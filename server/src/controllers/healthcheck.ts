/* Main Controller file */
import { Request, Response, NextFunction } from 'express';
import Routes from '../library/routes';

class Healthcheck extends Routes {
	constructor() {
		super('/');
		this.addRoute('get', 'healthcheck', this.HealthCheck);
	}

	private HealthCheck(req: Request, res: Response, next: NextFunction) {
		res.status(200).json({ status: 'OK' });
	}
}

const HealthCheckRoute = new Healthcheck();

export default HealthCheckRoute;