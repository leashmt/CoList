const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const LISTS = {};

app.use(
	cors({
		origin: 'http://localhost:3000',
		methods: ['GET', 'POST'],
	})
);
const io = socketIo(server, {
	cors: {
		origin: 'http://localhost:3000',
		methods: ['GET', 'POST'],
	},
});

io.on('connection', socket => {
	console.log('A user connected');

	socket.on('getListData', (listName, callback) => {
		if (LISTS[listName]) {
			callback({
				success: true,
				users: LISTS[listName].user,
				content: LISTS[listName].content,
			});
		} else {
			callback({
				success: false,
				notlist: true,
				message: "La liste n'existe pas",
			});
		}
	});

	socket.on('joinList', ({ listName, username }) => {
		console.log('joinList reçu :', { listName, username });

		let role = 'user';
		if (!LISTS[listName]) {
			LISTS[listName] = { user: [], content: [] };
			role = 'owner';
		}
		LISTS[listName].user.push({ id: socket.id, username, role });
		socket.join(listName);

		console.log(`${username} to ${listName}`);
		console.log(LISTS);

		socket.emit('listData', {
			users: LISTS[listName].user,
			content: LISTS[listName].content,
		});

		io.to(listName).emit('updateUsers', LISTS[listName]);
	});

	socket.on('add', ({ content, listName }) => {
		console.log('add reçu:', { content, listName });

		if (LISTS[listName]) {
			LISTS[listName].content.push({ by: socket.id, content });
			socket.to(listName).emit('updateContent', LISTS[listName]);
		}
		console.log(LISTS[listName].content);
	});

	socket.on('disconnect', () => {
		console.log('User disconnected');
	});
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
