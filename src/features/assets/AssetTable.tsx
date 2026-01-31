import React, { useState, useMemo } from 'react';
import type { Asset } from '../../types';
import { StatusBadge } from '../../components/shared/StatusBadge';
import { Button } from '../../components/shared/Button';

interface AssetTableProps {
    assets: Asset[];
    onEdit: (asset: Asset) => void;
    onDelete: (id: string) => void;
    onViewHistory: (asset: Asset) => void;
    onPrint: (asset: Asset) => void;
}

type SortKey = keyof Asset;
type SortDirection = 'asc' | 'desc';

interface SortConfig {
    key: SortKey;
    direction: SortDirection;
}

export const AssetTable = ({ assets, onEdit, onDelete, onViewHistory, onPrint }: AssetTableProps) => {
    const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);

    const handleSort = (key: SortKey) => {
        let direction: SortDirection = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const sortedAssets = useMemo(() => {
        if (!sortConfig) return assets;
        return [...assets].sort((a, b) => {
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
    }, [assets, sortConfig]);

    const getSortIndicator = (key: SortKey) => {
        if (!sortConfig || sortConfig.key !== key) return '↕';
        return sortConfig.direction === 'asc' ? '↑' : '↓';
    };

    return (
        <div className="table-responsive">
            <table className="table table-striped table-hover align-middle" style={{ whiteSpace: 'nowrap', '--bs-table-cell-padding-x': '1.5rem' } as React.CSSProperties}>
                <thead className="table-Dark">
                    <tr>
                        <th onClick={() => handleSort('name')} style={{ cursor: 'pointer' }}>Asset {getSortIndicator('name')}</th>
                        <th onClick={() => handleSort('assetTag')} style={{ cursor: 'pointer' }}>Tag / Serial {getSortIndicator('assetTag')}</th>
                        <th onClick={() => handleSort('model')} style={{ cursor: 'pointer' }}>Model {getSortIndicator('model')}</th>
                        <th onClick={() => handleSort('type')} style={{ cursor: 'pointer' }}>Type {getSortIndicator('type')}</th>
                        <th onClick={() => handleSort('department')} style={{ cursor: 'pointer' }}>Department {getSortIndicator('department')}</th>
                        <th onClick={() => handleSort('location')} style={{ cursor: 'pointer' }}>Location {getSortIndicator('location')}</th>
                        <th onClick={() => handleSort('status')} style={{ cursor: 'pointer' }}>Status {getSortIndicator('status')}</th>
                        <th onClick={() => handleSort('assignee')} style={{ cursor: 'pointer' }}>Assignee {getSortIndicator('assignee')}</th>
                        <th onClick={() => handleSort('purchaseCost')} style={{ cursor: 'pointer' }}>Cost {getSortIndicator('purchaseCost')}</th>
                        <th onClick={() => handleSort('currentValue')} style={{ cursor: 'pointer' }}>Value {getSortIndicator('currentValue')}</th>
                        <th onClick={() => handleSort('purchaseDate')} style={{ cursor: 'pointer' }}>Purchase Date {getSortIndicator('purchaseDate')}</th>
                        <th className="text-end">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {sortedAssets.map((asset) => (
                        <tr key={asset.id}>
                            <td className="fw-medium">
                                <div className="d-flex align-items-center">
                                    <img
                                        src={asset.image}
                                        alt={asset.name}
                                        className="rounded me-2"
                                        style={{ width: '36px', height: '36px', objectFit: 'cover' }}
                                    />
                                    <span>{asset.name}</span>
                                </div>
                            </td>
                            <td>
                                <div className="d-flex flex-column">
                                    <span className="small fw-medium">{asset.assetTag}</span>
                                    <span className="small text-muted">{asset.serialNumber}</span>
                                </div>
                            </td>
                            <td>{asset.model}</td>
                            <td>{asset.type}</td>
                            <td>{asset.department}</td>
                            <td>{asset.location}</td>
                            <td><StatusBadge status={asset.status} /></td>
                            <td>
                                <div className="d-flex align-items-center">
                                    <div
                                        className="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center me-2"
                                        style={{ width: '24px', height: '24px', fontSize: '0.75rem' }}
                                    >
                                        {asset.assignee.charAt(0)}
                                    </div>
                                    {asset.assignee}
                                </div>
                            </td>
                            <td>${asset.purchaseCost.toLocaleString()}</td>
                            <td>${asset.currentValue.toLocaleString()}</td>
                            <td>{new Date(asset.purchaseDate).toLocaleDateString()}</td>
                            <td className="text-end">
                                <div className="d-flex justify-content-end gap-1">
                                    <Button
                                        variant="primary"
                                        size="sm"
                                        onClick={() => onPrint(asset)}
                                        title="Print QR Tag"
                                    >
                                        🖨️
                                    </Button>
                                    <Button
                                        variant="info"
                                        size="sm"
                                        onClick={() => onViewHistory(asset)}
                                        title="View History"
                                    >
                                        🕒
                                    </Button>
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        onClick={() => onEdit(asset)}
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        variant="danger"
                                        size="sm"
                                        onClick={() => onDelete(asset.id)}
                                        title="Delete Asset"
                                    >
                                        ×
                                    </Button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    {sortedAssets.length === 0 && (
                        <tr>
                            <td colSpan={12} className="text-center py-5 text-muted">
                                No assets found. Add one to get started.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};
