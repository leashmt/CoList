import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3001');

const format = name => {
	return name.replace(/\s/g, '-').toLowerCase();
};

const Connexion = () => {
	const navigate = useNavigate();
	const { listName } = useParams();
	const [username, setUsername] = useState('');
	const [error, setError] = useState('');

	const handleSubmit = e => {
		e.preventDefault();
		if (username) {
			socket.emit('checkUserExists', { listName, username }, response => {
				if (response.exists) {
					setError("Ce nom d'utilisateur est déjà pris dans cette liste.");
				} else {
					socket.emit('joinList', { listName, username });
					navigate(`/${listName}/${format(username)}`);
				}
			});
		}
	};

	return (
		<div className="connexion">
			<h1>Invitation sur la liste : {listName}</h1>
			<form onSubmit={handleSubmit}>
				<input
					type="text"
					placeholder="Entrez votre nom"
					value={username}
					onChange={e => setUsername(e.target.value)}
					required
				/>
				<button type="submit">Rejoindre</button>
			</form>
			{error && <p className="error">{error}</p>}
		</div>
	);
};

export default Connexion;
