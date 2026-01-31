import type { ReactNode } from 'react';

interface StatCardProps {
    title: string;
    value: string | number;
    change?: string;
    isPositive?: boolean;
    icon: ReactNode;
}

export const StatCard = ({ title, value, change, isPositive, icon }: StatCardProps) => {
    const changeColor = isPositive ? 'text-success' : 'text-danger';

    return (
        <div className="card h-100 shadow-sm border-0">
            <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="text-secondary small font-weight-bold text-uppercase">{title}</span>
                    <div className="text-primary">{icon}</div>
                </div>
                <h3 className="card-title fw-bold mb-2">{value}</h3>
                {change && (
                    <span className={`small ${changeColor}`}>
                        <span className="me-1">{isPositive ? '↑' : '↓'}</span>
                        {change}
                    </span>
                )}
            </div>
        </div>
    );
};
