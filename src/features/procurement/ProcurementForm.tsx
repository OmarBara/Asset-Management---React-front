import { useState, useEffect } from 'react';
import type { ProcurementBatch, PurchaseOrder, DeliveryNote, WardMinutes } from '../../types';

interface ProcurementFormProps {
    initialData?: ProcurementBatch | null;
    onSubmit: (data: Omit<ProcurementBatch, 'id'>) => void;
    onCancel: () => void;
}

export const ProcurementForm = ({ initialData, onSubmit, onCancel }: ProcurementFormProps) => {
    const [formData, setFormData] = useState<Omit<ProcurementBatch, 'id'>>({
        name: '',
        orderedQty: 0,
        receivedQty: 0,
        itemType: 'asset',
        status: 'pending',
        notes: ''
    });

    const [po, setPo] = useState<PurchaseOrder | null>(null);
    const [dn, setDn] = useState<DeliveryNote | null>(null);
    const [minutes, setMinutes] = useState<WardMinutes | null>(null);

    const [activeSection, setActiveSection] = useState<'details' | 'po' | 'dn' | 'minutes'>('details');

    useEffect(() => {
        if (initialData) {
            const { id, po, dn, minutes, ...rest } = initialData;
            setFormData(rest);
            setPo(po || null);
            setDn(dn || null);
            setMinutes(minutes || null);
        }
    }, [initialData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: ['orderedQty', 'receivedQty'].includes(name) ? Number(value) : value,
        }));
    };

    const handlePoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPo(prev => ({
            ...(prev || { poNumber: '', vendor: '', totalCost: 0, date: '' }),
            [name]: name === 'totalCost' ? Number(value) : value
        } as PurchaseOrder));
    };

    const handleDnChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setDn(prev => ({
            ...(prev || { waybillNumber: '', receivedDate: '', condition: 'good' }),
            [name]: value
        } as DeliveryNote));
    };

    const handleMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target as HTMLInputElement;
        setMinutes(prev => ({
            ...(prev || { meetingRefNo: '', meetingDate: '', committeeSignOff: false }),
            [name]: type === 'checkbox' ? checked : value
        } as WardMinutes));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({
            ...formData,
            po: po || undefined,
            dn: dn || undefined,
            minutes: minutes || undefined
        });
    };

    return (
        <form onSubmit={handleSubmit}>
            <ul className="nav nav-tabs mb-4">
                <li className="nav-item">
                    <button type="button" className={`nav-link ${activeSection === 'details' ? 'active' : ''}`} onClick={() => setActiveSection('details')}>Basic Details</button>
                </li>
                <li className="nav-item">
                    <button type="button" className={`nav-link ${activeSection === 'po' ? 'active' : ''}`} onClick={() => setActiveSection('po')}>Purchase Order (PO)</button>
                </li>
                <li className="nav-item">
                    <button type="button" className={`nav-link ${activeSection === 'dn' ? 'active' : ''}`} onClick={() => setActiveSection('dn')}>Delivery Note (DN)</button>
                </li>
                <li className="nav-item">
                    <button type="button" className={`nav-link ${activeSection === 'minutes' ? 'active' : ''}`} onClick={() => setActiveSection('minutes')}>Ward Minutes</button>
                </li>
            </ul>

            {activeSection === 'details' && (
                <div className="animate__animated animate__fadeIn">
                    <div className="mb-3">
                        <label className="form-label">Batch Name</label>
                        <input type="text" name="name" className="form-control" value={formData.name} onChange={handleChange} required placeholder="e.g. Q1 2024 - Server Upgrade" />
                    </div>
                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Item Type</label>
                            <select name="itemType" className="form-select" value={formData.itemType} onChange={handleChange}>
                                <option value="asset">Asset</option>
                                <option value="license">License</option>
                            </select>
                        </div>
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Status</label>
                            <select name="status" className="form-select" value={formData.status} onChange={handleChange}>
                                <option value="pending">Pending</option>
                                <option value="partially_received">Partially Received</option>
                                <option value="received">Received</option>
                                <option value="commissioned">Commissioned</option>
                            </select>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Ordered Quantity</label>
                            <input type="number" name="orderedQty" className="form-control" value={formData.orderedQty} onChange={handleChange} min="0" required />
                        </div>
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Received Quantity</label>
                            <input type="number" name="receivedQty" className="form-control" value={formData.receivedQty} onChange={handleChange} min="0" required />
                        </div>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Notes</label>
                        <textarea name="notes" className="form-control" rows={3} value={formData.notes || ''} onChange={handleChange}></textarea>
                    </div>
                </div>
            )}

            {activeSection === 'po' && (
                <div className="animate__animated animate__fadeIn">
                    <div className="mb-3">
                        <label className="form-label">PO Number</label>
                        <input type="text" name="poNumber" className="form-control" value={po?.poNumber || ''} onChange={handlePoChange} placeholder="PO-XXXXXX" />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Vendor</label>
                        <input type="text" name="vendor" className="form-control" value={po?.vendor || ''} onChange={handlePoChange} />
                    </div>
                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Total Cost</label>
                            <div className="input-group">
                                <span className="input-group-text">$</span>
                                <input type="number" name="totalCost" className="form-control" value={po?.totalCost || 0} onChange={handlePoChange} min="0" step="0.01" />
                            </div>
                        </div>
                        <div className="col-md-6 mb-3">
                            <label className="form-label">PO Date</label>
                            <input type="date" name="date" className="form-control" value={po?.date || ''} onChange={handlePoChange} />
                        </div>
                    </div>
                </div>
            )}

            {activeSection === 'dn' && (
                <div className="animate__animated animate__fadeIn">
                    <div className="mb-3">
                        <label className="form-label">Waybill Number</label>
                        <input type="text" name="waybillNumber" className="form-control" value={dn?.waybillNumber || ''} onChange={handleDnChange} />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Received Date</label>
                        <input type="date" name="receivedDate" className="form-control" value={dn?.receivedDate || ''} onChange={handleDnChange} />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Condition</label>
                        <select name="condition" className="form-select" value={dn?.condition || 'good'} onChange={handleDnChange}>
                            <option value="good">Good</option>
                            <option value="damaged">Damaged</option>
                            <option value="partial">Partial / Incomplete</option>
                        </select>
                    </div>
                </div>
            )}

            {activeSection === 'minutes' && (
                <div className="animate__animated animate__fadeIn">
                    <div className="mb-3">
                        <label className="form-label">Meeting Reference Number</label>
                        <input type="text" name="meetingRefNo" className="form-control" value={minutes?.meetingRefNo || ''} onChange={handleMinutesChange} />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Meeting Date</label>
                        <input type="date" name="meetingDate" className="form-control" value={minutes?.meetingDate || ''} onChange={handleMinutesChange} />
                    </div>
                    <div className="form-check mb-3">
                        <input className="form-check-input" type="checkbox" name="committeeSignOff" id="signOff" checked={minutes?.committeeSignOff || false} onChange={handleMinutesChange} />
                        <label className="form-check-label" htmlFor="signOff">
                            Committee Sign-off Completed (Legal Proof)
                        </label>
                    </div>
                </div>
            )}

            <div className="d-flex justify-content-end gap-2 mt-4 border-top pt-3">
                <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>
                <button type="submit" className="btn btn-primary">{initialData ? 'Update Batch' : 'Create Procurement Batch'}</button>
            </div>
        </form>
    );
};
