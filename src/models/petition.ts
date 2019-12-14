import mongoose from "mongoose";
import randomstring from "randomstring";

export interface PetitionModel extends mongoose.Document {
	petition_id: string;
	title: string;
	description: string,
	media: string;
	created_by: string;
	community: string;
	organisation: {
		name: string,
		email: string,
	};
	user_ids: string[]

	getCreator(): Promise<UserModel>
}

export interface IPetitionModel extends mongoose.Model<PetitionModel> {
	generatePetitionId(): Promise<string>
}

const Schema = new mongoose.Schema(
	{
		petition_id: String,
		title: String,
		description: String,
		media: String,
		created_by: String,
		community: String,
		organisation: mongoose.Schema.Types.Mixed,
		user_ids: [String]
	},
	{
		timestamps: {
			createdAt: "created_at",
			updatedAt: "updated_at"
		}
	}
);

Schema.methods.getCreator = function(this: PetitionModel): Promise<UserModel> {
	return User.findOne({ user_id: this.created_by }).exec();
}

Schema.statics.generatePetitionId = async function(): Promise<string> {
	let petition_id: string;
	do {
		petition_id = randomstring.generate({
			length: 8,
			charset: "numeric"
		});
	}
	while(await Petition.findOne({ petition_id }).exec());
	return Promise.resolve(petition_id);
};

const Petition = <IPetitionModel> mongoose.model('Petition', Schema);
export default Petition;

import User, { UserModel } from "./user";
