import React, { useEffect, useState } from 'react';
import { IoMdTrash, IoMdCheckmark, IoMdCloseCircle } from 'react-icons/io';
import { ref, get, set, remove } from 'firebase/database';
import { database } from '../../firebaseConfig';
import './UserManager.css';
import Table from 'react-bootstrap/Table';

interface User {
    uid: string;
    email: string;
    address?: string;
    admin: boolean;
}

const UserManager: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        const fetchUsers = async () => {
            const usersRef = ref(database, 'users');
            const snapshot = await get(usersRef);

            if (snapshot.exists()) {
                const data = snapshot.val();
                const userList = Object.keys(data).map(key => ({
                    ...data[key],
                    uid: key
                }));
                setUsers(userList as User[]);
            }
        };

        fetchUsers();
    }, []);

    const handleToggleAdmin = async (uid: string, currentStatus: boolean) => {
        const userRef = ref(database, `users/${uid}`);
        const newStatus = !currentStatus;
        await set(userRef, { ...users.find(user => user.uid === uid), admin: newStatus });

        setUsers(users.map(user => (user.uid === uid ? { ...user, admin: newStatus } : user)));
    };

    const handleDeleteUser = async (uid: string) => {
        const userRef = ref(database, `users/${uid}`);
        await remove(userRef);

        setUsers(users.filter(user => user.uid !== uid));
    };

    return (
        <div className='app__users'>
            <div className='app__users-title'>
                <h2>Danh sách Tài khoản</h2>
            </div>
            <div className='app__users-table'>
                <Table striped bordered hover variant="dark">
                    <thead>
                        <tr>
                            <th>Email</th>
                            <th>Địa Chỉ</th>
                            <th>Quản Lý</th>
                            <th>Xóa</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.uid}>
                                <td>{user.email}</td>
                                <td>{user.address || 'N/A'}</td>
                                <td onClick={() => handleToggleAdmin(user.uid, user.admin)} style={{ cursor: 'pointer' }}>
                                    {user.admin ? <IoMdCheckmark /> : <IoMdCloseCircle />}
                                </td>
                                <td onClick={() => handleDeleteUser(user.uid)} style={{ cursor: 'pointer' }}>
                                    <IoMdTrash />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>
        </div>
    );
};

export default UserManager;
