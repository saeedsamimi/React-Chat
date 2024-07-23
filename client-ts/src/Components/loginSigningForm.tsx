import Input from './input'
import useInput from '../hooks/useInput'
import { Link, Navigate } from 'react-router-dom'
import { FormEvent, useCallback } from 'react'
import { useAuth } from '../hooks/useAuth'
import Loading from './loading.tsx'
import { useNavigate } from 'react-router-dom'

export interface LoginSigningFormProps {
	isLogin: boolean;
}

interface FormDetails {
	location: string;
	label: string;
	desc: string;
	changeLabel: string;
}

const loginSingingFormDetails: FormDetails[] = [
	/* for false (isSignIn) */
	{
		location: '/signin',
		label: 'Sign in',
		desc: 'Join to this platform',
		changeLabel: 'Don\'t have an account yet?'
	},
	/* for true (isLogin) */
	{
		location: '/login',
		label: 'Login',
		desc: 'Welcome again dear user',
		changeLabel: 'Already have an account?'
	}
]

export default function LoginSigningForm(props: LoginSigningFormProps) {
	const [username, usernameChanged] = useInput()
	const [password, passwordChange] = useInput()
	const { login, loading, loggedIn } = useAuth()
	const navigate = useNavigate()
	const details = loginSingingFormDetails[props.isLogin ? 1 : 0]
	const otherDetails = loginSingingFormDetails[props.isLogin ? 0 : 1]

	const handleSubmit = useCallback((e: FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		login(new FormData(e.currentTarget), details.location)
		navigate('/dashboard')
	}, [navigate, details.location, login])

	if (loggedIn) {
		return <Navigate to={'/dashboard'} replace />
	}

	return (
		<div
			className="relative mx-auto w-full max-w-md bg-white px-6 pt-16 pb-8 shadow-xl lg:ring-1 ring-gray-900/5 rounded-xl sm:px-10"
		>
			<div className="w-full">
				<div className="text-center sm:pb-2 lg:pb-4">
					<h1 className="text-3xl font-semibold text-gray-900">{details.label}</h1>
					<p className="my-2 text-gray-500">{details.desc}</p>
				</div>
				<div className="mt-5">
					<form onSubmit={handleSubmit} noValidate>
						<Input id="username_input"
						       type="text" name="username"
						       placeholder="Username"
						       onChange={usernameChanged} value={username} />
						<Input id="password_input" type="password"
						       name="password" placeholder="Passsword"
						       onChange={passwordChange} value={password} />
						<div className="my-6">
							<button type="submit"
							        className="peer w-full text-white bg-pink-600 hover:bg-pink-800 focus:outline-none active:ring-2 active:ring-pink-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 inline-flex items-center justify-center disabled:bg-pink-400"
							        disabled={loading}
							>
								{loading && <Loading />}
								{details.label}
							</button>
						</div>
						<p className="text-center text-sm text-gray-500">{details.changeLabel}
							<Link to={otherDetails.location}
							      className="font-semibold text-pink-500 hover:underline focus:text-gray-800 focus:outline-none ps-2"
							      replace>{otherDetails.label}</Link>.
						</p>
					</form>
				</div>
			</div>
		</div>
	)
}