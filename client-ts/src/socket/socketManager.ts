import io, { Socket } from 'socket.io-client'
import Conversation from '../types/conversation'

interface ClientToServerEvents {
	getConversation:
		(data: string,                           // the object id of the chat
		 callback: (data: Conversation) => void  // callback for sending the back-response for the acknowledgement
		) => void;
}

interface ServerToClientEvents {
	initChats: (data: Conversation[]) => void;
}

const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io({
	auth: (callback) => {
		callback({ token: `Bearer ${localStorage.getItem('token')}` })
	},
	autoConnect: false
})

export default socket