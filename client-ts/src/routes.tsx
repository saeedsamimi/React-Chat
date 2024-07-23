import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LoginSigningForm from './components/loginSigningForm'
import App from './pages/app'
import Dashboard from './pages/dashboard'
import ProtectedRoute from './routes/ProtectedRoute'
import Chats from './pages/chats'

export default function MainRoutes() {
	return (
		<Router>
			<Routes>
				<Route path="/" Component={App}>
					<Route path="login" element={<LoginSigningForm isLogin={true} />} />
					<Route path="signin" element={<LoginSigningForm isLogin={false} />} />
					<Route path="dashboard" element={<ProtectedRoute Component={Dashboard} />} />
					<Route path="chats" element={<ProtectedRoute Component={Chats}/>}/>
				</Route>
			</Routes>
		</Router>
	)
}

