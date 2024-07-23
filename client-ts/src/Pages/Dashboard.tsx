import { useAuth } from '../hooks/useAuth'

export default function Dashboard() {
	const auth = useAuth()

	return (
		<div
			className="relative flex flex-col items-center mx-auto w-full max-w-xl bg-white px-6 py-8 shadow-xl lg:ring-1 ring-gray-900/5 rounded-xl sm:px-10"
		>
			<div className="size-48 rounded-full bg-gradient-to-br from-indigo-400 to-pink-100 ring-gray-400 ring-2" />
			<h1 className="text-4xl mt-4 font-serif">Welcome {auth.user.username}!</h1>
		</div>
	)
}