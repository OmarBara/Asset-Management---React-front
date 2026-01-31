import React, { useState } from 'react';
import type { MasterLicense, LicenseSeat, Asset } from '../../types';
import { Button } from '../../components/shared/Button';

interface LicenseTableProps {
    masterLicenses: MasterLicense[];
    seats: LicenseSeat[];
    assets: Asset[];
    onEdit: (license: MasterLicense) => void;
    onDelete: (id: string) => void;
    onUpdateSeat: (seatId: string, updates: Partial<LicenseSeat>) => void;
    onViewHistory: (license: MasterLicense) => void;
    onViewSeatHistory: (seat: LicenseSeat) => void;
}

export const LicenseTable = ({
    masterLicenses,
    seats,
    assets,
    onEdit,
    onDelete,
    onUpdateSeat,
    onViewHistory,
    onViewSeatHistory
}: LicenseTableProps) => {
    const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());


    const toggleExpand = (id: string) => {
        const newIds = new Set(expandedIds);
        if (newIds.has(id)) newIds.delete(id);
        else newIds.add(id);
        setExpandedIds(newIds);
    };

    const getStatusBadge = (status: MasterLicense['status']) => {
        const bg = status === 'active' ? 'bg-success' : status === 'expiring' ? 'bg-warning text-dark' : 'bg-danger';
        return <span className={`badge ${bg}`}>{status.toUpperCase()}</span>;
    };

    return (
        <div className="table-responsive">
            <table className="table table-hover align-middle" style={{ '--bs-table-cell-padding-x': '1.5rem' } as React.CSSProperties}>
                <thead className="table-dark">
                    <tr>
                        <th style={{ width: '40px' }}></th>
                        <th>License Name</th>
                        <th>Manufacturer</th>
                        <th className="text-center">Total</th>
                        <th className="text-center">Available</th>
                        <th>Usage</th>
                        <th>Expiration</th>
                        <th>Status</th>
                        <th className="text-end">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {masterLicenses.map((license) => {
                        const licenseSeats = seats.filter(s => s.masterLicenseId === license.id);
                        const assignedCount = licenseSeats.filter(s => s.status === 'assigned').length;
                        const availableCount = license.totalSeats - assignedCount;
                        const isExpanded = expandedIds.has(license.id);

                        const handleQuickAssign = () => {
                            if (!isExpanded) toggleExpand(license.id);
                        };

                        return (
                            <React.Fragment key={license.id}>
                                <tr className={isExpanded ? 'table-active' : ''}>
                                    <td>
                                        <button
                                            className="btn btn-sm btn-outline-light border-0"
                                            onClick={() => toggleExpand(license.id)}
                                        >
                                            {isExpanded ? '▼' : '▶'}
                                        </button>
                                    </td>
                                    <td>
                                        <div className="fw-bold text-white">{license.name}</div>
                                        <div className="small text-muted font-monospace">{license.key}</div>
                                    </td>
                                    <td>{license.manufacturer}</td>
                                    <td className="text-center fw-bold">{license.totalSeats}</td>
                                    <td className="text-center">
                                        <span className={`badge ${availableCount > 0 ? 'bg-success' : 'bg-danger'} rounded-pill`}>
                                            {availableCount}
                                        </span>
                                    </td>
                                    <td style={{ minWidth: '120px' }}>
                                        <div className="d-flex align-items-center gap-2">
                                            <div className="progress w-100" style={{ height: '6px' }}>
                                                <div
                                                    className="progress-bar bg-info"
                                                    style={{ width: `${(assignedCount / license.totalSeats) * 100}%` }}
                                                ></div>
                                            </div>
                                            <span className="small opacity-75">{Math.round((assignedCount / license.totalSeats) * 100)}%</span>
                                        </div>
                                    </td>
                                    <td>{new Date(license.expirationDate).toLocaleDateString()}</td>
                                    <td>{getStatusBadge(license.status)}</td>
                                    <td className="text-end">
                                        <div className="d-flex justify-content-end gap-1">
                                            <Button
                                                variant="primary"
                                                size="sm"
                                                onClick={handleQuickAssign}
                                                disabled={availableCount === 0}
                                            >
                                                Assign
                                            </Button>
                                            <Button variant="info" size="sm" onClick={() => onViewHistory(license)} title="View History">🕒</Button>
                                            <Button variant="secondary" size="sm" onClick={() => onEdit(license)}>Edit</Button>
                                            <Button variant="danger" size="sm" onClick={() => onDelete(license.id)} title="Delete Master Record">×</Button>
                                        </div>
                                    </td>
                                </tr>
                                {isExpanded && (
                                    <tr>
                                        <td colSpan={9} className="p-0 border-0">
                                            <div className="bg-dark p-4 border-start border-4 border-info m-3 rounded shadow">
                                                <h6 className="mb-3 text-info d-flex justify-content-between">
                                                    <span>Individual Seat Tracking: {license.name}</span>
                                                    <span className="badge bg-secondary">{licenseSeats.length} Records</span>
                                                </h6>
                                                <table className="table table-sm table-dark table-borderless align-middle mb-0">
                                                    <thead>
                                                        <tr className="text-muted small border-bottom border-secondary">
                                                            <th className="pb-2">Seat #</th>
                                                            <th className="pb-2">Status</th>
                                                            <th className="pb-2">Assigned To Type</th>
                                                            <th className="pb-2">Target ID / Name</th>
                                                            <th className="pb-2 text-end">Actions</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {licenseSeats.map(seat => (
                                                            <SeatRow
                                                                key={seat.id}
                                                                seat={seat}
                                                                assets={assets}
                                                                onUpdate={(updates) => onUpdateSeat(seat.id, updates)}
                                                                onViewHistory={() => onViewSeatHistory(seat)}
                                                            />
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        );
                    })}
                    {masterLicenses.length === 0 && (
                        <tr>
                            <td colSpan={9} className="text-center py-5 text-muted">
                                No master licenses found. Create one to begin generating seats.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

const SeatRow = ({ seat, assets, onUpdate, onViewHistory }: {
    seat: LicenseSeat,
    assets: Asset[],
    onUpdate: (updates: Partial<LicenseSeat>) => void,
    onViewHistory: () => void
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState<Partial<LicenseSeat>>({
        assignedToType: seat.assignedToType,
        assignedToId: seat.assignedToId
    });

    const handleSave = () => {
        const isAssigned = editData.assignedToType !== 'unassigned' && !!editData.assignedToId;
        onUpdate({
            ...editData,
            status: isAssigned ? 'assigned' : 'available'
        });
        setIsEditing(false);
    };

    const getAssignedDisplay = () => {
        if (seat.assignedToType === 'unassigned') return <span className="text-muted italic opacity-50">Empty</span>;
        if (seat.assignedToType === 'person') return <span className="text-white">👤 {seat.assignedToId}</span>;
        const asset = assets.find(a => a.id === seat.assignedToId);
        return <span className="text-info">📦 {asset ? asset.name : 'Unknown Asset'}</span>;
    };

    return (
        <tr className="border-bottom border-secondary-subtle">
            <td className="small font-monospace opacity-75 py-3">{seat.seatNumber}</td>
            <td>
                <span className={`badge ${seat.status === 'assigned' ? 'bg-primary' : 'bg-secondary'}`}>
                    {seat.status.toUpperCase()}
                </span>
            </td>
            {isEditing ? (
                <>
                    <td>
                        <select
                            className="form-select form-select-sm bg-dark text-white border-secondary"
                            value={editData.assignedToType}
                            onChange={(e) => setEditData({ ...editData, assignedToType: e.target.value as any, assignedToId: '' })}
                        >
                            <option value="unassigned">Unassigned</option>
                            <option value="person">User</option>
                            <option value="asset">Device (PC/Laptop)</option>
                        </select>
                    </td>
                    <td>
                        {editData.assignedToType === 'asset' ? (
                            <select
                                className="form-select form-select-sm bg-dark text-white border-secondary"
                                value={editData.assignedToId}
                                onChange={(e) => setEditData({ ...editData, assignedToId: e.target.value })}
                            >
                                <option value="">-- Select Asset --</option>
                                {assets.map(a => <option key={a.id} value={a.id}>{a.name} ({a.assetTag})</option>)}
                            </select>
                        ) : (
                            <input
                                type="text"
                                className="form-control form-control-sm bg-dark text-white border-secondary"
                                placeholder="Enter Name"
                                value={editData.assignedToId || ''}
                                onChange={(e) => setEditData({ ...editData, assignedToId: e.target.value })}
                                disabled={editData.assignedToType === 'unassigned'}
                            />
                        )}
                    </td>
                    <td className="text-end">
                        <div className="d-flex gap-1 justify-content-end">
                            <button className="btn btn-sm btn-success" onClick={handleSave}>Save</button>
                            <button className="btn btn-sm btn-outline-secondary" onClick={() => setIsEditing(false)}>Cancel</button>
                        </div>
                    </td>
                </>
            ) : (
                <>
                    <td className="text-muted small text-uppercase fw-bold opacity-50">
                        {seat.assignedToType === 'unassigned' ? '-' : seat.assignedToType === 'person' ? 'User' : 'Device'}
                    </td>
                    <td>{getAssignedDisplay()}</td>
                    <td className="text-end">
                        <div className="d-flex gap-1 justify-content-end">
                            <button className="btn btn-sm btn-outline-info border-0" onClick={onViewHistory} title="Seat History">🕒</button>
                            <button className="btn btn-sm btn-outline-primary" onClick={() => {
                                setEditData({ assignedToType: seat.assignedToType, assignedToId: seat.assignedToId });
                                setIsEditing(true);
                            }}>Assign</button>
                        </div>
                    </td>
                </>
            )}
        </tr>
    );
};
