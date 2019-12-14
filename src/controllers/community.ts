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

export async function getCommunity(req: Request, res: Response) {
	const community_id = req.params.id;

	const community = await Community.findOne({ community_id });
	if(!community) return res.status(404).json({
		status: false,
		message: 'Community does not exist'
	});

	return res.json({
		status: true,
		data: { community }
	})
}

export async function getCommunites(req: Request, res: Response) {
	const communities = await Community.find();

	res.json({
		status: true,
		data: { communities }
	});
}

export async function joinCommunity(req: Request, res: Response) {
	const user: UserModel = (req as any).user;

	await user.addCommunity(req.params.id);

	const communities = await user.getCommunites();

	res.json({
		status: true,
		message: 'Community joined successfully',
		data: { communities }
	})
}

