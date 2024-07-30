import { createContext, Dispatch, SetStateAction } from 'react'
import User from '../types/user'

export interface authContextProps {
	loading: boolean;
	loggedIn: boolean;
	user: User;
	setUser: Dispatch<SetStateAction<User>>;
	login: (data: FormData, mode: string) => void;
}

export const AuthContext = createContext<authContextProps>({
	loading: true,
	loggedIn: false,
	user: {
		_id: '',
		username: ''
	},
	setUser: () => undefined,
	login: () => undefined,
})