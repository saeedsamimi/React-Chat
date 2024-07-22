import { Model } from 'mongoose';
import { Request, Response, NextFunction } from 'express';
import { User } from '../../models/user';

export default function CreateAndSave(model: Model<any>) {
	return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
		const original = descriptor.value;

		descriptor.value = async function(req: Request, res: Response, next: NextFunction) {
			try {
				req.document = new model(req.body);
				await req.document?.save();
			} catch (err) {
				next(err);
			}

			original.call(this, req, res, next);
		};
	};
}