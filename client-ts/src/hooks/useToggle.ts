import { useState, useCallback } from 'react'

export interface toggleSchema {
	value: boolean;
	open: () => void;
	close: () => void;
	toggle: () => void;
}

export default function useToggle(initial: boolean = false): toggleSchema {
	const [state, setState] = useState(initial)

	return {
		value: state,
		open: useCallback(() => {
			setState(true)
		}, []),
		close: useCallback(() => {
			setState(false)
		}, []),
		toggle: useCallback(() => {
			setState(state => !state)
		}, [])
	}
}