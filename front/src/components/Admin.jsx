import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { IoShareOutline } from 'react-icons/io5';
import { MdDeleteOutline } from 'react-icons/md';
import { FaRegCheckSquare } from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';

const socket = io('http://localhost:3001');

const formatDate = timestamp => {
	const date = new Date(timestamp);
	return (
		date.toLocaleDateString('fr-FR') +
		' ' +
		date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
	);
};

const Admin = () => {
	const navigate = useNavigate();
	const { listName, username } = useParams();
	const [currentUser, setCurrentUser] = useState(null);
	const [list, setList] = useState([]);
	const [users, setUsers] = useState([]);

	useEffect(() => {
		socket.emit('getListData', listName, response => {
			if (response.success) {
				setUsers(response.users);
				setList(response.request);
				const currentUser = response.users.find(
					user => user.username === username
				);
				if (
					!currentUser ||
					(currentUser.role !== 'owner' && currentUser.role !== 'admin')
				) {
					navigate(`/${listName}/${username}`);
					return;
				}
				setCurrentUser(currentUser);
			} else if (response.notlist) {
				navigate('/');
			}
		});

		socket.on('updateRequest', data => {
			setList(data);
		});

		return () => {
			socket.off('getListData');
		};
	}, []);

	const handleShare = () => {
		navigator.clipboard.writeText(`localhost:3000/${listName}`);
		alert('Lien copié dans le presse-papier');
	};

	const handleValidate = id => {
		socket.emit('validateRequest', { id, listName });
	};

	const handleDelete = id => {
		socket.emit('deleteRequest', { id, listName });
	};

	return (
		<div className="admin">
			<div className="header">
				<a href="/">
					<h1>CoList</h1>
				</a>
				<h2>Liste actuelle : {listName}</h2>
				<button className="share-button" onClick={handleShare}>
					<IoShareOutline />
				</button>
			</div>
			<div className="moderation">
				<h2>Modération</h2>
				{list?.length > 0 ? (
					<table>
						<thead>
							<tr>
								<th>Contenu</th>
								<th>Auteur</th>
								<th>Date</th>
								<th>Actions</th>
							</tr>
						</thead>
						<tbody>
							{list.map((request, index) => (
								<tr key={index}>
									<td>{request.content}</td>
									<td>{request.byName}</td>
									<td>{formatDate(request.id)}</td>
									<td className="actions">
										<button
											onClick={() => handleValidate(request.id)}
										>
											<FaRegCheckSquare />
										</button>
										<button onClick={() => handleDelete(request.id)}>
											<MdDeleteOutline />
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				) : (
					<p>Aucune demande en attente</p>
				)}
			</div>
		</div>
	);
};

export default Admin;
