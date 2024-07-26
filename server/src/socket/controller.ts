import IO, { IOSocket } from './io'
import { Conversation } from '../models/conversation'
import { Message } from '../models/message'
import { User } from '../models/user'
import { logger } from '../config'

const SocketController = (socket: IOSocket, io?: IO) => {
	// send initial chats and previous chats
	Conversation.find(
		{ participants: socket.data.user._id },
		{ _id: 1, name: 1 }
	).then((conversations) => {
		socket.emit('initChats', conversations)
		const rooms = conversations.map((conversation) => conversation.id)
		if (rooms.length === 0) return
		io?.sockets
			.to(rooms)
			.emit('userGetOnline', socket.data.user.id)
		socket.join(rooms)
	})

	socket.on('getConversation', (data, callback) => {
			Conversation.findOne(
				{ _id: data, participants: socket.data.user._id },
				{ participants: 1, messages: 1 },
				{
					populate: [
						{ path: 'participants' },
						{ path: 'messages', model: Message,populate: {path: 'sender',model: 'User'} }
					]
				}
			).orFail().then((result) => {
				callback(result)
			}).catch((err) => {
				socket.emit('error', err.message || 'Uncaught Exception')
			})
		}
	)

	socket.on('addParticipant', async (data, callback) => {
			try {
				const targetUser = await User.findById(data.userId).orFail()
				const update = await Conversation.findOneAndUpdate(
					{ _id: data.conversationId, participants: socket.data.user._id },
					{ $addToSet: { participants: data.userId } }).orFail()
				io?.sockets
					.in(update.id)
					.except(socket.id)
					.emit('participantAdded', {
						user: targetUser,
						conversationId: data.conversationId
					})
				callback(targetUser)
			} catch (err) {
				logger.warn(err)
				if (err instanceof Error)
					socket.emit('error', err.message)
			}
		}
	)

	socket.on('disconnect', () => {
		Conversation.find({ participants: socket.data.user._id }, { _id: 1 })
			.then((conversations) => {
				if (conversations.length >= 0) {
					const rooms = conversations.map((conversation) => conversation.id)
					io?.sockets.to(rooms).emit('userGetOffline', socket.data.user.id)
				}
			})
	})
}

export default SocketController