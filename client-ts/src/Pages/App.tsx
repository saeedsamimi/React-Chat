import useToggle from '../hooks/useToggle'
import Navbar from '../components/navbar'
import { Outlet } from 'react-router-dom'


export default function App() {
	const menuToggle = useToggle()

	return (
		<div className="bg-white">
			<header className="absolute inset-x-0 top-0 z-50">
				<Navbar opened={menuToggle.value} onClose={menuToggle.close} onOpen={menuToggle.open} />
			</header>
			<div className="relative isolate flex flex-col pt-14 px-6 lg:px-8">
				<div className="relative isolate px-6 pt-20 lg:px-8">
					<Outlet />
				</div>
			</div>
		</div>
	)
}