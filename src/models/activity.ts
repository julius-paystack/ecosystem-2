import mongoose from "mongoose";
import randomstring from "randomstring";

export type ActivityModel = mongoose.Document & {
    activity_id: string,
    created_by: string,
    template_id: string,
    media: string,
    start_date: string,
    end_date: Date,
    public: boolean,
    community_id: string,
    user_ids: string[],
    status: activityStatus,
    getCreator: () => Promise <UserModel>
}

export interface IActivityModel extends mongoose.Model<ActivityModel> {
    generateActivityId(): Promise<string>
}

export enum activityStatus {
    /** The activity hasnt started yet */
    Pending = "pending",
    /** The activity has started but isnt complete */
    Ongoing = "ongoing",
    /** The activity has started but isnt complete */
    complete = "complete"
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
    template_id: {
        type: String,
        required: true,
    },
    media: {
        type: String,
        required: true,
    },
    start_date: {
        type: Date,
        required: true,
    },
    end_date: {
        type: Date,
        required: true,
    },
    public: {
        type: Boolean,
        default: false,
        required: true,
    },
    community_id: {
        type: String,
    },
    status: {
        type: String,
        default: activityStatus.Pending,
        required: true,
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