import User from './user'
import Message from './message'

export default interface Conversation {
	_id: string;
	name: string;
	participants: User[];
	messages: Message[];
}