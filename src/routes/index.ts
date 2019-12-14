import { default as express, Request, Response, NextFunction} from "express";
import bearer from "express-bearer-token";

const router = express.Router();

router.use(bearer());

const app_start = Date.now();

/** Default route */
router.all("/", (req: Request, res: Response, next: NextFunction) => {
	res.json({
		status: 200,
		success: true,
		message: "Hello world",
		data: { app_start }
	});
});

export default router;
