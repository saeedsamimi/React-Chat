import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import {
	MagnifyingGlassIcon,
	UserGroupIcon,
	ArrowRightStartOnRectangleIcon
} from '@heroicons/react/16/solid'
import { EllipsisVerticalIcon } from '@heroicons/react/24/outline'

const items: { label: string, icon: typeof UserGroupIcon }[] = [
	{
		label: 'find',
		icon: MagnifyingGlassIcon
	},
	{
		label: 'Members',
		icon: UserGroupIcon
	},
	{
		label: 'Leave Conversation',
		icon: ArrowRightStartOnRectangleIcon
	}
]

export default function ConversationMenu() {
	return (
		<Menu>
			<MenuButton
				className="hover:bg-gray-200 hover:bg-opacity-20 rounded-full data-[open]:bg-gray-300 data-[open]:bg-opacity-20">
				<EllipsisVerticalIcon height={30} />
			</MenuButton>

			<MenuItems
				transition
				anchor="bottom end"
				className="w-52 origin-top-right rounded-xl border border-white/5 bg-white p-1 text-sm/6 text-black transition duration-100 ease-out mt-3 translate-x-1 focus:outline-none data-[closed]:translate-x-5 data-[closed]:opacity-0"
			>
				{
					items.map((item, index) => (
						<MenuItem>
							<button key={index}
							        className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-black/10">
								<item.icon className="size-4 fill-black/70" />
								{item.label}
							</button>
						</MenuItem>
					))
				}
			</MenuItems>
		</Menu>)
}