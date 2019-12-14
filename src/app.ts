import { default as express, Request, Response, NextFunction } from "express";
require('express-async-errors');
import bodyParser from "body-parser";
import dotenv from 'dotenv';
import fs from 'fs';

if (fs.existsSync(__dirname+"/../../.env")) {
	// logger.debug("Using .env file to supply config environment variables");
	dotenv.config({ path: __dirname+"/../../.env" });
} else {
	// logger.debug("Using .env.example file to supply config environment variables");
	dotenv.config({ path: __dirname+"/../../.env.example" });  // you can delete this after you create your own .env file!
}

const app = express();




export default app;
