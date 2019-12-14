import mongoose from "mongoose";

export enum AuthUserType {
	User = 'user'
};

export interface AuthModel extends mongoose.Document {
	token: string,
	user_type: AuthUserType,
	user_id: string,
	expires: Date,
	last_used: Date,

	getUser: () => Promise<mongoose.Document>,
	/** Has authentication expired */
	hasExpired: () => boolean
};

export interface IAuthModel extends mongoose.Model<AuthModel> {}

const Schema = new mongoose.Schema({
	token: String,
	user_type: String,
	user_id: String,
	expires: Date,
	last_used: Date
}, {
	timestamps: {
		createdAt: "created_at",
		updatedAt: "updated_at"
	}
});

/** Get user */
Schema.methods.getUser = function(): Promise<mongoose.Document> {
	let query: {[field: string]: string};
	switch (this.user_type) {
		
		case AuthUserType.User:
			query = { user_id: this.user_id };
			return User.findOne(query).exec();

		default:
			throw new Error("Unrecognised user type");
	}
}

Schema.methods.hasExpired = function(this: AuthModel): boolean {
	return new Date >= this.expires;
}

const Auth: IAuthModel = mongoose.model('Auth', Schema);
export default Auth;

import User from "./user";
