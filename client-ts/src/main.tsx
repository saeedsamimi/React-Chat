import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import MainRoutes from './routes'
import AuthProvider from './contexts/authProvider.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<AuthProvider>
			<MainRoutes />
		</AuthProvider>
	</React.StrictMode>
)
