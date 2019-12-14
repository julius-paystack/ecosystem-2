import { Request, Response } from "express";
import User, { UserModel } from "../models/user";


export async function signUp(req: Request, res: Response) {
	const body = req.body;

	const required = ['first_name', 'last_name', 'email', 'password'];
	for(const field of required) {
		if (!body[field]) return res.status(404).json({
			status: false,
			message: `'${field}' is required`
		});
	}

	const existingUser = await User.findOne({ email: body.email }).exec();
	if (existingUser) {
		return res.status(400).json({
			status: false,
			message: 'Email already used'
		})
	}

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

export async function logIn(req: Request, res: Response) {
	const body = req.body;
	
	const required = ['email', 'password'];
	for(const field of required) {
		if (!body[field]) return res.status(404).json({
			status: false,
			message: `'${field}' is required`
		});
	}

	const user = await User.findOne({ email: body.email });
	if (!user || !(await user.comparePassword(body.password))) {
		return res.status(401).json({
			status: false,
			message: 'Email/Password Incorrect'
		});
	}
	
	const auth = await user.generateAuth();
	res.json({
		status: true,
		message: "Logged in successfully",
		data: { user, auth }
	})
}

export async function profile(req: Request, res: Response) {
	const user: UserModel = (req as any).user;
	const auth = (req as any).auth;

	const communities = await user.getCommunites();

	res.json({
		status: true,
		data: { user, auth, communities }
	})

}
