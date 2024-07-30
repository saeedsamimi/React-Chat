import ConversationMenu from './conversationMenu.tsx'
import Conversation from '../types/conversation.ts'

interface props {
	targetConversation?: Conversation;
	show: boolean;
	toggle: () => void;
}

export default function ConversationHeader({ targetConversation,show,toggle }: props) {
	return (
		<div className="flex flex-row py-2 px-3 bg-pink-400 w-full items-center gap-2 shadow-md">
			<div className="rounded-full size-10 bg-gradient-to-bl from-blue-400 to-green-400"></div>
			<a className="flex-grow text-xl" href="#">{targetConversation?.name || 'Chat Application'}</a>
			{targetConversation && <ConversationMenu showUsers={show} changeMode={toggle} />}
		</div>
	)
}