import { ComponentType } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import Loading from '../components/loading.tsx'

export interface ProtectedRouterProps {
	Component: ComponentType;
}

const ProtectedRoute = ({ Component: Component }: ProtectedRouterProps) => {
	const { loggedIn, loading } = useAuth()

	if (loading)
		return (
			<div className="w-fit mx-auto">
				<Loading size={100} background="#DB2777" foreground="#D1D5DB"/>
			</div>
		)

	return loggedIn ? <Component /> : <Navigate to="/login" replace />
}

export default ProtectedRoute;