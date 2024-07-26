import Conversation from '../types/conversation'

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
		<section className="flex flex-col bg-pink-100 row-span-2 rounded-lg contain-paint ">
			<div className="bg-pink-900 w-full p-4 text-white">
				Chat Page
			</div>
			<ul className="flex flex-col divide-y divide-gray-400 list-none">
				<RenderChats />
			</ul>
		</section>
	)
}