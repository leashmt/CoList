import React, { useEffect, useState } from 'react';
import { FaPencilAlt } from 'react-icons/fa';
import { FaDeleteLeft } from 'react-icons/fa6';
import { IoShareOutline } from 'react-icons/io5';
import io from 'socket.io-client';
import { useNavigate, useParams } from 'react-router-dom';

const socket = io('http://localhost:3001');

const List = () => {
	const navigate = useNavigate();
	const { listName, username } = useParams();
	const [users, setUsers] = useState([]);
	const [list, setList] = useState([]);
	const [newElement, setNewElement] = useState('');
	const [currentUser, setCurrentUser] = useState(null);

	useEffect(() => {
		socket.emit('getListData', listName, response => {
			if (response.success) {
				setUsers(response.users);
				setList(response.content);
				setCurrentUser(response.users.find(user => user.username === username));
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

		socket.on('updateContent', data => {
			setList(data.content);
		});

		return () => {
			socket.off('getListData');
			socket.off('listData');
			socket.off('updateUsers');
			socket.off('updateContent');
		};
	}, []);

	const handleSubmit = e => {
		e.preventDefault();
		socket.emit('add', {
			content: newElement,
			listName,
			username: currentUser.username,
		});
		setNewElement('');
	};

	const handleDelete = pointId => {
		socket.emit('delete', { pointId, listName });
	};

	const handleEdit = (pointId, newContent) => {
		socket.emit('edit', { pointId, newContent, listName });
	};

	const handleShare = () => {
		navigator.clipboard.writeText(`localhost:3000/${listName}`);
		alert('Lien copié dans le presse-papier');
	};

	return (
		<div className="list">
			<div className="header">
				<a href="/">
					<h1>CoList</h1>
				</a>
				<h2>Liste actuelle : {listName}</h2>
				<button className="share-button" onClick={handleShare}>
					<IoShareOutline />
				</button>
			</div>
			<div className="main">
				<div className="aside">
					<h2>Membres</h2>
					<ul>
						{users &&
							users.map(user => (
								<li key={user.id}>
									{user.username} - <i>{user.role}</i>
								</li>
							))}
					</ul>
				</div>
				<div className="content">
					<h2>Contenu de la liste</h2>
					<div>
						{list &&
							list.map((point, index) => (
								<div key={index} className="point">
									{'>>'} {point.content}
									<i> par {point.byName}</i>
									{currentUser &&
										(currentUser?.role === 'owner' ||
											currentUser.username === point.byName) && (
											<div className="buttons-update">
												<button
													onClick={() => {
														const newContent = prompt(
															'Nouveau contenu:',
															point.content
														);
														if (
															newContent &&
															newContent !== point.content
														) {
															handleEdit(
																point.id,
																newContent
															);
														}
													}}
												>
													<FaPencilAlt />
												</button>
												<button
													onClick={() => handleDelete(point.id)}
												>
													<FaDeleteLeft />
												</button>
											</div>
										)}
								</div>
							))}
						{!list.length && <li key="empty">Aucun élément dans la liste</li>}
						<div key="new" className="new">
							<form onSubmit={handleSubmit}>
								<input
									type="text"
									placeholder="Nouveau point"
									value={newElement}
									onChange={e => setNewElement(e.target.value)}
									required
								/>
								<button className="button-submit" type="submit">
									+
								</button>
							</form>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default List;
