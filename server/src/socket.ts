import { Server, Socket } from 'socket.io'
import { logger } from './config'
import { IUserDocument } from './models/user'
import Bearer from './security/bearer'
import { HydratedDocument, Types } from 'mongoose'
import { Conversation } from './models/conversation'
import { Message } from './models/message'

async function createConversation(data: { name: string, participants: Types.ObjectId[] }) {
	const conversation = new Conversation(data)
	await conversation.save()
	return conversation
}

function protectedHandlers(io: Server, socket: Socket, user: HydratedDocument<IUserDocument>) {
	(async function() {
		try {
			const conversations = await Conversation.find({ participants: user._id })
				.populate([{
					path: 'participants'
				}, {
					path: 'messages',
					populate: {
						path: 'sender',
						model: 'User'
					}
				}])
				.exec()
			socket.emit('initialMessages', conversations)
		} catch (err) {
			if (err instanceof Error) {
				logger.error(`Error while retrieving the initial messages: `, err.message)
				socket.emit('error', err.message)
			}
			socket.emit('uncaughtError', 'Uncaught Error Occurred')
		}
	})()

	socket.on('createConversation', async (data) => {
		logger.info(`you want to create a chat by name: ${data.chatname}`)
		logger.info('you want to create a chat by users:', data.participants)

		data.participants.push(user._id)
		try {
			logger.info(await createConversation(data))
		} catch (err) {
			logger.error(err)
		}
	})

	socket.on('addParticipant', async (data) => {
		logger.info(`add a user by id: ${data.userId} to chat by chatID: ${data.chatId}`)

		try {
			const result = await Conversation.findOneAndUpdate(
				{ _id: data.chatId, participants: user._id },
				{ $addToSet: { participants: data.userId } },
				{ new: true }
			).populate('participants')

			if (result) {
				logger.info(`User ${data.userId} added to chat ${data.chatId}`)
				socket.emit('participantAdded', result)  // Emit success event with updated conversation
			} else {
				logger.warn(`Chat ${data.chatId} not found`)
				socket.emit('error', 'Chat not found')
			}
		} catch (err) {
			logger.error(err)
			if (err instanceof Error) {
				socket.emit('error', err.message)
			}
		}
	})

	socket.on('addMessage', async (data) => {
		try {
			const message = new Message({ content: data.message.content, sender: user._id })
			await message.validate()
			const chat = await Conversation.findOneAndUpdate(
				{ _id: data.conversationId, participants: user._id },
				{ $push: { messages: message._id } },
				{ new: true }
			)
			if (chat) {
				logger.info(`Chat added into the ${data.conversationId} successfully`)
				const result = await message.save()
				await result.populate('sender')
				socket.emit('messageAdded', { message: result, conversationId: data.conversationId })
			} else {
				logger.warn(`Chat ${data.conversationId} is not found`)
				return socket.emit('error', 'Chat not Updated')
			}
		} catch (err) {
			logger.error(err)
			if (err instanceof Error)
				socket.emit('error', err.message)
		}
	})
}

export default function socketHandler(io: Server) {
	return async (socket: Socket) => {
		console.log(`the client is connected by ID: ${socket.id}`)

		socket.on('disconnect', () => {
			logger.info(`user by id: ${socket.id} is disconnected`)
		})

		Bearer(socket.handshake.headers.authorization)
			.then((res) => {
				logger.info(`logged in by id: ${res.id} or ${res._id}`)
				protectedHandlers(io, socket, res)
			})
			.catch((err) => {
				logger.error(err)
				socket.emit('error', err.message)
				socket.disconnect()
			})
	}
}