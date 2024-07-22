import { ChangeEvent } from 'react'

export interface InputProps {
	name: string;
	id: string;
	placeholder: string;
	type: string;
	value: string;
	onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export default function Input(props: InputProps) {
	return (
		<div className="relative mt-6">
			<input name={props.name} type={props.type} value={props.value} onChange={props.onChange} id={props.id}
			       placeholder={props.placeholder}
			       className="peer mt-1 w-full border-b-2 border-gray-300 px-0 py-1 placeholder:text-transparent focus:border-pink-600 focus:outline-none"
			       autoComplete="NA" />
			<label htmlFor={props.id}
			       className="pointer-events-none absolute top-0 left-0 origin-left -translate-y-1/2 transform text-sm text-gray-800 opacity-75 transition-all duration-100 ease-in-out peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-0 peer-focus:pl-0 peer-focus:text-sm peer-focus:text-pink-800"
			>
				{props.placeholder}
			</label>
		</div>
	)
}