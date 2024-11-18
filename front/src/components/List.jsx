import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { Navigate, useNavigate, useParams } from 'react-router-dom';

const socket = io('http://localhost:3001');

const List = () => {
	const navigate = useNavigate();
	const { listName } = useParams();
	const [users, setUsers] = useState([]);
	const [list, setList] = useState([]);
	const [newElement, setNewElement] = useState('');

	useEffect(() => {
		socket.emit('getListData', listName, response => {
			if (response.success) {
				setUsers(response.users);
				setList(response.content);
			} else if (response.notlist) {
				navigate('/');
			}
		});

		socket.on('listData', data => {
			setUsers(data.users);
			setList(data.content);
		});

		socket.on('updateUsers', users => {
			setUsers(users);
		});

		return () => {
			socket.off('getListData');
			socket.off('listData');
			socket.off('updateUsers');
		};
	}, []);

	const handleSubmit = e => {
		e.preventDefault();
		socket.emit('add', { content: newElement });
		setNewElement('');
	};

	return (
		<div className="list">
			<div className="header">
				<h1>CoList</h1>
				<h2>Liste actuelle : {listName}</h2>
			</div>
			<div className="main">
				<div className="aside">
					<h2>Membres</h2>
					<ul>
						{users.map(user => (
							<li key={user.id}>
								{user.username} - <i>{user.role}</i>
							</li>
						))}
					</ul>
				</div>
				<div className="content">
					<h2>Contenu de la liste</h2>
					<ul>
						{list.map(user => (
							<li key={user.id}>{user.username}</li>
						))}
						{!list.length && <li>Aucun élément dans la liste</li>}
						<li>
							<form onSubmit={handleSubmit}>
								<input
									type="text"
									placeholder="Nouveau point"
									value={newElement}
									onChange={e => setNewElement(e.target.value)}
									required
								/>
								<button type="submit">Ajouter</button>
							</form>
						</li>
					</ul>
				</div>
			</div>
		</div>
	);
};

export default List;
