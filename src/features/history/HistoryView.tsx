import type { AssetHistoryEvent } from '../../types';

interface HistoryViewProps {
    history: AssetHistoryEvent[];
}

export const HistoryView = ({ history }: HistoryViewProps) => {
    // Sort history by date descending (newest first)
    const sortedHistory = [...history].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getIcon = (type: AssetHistoryEvent['type']) => {
        switch (type) {
            case 'assignment': return '👤';
            case 'status': return '🔄';
            case 'maintenance': return '🔧';
            case 'creation': return '✨';
            case 'update': return '✏️';
            case 'location': return '📍';
            default: return '📝';
        }
    };

    const getBadgeClass = (type: AssetHistoryEvent['type']) => {
        switch (type) {
            case 'assignment': return 'bg-info text-dark';
            case 'status': return 'bg-warning text-dark';
            case 'maintenance': return 'bg-danger';
            case 'creation': return 'bg-success';
            default: return 'bg-secondary';
        }
    };

    return (
        <div className="history-timeline">
            {sortedHistory.length === 0 ? (
                <div className="text-center py-5 text-muted">
                    No history records found for this asset.
                </div>
            ) : (
                <div className="list-group list-group-flush">
                    {sortedHistory.map((event) => (
                        <div key={event.id} className="list-group-item bg-transparent border-start-0 border-end-0 border-top-0 d-flex gap-3 py-3">
                            <div className="d-flex flex-column align-items-center">
                                <div
                                    className="rounded-circle d-flex align-items-center justify-content-center border border-secondary"
                                    style={{ width: '40px', height: '40px', fontSize: '1.2rem', backgroundColor: 'var(--bs-dark)' }}
                                >
                                    {getIcon(event.type)}
                                </div>
                                <div className="h-100 border-start border-secondary my-2" style={{ width: '1px' }}></div>
                            </div>
                            <div className="flex-grow-1">
                                <div className="d-flex justify-content-between align-items-center mb-1">
                                    <span className={`badge ${getBadgeClass(event.type)}`}>
                                        {event.type.toUpperCase()}
                                    </span>
                                    <small className="text-muted">{formatDate(event.date)}</small>
                                </div>
                                <p className="mb-1 fw-bold text-white">{event.description}</p>
                                {(event.changedFrom || event.changedTo) && (
                                    <div className="small text-muted p-2 rounded bg-opacity-10 bg-secondary mt-2">
                                        {event.changedFrom && (
                                            <div className="d-flex align-items-center gap-2">
                                                <span className="text-danger">From:</span> {event.changedFrom}
                                            </div>
                                        )}
                                        {event.changedTo && (
                                            <div className="d-flex align-items-center gap-2">
                                                <span className="text-success">To:</span> {event.changedTo}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
