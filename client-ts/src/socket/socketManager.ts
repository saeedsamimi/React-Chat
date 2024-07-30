import io, { Socket } from 'socket.io-client'
import Conversation from '../types/conversation'
import User from '../types/user'
import Message from '../types/message'

interface ClientToServerEvents {
	getConversation:
		(data: string,                           // the object id of the chat
		 callback: (data: Conversation) => void  // callback for sending the back-response for the acknowledgement
		) => void;
	addMessage:
		(data: string,                           // the target message content
		 conversationId: string,                 // the target conversation id
		 callback:                               // the callback function for back-response for the acknowledgement
			 (message: Message) => void
		) => void;
}

interface ServerToClientEvents {
	initChats: (data: Conversation[]) => void;
	userGetOnline: (data: User) => void;
	userGetOffline: (data: User) => void;
	messageAdded:
		(data: Message,
		 conversationId: string,
		 user: User
		) => void;
}

const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io({
	auth: (callback) => {
		callback({ token: `Bearer ${localStorage.getItem('token')}` })
	},
	autoConnect: false
})

export default socket