import { useState, useEffect } from 'react';
import type { MasterLicense, LicenseSeat } from '../../types';

interface LicenseFormProps {
    initialData?: MasterLicense | null;
    onSubmit: (data: Omit<MasterLicense, 'id'>, initialSeats: Omit<LicenseSeat, 'id' | 'masterLicenseId'>[]) => void;
    onCancel: () => void;
}

export const LicenseForm = ({ initialData, onSubmit, onCancel }: LicenseFormProps) => {
    const [formData, setFormData] = useState<Omit<MasterLicense, 'id'>>({
        name: '',
        key: '',
        category: 'Software',
        manufacturer: '',
        totalSeats: 1,
        expirationDate: new Date().toISOString().split('T')[0],
        status: 'active',
        notes: '',
    });

    const [seats, setSeats] = useState<Omit<LicenseSeat, 'id' | 'masterLicenseId'>[]>([]);

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name,
                key: initialData.key,
                category: initialData.category,
                manufacturer: initialData.manufacturer,
                totalSeats: initialData.totalSeats,
                expirationDate: initialData.expirationDate,
                status: initialData.status,
                notes: initialData.notes || '',
            });
        } else {
            // Default to 1 empty seat for new licenses
            setSeats([{ seatNumber: 'Seat 001', status: 'available', assignedToType: 'unassigned' }]);
        }
    }, [initialData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'totalSeats' ? Number(value) : value,
        }));
    };

    const addSeat = () => {
        const nextNumber = (seats.length + 1).toString().padStart(3, '0');
        setSeats([...seats, { seatNumber: `Seat ${nextNumber}`, status: 'available', assignedToType: 'unassigned' }]);
        setFormData(prev => ({ ...prev, totalSeats: prev.totalSeats + 1 }));
    };

    const removeSeat = (index: number) => {
        setSeats(seats.filter((_, i) => i !== index));
        setFormData(prev => ({ ...prev, totalSeats: Math.max(0, prev.totalSeats - 1) }));
    };

    const handleSeatChange = (index: number, updates: Partial<Omit<LicenseSeat, 'id' | 'masterLicenseId'>>) => {
        setSeats(prev => prev.map((s, i) => i === index ? { ...s, ...updates } : s));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData, seats);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="mb-3">
                <label htmlFor="name" className="form-label">License Name</label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    className="form-control"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="e.g. Adobe Creative Cloud"
                />
            </div>

            <div className="row">
                <div className="col-md-6 mb-3">
                    <label htmlFor="key" className="form-label">Product Key / License Key</label>
                    <input
                        type="text"
                        id="key"
                        name="key"
                        className="form-control"
                        value={formData.key}
                        onChange={handleChange}
                        required
                        placeholder="XXXX-XXXX-XXXX-XXXX"
                    />
                </div>
                <div className="col-md-6 mb-3">
                    <label htmlFor="manufacturer" className="form-label">Manufacturer</label>
                    <input
                        type="text"
                        id="manufacturer"
                        name="manufacturer"
                        className="form-control"
                        value={formData.manufacturer}
                        onChange={handleChange}
                        required
                        placeholder="e.g. Adobe"
                    />
                </div>
            </div>

            <div className="row">
                <div className="col-md-6 mb-3">
                    <label htmlFor="category" className="form-label">Category</label>
                    <input
                        type="text"
                        id="category"
                        name="category"
                        className="form-control"
                        value={formData.category}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="col-md-6 mb-3">
                    <label htmlFor="expirationDate" className="form-label">Expiration Date</label>
                    <input
                        type="date"
                        id="expirationDate"
                        name="expirationDate"
                        className="form-control"
                        value={formData.expirationDate}
                        onChange={handleChange}
                        required
                    />
                </div>
            </div>

            <div className="mt-4 mb-3 border-top pt-3">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h6 className="mb-0">License Seats (Assignments)</h6>
                    {!initialData && (
                        <button type="button" className="btn btn-sm btn-outline-info" onClick={addSeat}>
                            + Add Seat
                        </button>
                    )}
                </div>

                {initialData ? (
                    <p className="text-muted small">Expand the license row in the table to manage seats for existing records.</p>
                ) : (
                    <div className="seat-list bg-dark p-3 rounded border border-secondary shadow-inner" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                        {seats.length === 0 && <p className="text-center text-muted py-2 m-0">No seats added yet.</p>}
                        {seats.map((seat, index) => (
                            <div key={index} className="row g-2 align-items-center mb-2 pb-2 border-bottom border-secondary-subtle last-child-border-0">
                                <div className="col-3">
                                    <input
                                        type="text"
                                        className="form-control form-control-sm bg-dark text-white border-secondary"
                                        value={seat.seatNumber}
                                        onChange={(e) => handleSeatChange(index, { seatNumber: e.target.value })}
                                        placeholder="Seat Name"
                                    />
                                </div>
                                <div className="col-4">
                                    <select
                                        className="form-select form-select-sm bg-dark text-white border-secondary"
                                        value={seat.assignedToType}
                                        onChange={(e) => handleSeatChange(index, { assignedToType: e.target.value as any, assignedToId: '' })}
                                    >
                                        <option value="unassigned">Unassigned</option>
                                        <option value="person">User</option>
                                    </select>
                                </div>
                                <div className="col-4">
                                    <input
                                        type="text"
                                        className="form-control form-control-sm bg-dark text-white border-secondary"
                                        placeholder="Assignee Name"
                                        value={seat.assignedToId || ''}
                                        onChange={(e) => handleSeatChange(index, { assignedToId: e.target.value, status: e.target.value ? 'assigned' : 'available' })}
                                        disabled={seat.assignedToType === 'unassigned'}
                                    />
                                </div>
                                <div className="col-1 text-end">
                                    <button type="button" className="btn btn-sm btn-link text-danger p-0" onClick={() => removeSeat(index)}>×</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                {!initialData && <small className="text-muted">Total: {formData.totalSeats} seats</small>}
            </div>

            <div className="mb-3">
                <label htmlFor="notes" className="form-label">Notes</label>
                <textarea
                    id="notes"
                    name="notes"
                    className="form-control"
                    rows={2}
                    value={formData.notes}
                    onChange={handleChange}
                ></textarea>
            </div>

            <div className="d-flex justify-content-end gap-2 mt-4">
                <button type="button" className="btn btn-secondary" onClick={onCancel}>
                    Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                    {initialData ? 'Update Master Record' : 'Create & Assign Seats'}
                </button>
            </div>
        </form>
    );
};
