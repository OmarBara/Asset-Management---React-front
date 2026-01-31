import { useState } from 'react';
import { useAppContext } from '../../providers/AppContext';
import { Button } from '../../components/shared/Button';
import type { Role, Privilege } from '../../types';

export const RolesView = () => {
    const { state, dispatch } = useAppContext();
    const { roles, privileges } = state;

    const [editingRole, setEditingRole] = useState<Role | null>(null);

    const togglePrivilege = (roleId: string, privilegeId: string) => {
        const role = roles.find(r => r.id === roleId);
        if (!role) return;

        const newPrivileges = role.privileges.includes(privilegeId)
            ? role.privileges.filter(p => p !== privilegeId)
            : [...role.privileges, privilegeId];

        dispatch({ type: 'UPDATE_ROLE', payload: { ...role, privileges: newPrivileges } });
    };

    const handleAddRole = () => {
        const name = prompt('Enter role name:');
        if (name) {
            dispatch({ type: 'ADD_ROLE', payload: { id: crypto.randomUUID(), name, privileges: [] } });
        }
    };

    return (
        <div className="roles-container">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="mb-0">Roles & Permissions</h4>
                <Button onClick={handleAddRole} variant="primary">+ Create New Role</Button>
            </div>

            <div className="row g-4">
                {roles.map((role) => (
                    <div key={role.id} className="col-md-6 col-lg-4">
                        <div className="card bg-dark border-secondary h-100">
                            <div className="card-header border-secondary d-flex justify-content-between align-items-center">
                                <h5 className="mb-0 fw-bold">{role.name}</h5>
                                <Button variant="outline-danger" size="sm" onClick={() => dispatch({ type: 'DELETE_ROLE', payload: role.id })}>×</Button>
                            </div>
                            <div className="card-body">
                                <h6 className="small text-secondary fw-bold mb-3">PRIVILEGES</h6>
                                <div className="privilege-list overflow-auto" style={{ maxHeight: '300px' }}>
                                    {privileges.map((p) => (
                                        <div key={p.id} className="form-check form-switch mb-2">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                id={`priv-${role.id}-${p.id}`}
                                                checked={role.privileges.includes(p.id)}
                                                onChange={() => togglePrivilege(role.id, p.id)}
                                            />
                                            <label className="form-check-label small" htmlFor={`priv-${role.id}-${p.id}`}>
                                                <span className="fw-medium">{p.name}</span>
                                                <br />
                                                <span className="text-secondary smaller">{p.description}</span>
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
