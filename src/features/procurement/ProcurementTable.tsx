import { useState, useMemo } from 'react';
import type { ProcurementBatch } from '../../types';
import { Button } from '../../components/shared/Button';

interface ProcurementTableProps {
    batches: ProcurementBatch[];
    onEdit: (batch: ProcurementBatch) => void;
    onDelete: (id: string) => void;
    onUpdateStatus: (batch: ProcurementBatch, status: ProcurementBatch['status']) => void;
}

type SortKey = keyof ProcurementBatch | 'poNumber' | 'waybill' | 'meetingRef';
type SortDirection = 'asc' | 'desc';

interface SortConfig {
    key: SortKey;
    direction: SortDirection;
}

export const ProcurementTable = ({
    batches,
    onEdit,
    onDelete,
    onUpdateStatus
}: ProcurementTableProps) => {
    const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);

    const handleSort = (key: SortKey) => {
        let direction: SortDirection = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const sortedBatches = useMemo(() => {
        if (!sortConfig) return batches;
        return [...batches].sort((a, b) => {
            let valA: any = a[sortConfig.key as keyof ProcurementBatch];
            let valB: any = b[sortConfig.key as keyof ProcurementBatch];

            if (sortConfig.key === 'poNumber') {
                valA = a.po?.poNumber;
                valB = b.po?.poNumber;
            } else if (sortConfig.key === 'waybill') {
                valA = a.dn?.waybillNumber;
                valB = b.dn?.waybillNumber;
            } else if (sortConfig.key === 'meetingRef') {
                valA = a.minutes?.meetingRefNo;
                valB = b.minutes?.meetingRefNo;
            }

            if (valA === valB) return 0;
            if (valA === undefined || valA === null) return 1;
            if (valB === undefined || valB === null) return -1;

            if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
            if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });
    }, [batches, sortConfig]);

    const getStatusBadgeClass = (status: ProcurementBatch['status']) => {
        switch (status) {
            case 'pending': return 'bg-secondary';
            case 'partially_received': return 'bg-warning text-dark';
            case 'received': return 'bg-info text-dark';
            case 'commissioned': return 'bg-success';
            default: return 'bg-secondary';
        }
    };



    return (
        <div className="table-responsive">
            <table className="table table-striped table-hover align-middle">
                <thead className="table-dark">
                    <tr>
                        <th onClick={() => handleSort('name')} style={{ cursor: 'pointer' }}>Batch Name</th>
                        <th onClick={() => handleSort('poNumber')} style={{ cursor: 'pointer' }}>PO Number</th>
                        <th onClick={() => handleSort('waybill')} style={{ cursor: 'pointer' }}>Waybill</th>
                        <th onClick={() => handleSort('meetingRef')} style={{ cursor: 'pointer' }}>Ward Minutes</th>
                        <th className="text-center">Ordered</th>
                        <th className="text-center">Received</th>
                        <th className="text-center">Reconciliation</th>
                        <th className="text-center">Status</th>
                        <th className="text-end">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {sortedBatches.map((batch) => {
                        const discrepancy = batch.orderedQty - batch.receivedQty;
                        const hasDiscrepancy = discrepancy !== 0;

                        return (
                            <tr key={batch.id}>
                                <td className="fw-bold text-white">
                                    {batch.name}
                                    <div className="small text-muted">{batch.itemType.toUpperCase()}</div>
                                </td>
                                <td>
                                    {batch.po ? (
                                        <div>
                                            <span className="font-monospace small">{batch.po.poNumber}</span>
                                            <div className="small text-muted">{batch.po.vendor}</div>
                                        </div>
                                    ) : <span className="text-muted">No PO</span>}
                                </td>
                                <td>
                                    {batch.dn ? (
                                        <div>
                                            <span className="font-monospace small">{batch.dn.waybillNumber}</span>
                                            <div className="small text-muted">{batch.dn.receivedDate}</div>
                                        </div>
                                    ) : <span className="text-muted">No DN</span>}
                                </td>
                                <td>
                                    {batch.minutes ? (
                                        <div>
                                            <span className="font-monospace small">{batch.minutes.meetingRefNo}</span>
                                            <div className="small text-muted">{batch.minutes.meetingDate}</div>
                                        </div>
                                    ) : <span className="text-muted">No Minutes</span>}
                                </td>
                                <td className="text-center">{batch.orderedQty}</td>
                                <td className="text-center">{batch.receivedQty}</td>
                                <td className="text-center">
                                    {hasDiscrepancy ? (
                                        <span className="badge bg-danger rounded-pill" title="Missing Items">
                                            -{discrepancy}
                                        </span>
                                    ) : (
                                        <span className="badge bg-success rounded-pill">Matched</span>
                                    )}
                                </td>
                                <td className="text-center">
                                    <select
                                        className={`form-select form-select-sm badge ${getStatusBadgeClass(batch.status)}`}
                                        value={batch.status}
                                        onChange={(e) => onUpdateStatus(batch, e.target.value as ProcurementBatch['status'])}
                                        style={{ border: 'none', cursor: 'pointer' }}
                                    >
                                        <option value="pending">PENDING</option>
                                        <option value="partially_received">PARTIALLY RECEIVED</option>
                                        <option value="received">RECEIVED</option>
                                        <option value="commissioned">COMMISSIONED</option>
                                    </select>
                                </td>
                                <td className="text-end">
                                    <div className="d-flex justify-content-end gap-1">
                                        <Button variant="secondary" size="sm" onClick={() => onEdit(batch)}>Edit</Button>
                                        <Button variant="danger" size="sm" onClick={() => onDelete(batch.id)} title="Delete Batch">×</Button>
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                    {sortedBatches.length === 0 && (
                        <tr>
                            <td colSpan={9} className="text-center py-5 text-muted">
                                No procurement batches found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};
