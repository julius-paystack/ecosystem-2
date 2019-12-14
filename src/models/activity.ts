import mongoose from "mongoose";
import randomstring from "randomstring";

export type ActivityModel = mongoose.Document & {
    activity_id: string,
    created_by: string,
    title: string,
    description: string,
    media: string,
    scheduled_date: string,
    completed_at: Date,
    public: boolean,
    community_id: string,
    user_ids: string[],
    getCreator: () => Promise <UserModel>
}

export interface IActivityModel extends mongoose.Model<ActivityModel> {
    generateActivityId(): Promise<string>
}

const activitySchema = new mongoose.Schema({
    activity_id: {
        type: String,
        required: true,
    },
    created_by: {
        type: Date,
        default: Date.now()
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        default: 'Paystack Hackathon',
        required: true,
    },
    media: {
        type: String,
        required: true,
    },
    scheduled_date: {
        type: Date,
        required: true,
    },
    completed_at: {
        type: Date,
        required: true,
    },
    public: {
        type: Boolean,
        deafult: false,
        required: true,
    },
    community_id: {
        type: String,
    },
    user_ids: [{
        type: String,
    }]
});

activitySchema.methods.getCreator = function(this: ActivityModel): Promise<UserModel> {
	return User.findOne({ user_id: this.created_by }).exec();
};

activitySchema.statics.generateActivityId = async function(): Promise<string> {
    let activity_id: string;
	do {
		activity_id = randomstring.generate({
			length: 8,
			charset: "numeric"
		});
	}
	while(await Activity.findOne({ activity_id }).exec());
	return Promise.resolve(activity_id);
}

const Activity = <IActivityModel> mongoose.model('Activity', activitySchema);
export default Activity;

import User, { UserModel } from "./user";