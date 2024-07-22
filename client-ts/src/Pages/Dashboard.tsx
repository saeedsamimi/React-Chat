import { useAuth } from '../hooks/useAuth.ts'

export default function Dashboard() {
	const auth = useAuth()

	return <h1>welcome {auth.user.username}!</h1>
}