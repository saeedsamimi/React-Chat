import { Schema, model, Document } from 'mongoose'
import { hash, verify } from '../security/password'

export interface IUserDocument extends Document {
	username: string;
	password: string;
	name?: string;
}

export interface IUser extends Document, IUserDocument {
	verifyPassword: (input: string) => boolean;
}

export const UserSchema = new Schema<IUser, IUserDocument>({
		username: { type: String, required: true, unique: true },
		password: { type: String, length: 61, required: true },
		name: { type: String, maxLength: 30 }
	},
	{
		toJSON: {
			transform: (doc, ret, opt) => {
				delete ret['password']
				delete ret['__v']
				return ret
			}
		}
	})

UserSchema.pre('save', function(next) {
	if (this.isModified('password')) this.password = hash(this.password)
	next()
})

UserSchema.methods.verifyPassword = function(input: string) {
	return verify(input, this.password)
}

export const User = model('User', UserSchema)
