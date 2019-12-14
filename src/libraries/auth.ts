import { Request, Response, NextFunction } from "express";

import Auth, { AuthUserType } from "../models/auth";

/**
 * Authorise and authenticate request
 */
export function authorize_request(allowed_types: AuthUserType|Array<AuthUserType>): (req: Request, res: Response, next: NextFunction) => void {
	let array_allowed_types: Array<AuthUserType> = <Array<AuthUserType>>([].concat(allowed_types));
	return async function(req: Request, res: Response, next: NextFunction) {
		let token: string = (req as any).token;

		let code = 401;
		let unauth_msg = await (async function(): Promise<string> {
			if(!token) return "Pls send authentication token";
			let auth = await Auth.findOne({ token }).exec();
			if(!auth) return "Invalid authentication token";
			if(!array_allowed_types.includes(auth.user_type)) return "You do not have access to carry out this request";
			auth.last_used = new Date;
			auth.save();
			let user = await auth.getUser();
			if(!user) return "There was an error with your request. Pls contact admin";
			code = 503;
			(req as any).auth = auth;
			(req as any).user = user;
			// logger.debug("auth: %o", auth.toObject())
			// logger.debug("user: %o", user.toObject())
			return null;
		})();

		if(unauth_msg) {
			res.status(code).json({
				status: false,
				message: unauth_msg
			})
		}
		else next();
	};
};
