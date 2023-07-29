import { io } from 'socket.io-client';

class SocketService {
	socket;

	setupSocketConnection = () => {
		this.socket = io(process.env.REACT_APP_BASE_ENDPOINT, {
			transports: ['websocket'],
			secure: true,
		});

		this.socketConnectionEvents();
	}

	socketConnectionEvents = () => {
		this.socket.on('connect', () => {
			console.log('connected');
		});

		this.socket.on('disconnect', (reason) => {
			console.log(`${reason}`);
			this.socket.connect();
		});

		this.socket.on('connect_error', (err) => {
			console.log(`${err}`);
			this.socket.connect();
		})
	}
}

export const socketService = new SocketService();