import { Request, Response, NextFunction } from 'express';
import { sign } from '../../security/jwt';

export default async function SendJWT(req: Request, res: Response, next: NextFunction) {
	if (req.payload) {
		try {
			const token = await sign(req.payload);
			res.status(200).json({ token,user: req.document });
		} catch (err) {
			return next(err);
		}
	} else {
		return next(new Error('Invalid Payload signature'));
	}
}