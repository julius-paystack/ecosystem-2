import express from "express";

import * as Controller from "../controllers/activityController"

const router = express.Router();

router.get('/activities', Controller.getActivities);

export default router;
