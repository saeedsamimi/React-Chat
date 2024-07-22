import { Request, Response, NextFunction } from 'express';
import { Document } from 'mongoose';
import { Payload } from '../security/jwt';

declare global {
	namespace Express {
		interface Request {
			targetDir: string;
			acceptedMimeTypes: string[];
			document: Document | undefined;
			payload: Payload | undefined;
		}
	}
}

export function declareHandler(req: Request, res: Response, next: NextFunction) {
	req.targetDir = '';
	req.acceptedMimeTypes = [];
	req.document = undefined;
	req.payload = undefined;
	next();
}