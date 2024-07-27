import Conversation from '../types/conversation'
import Message from '../types/message'
import { forwardRef, createRef, useEffect } from 'react'
import { InformationCircleIcon } from '@heroicons/react/24/outline'
import { useAuth } from '../hooks/useAuth'

export interface MessagesListProps {
	conversation: Conversation;
	scrollBottom?: boolean;
}

interface MessageProps {
	message: Message;
	self: boolean;
}

const Message = forwardRef<HTMLDivElement, MessageProps>((props, ref) => {
	const alignCSS = props.self ? 'ms-auto bg-pink-800' : 'me-auto bg-pink-600'
	const paddingCSS = props.self ? 'ps-[100px]' : 'pe-[100px]'

	return (
		<div className="w-full"
		     ref={ref}>
			<div className={'py-1 px-2 my-2 rounded-lg rounded-br-2xl w-fit ' + alignCSS}>
				<span className={"text-sm text-gray-100 " + paddingCSS}>
					{props.self && <span className="text-sm text-pink-300">You: </span>}{props.message.sender.username}</span><br />
				<p className="text-white p-2 text-lg">{props.message.content}</p>
				<span
					className="text-xs text-gray-100">{new Date(Date.parse(props.message.createdAt)).toLocaleDateString()}</span>
			</div>
		</div>
	)
})

export default function MessagesList({ conversation, scrollBottom }: MessagesListProps) {
	const ref = createRef<HTMLDivElement>()
	const auth = useAuth()

	useEffect(() => {
		if (scrollBottom === true)
			ref.current?.scrollTo({ top: ref.current?.scrollHeight, behavior: 'smooth' })
	}, [ref, scrollBottom])

	if (conversation) {
		const messages = conversation.messages || []
		return (
			<div ref={ref} className="px-4 overflow-y-scroll">
				{messages.map((message, index) => (
					<Message key={index} message={message} self={message.sender._id === auth.user._id} />
				))}
			</div>
		)
	} else
		return (
			<div className="mt-20 self-center text-xl p-2">
				<InformationCircleIcon height={30} className="inline me-2" color="green" />
				No chats is available
			</div>
		)
}