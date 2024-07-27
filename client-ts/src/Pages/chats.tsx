import { useEffect, useState } from 'react'
import socket from '../socket/socketManager'
import ChatsList from '../components/chatsList'
import Conversation from '../types/conversation'
import MessageBox from '../components/messageBox'
import MessagesList from '../components/messagesList'
import ConversationMenu from '../components/conversationMenu'
import useToggle from '../hooks/useToggle'
import UsersList from '../components/usersList'
import User from '../types/user'

export default function Chats() {
	const [socketConnected, setSocketConnected] = useState(socket.connected)
	const [initialMessage, setInitialMessage] = useState<Conversation[]>([])
	const [selectedChatIndex, setSelectedChatIndex] = useState(-1)
	const [notified, setNotified] = useState<boolean>(false)
	const userList = useToggle(false)

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

		const userGetOnline = (user: User) => {
			console.log(JSON.stringify(user))
		}

		const userGetOffline = (user: User) => {
			console.log(JSON.stringify(user))
		}

		socket.on('connect', connect)
		socket.on('disconnect', disconnect)
		socket.on('initChats', initialMessageEvent)
		socket.on('userGetOnline', userGetOnline)
		socket.on('userGetOffline', userGetOffline)

		return () => {
			socket.off('connect', connect)
			socket.off('disconnect', disconnect)
			socket.off('initChats', initialMessageEvent)
			socket.off('userGetOnline', userGetOnline)
			socket.off('userGetOffline', userGetOffline)
		}
	}, [selectedChatIndex, initialMessage])

	const targetId = initialMessage[selectedChatIndex]?._id

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

	const targetConversation = initialMessage[selectedChatIndex]

	return (
		<div
			className="relative -m-4 grid grid-rows-[80%_minmax(auto,80px)] grid-cols-[30%_70%] gap-4 min-h-[75vh]"
		>
			<ChatsList chats={initialMessage} currentChatIndex={selectedChatIndex}
			           onCurrentChatIndexChanged={setSelectedChatIndex} />
			<section
				className="flex flex-col bg-pink-100 row-0 rounded-lg max-h-[60vh] contain-paint"
			>
				<div className="flex flex-row py-2 px-3 bg-pink-400 w-full items-center gap-2 shadow-md">
					<div className="rounded-full size-10 bg-gradient-to-bl from-blue-400 to-green-400"></div>
					<a className="flex-grow text-xl" href="#">{targetConversation?.name || 'Chat Application'}</a>
					{targetConversation && <ConversationMenu showUsers={userList.value} changeMode={userList.toggle} />}
				</div>
				{userList.value ?
					<UsersList conversation={targetConversation} /> :
					<MessagesList conversation={targetConversation} scrollBottom={notified} />
				}
			</section>
			<section className="bg-pink-100 row-1 gap-2 rounded-lg p-4 inline-flex flex-row items-center">
				<MessageBox />
			</section>
		</div>
	)
}