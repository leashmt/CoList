const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
app.use(
	cors({
		origin: 'http://localhost:3000',
		methods: ['GET', 'POST'],
	})
);
const io = socketIo(server, {
	cors: {
		origin: 'http://localhost:3000', // Front-end autorisé
		methods: ['GET', 'POST'], // Méthodes HTTP autorisées
	},
});

io.on('connection', socket => {
	console.log('A user connected');

	socket.on('disconnect', () => {
		console.log('User disconnected');
	});
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
