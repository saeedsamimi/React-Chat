import { ChangeEvent, useCallback, useState } from 'react'
import { PaperAirplaneIcon, LinkIcon } from '@heroicons/react/24/solid'

const CSSClass = 'rounded-full bg-white p-2 hover:bg-gradient-to-br hover:from-pink-400 active:bg-pink-400'

export default function MessageBox({ onSend }: { onSend: (message: string) => void }) {
	const [message, setMessage] = useState('')

	const changeMessage = useCallback((e: ChangeEvent<HTMLTextAreaElement>) => {
		setMessage(e.target.value)
	}, [])

	const sendMessage = useCallback(() => {
		if (message.trim().length > 0) {
			onSend(message)
			setMessage('')
		}
	}, [onSend, message])

	return (
		<>
			<textarea placeholder="write a message" className="p-4 rounded-lg grow" value={message} onChange={changeMessage}
			          rows={1}
			          autoFocus
			          aria-multiline={true} />
			<button>
				<LinkIcon className={CSSClass} width={50} />
			</button>
			<button onClick={sendMessage}>
				<PaperAirplaneIcon className={CSSClass} width={50} />
			</button>
		</>
	)
}