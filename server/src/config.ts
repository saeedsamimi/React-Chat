import { CorsOptions } from 'cors';
import { createLogger, format, Logform, transports } from 'winston';
import { resolve } from 'path';
import mongoose from 'mongoose';
import { readFileSync } from 'fs';

require('dotenv').config();

export const SERVER_PORT: number = Number(process.env.SERVER_PORT) || 3030;
export const SERVER_HOST: string = process.env.SERVER_HOST || 'localhost';

export const CORS_OPTIONS: CorsOptions = {
	origin: process.env.ACCESS_CONTROL_ALLOW_ORIGIN || '*',
	optionsSuccessStatus: 200,
	methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
};

const MONGO_OPTIONS: mongoose.ConnectOptions = {
	retryWrites: true,
	connectTimeoutMS: 1000,
	writeConcern: { w: 'majority' }
};
const MONGO_CONNECTION_STRING = process.env.MONGO_CONNECTION_STRING || '';

export const mongo: [string, typeof MONGO_OPTIONS] = [MONGO_CONNECTION_STRING, MONGO_OPTIONS];

export const LOGS_DIRECTORY: string = resolve(process.cwd(), 'logs');

export const logger = createLogger({
	format: format.combine(
		format.timestamp({
			format: 'YY-MM-DD HH:mm:ss'
		}),
		format.colorize(),
		format.printf(
			(info: Logform.TransformableInfo) => {
				return `${info.timestamp} ${info.level}: ${info.message}`;
			}
		)
	),
	transports: [
		new transports.Console(),
		new transports.File({
			filename: resolve(LOGS_DIRECTORY, 'errors.log'),
			format: format.uncolorize(),
			level: 'error'
		})
	]
});

export const publicDir = resolve(process.cwd(), process.env.PUBLIC_DIR || 'public');
let PUBLIC_KEY_PATH_STR = process.env.RSA_PUBLIC_KEY_PATH;
let PRIVATE_KEY_PATH_STR = process.env.RSA_PRIVATE_KEY_PATH;

export const JWT_EXPIRES = process.env.JWT_EXPIRES || '1h';

let keys_loaded = false;
export let PUBLIC_KEY = '';
export let PRIVATE_KEY = '';

if (!keys_loaded) {
	if (PUBLIC_KEY_PATH_STR && PRIVATE_KEY_PATH_STR) {
		PUBLIC_KEY_PATH_STR = resolve(process.cwd(), 'RSA', PUBLIC_KEY_PATH_STR);
		PRIVATE_KEY_PATH_STR = resolve(process.cwd(), 'RSA', PRIVATE_KEY_PATH_STR);
		try {
			PUBLIC_KEY = readFileSync(PUBLIC_KEY_PATH_STR, 'utf8');
			PRIVATE_KEY = readFileSync(PRIVATE_KEY_PATH_STR, 'utf8');
			keys_loaded = true;
		} catch (err) {
			logger.error({
				cause: 'the file system could not read the keys!',
				err
			});
			process.exit('the public and private key is not loaded!');
		}
	} else {
		logger.error('The Public key and private key sources not set!');
		process.exit(1);
	}
}

