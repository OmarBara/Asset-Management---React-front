import React, { useState, useMemo } from 'react';
import type { HardwareComponent } from '../../types';
import { Button } from '../../components/shared/Button';

interface ComponentTableProps {
    components: HardwareComponent[];
    onEdit: (component: HardwareComponent) => void;
    onDelete: (id: string) => void;
    onCheckout: (component: HardwareComponent) => void;
    onCheckin: (component: HardwareComponent) => void;
    onViewHistory: (component: HardwareComponent) => void;
}

type SortKey = keyof HardwareComponent;
type SortDirection = 'asc' | 'desc';

interface SortConfig {
    key: SortKey;
    direction: SortDirection;
}

export const ComponentTable = ({
    components,
    onEdit,
    onDelete,
    onCheckout,
    onCheckin,
    onViewHistory
}: ComponentTableProps) => {
    const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);

    const handleSort = (key: SortKey) => {
        let direction: SortDirection = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const sortedComponents = useMemo(() => {
        if (!sortConfig) return components;
        return [...components].sort((a, b) => {
            const valA = a[sortConfig.key];
            const valB = b[sortConfig.key];

            if (valA === valB) return 0;
            if (valA === undefined || valA === null) return 1;
            if (valB === undefined || valB === null) return -1;

            if ((valA as any) < (valB as any)) {
                return sortConfig.direction === 'asc' ? -1 : 1;
            }
            if ((valA as any) > (valB as any)) {
                return sortConfig.direction === 'asc' ? 1 : -1;
            }
            return 0;
        });
    }, [components, sortConfig]);

    const getSortIndicator = (key: SortKey) => {
        if (!sortConfig || sortConfig.key !== key) return '↕';
        return sortConfig.direction === 'asc' ? '↑' : '↓';
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US');
    };

    return (
        <div className="table-responsive">
            <table className="table table-striped table-hover align-middle" style={{ whiteSpace: 'nowrap', '--bs-table-cell-padding-x': '1.5rem' } as React.CSSProperties}>
                <thead className="table-dark">
                    <tr>
                        <th onClick={() => handleSort('name')} style={{ cursor: 'pointer' }}>Name {getSortIndicator('name')}</th>
                        <th onClick={() => handleSort('serial')} style={{ cursor: 'pointer' }}>Serial {getSortIndicator('serial')}</th>
                        <th onClick={() => handleSort('category')} style={{ cursor: 'pointer' }}>Category {getSortIndicator('category')}</th>
                        <th onClick={() => handleSort('modelNumber')} style={{ cursor: 'pointer' }}>Model No. {getSortIndicator('modelNumber')}</th>
                        <th onClick={() => handleSort('location')} style={{ cursor: 'pointer' }}>Location {getSortIndicator('location')}</th>
                        <th onClick={() => handleSort('orderNumber')} style={{ cursor: 'pointer' }}>Order Number {getSortIndicator('orderNumber')}</th>
                        <th onClick={() => handleSort('purchaseDate')} style={{ cursor: 'pointer' }}>Purchase Date {getSortIndicator('purchaseDate')}</th>
                        <th onClick={() => handleSort('minQty')} style={{ cursor: 'pointer' }} className="text-center">Min. QTY {getSortIndicator('minQty')}</th>
                        <th onClick={() => handleSort('totalQty')} style={{ cursor: 'pointer' }} className="text-center">Total {getSortIndicator('totalQty')}</th>
                        <th onClick={() => handleSort('remainingQty')} style={{ cursor: 'pointer' }} className="text-center">Remaining {getSortIndicator('remainingQty')}</th>
                        <th>Unit Cost</th>
                        <th>Total Cost</th>
                        <th className="text-center">Checkin/Checkout</th>
                        <th className="text-end">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {sortedComponents.map((comp) => {
                        const isLowStock = comp.remainingQty <= comp.minQty;
                        const totalCost = comp.totalQty * comp.unitCost;

                        return (
                            <tr key={comp.id} className={isLowStock ? 'table-warning' : ''}>
                                <td className="fw-bold text-white">{comp.name}</td>
                                <td className="small font-monospace">{comp.serial}</td>
                                <td>{comp.category}</td>
                                <td className="font-monospace small">{comp.modelNumber}</td>
                                <td>{comp.location}</td>
                                <td>{comp.orderNumber}</td>
                                <td>{formatDate(comp.purchaseDate)}</td>
                                <td className="text-center">{comp.minQty}</td>
                                <td className="text-center fw-bold">{comp.totalQty}</td>
                                <td className="text-center">
                                    <span className={`badge ${comp.remainingQty > comp.minQty ? 'bg-success' : 'bg-danger'} rounded-pill`}>
                                        {comp.remainingQty}
                                    </span>
                                </td>
                                <td>${comp.unitCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                <td className="fw-bold">${totalCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                <td className="text-center">
                                    <div className="d-flex justify-content-center gap-1">
                                        <Button
                                            variant="outline-success"
                                            size="sm"
                                            onClick={() => onCheckin(comp)}
                                            disabled={comp.remainingQty === comp.totalQty}
                                            title="Check In"
                                        >
                                            In 📥
                                        </Button>
                                        <Button
                                            variant="outline-info"
                                            size="sm"
                                            onClick={() => onCheckout(comp)}
                                            disabled={comp.remainingQty === 0}
                                            title="Check Out"
                                        >
                                            Out 📤
                                        </Button>
                                    </div>
                                </td>
                                <td className="text-end">
                                    <div className="d-flex justify-content-end gap-1">
                                        <Button variant="info" size="sm" onClick={() => onViewHistory(comp)} title="View History">🕒</Button>
                                        <Button variant="secondary" size="sm" onClick={() => onEdit(comp)}>Edit</Button>
                                        <Button variant="danger" size="sm" onClick={() => onDelete(comp.id)} title="Delete Component">×</Button>
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                    {sortedComponents.length === 0 && (
                        <tr>
                            <td colSpan={14} className="text-center py-5 text-muted">
                                No components found. Add one to get started.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};
