import bcrypt from "bcrypt";
import mongoose from "mongoose";
import randomstring from "randomstring";
import Util from '../libraries/utils';
import dayjs from 'dayjs';

export interface UserModel extends mongoose.Document {
	user_id: string,
	first_name: string,
	last_name: string,
	email: string,

	password: string,
	communities: string[]

	comparePassword(candidate_password: string): Promise<boolean>;
	getName(): string;
	generateAuth(): Promise<AuthModel>;
	addCommunity(community_id: string): Promise<void>;
	getCommunites(): Promise<CommunityModel[]>
}

export interface IUserModel extends mongoose.Model<UserModel> {
	generateUserId(): Promise<string>
}

const Schema = new mongoose.Schema(
	{
		user_id: String,
		first_name: String,
		last_name: String,
		email: String,
		password: String,
		communities: [String]
	},
	{
		timestamps: {
			createdAt: "created_at",
			updatedAt: "updated_at"
		}
	}
);

/**
 * Password hash middleware.
 */
Schema.pre("save", function save(this: UserModel, next) {
	if (!this.isModified("password")) { return next(); }

	bcrypt.hash(this.password, 10)
		.then((hash: string) => {
			this.password = hash;
			next();
		})
		.catch(next);
});

Schema.methods.comparePassword = function (this: UserModel, candidate_password) {
	return bcrypt.compare(candidate_password, this.password);
};

Schema.methods.getName = function(this: UserModel): string {
	return this.first_name + " " + this.last_name;
};

Schema.methods.addCommunity = async function(this: UserModel, community_id: string) {
	const communities = new Set(this.communities);
	communities.add(community_id);
	this.communities = [...communities];
	await this.save();
};

Schema.methods.getCommunites = function (this: UserModel): Promise<CommunityModel[]> {
	return Community.find({ community_id: { $in: this.communities } }).exec();
}

Schema.methods.toJSON = function(this: UserModel): any {
	const obj = Util.blackFields(this.toObject(),["password", "_id", "__v", 'communities']);
	return obj;
};

Schema.methods.generateAuth = function(this: UserModel): Promise<AuthModel> {
	const auth: AuthModel = new Auth({
		token: randomstring.generate(64),
		user_type: AuthUserType.User,
		user_id: this.user_id,
		expires: dayjs().add(1, 'year').toDate()
	});

	return auth.save();
};

Schema.statics.generateUserId = async function(): Promise<string> {
	let user_id: string;
	do {
		user_id = randomstring.generate({
			length: 8,
			charset: "numeric"
		});
	}
	while(await User.findOne({ user_id }).exec());
	return Promise.resolve(user_id);
};

const User = <IUserModel> mongoose.model('User', Schema);
export default User;

import Auth, { AuthModel, AuthUserType } from "./auth";import Community, { CommunityModel } from "./community";

