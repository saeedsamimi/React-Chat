import { Schema, model, Types } from 'mongoose'

export interface IConversation {
	name: string;
	participants: Types.ObjectId[];
	messages: Types.ObjectId[];
	createdAt: Date;
	updatedAt: Date;
}

export const ConversationSchema = new Schema<IConversation>({
	name: { type: String, required: true },
	participants: [{ type: Schema.Types.ObjectId, ref: 'User', required: true }],
	messages: [{ type: Schema.Types.ObjectId, ref: 'Message', required: true }],
	createdAt: { type: Date, default: Date.now }
})

ConversationSchema.pre('save', function(next) {
	if (this.isModified('participants'))
		this.participants = Array.from(new Set(this.participants.map(String))).map(id => new Types.ObjectId(id))
	next()
})

export const Conversation = model('Conversation', ConversationSchema)