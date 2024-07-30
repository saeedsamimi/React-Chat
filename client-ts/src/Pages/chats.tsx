import { useEffect, useState } from 'react'
import socket from '../socket/socketManager'
import ChatsList from '../components/chatsList'
import Conversation from '../types/conversation'
import MessageBox from '../components/messageBox'
import MessagesList from '../components/messagesList'
import useToggle from '../hooks/useToggle'
import UsersList from '../components/usersList'
import User from '../types/user'
import Message from '../types/message'
import { useAuth } from '../hooks/useAuth'
import ConversationHeader from '../components/conversationHeader.tsx'

export default function Chats() {
	const [socketConnected, setSocketConnected] = useState(socket.connected)
	const [initialMessage, setInitialMessage] = useState<Conversation[]>([])
	const [selectedChatIndex, setSelectedChatIndex] = useState(-1)
	const [notified, setNotified] = useState<boolean>(false)
	const userList = useToggle(false)
	const auth = useAuth()
	const targetConversation = initialMessage[selectedChatIndex]
	const targetId = initialMessage[selectedChatIndex]?._id

	useEffect(() => {
		if (!socketConnected) {
			socket.connect()
		}
	}, [socketConnected])

	useEffect(() => {
		const connect = () => {
			setSocketConnected(true)
			console.log('Connected')
		}

		const disconnect = () => {
			setSocketConnected(false)
			console.log('Disconnected')
		}

		const initialMessageEvent = (message: Conversation[]) => {
			setInitialMessage(message)
			setNotified(true)
		}

		const userGetOnline = (user: User) => {
			console.log(JSON.stringify(user))
		}

		const userGetOffline = (user: User) => {
			console.log(JSON.stringify(user))
		}

		const messageAdded = (data: Message, conversationId: string, user: User) => {
			if (conversationId === targetId) {
				setInitialMessage(
					initialMessage.map((conversation) => {
						if (conversation._id === targetId)
							return { ...conversation, messages: [...conversation.messages, { ...data, sender: user }] }
						return conversation
					})
				)
			}
		}

		socket.on('connect', connect)
		socket.on('disconnect', disconnect)
		socket.on('initChats', initialMessageEvent)
		socket.on('userGetOnline', userGetOnline)
		socket.on('userGetOffline', userGetOffline)
		socket.on('messageAdded', messageAdded)

		return () => {
			socket.off('connect', connect)
			socket.off('disconnect', disconnect)
			socket.off('initChats', initialMessageEvent)
			socket.off('userGetOnline', userGetOnline)
			socket.off('userGetOffline', userGetOffline)
			socket.off('messageAdded', messageAdded)
		}
	}, [selectedChatIndex, initialMessage, targetId])

	useEffect(() => {
		if (selectedChatIndex >= 0)
			socket
				.emitWithAck('getConversation', targetId)
				.then((data) => {
					setInitialMessage((messages) => {
						return messages.map((message, i) => {
							if (i === selectedChatIndex) {
								return { ...message, participants: data.participants, messages: data.messages }
							} else return message
						})
					})
				})
	}, [targetId, selectedChatIndex])

	const sendMessage = (message: string) => {
		socket
			.emitWithAck('addMessage', message, targetConversation._id)
			.then((res) => {
				setInitialMessage(
					initialMessage.map((conversation) => {
						if (conversation._id === targetConversation._id)
							return { ...conversation, messages: [...conversation.messages, { ...res, sender: auth.user }] }
						return conversation
					})
				)
			})
			.catch((err) => {
				console.error(err)
			})
	}

	return (
		<div
			className="relative -m-4 grid grid-rows-[80%_minmax(auto,80px)] grid-cols-[30%_70%] gap-4 min-h-[75vh]"
		>
			<section className="relative flex flex-col bg-pink-100 row-span-2 rounded-lg contain-paint">
				<ChatsList chats={initialMessage} currentChatIndex={selectedChatIndex}
				           onCurrentChatIndexChanged={setSelectedChatIndex} />
			</section>
			<section
				className="flex flex-col bg-pink-100 row-0 rounded-lg max-h-[60vh] contain-paint"
			>
				<ConversationHeader show={userList.value} toggle={userList.toggle} targetConversation={targetConversation}/>
				{userList.value ?
					<UsersList conversation={targetConversation} /> :
					<MessagesList conversation={targetConversation} scrollBottom={notified} />
				}
			</section>
			<section className="bg-pink-100 row-1 gap-2 rounded-lg p-4 inline-flex flex-row items-center">
				<MessageBox sendMessage={sendMessage} />
			</section>
		</div>
	)
}