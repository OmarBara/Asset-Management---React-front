import type { AssetStatus } from '../types';
interface StatusBadgeProps {
    status: AssetStatus;
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
    const getBadgeClass = (status: AssetStatus) => {
        switch (status) {
            case 'active':
                return 'bg-success';
            case 'maintenance':
                return 'bg-warning text-dark';
            case 'retired':
                return 'bg-secondary';
            default:
                return 'bg-secondary';
        }
    };

    return (
        <span className={`badge ${getBadgeClass(status)}`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
    );
};
