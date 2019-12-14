import express from "express";

import * as Controller from "../controllers/community"
import { authorize_request as auth } from "../libraries/auth";
import { AuthUserType } from "../models/auth";

const router = express.Router();

/** User authentication */
const isUser = auth(AuthUserType.User);

router.post('/', isUser, Controller.create);

router.get('/:id', isUser, Controller.getCommunity);

router.get('/', Controller.getCommunites);

router.post('/:id/join', isUser, Controller.joinCommunity);

export default router;