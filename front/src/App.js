import React, { useEffect } from 'react';
import io from 'socket.io-client';
const socket = io('http://localhost:3001');

function App() {
	useEffect(() => {
		socket.on('connect', () => {
			console.log('Connected to server');
		});

		socket.on('disconnect', () => {
			console.log('Disconnected from server');
		});

		return () => {
			socket.off('connect');
			socket.off('disconnect');
		};
	}, []);

	return (
		<div>
			<h1>Socket.io Client</h1>
		</div>
	);
}

export default App;
