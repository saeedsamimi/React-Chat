import { ChangeEvent, ChangeEventHandler, useCallback, useState } from 'react'
import { PaperAirplaneIcon, LinkIcon } from '@heroicons/react/24/solid'

const CSSClass = 'rounded-full bg-white p-2 hover:bg-gradient-to-br hover:from-pink-400 active:bg-pink-400'

interface Props {
	sendMessage: (content: string) => void;
}

export default function MessageBox({ sendMessage }: Props) {
	const [message, setMessage] = useState('')

	const changeMessage = useCallback<ChangeEventHandler>((e: ChangeEvent<HTMLInputElement>) => {
		setMessage(e.currentTarget.value)
	}, [])

	const sendMessageHandler = () => sendMessage(message)

	return (
		<>
			<input placeholder="write a message"
			       className="p-4 rounded-lg grow"
			       value={message}
			       onChange={changeMessage}
			       autoFocus
			       aria-multiline={true} />
			<button>
				<LinkIcon className={CSSClass} width={50} />
			</button>
			<button>
				<PaperAirplaneIcon className={CSSClass} width={50} onClick={sendMessageHandler} />
			</button>
		</>
	)
}