import Routes from '../library/routes'
import { NextFunction, Request, Response } from 'express'
import { uploadNone } from '../middleware/multer'
import CreateAndSave from '../decorators/mongoose/createAndSave'
import { User } from '../models/user'
import SendJWT from '../decorators/security/sendJwt'
import ReceiveJWT from '../decorators/security/receiveJwt'
import { logger } from '../config'

class UserController extends Routes {
	constructor() {
		super('/users')
		this.addRoute('post', '/signup', uploadNone, this.signup, SendJWT)
		this.addRoute('post', '/login', uploadNone, this.login, SendJWT)
		this.addRoute('post', '/auth', uploadNone, ReceiveJWT, this.auth)
	}

	@CreateAndSave(User)
	private async signup(req: Request, res: Response, next: NextFunction) {
		try {
			req.payload = { id: req.document?.id }
			next()
		} catch (err) {
			await req.document?.deleteOne()
			return next(err)
		}
	}

	private async login(req: Request, res: Response, next: NextFunction) {
		try {
			const username = req.body.username
			const password = req.body.password

			const foundUser = await User.findOne({ username: username })
			if (foundUser && foundUser.verifyPassword(password)) {
				req.payload = { id: foundUser.id }
				req.document = foundUser
				next()
			} else {
				res.status(401).json({ error: 'User login information is incorrect!' })
			}
		} catch (err) {
			next(err)
		}
	}

	private async auth(req: Request, res: Response, next: NextFunction) {
		logger.info(req.document)
		res.status(200).json({ user: req.document })
	}
}

const UserRoute = new UserController()

export default UserRoute