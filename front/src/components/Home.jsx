import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3001');

const format = name => {
	return name.replace(/\s/g, '-').toLowerCase();
};

const Home = () => {
	const [username, setUsername] = useState('');
	const [listName, setListName] = useState('');
	const navigate = useNavigate();

	const handleSubmit = e => {
		e.preventDefault();
		if (username && listName) {
			console.log(format(listName), username);
			socket.emit('joinList', { listName, username });
			navigate(`/${format(listName)}`, { state: { username } });
		}
	};

	return (
		<div className="home">
			<h1>CoList</h1>
			<form onSubmit={handleSubmit}>
				<input
					type="text"
					placeholder="Entrez votre nom"
					value={username}
					onChange={e => setUsername(e.target.value)}
					required
				/>
				<input
					type="text"
					placeholder="Entrez le nom de la liste"
					value={listName}
					onChange={e => setListName(e.target.value)}
					required
				/>
				<button type="submit">Accéder à la liste</button>
			</form>
		</div>
	);
};

export default Home;
