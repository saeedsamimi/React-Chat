import {Request,Response,NextFunction} from 'express';

export function routeNotFound(req: Request, res: Response, next: NextFunction) {
	return res.status(404).json({error: 'Not Found'});
}