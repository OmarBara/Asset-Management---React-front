import { useState } from 'react';
import { useAppContext } from '../../providers/AppContext';
import { Button } from '../../components/shared/Button';
import { UserForm } from './UserForm';
import { Modal } from '../../components/shared/Modal';
import type { User } from '../../types';

export const UserView = () => {
    const { state, dispatch } = useAppContext();
    const { users, roles, groups } = state;

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);

    const handleAddUser = (data: User) => {
        dispatch({ type: 'ADD_USER', payload: data });
        setIsModalOpen(false);
    };

    const handleUpdateUser = (data: User) => {
        dispatch({ type: 'UPDATE_USER', payload: data });
        setIsModalOpen(false);
        setEditingUser(null);
    };

    const handleDeleteUser = (id: string) => {
        if (confirm('Are you sure you want to delete this user?')) {
            dispatch({ type: 'DELETE_USER', payload: id });
        }
    };

    const openEditModal = (user: User) => {
        setEditingUser(user);
        setIsModalOpen(true);
    };

    return (
        <div className="users-container">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="mb-0">Users</h4>
                <Button onClick={() => { setEditingUser(null); setIsModalOpen(true); }} variant="primary">
                    + Add New User
                </Button>
            </div>

            <div className="card bg-dark border-secondary">
                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table table-dark table-hover mb-0">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Username</th>
                                    <th>Email</th>
                                    <th>Group</th>
                                    <th>Inherited Role</th>
                                    <th>Status</th>
                                    <th className="text-end">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user) => {
                                    const group = groups.find(g => g.id === user.groupId);
                                    const role = roles.find(r => r.id === group?.roleId);

                                    return (
                                        <tr key={user.id}>
                                            <td>
                                                <div className="d-flex align-items-center">
                                                    <div className="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center me-2" style={{ width: 32, height: 32 }}>
                                                        {user.name.charAt(0)}
                                                    </div>
                                                    {user.name}
                                                </div>
                                            </td>
                                            <td>{user.username}</td>
                                            <td>{user.email}</td>
                                            <td>{group?.name || 'N/A'}</td>
                                            <td>
                                                <span className="badge bg-info text-dark">
                                                    {role?.name || 'No Role'}
                                                </span>
                                            </td>
                                            <td>
                                                <span className={`badge bg-${user.status === 'active' ? 'success' : 'danger'}`}>
                                                    {user.status}
                                                </span>
                                            </td>
                                            <td className="text-end">
                                                <div className="d-flex justify-content-end gap-1">
                                                    <Button variant="secondary" size="sm" onClick={() => openEditModal(user)}>Edit</Button>
                                                    <Button variant="danger" size="sm" onClick={() => handleDeleteUser(user.id)}>×</Button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingUser ? 'Edit User' : 'Add New User'}>
                <UserForm
                    initialData={editingUser}
                    onSubmit={editingUser ? handleUpdateUser : handleAddUser}
                    onCancel={() => setIsModalOpen(false)}
                    groups={groups}
                />
            </Modal>
        </div>
    );
};
