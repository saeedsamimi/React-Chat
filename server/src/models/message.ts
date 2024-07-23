import { Schema, model, Document, Types } from 'mongoose'

export interface IMessage extends Document {
	sender: Types.ObjectId;
	content: string;
	conversation: Types.ObjectId;
	createdAt: Date;
}

export const MessageSchema = new Schema<IMessage>({
	sender: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: true
	},
	content: {
		type: String,
		required: true
	},
	createdAt: {
		type: Date,
		default: Date.now,
	}
})

export const Message = model('Message', MessageSchema)
