import Conversation from '../types/conversation'
import ConversationMenu from './conversationMenu'
import { createRef, ReactNode, useEffect } from 'react'

export interface ConversationComponentProps {
	conversation?: Conversation
	scrollToBottom: boolean
}

export default function ConversationComponent(props: ConversationComponentProps):ReactNode {
	const listRef = createRef<HTMLDivElement>()

	useEffect(() => {
		if (props.scrollToBottom)
			listRef.current.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' })
	}, [listRef, props.scrollToBottom])

	return (
		<>
			<div className="flex flex-row p-2 bg-pink-400 w-full items-center gap-2 shadow-md">
				<div className="rounded-full size-10 bg-gradient-to-bl from-blue-400 to-green-400"></div>
				<a className="flex-grow text-xl" href="#">Title</a>
				<ConversationMenu />
			</div>
			<div className="overflow-y-scroll" ref={listRef}>
				{props.conversation ? (
					props.conversation.messages.map((message, index) => (
						<div className="w-full"
						     key={index}>
							<div className="py-1 px-2 my-2 bg-pink-800 rounded-lg rounded-br-2xl w-fit ms-auto">
								<span className="text-sm text-gray-100">{message.sender.username}</span><br />
								<p className="text-white p-2 text-lg">{message.content}</p>
								<span
									className="text-xs text-gray-100">{new Date(Date.parse(message.createdAt)).toLocaleDateString()}</span>
							</div>
						</div>
					))) : <div>No chats is available</div>
				}
			</div>
		</>
	)
}