import User from './user'

export default interface Message {
	_id: string;
	sender: User;
	content: string;
	createdAt: string;
}