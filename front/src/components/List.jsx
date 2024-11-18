import React, { useEffect, useState } from 'react';
import { FaPencilAlt } from 'react-icons/fa';
import { FaDeleteLeft } from 'react-icons/fa6';
import { IoShareOutline } from 'react-icons/io5';
import { RiAdminFill } from 'react-icons/ri';
import io from 'socket.io-client';
import { Link, useNavigate, useParams } from 'react-router-dom';

const socket = io('http://localhost:3001');

const List = () => {
	const navigate = useNavigate();
	const { listName, username } = useParams();
	const [users, setUsers] = useState([]);
	const [list, setList] = useState([]);
	const [listRequest, setListRequest] = useState([]);
	const [newElement, setNewElement] = useState('');
	const [currentUser, setCurrentUser] = useState(null);

	useEffect(() => {
		socket.emit('getListData', listName, response => {
			if (response.success) {
				setUsers(response.users);
				setList(response.content);
				setListRequest(response.request);
				setCurrentUser(response.users.find(user => user.username === username));
			} else if (response.notlist) {
				navigate('/');
			}
		});

		socket.on('listData', data => {
			if (data.users) {
				setCurrentUser(data.users.find(user => user.username === username));
				setUsers(data.users);
			}
			if (data.content) {
				setList(data.content);
			}
			if (data.request) {
				setListRequest(data.request);
			}
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
		if (currentUser?.role === 'owner' || currentUser?.role === 'admin') {
			socket.emit('add', {
				content: newElement,
				listName,
				username: currentUser.username,
			});
		} else {
			socket.emit('requestAdd', {
				content: newElement,
				listName,
				username: currentUser.username,
			});
		}
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
					{(currentUser?.role === 'admin' || currentUser?.role === 'owner') && (
						<Link
							to={`/admin/${listName}/${username}`}
							className="admin-link"
						>
							<RiAdminFill /> Admin
						</Link>
					)}
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
											currentUser?.role === 'admin' ||
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
						{list?.length === 0 && (
							<div key="empty">Aucun élément dans la liste</div>
						)}
						{listRequest.length > 0 &&
							listRequest.map((request, index) =>
								request.byName === currentUser?.username ? (
									<div key={index} className="point request">
										<p>
											{'>>'} {request.content}
											<i> par {request.byName} </i>
											(en attente de validation)
										</p>
									</div>
								) : null
							)}
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
