import mongoose from "mongoose";
import randomstring from "randomstring";
import Util from '../libraries/utils';

export interface CommunityModel extends mongoose.Document {
	community_id: string,
	name: string,
	description: string,
	city: string,
	state: string,
	country: string,
	created_by: string,
	cover_image: string,

	getCreator(): Promise<UserModel>
}

export interface ICommunityModel extends mongoose.Model<CommunityModel> {
	generateCommunityId(): Promise<string>
}

const Schema = new mongoose.Schema(
	{
		community_id: String,
		name: String,
		description: String,
		city: String,
		state: String,
		country: String,
		created_by: String,
		cover_image: String,
	},
	{
		timestamps: {
			createdAt: "created_at",
			updatedAt: "updated_at"
		}
	}
);

Schema.methods.getCreator = function(this: CommunityModel): Promise<UserModel> {
	return User.findOne({ user_id: this.created_by }).exec();
};

Schema.methods.toJSON = function(this: CommunityModel) {
	const obj = Util.blackFields(this.toObject(), ['_id', '__v']);
	return obj;
};

Schema.statics.generateCommunityId = async function(): Promise<string> {
	let community_id: string;
	do {
		community_id = randomstring.generate({
			length: 8,
			charset: "numeric"
		});
	}
	while(await Community.findOne({ community_id }).exec());
	return Promise.resolve(community_id);
};

const Community = <ICommunityModel> mongoose.model('Community', Schema);
export default Community;

import User, { UserModel } from "./user";

