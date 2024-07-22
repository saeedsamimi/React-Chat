import { AuthContext } from './authContext.ts'
import { ReactNode, useEffect, useState, useRef, useCallback } from 'react'
import User from '../types/user.ts'
import axios from 'axios'

export default function AuthProvider({ children }: { children: ReactNode }) {
	const [user, setUser] = useState<User>({ _id: '', username: '' })
	const [loading, setLoading] = useState<boolean>(true)
	const [loggedIn, setLoggedIn] = useState(false)
	const initialRef = useRef<boolean>(true)

	useEffect(() => {
		if (initialRef.current) {
			const token = localStorage.getItem('token')
			if (token !== null) {
				axios.post('/api/users/auth', undefined, {
					headers: { authorization: `Bearer ${token}` }
				})
					.then((res) => {
						setLoggedIn(true)
						setUser(res.data.user)
					})
					.catch(console.error)
					.finally(() => setLoading(false))
			} else {
				setLoading(false)
			}
			initialRef.current = false
		}
	}, [])

	const login = useCallback((data: FormData, mode: string) => {
		axios.post(`/api/users${mode}`, data)
			.then((res) => {
				localStorage.setItem('token', res.data.token)
				setUser(res.data.user)
				setLoading(false)
				setLoggedIn(true)
			})
			.catch((err) => {
				console.error(err)
			})
	}, [])

	return (
		<AuthContext.Provider value={{ user, setUser, loading, login, loggedIn }}>
			{children}
		</AuthContext.Provider>
	)
}