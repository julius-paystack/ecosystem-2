import { default as express, Request, Response, NextFunction} from "express";
import bearer from "express-bearer-token";

import user from "./user";

const router = express.Router();

router.use(bearer());

const app_start = Date.now()/1000;

/** Default route */
router.all("/", (req: Request, res: Response, next: NextFunction) => {
	res.json({
		status: 200,
		success: true,
		message: "Hello world",
		data: { app_start }
	});
});

router.use(user);

export default router;
