import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import MainRoutes from './routes'
import AuthProvider from './contexts/authProvider'

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<AuthProvider>
			<MainRoutes />
		</AuthProvider>
	</StrictMode>
)
