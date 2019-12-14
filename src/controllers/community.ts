import { Request, Response } from "express";
import Community, { CommunityModel } from '../models/community';
import { UserModel } from "../models/user";

export async function create(req: Request, res: Response) {
	const body = req.body;
	const user: UserModel = (req as any).user;

	const required = ['name', 'description', 'city', 'state', 'country', 'cover_image'];
	for(const field of required) {
		if (!body[field]) return res.status(400).json({
			status: false,
			message: `'${field}' is required`
		});
	}

	const community: CommunityModel = new Community({
		community_id: await Community.generateCommunityId(),
		name: body.name,
		description: body.description,
		city: body.city,
		state: body.state,
		country: body.country,
		created_by: user.user_id,
		cover_image: body.cover_image
	});

	await Promise.all([ community.save() ,user.addCommunity(community.community_id) ]);

	res.json({
		status: false,
		message: 'Community created successfully',
		data: { community }
	})
}

