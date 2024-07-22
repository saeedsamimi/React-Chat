import multer, { diskStorage, DiskStorageOptions, FileFilterCallback } from 'multer';
import { Request, Response, NextFunction } from 'express';
import { resolve, extname } from 'path';
import { publicDir } from '../../config';

export const storageOptions: DiskStorageOptions = {
	destination: (req: Request, file: Express.Multer.File, cb: (Error: Error | null, message: string) => void): void => {
		cb(null, resolve(publicDir, req.targetDir));
	},
	filename: (req: Request, file: Express.Multer.File, cb: (Error: Error | null, message: string) => void): void => {
		const UID = Date.now().toString();
		const random = Math.round(Math.random() * 1e9);
		cb(null, `${UID}-${random}${extname(file.originalname)}`);
	}
};

export const multerDiskStorage = diskStorage(storageOptions);

const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
	if (req.acceptedMimeTypes.length === 0 || req.acceptedMimeTypes.includes(file.mimetype)) {
		cb(null, true);
	} else {
		cb(new Error(`this mime type: ${file.mimetype}, allowed: ${req.acceptedMimeTypes}`));
	}
};

export const upload = multer({ storage: multerDiskStorage, limits: { fileSize: 5 * 1024 * 1024 }, fileFilter });

export const uploadNone = upload.none();

export const uploadInto = (path: string) => {
	return (req: Request, res: Response, next: NextFunction): void => {
		req.targetDir = path;
		next();
	};
};