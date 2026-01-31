import { useState, useEffect } from 'react';
import type { User, Role, UserGroup } from '../../types';

interface UserFormProps {
    initialData?: User | null;
    onSubmit: (data: User) => void;
    onCancel: () => void;
    groups: UserGroup[];
}

export const UserForm = ({ initialData, onSubmit, onCancel, groups }: UserFormProps) => {
    const [formData, setFormData] = useState<User>({
        id: '',
        name: '',
        email: '',
        username: '',
        status: 'active',
        groupId: groups[0]?.id || '',
        department: '',
        location: ''
    });

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        }
    }, [initialData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const data = { ...formData, id: formData.id || crypto.randomUUID() };
        onSubmit(data);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="mb-3">
                <label className="form-label">Full Name</label>
                <input type="text" name="name" className="form-control" value={formData.name} onChange={handleChange} required />
            </div>
            <div className="row">
                <div className="col-md-6 mb-3">
                    <label className="form-label">Username</label>
                    <input type="text" name="username" className="form-control" value={formData.username} onChange={handleChange} required />
                </div>
                <div className="col-md-6 mb-3">
                    <label className="form-label">Email</label>
                    <input type="email" name="email" className="form-control" value={formData.email} onChange={handleChange} required />
                </div>
            </div>
            <div className="mb-3">
                <label className="form-label">User Group (Determines Role & Permissions)</label>
                <select name="groupId" className="form-select" value={formData.groupId} onChange={handleChange} required>
                    {groups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                </select>
                <div className="form-text text-secondary mt-1 small">
                    User will inherit permissions based on the selected group.
                </div>
            </div>
            <div className="row">
                <div className="col-md-6 mb-3">
                    <label className="form-label">Department</label>
                    <input type="text" name="department" className="form-control" value={formData.department} onChange={handleChange} />
                </div>
                <div className="col-md-6 mb-3">
                    <label className="form-label">Location</label>
                    <input type="text" name="location" className="form-control" value={formData.location} onChange={handleChange} />
                </div>
            </div>
            <div className="mb-3">
                <label className="form-label">Status</label>
                <div className="form-check form-switch">
                    <input
                        className="form-check-input"
                        type="checkbox"
                        id="userStatus"
                        checked={formData.status === 'active'}
                        onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.checked ? 'active' : 'inactive' }))}
                    />
                    <label className="form-check-label" htmlFor="userStatus">
                        {formData.status === 'active' ? 'Active' : 'Inactive'}
                    </label>
                </div>
            </div>
            <div className="d-flex justify-content-end gap-2 mt-4">
                <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>
                <button type="submit" className="btn btn-primary">{initialData ? 'Update User' : 'Create User'}</button>
            </div>
        </form>
    );
};
