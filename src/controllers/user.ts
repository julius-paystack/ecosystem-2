import { Request, Response } from "express";
import randomstring from "randomstring";
import User, { UserModel } from "../models/user";


export async function signUp(req: Request, res: Response) {
	const body = req.body;
	// Create body
	const user: UserModel = new User({
		user_id: await User.generateUserId(),
		first_name: body.first_name,
		last_name: body.last_name,
		email: body.email,
		password: body.password,
		communities: []
	});

	user.save();

	res.json({
		status: true,
		message: 'User signed up successfully',
		data: { user }
	})
}
