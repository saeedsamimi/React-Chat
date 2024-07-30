export interface IRoute {
	name: string;
	href: string;
}

export const ROUTES: IRoute[] = [
	{
		name: 'Dashboard',
		href: '/dashboard'
	},
	{
		name: 'Chats',
		href: '/chats'
	}
]