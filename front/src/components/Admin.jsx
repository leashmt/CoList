import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useNavigate, useParams } from 'react-router-dom';

const socket = io('http://localhost:3001');
const Admin = () => {
	const navigate = useNavigate();
	const { listName, username } = useParams();
	const [currentUser, setCurrentUser] = useState(null);

	useEffect(() => {
		socket.emit('getListData', listName, response => {
			if (response.success) {
				// setUsers(response.users);
				// setList(response.content);
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

		return () => {
			socket.off('getListData');
		};
	}, []);
	return <div>Admin</div>;
};

export default Admin;
