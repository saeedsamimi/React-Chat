import express, { Express } from 'express';
import { createServer } from 'http';
import cors from 'cors';
import { CORS_OPTIONS, SERVER_PORT, logger, SERVER_HOST, mongo } from './config';
import * as middleware from './middleware';
import HealthCheckRoute from './controllers/healthcheck';
import UserController from './controllers/user';
import Routes from './library/routes';
import { declareHandler } from './middleware';
import connect from './database';

/* create the express app object */
export const app: Express = express();

/* configure the logging handler middleware */
app.use(middleware.loggingHandler);

/* begin using the needed middlewares */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(CORS_OPTIONS));
app.use(declareHandler);

const controllers: Routes[] = [HealthCheckRoute, UserController];
controllers.forEach(controller => {
	controller.defineRoute(app);
});

/* use the error handler */
app.use(middleware.routeNotFound);
app.use(middleware.errorHandler);

/* create the database connection */
connect();

/*create the server and listen to the port*/
export const server = createServer(app);
server.listen(SERVER_PORT, () => {
	logger.info(`Server listening on http://${SERVER_HOST}:${SERVER_PORT}`);
});

server.on('error', (err: Error) => {
	console.log(`Error: ${err.message}`);
});

/* synchronize utility function for shutdown the server */
export function Shutdown(signal?: string, callback?: (err?: Error) => void) {
	signal && logger.info(`Shutdown with signal: ${signal}`);
	server.close(callback);
}

/* async version of shutdown */
export function ShutdownSync(signal?: string): Promise<void> {
	return new Promise<void>((resolve, reject) => {
		Shutdown(signal, (err?: Error): void => {
			if (err) reject(err);
			else resolve();
		});
	});
}

process
	.on('SIGTERM', () => Shutdown('SIGTERM'))
	.on('SIGINT', () => Shutdown('SIGINT'))
	.on('uncaughtException', () => Shutdown('uncaughtException'));