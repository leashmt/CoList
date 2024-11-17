import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
const socket = io('http://localhost:3001');

function App() {
	const [message, setMessage] = useState('');

	useEffect(() => {
		socket.on('connect', () => {
			console.log('Connected to server');
		});

		socket.on('disconnect', () => {
			console.log('Disconnected from server');
		});

		socket.on('message', data => {
			console.log('Message received:', data);
			setMessage(data.content);
		});

		return () => {
			socket.off('connect');
			socket.off('disconnect');
			socket.off('message');
		};
	}, []);

	return (
		<div>
			<h1>Socket.io Client</h1>
			<p>Message from server: {message}</p>
		</div>
	);
}

export default App;
