import type User from '../types/user'
import Conversation from '../types/conversation'

const gradients = [
	'bg-gradient-to-tr from-rose-500',
	'bg-gradient-to-r from-pink-500 to-rose-500',
	'bg-gradient-to-r from-blue-200 to-cyan-200',
	'bg-gradient-to-r from-lime-400 to-lime-500',
	'bg-gradient-to-r from-fuchsia-600 to-pink-600'
]

function User({ user, recent }: { user: User, recent: string }) {
	return (
		<div
			className="grid grid-cols-[min-content_auto] grid-rows-[auto_auto] bg-white bg-opacity-40 rounded-xl shadow-md my-4 p-2 gap-3 hover:bg-gray-200"
		>
			<div
				className={'size-20 rounded-full row-span-2 ' + gradients[Math.floor(Math.random() * gradients.length)]}
			></div>
			<div className="col-start-2 text-lg font-bold">
				{user.username}
			</div>
			<div>
				<span className="text-xs text-opacity-85 me-2">recents:</span>
				{recent}
			</div>
		</div>
	)
}

export default function UsersList({ conversation }: { conversation: Conversation }) {
	return (
		<div className="px-5 overflow-y-scroll">
			{
				conversation.participants.map((user, i) => {
					const recentMessages = conversation.messages
						.filter((msg) => msg.sender._id === user._id)
						.map((msg) => msg.content)
						.slice(0, 5)
					return <User user={user} key={i} recent={recentMessages.reverse().join(', ')} />
				})
			}
		</div>
	)
}