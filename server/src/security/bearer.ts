import { Payload, verify } from './jwt'
import { User } from '../models/user'

export default function Bearer(head?: string) {
	return new Promise<any>(async (resolve, reject) => {
		// 1- check the token exists
		if (!head)
			return reject(new Error('the token is not exists in the header'))
		// 2- check the bearer exists
		if (!head.startsWith('Bearer '))
			return reject(new Error('the token schema is not valid: not have correct Bearer head'))
		const split = head.split(' ')
		// 3- check the token already exists
		if (split.length <= 1)
			return reject(new Error('the token in token schema doesn\'t exists'))
		// 4- try to decode the token for retrieving the payload
		try {
			const payload = await verify(split[1])
			const user = await User.findById(payload.id)
			if (!user)
				return reject(new Error('Invalid Payload, The user not found'))
			resolve(user)
		} catch (err) {
			reject(err)
		}
	})
}