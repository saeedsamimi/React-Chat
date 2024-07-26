import { Server, Socket } from 'socket.io'
import { Server as HTTPServer } from 'http'
import { ExtendedError } from 'socket.io/dist/namespace'
import Bearer from '../security/bearer'
import { HydratedDocument, PopulatedDoc, ProjectionType, Types } from 'mongoose'
import { IUserDocument } from '../models/user'
import { logger } from '../config'
import { IConversation } from '../models/conversation'
import Controller from './controller'

// **** helper types **** //

type addParticipantData = { conversationId: Types.ObjectId, userId: Types.ObjectId }
type participantAddedData = { conversationId: Types.ObjectId, user: HydratedDocument<IUserDocument> }

// **** helper types **** //

interface ClientToServerEvents {
	getConversation:
		(data: Types.ObjectId,                                                  // the object id of the chat
		 callback: (data: PopulatedDoc<ProjectionType<IConversation>>) => void  // callback for sending the back-response for the acknowledgement
		) => void;
	addParticipant:
		(data: addParticipantData,                                      // the data of which participant to add and who want to add it
		 callback: (user: HydratedDocument<IUserDocument>) => void      // the callback function for back-response for the acknowledgement
		) => void;
}

interface ServerToClientEvents {
	error: (err?: string) => void;
	initChats:
		(data: ProjectionType<IConversation>[] // the related chats for the user
		) => void;
	userGetOnline:
		(data: Types.ObjectId                  // the online user document
		) => void;
	userGetOffline:
		(data: Types.ObjectId                  // the objectId of the offline user
		) => void;
	participantAdded:
		(data: participantAddedData            // the added participant data
		) => void;
}

interface InterServerEvents {
	/* nothing */
}

interface SocketData {
	user: HydratedDocument<IUserDocument>;
}

export type IOSocket = Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>

export default class IO extends Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData> {
	constructor(srv: HTTPServer) {
		super(srv)
	}

	run() {
		this.of('/').adapter.on('create-room', IO.logCreateRooms)
		this.of('/').adapter.on('join-room', IO.logJoinRooms)
		this.use(IO.auth)
		this.use(IO.logging)
		this.on('connect', this.runner)
	}

	private runner = (socket: IOSocket) => {
		Controller(socket, this)
	}

	private static auth = (socket: IOSocket, next: (err?: ExtendedError) => void) => {
		const token = socket.handshake.auth.token || socket.handshake.headers.authorization
		Bearer(token)
			.then((user) => {
				socket.data.user = user
				next()
			})
			.catch((err) => next(err))
	}

	private static logging = (socket: IOSocket, next: (err?: ExtendedError) => void) => {
		logger.info(`a client connected[ ID: ${socket.id} IP: ${socket.handshake.address} USER: ${socket.data.user.username}]`)

		socket.on('disconnect', (reason) => {
			logger.info(`client disconnected[ ID: ${socket.id} USER; ${socket.data.user.username} REASON: ${reason} ]`)
		})
		next()
	}

	private static logCreateRooms = (room: any) => {
		logger.info(`room ${room} is created by adapter`)
	}

	private static logJoinRooms = (room: any, socketId: any) => {
		logger.info(`socket by id ${socketId} joined to ${room}`)
	}
}
