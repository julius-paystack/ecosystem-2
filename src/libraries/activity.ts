import Activity from "../models/activity";

const activityLogic = {

    getUpcomingActivities: async () => {
        const activities = await Activity.find().sort({ start_date: 'desc' });
        return activities;
    },

    validateActivityPayload: (payload: object) => {
        const requiredValues = ['activity_id', 'created_by', 'template_id', 'media', 'start_date', 'end_date', 'public', 'community_id',];
        const invalid = requiredValues.filter(key => Boolean(payload[key]));

        if (invalid.length) return { status: false, message: `${invalid.join()} are required values` };

        return { status: true, message: 'Valid Data' };
    }
}

export default activityLogic;