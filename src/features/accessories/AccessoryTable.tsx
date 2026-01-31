import React, { useState, useMemo } from 'react';
import type { Accessory } from '../../types';
import { Button } from '../../components/shared/Button';

interface AccessoryTableProps {
    accessories: Accessory[];
    onEdit: (accessory: Accessory) => void;
    onDelete: (id: string) => void;
    onCheckout: (accessory: Accessory) => void;
    onCheckin: (accessory: Accessory) => void;
    onViewHistory: (accessory: Accessory) => void;
}

type SortKey = keyof Accessory;
type SortDirection = 'asc' | 'desc';

interface SortConfig {
    key: SortKey;
    direction: SortDirection;
}

export const AccessoryTable = ({
    accessories,
    onEdit,
    onDelete,
    onCheckout,
    onCheckin,
    onViewHistory
}: AccessoryTableProps) => {
    const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);

    const handleSort = (key: SortKey) => {
        let direction: SortDirection = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const sortedAccessories = useMemo(() => {
        if (!sortConfig) return accessories;
        return [...accessories].sort((a, b) => {
            let valA: any = a[sortConfig.key];
            let valB: any = b[sortConfig.key];

            if (sortConfig.key as string === 'remainingQty') {
                valA = a.totalQty - a.checkedOutQty;
                valB = b.totalQty - b.checkedOutQty;
            }

            if (valA === valB) return 0;
            if (valA === undefined || valA === null) return 1;
            if (valB === undefined || valB === null) return -1;

            if (valA < valB) {
                return sortConfig.direction === 'asc' ? -1 : 1;
            }
            if (valA > valB) {
                return sortConfig.direction === 'asc' ? 1 : -1;
            }
            return 0;
        });
    }, [accessories, sortConfig]);

    const getSortIndicator = (key: string) => {
        if (!sortConfig || sortConfig.key !== key) return '↕';
        return sortConfig.direction === 'asc' ? '↑' : '↓';
    };

    return (
        <div className="table-responsive">
            <table className="table table-striped table-hover align-middle">
                <thead className="table-dark">
                    <tr>
                        <th onClick={() => handleSort('name')} style={{ cursor: 'pointer' }}>Name {getSortIndicator('name')}</th>
                        <th onClick={() => handleSort('category')} style={{ cursor: 'pointer' }}>Category {getSortIndicator('category')}</th>
                        <th onClick={() => handleSort('modelNumber')} style={{ cursor: 'pointer' }}>Model {getSortIndicator('modelNumber')}</th>
                        <th onClick={() => handleSort('location')} style={{ cursor: 'pointer' }}>Location {getSortIndicator('location')}</th>
                        <th onClick={() => handleSort('totalQty')} style={{ cursor: 'pointer' }} className="text-center">Total {getSortIndicator('totalQty')}</th>
                        <th onClick={() => handleSort('remainingQty' as any)} style={{ cursor: 'pointer' }} className="text-center">Remaining {getSortIndicator('remainingQty')}</th>
                        <th>Unit Cost</th>
                        <th className="text-center">Checkout/Checkin</th>
                        <th className="text-end">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {sortedAccessories.map((acc) => {
                        const remainingQty = acc.totalQty - acc.checkedOutQty;
                        const isLowStock = remainingQty <= acc.minQty;
                        return (
                            <tr key={acc.id} className={isLowStock ? 'table-warning' : ''}>
                                <td className="fw-bold text-white">
                                    <div className="d-flex align-items-center">
                                        <img src={acc.image} alt={acc.name} className="rounded me-2" style={{ width: '32px', height: '32px', objectFit: 'cover' }} />
                                        {acc.name}
                                    </div>
                                </td>
                                <td>{acc.category}</td>
                                <td>{acc.modelNumber}</td>
                                <td>{acc.location}</td>
                                <td className="text-center">{acc.totalQty}</td>
                                <td className="text-center">
                                    <span className={`badge ${remainingQty > acc.minQty ? 'bg-success' : 'bg-danger'} rounded-pill`}>
                                        {remainingQty}
                                    </span>
                                </td>
                                <td>${acc.unitCost.toLocaleString()}</td>
                                <td className="text-center">
                                    <div className="d-flex justify-content-center gap-1">
                                        <Button
                                            variant="outline-info"
                                            size="sm"
                                            onClick={() => onCheckout(acc)}
                                            disabled={remainingQty === 0}
                                        >
                                            Out 📤
                                        </Button>
                                        <Button
                                            variant="outline-success"
                                            size="sm"
                                            onClick={() => onCheckin(acc)}
                                            disabled={remainingQty === acc.totalQty}
                                        >
                                            In 📥
                                        </Button>
                                    </div>
                                </td>
                                <td className="text-end">
                                    <div className="d-flex justify-content-end gap-1">
                                        <Button variant="info" size="sm" onClick={() => onViewHistory(acc)}>🕒</Button>
                                        <Button variant="secondary" size="sm" onClick={() => onEdit(acc)}>Edit</Button>
                                        <Button variant="danger" size="sm" onClick={() => onDelete(acc.id)}>×</Button>
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};
