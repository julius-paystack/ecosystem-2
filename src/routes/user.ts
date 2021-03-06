import express from "express";

import * as Controller from "../controllers/user"
import { authorize_request as auth } from "../libraries/auth";
import { AuthUserType } from "../models/auth";

const router = express.Router();

/** User authentication */
const isUser = auth(AuthUserType.User);

router.post('/signup', Controller.signUp);

router.post('/login', Controller.logIn);

router.get('/profile', isUser, Controller.profile);

export default router;
