import Logo from '../assets/chat-50.png'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { Dialog, DialogPanel } from '@headlessui/react'
import { ROUTES } from '../constants'
import { useLocation } from 'react-router-dom'

export interface NavbarProps {
	opened: boolean;
	onClose: () => void;
	onOpen: () => void;
}

export default function Navbar(props: NavbarProps) {
	const location = useLocation()
	return (
		<>
			<nav aria-label="Global" className="flex bg-pink-400 items-center justify-between p-6 lg:px-8 shadow-md">
				<div className="flex lg:flex-1 items-center">
					<a href="#" className="-m-1.5 p-1.5">
						<span className="sr-only">Your Company</span>
						<img alt="logo" src={Logo} className="h-8 w-auto" />
					</a>
					<span className="ps-2">Chat Application</span>
				</div>
				<div className="flex lg:hidden">
					<button type="button" onClick={props.onOpen}
					        className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700">
						<span className="sr-only">Open main menu</span>
						<Bars3Icon aria-hidden="true" className="h-6 w-6" />
					</button>
				</div>
				<div className="hidden lg:flex lg:gap-x-12">
					{ROUTES.map((item, index) => (
						<a key={index}
						   href={item.href}
						   className={"text-sm font-semibold leading-6 text-gray-900 " + (location.pathname === item.href ? 'border-b-2 border-b-black' : '')}>
							{item.name}
						</a>
					))}
				</div>
				<div className="hidden lg:flex lg:flex-1 lg:justify-end">
					<a href="#" className="text-sm font-semibold leading-6 text-gray-900">
						Log in <span aria-hidden="true">&rarr;</span>
					</a>
				</div>
			</nav>
			<Dialog open={props.opened} onClose={props.onClose} className="lg:hidden">
				<div className="fixed inset-0 z-50" />
				<DialogPanel
					className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white sm:max-w-sm sm:ring-1 sm:ring-gray-900/10 shadow-md">
					<div className="flex items-center justify-between bg-pink-400 p-6">
						<a href="#" className="-m-1.5 p-1.5">
							<span className="sr-only">Your Company</span>
							<img
								alt=""
								src={Logo}
								className="h-8 w-auto"
							/>
						</a>
						<button
							type="button"
							onClick={props.onClose}
							className="-m-2.5 rounded-md p-2.5 text-gray-700"
						>
							<span className="sr-only">Close menu</span>
							<XMarkIcon aria-hidden="true" className="h-6 w-6" />
						</button>
					</div>
					<div className="mt-6 px-6 flow-root">
						<div className="-my-6 divide-y divide-pink-500/30">
							<div className="space-y-2 py-6">
								{ROUTES.map((item) => (
									<a
										key={item.name}
										href={item.href}
										className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
									>
										{item.name}
									</a>
								))}
							</div>
							<div className="py-6">
								<a
									href="#"
									className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
								>
									Log in<span className="ps-2">&rarr;</span>
								</a>
							</div>
						</div>
					</div>
				</DialogPanel>
			</Dialog>
		</>
	)
}