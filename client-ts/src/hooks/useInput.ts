import { ChangeEvent, useCallback, useState } from 'react'

export default function useInput(initialValue?: string): [string,(e: ChangeEvent<HTMLInputElement>) => void] {
	const [value,setValue] = useState(initialValue || '')

	return [
		value,
		useCallback((e: ChangeEvent<HTMLInputElement>)=>{
			setValue(e.currentTarget.value)
		},[])
	]
}