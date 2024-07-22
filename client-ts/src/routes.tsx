import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LoginSigningForm from './components/loginSigningForm.tsx'
import App from './pages/app.tsx'
import Dashboard from './pages/dashboard.tsx'
import ProtectedRoute from './routes/protectedRoute.tsx'

export default function MainRoutes() {
	return (
		<Router>
			<Routes>
				<Route path="/" Component={App}>
					<Route path="login" element={<LoginSigningForm isLogin={true} />} />
					<Route path="signin" element={<LoginSigningForm isLogin={false} />} />
					<Route path="dashboard" element={<ProtectedRoute Component={Dashboard} />} />
				</Route>
			</Routes>
		</Router>
	)
}

