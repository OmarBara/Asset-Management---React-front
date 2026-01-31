import type { Asset, MasterLicense, LicenseSeat, Accessory, HardwareComponent, AssetHistoryEvent } from '../../types';

interface GlobalHistoryViewProps {
    assets: Asset[];
    masterLicenses: MasterLicense[];
    seats: LicenseSeat[];
    accessories: Accessory[];
    components: HardwareComponent[];
}

export const GlobalHistoryView = ({ assets, masterLicenses, seats, accessories, components }: GlobalHistoryViewProps) => {
    // Collect all history events from assets
    const assetEvents = assets.flatMap(asset =>
        (asset.history || []).map(event => ({
            ...event,
            itemName: asset.name,
            itemType: 'Asset'
        }))
    );

    // Collect all history events from master licenses
    const masterEvents = masterLicenses.flatMap(license =>
        (license.history || []).map(event => ({
            ...event,
            itemName: license.name,
            itemType: 'Master License'
        }))
    );

    // Collect all history events from seats
    const seatEvents = seats.flatMap(seat =>
        (seat.history || []).map(event => ({
            ...event,
            itemName: `${masterLicenses.find(l => l.id === seat.masterLicenseId)?.name} - ${seat.seatNumber}`,
            itemType: 'License Seat'
        }))
    );

    // Collect all history events from accessories
    const accessoryEvents = accessories.flatMap(acc =>
        (acc.history || []).map(event => ({
            ...event,
            itemName: acc.name,
            itemType: 'Accessory'
        }))
    );

    // Collect all history events from components
    const componentEvents = components.flatMap(comp =>
        (comp.history || []).map(event => ({
            ...event,
            itemName: comp.name,
            itemType: 'Component'
        }))
    );

    // Combine and sort by date descending
    const allEvents = [...assetEvents, ...masterEvents, ...seatEvents, ...accessoryEvents, ...componentEvents].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

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
            case 'checkout': return '📤';
            case 'checkin': return '📥';
            default: return '📝';
        }
    };

    return (
        <div className="card shadow-sm border-secondary-subtle">
            <div className="card-body p-0">
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="table-dark">
                            <tr>
                                <th className="ps-4">Date</th>
                                <th>Item</th>
                                <th>Type</th>
                                <th>Event</th>
                                <th>Description</th>
                                <th className="pe-4">Details</th>
                            </tr>
                        </thead>
                        <tbody>
                            {allEvents.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-5 text-muted">
                                        No activity recorded yet.
                                    </td>
                                </tr>
                            ) : (
                                allEvents.map((event) => (
                                    <tr key={event.id}>
                                        <td className="ps-4">
                                            <div className="small text-muted">{formatDate(event.date)}</div>
                                        </td>
                                        <td>
                                            <span className="fw-medium text-white">{(event as any).itemName}</span>
                                        </td>
                                        <td>
                                            <span className={`badge bg-secondary opacity-75`}>{(event as any).itemType}</span>
                                        </td>
                                        <td>
                                            <div className="d-flex align-items-center gap-2">
                                                <span>{getIcon(event.type)}</span>
                                                <span className="small text-uppercase fw-bold text-info-emphasis opacity-75">{event.type}</span>
                                            </div>
                                        </td>
                                        <td>{event.description}</td>
                                        <td className="pe-4">
                                            {event.changedFrom || event.changedTo ? (
                                                <div className="small text-muted">
                                                    {event.changedFrom && <span className="opacity-75">From: {event.changedFrom} </span>}
                                                    {event.changedTo && <span className="text-success-emphasis">To: {event.changedTo}</span>}
                                                </div>
                                            ) : (
                                                <span className="text-muted small">N/A</span>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
