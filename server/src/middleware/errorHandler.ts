import { Request, Response, NextFunction } from 'express';
import { logger } from '../config';

export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
	logger.error(err);
	res.status(500).json({ error: err.message });
	next();
}