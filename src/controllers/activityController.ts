import { Request, Response } from "express";
import activityLogic from "../libraries/activity";

export async function getActivities(req: Request, res: Response) {
    const activities = await activityLogic.getUpcomingActivities();
    
    res.json({
        status: true,
        message: activities.length ? 'Activities retrieved successfully' : 'No saved activity',
        data: { activities }
	});
}

export async function createActivity(req: Request, res: Response) {
    const { body } = req;
    const { status, message } = activityLogic.validateActivityPayload(body);

    if (!status) return res.status(400).json({ status, message });

}