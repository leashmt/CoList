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
	socket.on('getListData', (listName, callback) => {
		if (LISTS[listName]) {
			callback({
				success: true,
				users: LISTS[listName].user,
				content: LISTS[listName].content,
				request: LISTS[listName].request,
			});
		} else {
			callback({
				success: false,
				notlist: true,
				message: "La liste n'existe pas",
			});
		}
	});

	socket.on('checkUserExists', ({ listName, username }, callback) => {
		const list = LISTS[listName];

		if (list) {
			const userExists = list.user.some(user => user.username === username);
			callback({ exists: userExists });
		} else {
			callback({ exists: false });
		}
	});

	socket.on('joinList', ({ listName, username }) => {
		socket.join(listName);

		let role = 'user';
		if (!LISTS[listName]) {
			LISTS[listName] = { user: [], content: [], request: [] };
			role = 'owner';
		}

		if (LISTS[listName].user.find(user => user.username === username)) {
		}
		LISTS[listName].user.push({ id: socket.id, username, role });
		console.log(`${username} to ${listName}`);

		io.emit('updateContent', {
			content: LISTS[listName].content,
			users: LISTS[listName].user,
		});

		io.emit('updateRole', LISTS[listName].user);
	});

	socket.on('add', ({ content, listName, username }) => {
		console.log('add reçu:', { content, listName });

		if (LISTS[listName]) {
			LISTS[listName].content.push({
				by: socket.id,
				content,
				byName: username,
				id: Date.now(),
			});
			io.emit('updateContent', LISTS[listName]);
		}
	});

	socket.on('requestAdd', ({ content, listName, username }) => {
		console.log('requestAdd reçu:', { content, listName, username });

		if (LISTS[listName]) {
			LISTS[listName].request.push({
				by: socket.id,
				content,
				byName: username,
				id: Date.now(),
			});
			io.emit('updateRequest', LISTS[listName].request);
			io.emit('listData', {
				content: LISTS[listName].content,
				users: LISTS[listName].user,
				request: LISTS[listName].request,
			});
		}
	});

	socket.on('validateRequest', ({ id, listName }) => {
		const list = LISTS[listName];

		if (list) {
			const request = list.request.find(p => p.id === id);
			if (request) {
				list.content.push({
					by: socket.id,
					content: request.content,
					byName: request.byName,
					id: Date.now(),
				});
				list.request = list.request.filter(p => p.id !== id);
				console.log(`Point ajouté: ${request.id}`);

				io.emit('listData', {
					content: list.content,
					users: list.user,
					request: list.request,
				});
				io.emit('updateRequest', list.request);
			}
		}
	});

	socket.on('deleteRequest', ({ id, listName }) => {
		const list = LISTS[listName];

		if (list) {
			const request = list.request.find(p => p.id === id);
			if (request) {
				list.request = list.request.filter(p => p.id !== id);
				console.log(`Point supprimé: ${request.id}`);

				io.emit('updateRequest', list.request);
				io.emit('listData', {
					content: list.content,
					users: list.user,
					request: list.request,
				});
			}
		}
	});

	socket.on('delete', ({ pointId, listName }) => {
		const list = LISTS[listName];

		if (list) {
			const point = list.content.find(p => p.id === pointId);
			if (point) {
				list.content = list.content.filter(p => p.id !== pointId);
				console.log(`Point supprimé: ${pointId}`);

				io.emit('updateContent', {
					content: list.content,
					users: list.user,
					request: list.request,
				});
			}
		}
	});

	socket.on('edit', ({ pointId, newContent, listName }) => {
		const list = LISTS[listName];

		if (list) {
			const point = list.content.find(p => p.id === pointId);
			if (point) {
				point.content = newContent;
				console.log(`Point modifié: ${pointId}`);

				io.emit('updateContent', {
					content: list.content,
					users: list.user,
				});
			}
		}
	});

	socket.on('changeRole', ({ id, role, listName }) => {
		const listUsers = LISTS[listName].user;
		const userIndex = listUsers.findIndex(user => user.id === id);
		listUsers[userIndex].role = role;

		io.emit('updateRole', listUsers);
		io.emit('listData', {
			users: listUsers,
		});
	});

	socket.on('disconnect', () => {
		console.log('User disconnected');
	});
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
