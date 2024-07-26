import Conversation from '../types/conversation'

export default function MessagesList({ conversation }: {conversation: Conversation}){
	if (conversation) {
		const messages = conversation.messages || []
		return (
			messages.map((message, index) => (
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
}