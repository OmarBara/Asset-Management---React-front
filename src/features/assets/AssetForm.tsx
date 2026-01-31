import { useState, useEffect } from 'react';
import type { Asset, MasterLicense, LicenseSeat } from '../../types';
import { QRCodeTag } from '../../components/shared/QRCodeTag';

interface AssetFormProps {
    initialData?: Asset | null;
    onSubmit: (data: Omit<Asset, 'id'>, licenseAssignments: string[]) => void;
    onCancel: () => void;
    departments: string[];
    locations: string[];
    types: string[];
    masterLicenses: MasterLicense[];
    licenseSeats: LicenseSeat[];
}

export const AssetForm = ({
    initialData,
    onSubmit,
    onCancel,
    departments,
    locations,
    types,
    masterLicenses,
    licenseSeats
}: AssetFormProps) => {
    const [formData, setFormData] = useState<Omit<Asset, 'id'>>({
        name: '',
        image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=200',
        assetTag: '',
        serialNumber: '',
        model: '',
        type: types[0] || 'Laptop',
        status: 'active',
        location: locations[0] || '',
        purchaseCost: 0,
        currentValue: 0,
        assignee: '',
        department: departments[0] || 'Engineering',
        purchaseDate: new Date().toISOString().split('T')[0],
        assignedLicenses: []
    });

    const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
    const [showSuccess, setShowSuccess] = useState(false);
    const [createdAsset, setCreatedAsset] = useState<Asset | null>(null);

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
            setSelectedSeats(initialData.assignedLicenses || []);
        }
    }, [initialData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'purchaseCost' || name === 'currentValue' ? Number(value) : value,
        }));
    };

    const addAssignmentField = () => {
        setSelectedSeats([...selectedSeats, '']);
    };

    const removeAssignmentField = (index: number) => {
        setSelectedSeats(selectedSeats.filter((_, i) => i !== index));
    };

    const handleSeatSelect = (index: number, seatId: string) => {
        const newSeats = [...selectedSeats];
        newSeats[index] = seatId;
        setSelectedSeats(newSeats);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const data = { ...formData, assignedLicenses: selectedSeats.filter(s => s !== '') };

        if (!initialData) {
            // New asset creation
            const newId = crypto.randomUUID();
            const assetWithId: Asset = { ...data, id: newId };
            setCreatedAsset(assetWithId);
            setShowSuccess(true);
            onSubmit(data, selectedSeats.filter(s => s !== ''));
        } else {
            onSubmit(data, selectedSeats.filter(s => s !== ''));
        }
    };

    const handlePrint = () => {
        window.print();
    };

    if (showSuccess && createdAsset) {
        return (
            <div className="text-center py-4">
                <div className="mb-4">
                    <div className="display-4 text-success mb-2">🎉</div>
                    <h4>Asset Created Successfully!</h4>
                    <p className="text-muted">You can now print the QR code asset tag below.</p>
                </div>

                <div className="d-flex justify-content-center mb-4">
                    <QRCodeTag asset={createdAsset} />
                </div>

                <div className="alert alert-info small mx-auto" style={{ maxWidth: '400px' }}>
                    <strong>Note:</strong> Printing will format the tag as a 2x1 inch label.
                </div>

                <div className="d-flex justify-content-center gap-2 mt-4">
                    <button type="button" className="btn btn-outline-secondary" onClick={onCancel}>
                        Close
                    </button>
                    <button type="button" className="btn btn-primary" onClick={handlePrint}>
                        🖨️ Print Label
                    </button>
                    <button type="button" className="btn btn-success" onClick={onCancel}>
                        Finish
                    </button>
                </div>
            </div>
        );
    }

    // Helper to get available seats for dropdown
    const availableSeats = licenseSeats.filter(s => s.status === 'available' || selectedSeats.includes(s.id));

    return (
        <form onSubmit={handleSubmit}>
            <div className="mb-3">
                <label htmlFor="name" className="form-label">Asset Name</label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    className="form-control"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className="row">
                <div className="col-md-6 mb-3">
                    <label htmlFor="assetTag" className="form-label">Asset Tag</label>
                    <input
                        type="text"
                        id="assetTag"
                        name="assetTag"
                        className="form-control"
                        value={formData.assetTag}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="col-md-6 mb-3">
                    <label htmlFor="serialNumber" className="form-label">Serial Number</label>
                    <input
                        type="text"
                        id="serialNumber"
                        name="serialNumber"
                        className="form-control"
                        value={formData.serialNumber}
                        onChange={handleChange}
                        required
                    />
                </div>
            </div>

            <div className="row">
                <div className="col-md-6 mb-3">
                    <label htmlFor="type" className="form-label">Type</label>
                    <select
                        id="type"
                        name="type"
                        className="form-select"
                        value={formData.type}
                        onChange={handleChange}
                        required
                    >
                        {types.map(t => (
                            <option key={t} value={t}>{t}</option>
                        ))}
                    </select>
                </div>
                <div className="col-md-6 mb-3">
                    <label htmlFor="model" className="form-label">Model</label>
                    <input
                        type="text"
                        id="model"
                        name="model"
                        className="form-control"
                        value={formData.model}
                        onChange={handleChange}
                        required
                    />
                </div>
            </div>

            <div className="row">
                <div className="col-md-6 mb-3">
                    <label htmlFor="status" className="form-label">Status</label>
                    <select
                        id="status"
                        name="status"
                        className="form-select"
                        value={formData.status}
                        onChange={handleChange}
                    >
                        <option value="active">Active</option>
                        <option value="maintenance">Maintenance</option>
                        <option value="retired">Retired</option>
                    </select>
                </div>
                <div className="col-md-6 mb-3">
                    <label htmlFor="department" className="form-label">Department</label>
                    <select
                        id="department"
                        name="department"
                        className="form-select"
                        value={formData.department}
                        onChange={handleChange}
                        required
                    >
                        {departments.map(dept => (
                            <option key={dept} value={dept}>{dept}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="mb-3">
                <label htmlFor="location" className="form-label">Location</label>
                <select
                    id="location"
                    name="location"
                    className="form-select"
                    value={formData.location}
                    onChange={handleChange}
                    required
                >
                    {locations.map(loc => (
                        <option key={loc} value={loc}>{loc}</option>
                    ))}
                </select>
            </div>

            <div className="mb-3">
                <label htmlFor="assignee" className="form-label">Assignee</label>
                <input
                    type="text"
                    id="assignee"
                    name="assignee"
                    className="form-control"
                    value={formData.assignee}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className="mt-4 mb-3 border-top pt-3">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h6 className="mb-0">License Assignments</h6>
                    <button type="button" className="btn btn-sm btn-outline-info" onClick={addAssignmentField}>
                        + Assign License
                    </button>
                </div>
                <div className="assignment-list bg-dark p-3 rounded border border-secondary shadow-inner">
                    {selectedSeats.length === 0 && <p className="text-center text-muted m-0 small py-2">No licenses assigned yet.</p>}
                    {selectedSeats.map((selectedId, index) => (
                        <div key={index} className="d-flex gap-2 mb-2">
                            <select
                                className="form-select form-select-sm bg-dark text-white border-secondary"
                                value={selectedId}
                                onChange={(e) => handleSeatSelect(index, e.target.value)}
                                required
                            >
                                <option value="">-- Select License Seat --</option>
                                {masterLicenses.map(ml => (
                                    <optgroup key={ml.id} label={ml.name}>
                                        {availableSeats
                                            .filter(s => s.masterLicenseId === ml.id)
                                            .map(s => (
                                                <option key={s.id} value={s.id} disabled={s.status === 'assigned' && !selectedSeats.includes(s.id)}>
                                                    {s.seatNumber} {s.status === 'assigned' ? '(Assigned)' : '(Available)'}
                                                </option>
                                            ))
                                        }
                                    </optgroup>
                                ))}
                            </select>
                            <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => removeAssignmentField(index)}>×</button>
                        </div>
                    ))}
                </div>
            </div>

            <div className="row mt-4">
                <div className="col-md-4 mb-3">
                    <label htmlFor="purchaseCost" className="form-label">Purchase Cost</label>
                    <div className="input-group">
                        <span className="input-group-text">$</span>
                        <input
                            type="number"
                            id="purchaseCost"
                            name="purchaseCost"
                            className="form-control"
                            value={formData.purchaseCost}
                            onChange={handleChange}
                            min="0"
                            required
                        />
                    </div>
                </div>
                <div className="col-md-4 mb-3">
                    <label htmlFor="currentValue" className="form-label">Current Value</label>
                    <div className="input-group">
                        <span className="input-group-text">$</span>
                        <input
                            type="number"
                            id="currentValue"
                            name="currentValue"
                            className="form-control"
                            value={formData.currentValue}
                            onChange={handleChange}
                            min="0"
                            required
                        />
                    </div>
                </div>
                <div className="col-md-4 mb-3">
                    <label htmlFor="purchaseDate" className="form-label">Purchase Date</label>
                    <input
                        type="date"
                        id="purchaseDate"
                        name="purchaseDate"
                        className="form-control"
                        value={formData.purchaseDate}
                        onChange={handleChange}
                        required
                    />
                </div>
            </div>

            <div className="mb-3">
                <label htmlFor="image" className="form-label">Image URL</label>
                <input
                    type="url"
                    id="image"
                    name="image"
                    className="form-control"
                    value={formData.image}
                    onChange={handleChange}
                    placeholder="https://example.com/image.jpg"
                />
            </div>

            <div className="d-flex justify-content-end gap-2 mt-4">
                <button type="button" className="btn btn-secondary" onClick={onCancel}>
                    Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                    {initialData ? 'Update Asset' : 'Add Asset'}
                </button>
            </div>
        </form>
    );
};
