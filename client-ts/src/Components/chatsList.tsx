import Conversation from '../types/conversation'
import { PlusCircleIcon } from '@heroicons/react/24/solid'

interface ChatsListProps {
	chats: Conversation[];
	currentChatIndex: number;
	onCurrentChatIndexChanged: (index: number) => void;
}

export default function ChatsList(props: ChatsListProps) {
	const RenderChats = () => {
		return props.chats.map((item, i) => (
			<div key={i}>
				<li aria-selected={i === props.currentChatIndex}
				    className={(i === props.currentChatIndex ? 'border-l-black border-l-4' : '') + ' ps-4 py-3 hover:bg-pink-200 active:bg-pink-300'}
				    onClick={() => props.onCurrentChatIndexChanged(i)}
				>{item.name}</li>
			</div>))
	}

	return (
		<>
			<div className="bg-pink-900 w-full p-4 text-white">
				Conversations
			</div>
			<ul className="flex flex-col divide-y divide-gray-400 list-none">
				<RenderChats />
			</ul>
			<button
				className="absolute shadow-lg bg-pink-600 inline-flex rounded-full w-fit h-10 bottom-5 right-5 p-2 items-center group active:text-gray-800">
					<span
						className="transition-all duration-300 ease-in-out max-w-0 opacity-0 overflow-hidden group-hover:max-w-xs group-hover:opacity-100 px-0 group-hover:px-2">
						Create Conversation
					</span>
				<PlusCircleIcon height={30} />
			</button>
		</>
	)
}