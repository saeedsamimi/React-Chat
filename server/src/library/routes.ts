import { Express, RequestHandler } from 'express';
import { logger } from '../config';

export default class Routes {
	constructor(baseRoute: string) {
		this.baseRoute = baseRoute;
		this.routes = new Map();
	}

	addRoute(method: keyof Express, path: string, ...handlers: RequestHandler[]) {
		if (!this.routes.has(path)) this.routes.set(path, new Map());
		if (!this.routes.get(path)?.has(method))
			this.routes.get(path)?.set(method, handlers);
		else throw new Error(`Route ${Routes.getMethod(method)} : ${this.baseRoute}${path} have already mounted.`);
	}

	defineRoute(app: Express) {
		for (const [path, routes] of this.routes)
			for (const [method, handlers] of routes) {
				const absolutePath = this.baseRoute + path;
				logger.info(`mount route ${Routes.getMethod(method)} : ${absolutePath}`);
				app[method](absolutePath, ...handlers);
			}
	}

	protected static getMethod(key: keyof Express) {
		return String(key).toUpperCase();
	}

	readonly baseRoute: string;
	protected routes: Map<string, Map<keyof Express, RequestHandler[]>>;
}