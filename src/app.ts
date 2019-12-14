import { default as express, Request, Response, NextFunction } from "express";
require('express-async-errors');
import bodyParser from "body-parser";
import dotenv from 'dotenv';
import fs from 'fs';
import cors from 'cors';
import logger from "./libraries/logger";
import util from 'util';
import * as mongoose from 'mongoose';

if (fs.existsSync(__dirname+"/../../.env")) {
	// logger.debug("Using .env file to supply config environment variables");
	dotenv.config({ path: __dirname+"/../../.env" });
} else {
	// logger.debug("Using .env.example file to supply config environment variables");
	dotenv.config({ path: __dirname+"/../../.env.example" });  // you can delete this after you create your own .env file!
}

const app = express();

// Connect to MongoDB
const mongoUrl = process.env.MONGODB_URI;
mongoose.connect(mongoUrl).catch(err => {
	console.log("MongoDB connection error. Please make sure MongoDB is running. " + err);
	// process.exit();
});

// Trust reverse proxy
app.set("trust proxy", true);

// CORS
app.use(cors());

// Express configuration
app.set("port", process.env.PORT || 3000);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Error handler
app.use(function(err: any, req: Request, res: Response, next: NextFunction) {
	logger.debug(util.inspect(err, true, 5));
	if(!res.headersSent) {
		res.status(500).json({
			status: 500,
			success: false,
			message: "An error occurred while processing your request"
		});
	}
});

export default app;
