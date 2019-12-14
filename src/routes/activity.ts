import express from "express";

import * as Controller from "../controllers/activityController";
import { authorize_request as auth } from "../libraries/auth";
import { AuthUserType } from "../models/auth";

const router = express.Router();

/** User authentication */
const isUser = auth(AuthUserType.User);

router.get('/', isUser, Controller.getActivities);
router.post('/create', isUser, Controller.createActivity);
router.get('/get-user-activities', isUser, Controller.getUserActivities);

router.get('/template', Controller.getTemplates);

export default router;
