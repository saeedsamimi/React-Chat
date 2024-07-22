import { Request, Response, NextFunction } from 'express';
import { verify } from '../../security/jwt';
import { User } from '../../models/user';
import { logger } from '../../config';

export default async function ReceiveJWT(req: Request, res: Response, next: NextFunction) {
	const text = req.headers.authorization;
	// 1- check the token exists
	if (!text)
		return next(new Error('the token is not exists in the header'));
	// 2- check the bearer exists
	if (!text.startsWith('Bearer '))
		return next(new Error('the token schema is not valid: not have correct Bearer head'));
	const split = text.split(' ');
	// 3- check the token already exists
	if (split.length <= 1)
		return next(new Error('the token in token schema doesn\'t exists'));
	// 4- try to decode the token for retrieving the payload
	try {
		req.payload = await verify(split[1]);
		logger.info({ payload: req.payload });
		const user = await User.findById(req.payload.id);
		if (!user)
			return next(new Error('Invalid Payload, The user not found'));
		req.document = user;
		next();
	} catch (err) {
		next(err);
	}
}
