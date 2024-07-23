import io from 'socket.io-client'

const socket = io(undefined, {
	extraHeaders: {
		Authorization: `Bearer ${localStorage.getItem('token')}`
	}
})

export default socket