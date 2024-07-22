import { ComponentType } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export interface ProtectedRouterProps {
	Component: ComponentType;
}

const ProtectedRoute = ({ Component: Component }: ProtectedRouterProps) => {
	const { loggedIn, loading } = useAuth()

	if (loading)
		return <div>Loading...</div>

	return loggedIn ? <Component /> : <Navigate to="/login" replace />
}

export default ProtectedRoute;