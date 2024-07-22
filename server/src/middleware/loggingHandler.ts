import { Request, Response, NextFunction } from 'express';
import { logger } from '../config';

export function loggingHandler(req: Request, res: Response, next: NextFunction) {
	logger.info(`INCOMING - METHOD: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}]`);

	res.on('finish', () => {
		logger.info(`INCOMING - METHOD: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}] - STATUS: [${res.statusCode}]`);
	});

	next();
}