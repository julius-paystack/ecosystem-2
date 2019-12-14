import Activity, { ActivityModel } from "../models/activity";
import { UserModel } from "../models/user";
import { ActivityTemplates } from "./activity-templates";
import Community from "../models/community";

const activityLogic = {

    getUpcomingActivities: async () => {
        const activities = await Activity.find().sort({ start_date: 'desc' });
        return activities;
    },

    validateActivityPayload: (payload: any) => {
        const requiredValues = ['template_id', 'media', 'start_date', 'end_date', 'community_id',];
        const invalid = requiredValues.filter(key => !Boolean(payload[key]));

        if (invalid.length) return { status: false, message: `${invalid.join(", ")} are required values` };
        const valid_template = ActivityTemplates.some(activity => activity.id === payload.template_id);

        if (!valid_template) return { status: false, message: 'Invalid Template' };
        return { status: true, message: 'Valid Data' };
    },

    createActivity: async (payload, user: UserModel) => {
        const { template_id, media, start_date, end_date, community_id } = payload;
        const { user_id } = user;
        const activity: ActivityModel  = new Activity({
            activity_id: await Activity.generateActivityId(),
            created_by: user_id,
            template_id,
            media,
            start_date: new Date(start_date),
            end_date: new Date(end_date),
            community_id,
            user_ids: [user_id]
        });

        await activity.save();
        return activity;
    },

    getUserActivities: async (user: UserModel) => {
        const activities = await Activity.getUserActivities(user);
        return activities;
    },

    populateActivitiesData: async (activities) => {
        const activities_response = [];
        for (const activity of activities) {
            const community = await Community.findOne({ community_id: activity.community_id });
            const template = ActivityTemplates.find(template => template.id == activity.template_id);
            const copy = { ...activity.toJSON(), community, template }
            activities_response.push(copy);
        }
        return activities_response;
    }
}

export default activityLogic;