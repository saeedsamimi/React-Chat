import mongoose from 'mongoose';
import { logger, mongo } from '../config';
/* Use global promise instead of mongoose promises */
mongoose.Promise = global.Promise;

export default async function connect() {
	try {
		const connection = await mongoose.connect(...mongo);
		console.log(`connected to database: ${connection.version}`);
	} catch (err) {
		logger.error(err);
		process.exit(1);
	}
}