import { useState, useEffect } from 'react';
import type { Accessory } from '../../types';

interface AccessoryFormProps {
    initialData?: Accessory | null;
    onSubmit: (data: Omit<Accessory, 'id'>) => void;
    onCancel: () => void;
    locations: string[];
}

export const AccessoryForm = ({ initialData, onSubmit, onCancel, locations }: AccessoryFormProps) => {
    const [formData, setFormData] = useState<Omit<Accessory, 'id'>>({
        name: '',
        image: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&q=80&w=200',
        category: 'Keyboards',
        modelNumber: '',
        location: locations[0] || '',
        minQty: 2,
        totalQty: 10,
        checkedOutQty: 0,
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
            [name]: ['minQty', 'totalQty', 'unitCost'].includes(name) ? Number(value) : value,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="mb-3">
                <label htmlFor="name" className="form-label">Accessory Name</label>
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
                    <label htmlFor="category" className="form-label">Category</label>
                    <select
                        id="category"
                        name="category"
                        className="form-select"
                        value={formData.category}
                        onChange={handleChange}
                        required
                    >
                        <option value="Keyboards">Keyboards</option>
                        <option value="Mouse">Mouse</option>
                        <option value="Cables">Cables</option>
                        <option value="Adapters">Adapters</option>
                        <option value="Monitors">Monitors</option>
                        <option value="Others">Others</option>
                    </select>
                </div>
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
                    <label htmlFor="minQty" className="form-label">Min. QTY (Alert)</label>
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
                <div className="col-md-4 mb-3">
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
                />
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
                    {initialData ? 'Update Accessory' : 'Add Accessory'}
                </button>
            </div>
        </form>
    );
};
