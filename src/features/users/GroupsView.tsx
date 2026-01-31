import { useState } from 'react';
import { useAppContext } from '../../providers/AppContext';
import { Button } from '../../components/shared/Button';
import { Modal } from '../../components/shared/Modal';
import type { UserGroup, Role } from '../../types';

export const GroupsView = () => {
    const { state, dispatch } = useAppContext();
    const { groups, roles } = state;

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingGroup, setEditingGroup] = useState<UserGroup | null>(null);
    const [formData, setFormData] = useState<UserGroup>({
        id: '',
        name: '',
        description: '',
        roleId: roles[0]?.id || ''
    });

    const openModal = (group: UserGroup | null) => {
        if (group) {
            setEditingGroup(group);
            setFormData(group);
        } else {
            setEditingGroup(null);
            setFormData({
                id: '',
                name: '',
                description: '',
                roleId: roles[0]?.id || ''
            });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingGroup) {
            dispatch({ type: 'UPDATE_GROUP', payload: formData });
        } else {
            dispatch({ type: 'ADD_GROUP', payload: { ...formData, id: crypto.randomUUID() } });
        }
        setIsModalOpen(false);
    };

    const handleDelete = (id: string) => {
        if (confirm('Are you sure you want to delete this group?')) {
            dispatch({ type: 'DELETE_GROUP', payload: id });
        }
    };

    return (
        <div className="groups-container">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="mb-0">User Groups</h4>
                <Button onClick={() => openModal(null)} variant="primary">+ Create New Group</Button>
            </div>

            <div className="card bg-dark border-secondary">
                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table table-dark table-hover mb-0">
                            <thead>
                                <tr>
                                    <th>Group Name</th>
                                    <th>Description</th>
                                    <th>Assigned Role</th>
                                    <th className="text-end">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {groups.map((group) => (
                                    <tr key={group.id}>
                                        <td className="fw-bold">{group.name}</td>
                                        <td>{group.description || <span className="text-secondary small">No description</span>}</td>
                                        <td>
                                            <span className="badge bg-info text-dark">
                                                {roles.find(r => r.id === group.roleId)?.name || 'No Role'}
                                            </span>
                                        </td>
                                        <td className="text-end">
                                            <div className="d-flex justify-content-end gap-1">
                                                <Button variant="secondary" size="sm" onClick={() => openModal(group)}>Edit</Button>
                                                <Button variant="danger" size="sm" onClick={() => handleDelete(group.id)}>×</Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingGroup ? 'Edit Group' : 'Create New Group'}>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Group Name</label>
                        <input
                            type="text"
                            className="form-control"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Description</label>
                        <textarea
                            className="form-control"
                            rows={2}
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Assigned Role</label>
                        <select
                            className="form-select"
                            value={formData.roleId}
                            onChange={(e) => setFormData({ ...formData, roleId: e.target.value })}
                            required
                        >
                            {roles.map(role => (
                                <option key={role.id} value={role.id}>{role.name}</option>
                            ))}
                        </select>
                        <div className="form-text text-secondary mt-2">
                            All members of this group will inherit the privileges of the selected role.
                        </div>
                    </div>
                    <div className="d-flex justify-content-end gap-2 mt-4">
                        <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                        <Button type="submit" variant="primary">{editingGroup ? 'Update Group' : 'Create Group'}</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};
