import jwt, { JwtPayload } from 'jsonwebtoken';
import { JWT_EXPIRES, PRIVATE_KEY, PUBLIC_KEY } from '../config';

export interface Payload extends JwtPayload{
	id: string;
}

export function verify(token: string): Promise<Payload> {
	return new Promise((resolve, reject) => {
		jwt.verify(token, PUBLIC_KEY, { algorithms: ['RS256'] }, (err, decoded) => {
			if (err) return reject(err);
			if (decoded) resolve(decoded as Payload);
		});
	});
}

export function sign(payload: Payload): Promise<string> {
	return new Promise((resolve, reject) => {
		jwt.sign(payload, PRIVATE_KEY, { algorithm: 'RS256', expiresIn: JWT_EXPIRES }, (err, encoded) => {
			if (err) return reject(err);
			encoded && resolve(encoded);
		});
	});
}