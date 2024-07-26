import { createRef, useEffect, useState } from 'react'
import socket from '../socket/socketManager'
import ChatsList from '../components/chatsList'
import Conversation from '../types/conversation'
import MessageBox from '../components/messageBox'
import MessagesList from '../components/messagesList'

export default function Chats() {
	const [socketConnected, setSocketConnected] = useState(socket.connected)
	const [initialMessage, setInitialMessage] = useState<Conversation[]>([])
	const [selectedChatIndex, setSelectedChatIndex] = useState(-1)
	const messagesListRef = createRef<HTMLDivElement>()
	const [notified, setNotified] = useState<boolean>(false)

	useEffect(() => {
		if (notified)
			messagesListRef.current.scrollTo({ top: messagesListRef.current.scrollHeight, behavior: 'smooth' })
	}, [messagesListRef, notified])

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

		const initialMessageEvent = (message: []) => {
			setInitialMessage(message)
			setNotified(true)
		}

		socket.on('connect', connect)
		socket.on('disconnect', disconnect)
		socket.on('initChats', initialMessageEvent)

		return () => {
			socket.off('connect', connect)
			socket.off('disconnect', disconnect)
			socket.off('initChats', initialMessageEvent)
		}
	}, [selectedChatIndex, initialMessage, messagesListRef])

	useEffect(() => {
		if (selectedChatIndex >= 0)
			socket
				.emitWithAck('getConversation', initialMessage[selectedChatIndex]._id)
				.then((data) => {
					console.log(data)
					setInitialMessage((messages) => {
						return messages.map((message, i) => {
							if (i === selectedChatIndex) {
								return { ...message, participants: data.participants, messages: data.messages }
							} else return message
						})
					})
				})
	}, [selectedChatIndex, initialMessage])

	return (
		<div
			className="relative -m-4 grid grid-rows-[80%_minmax(auto,80px)] grid-cols-[30%_70%] gap-4 min-h-[75vh]"
		>
			<ChatsList chats={initialMessage} currentChatIndex={selectedChatIndex}
			           onCurrentChatIndexChanged={setSelectedChatIndex} />
			<section className="bg-pink-100 row-0 rounded-lg p-4 overflow-y-scroll max-h-[60vh]" ref={messagesListRef}>
				<MessagesList conversation={initialMessage[selectedChatIndex]} />
			</section>
			<section className="bg-pink-100 row-1 gap-2 rounded-lg p-4 inline-flex flex-row items-center">
				<MessageBox />
			</section>
		</div>
	)
}