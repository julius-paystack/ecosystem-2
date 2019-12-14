import { Request, Response } from "express";
import activityLogic from "../libraries/activity";
import { UserModel } from "../models/user";

export async function getActivities(req: Request, res: Response) {
    const activities = await activityLogic.getUpcomingActivities();
    const activities_response = await activityLogic.populateActivitiesData(activities);

    return res.json({
        status: true,
        message: activities.length ? 'Activities retrieved successfully' : 'No saved activity',
        data: { activities: activities_response }
	});
}

export async function createActivity(req: Request, res: Response) {
    const { body } = req;
    const user: UserModel = (req as any).user;
    const { status, message } = activityLogic.validateActivityPayload(body);

    if (!status) return res.status(400).json({ status, message });

    const activity = await activityLogic.createActivity(body, user);

    if (!activity) return res.status(400).json({ status: false, message: 'Something went wrong creating the activity' });

    return res.json({
        status: true,
        message: 'Activity Successfully Saved',
        data: { activity }
	});
}

export async function getUserActivities(req: Request, res: Response) {
    const user: UserModel = (req as any).user;
    const activities = await activityLogic.getUserActivities(user);
    const activities_response = await activityLogic.populateActivitiesData(activities);

    return res.json({
        status: true,
        message: 'Activities Successfully retrieved',
        data: { activities: activities_response }
	});
}