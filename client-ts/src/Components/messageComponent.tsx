import Message from '../types/message'

export interface MessageComponentProps {
	message: Message;
}

export default function MessageComponent({message}: MessageComponentProps) {
	return (
		<div className="px-2 py-4 ring-1 ring-gray-400 ">
			Chat {message.content}
		</div>
	)
}