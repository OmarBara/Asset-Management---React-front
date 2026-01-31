import { useState, useEffect } from 'react';
import type { HardwareComponent } from '../../types';

interface ComponentFormProps {
    initialData?: HardwareComponent | null;
    onSubmit: (data: Omit<HardwareComponent, 'id'>) => void;
    onCancel: () => void;
    locations: string[];
}

export const ComponentForm = ({ initialData, onSubmit, onCancel, locations }: ComponentFormProps) => {
    const [formData, setFormData] = useState<Omit<HardwareComponent, 'id'>>({
        name: '',
        serial: '',
        category: 'RAM',
        modelNumber: '',
        location: locations[0] || '',
        orderNumber: '',
        purchaseDate: new Date().toISOString().split('T')[0],
        minQty: 2,
        totalQty: 10,
        remainingQty: 10,
        unitCost: 0,
        notes: ''
    });

    useEffect(() => {
        if (initialData) {
            const { id, history, ...rest } = initialData;
            setFormData(rest);
        }
    }, [initialData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: ['minQty', 'totalQty', 'remainingQty', 'unitCost'].includes(name) ? Number(value) : value,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="mb-3">
                <label htmlFor="name" className="form-label">Component Name</label>
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
                    <label htmlFor="serial" className="form-label">Serial Number</label>
                    <input
                        type="text"
                        id="serial"
                        name="serial"
                        className="form-control"
                        value={formData.serial}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="col-md-6 mb-3">
                    <label htmlFor="category" className="form-label">Category</label>
                    <select
                        id="category"
                        name="category"
                        className="form-select"
                        value={formData.category}
                        onChange={handleChange}
                        required
                    >
                        <option value="RAM">RAM</option>
                        <option value="HDD/SSD">HDD/SSD</option>
                        <option value="Motherboard">Motherboard</option>
                        <option value="CPU">CPU</option>
                        <option value="GPU">GPU</option>
                        <option value="Power Supply">Power Supply</option>
                        <option value="Others">Others</option>
                    </select>
                </div>
            </div>

            <div className="row">
                <div className="col-md-6 mb-3">
                    <label htmlFor="modelNumber" className="form-label">Model Number</label>
                    <input
                        type="text"
                        id="modelNumber"
                        name="modelNumber"
                        className="form-control"
                        value={formData.modelNumber}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="col-md-6 mb-3">
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
            </div>

            <div className="row">
                <div className="col-md-6 mb-3">
                    <label htmlFor="orderNumber" className="form-label">Order Number</label>
                    <input
                        type="text"
                        id="orderNumber"
                        name="orderNumber"
                        className="form-control"
                        value={formData.orderNumber}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="col-md-6 mb-3">
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

            <div className="row">
                <div className="col-md-4 mb-3">
                    <label htmlFor="totalQty" className="form-label">Total Quantity</label>
                    <input
                        type="number"
                        id="totalQty"
                        name="totalQty"
                        className="form-control"
                        value={formData.totalQty}
                        onChange={handleChange}
                        min="0"
                        required
                    />
                </div>
                <div className="col-md-4 mb-3">
                    <label htmlFor="remainingQty" className="form-label">Remaining QTY</label>
                    <input
                        type="number"
                        id="remainingQty"
                        name="remainingQty"
                        className="form-control"
                        value={formData.remainingQty}
                        onChange={handleChange}
                        min="0"
                        max={formData.totalQty}
                        required
                    />
                </div>
                <div className="col-md-4 mb-3">
                    <label htmlFor="minQty" className="form-label">Min. QTY</label>
                    <input
                        type="number"
                        id="minQty"
                        name="minQty"
                        className="form-control"
                        value={formData.minQty}
                        onChange={handleChange}
                        min="0"
                        required
                    />
                </div>
            </div>

            <div className="mb-3">
                <label htmlFor="unitCost" className="form-label">Unit Cost</label>
                <div className="input-group">
                    <span className="input-group-text">$</span>
                    <input
                        type="number"
                        id="unitCost"
                        name="unitCost"
                        className="form-control"
                        value={formData.unitCost}
                        onChange={handleChange}
                        min="0"
                        step="0.01"
                        required
                    />
                </div>
            </div>

            <div className="mb-3">
                <label htmlFor="notes" className="form-label">Notes</label>
                <textarea
                    id="notes"
                    name="notes"
                    className="form-control"
                    rows={2}
                    value={formData.notes || ''}
                    onChange={handleChange}
                ></textarea>
            </div>

            <div className="d-flex justify-content-end gap-2 mt-4">
                <button type="button" className="btn btn-secondary" onClick={onCancel}>
                    Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                    {initialData ? 'Update Component' : 'Add Component'}
                </button>
            </div>
        </form>
    );
};
