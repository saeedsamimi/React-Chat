import { useAuth } from '../hooks/useAuth'
import { createRef, useCallback, useEffect, useState } from 'react'
import socket from '../socket/socketManager'
import ChatsList from '../components/chatsList'
import Conversation from '../types/conversation'
import MessageBox from '../components/messageBox'
import Message from '../types/message'

export default function Chats() {
	const [socketConnected, setSocketConnected] = useState(socket.connected)
	const [initialMessage, setInitialMessage] = useState<Conversation[]>([])
	const [selectedChatIndex, setSelectedChatIndex] = useState(0)
	const messagesListRef = createRef<HTMLDivElement>()
	const [notified, setNotified] = useState<boolean>(false)
	const auth = useAuth()

	useEffect(() => {
		if (notified)
			messagesListRef.current.scrollTo({ top: messagesListRef.current.scrollHeight, behavior: 'smooth' })
	}, [messagesListRef, notified])

	useEffect(() => {
		const connect = () => {
			setSocketConnected(true)
			console.log('Connected')
		}

		const disconnect = () => {
			setSocketConnected(false)
			console.log('Disconnected')
		}

		const initialMessageEvent = (message: []) => {
			setInitialMessage(message)
			setNotified(true);
		}

		const onMessageAdded = (message: { message: Message, conversationId: string }) => {
			setInitialMessage((v) => {
				return v.map((conversation) => {
					if (conversation._id === message.conversationId) {
						return ({
							...conversation,
							messages: [...conversation.messages, message.message]
						})
					} else {
						return conversation
					}
				})
			})
			setNotified(true)
		}

		socket.on('connect', connect)
		socket.on('disconnect', disconnect)
		socket.on('initialMessages', initialMessageEvent)
		socket.on('messageAdded', onMessageAdded)

		return () => {
			socket.off('connect', connect)
			socket.off('disconnect', disconnect)
			socket.off('initialMessages', initialMessageEvent)
			socket.off('messageAdded', onMessageAdded)
		}
	}, [selectedChatIndex, initialMessage, messagesListRef])

	const Messages = useCallback(() => {
		if (initialMessage[selectedChatIndex]) {
			return (
				initialMessage[selectedChatIndex].messages.map((message, index) => (
					<div className="w-full"
					     key={index}>
						<div className="py-1 px-2 my-2 bg-pink-800 rounded-lg rounded-br-2xl w-fit ms-auto">
							<span className="text-sm text-gray-100">{message.sender.username}</span><br />
							<p className="text-white p-2 text-lg">{message.content}</p>
							<span
								className="text-xs text-gray-100">{new Date(Date.parse(message.createdAt)).toLocaleDateString()}</span>
						</div>
					</div>
				))
			)
		} else
			return <div>No chats is available</div>
	}, [initialMessage, selectedChatIndex])

	const sendMessage = useCallback((msg: string) => {
		console.log(`sending ${msg}`)
		socket.emit('addMessage',
			{
				message: { content: msg },
				conversationId: initialMessage[selectedChatIndex]._id,
				sender: auth.user._id
			}
		)
	}, [auth.user._id, initialMessage, selectedChatIndex])

	return (
		<div
			className="relative -m-4 grid grid-rows-[80%_fit-content] grid-cols-[30%_70%] gap-4 min-h-[75vh]"
		>
			<ChatsList chats={initialMessage} currentChatIndex={selectedChatIndex}
			           onCurrentChatIndexChanged={setSelectedChatIndex} />
			<section className="bg-pink-100 row-0 rounded-lg p-4 overflow-y-scroll max-h-[60vh]" ref={messagesListRef}>
				<Messages />
			</section>
			<section className="bg-pink-100 row-1 gap-2 rounded-lg p-4 inline-flex flex-row items-center">
				<MessageBox onSend={sendMessage} />
			</section>
		</div>
	)
}