import type { ProcurementBatch } from '../../types';

interface ReconciliationReportProps {
    batches: ProcurementBatch[];
}

export const ReconciliationReport = ({ batches }: ReconciliationReportProps) => {
    const discrepancies = batches.filter(b => b.orderedQty !== b.receivedQty);
    const totalOrdered = batches.reduce((sum, b) => sum + b.orderedQty, 0);
    const totalReceived = batches.reduce((sum, b) => sum + b.receivedQty, 0);

    return (
        <div className="card bg-dark border-secondary mb-4">
            <div className="card-header border-secondary d-flex justify-content-between align-items-center">
                <h5 className="mb-0 text-white">Reconciliation Summary</h5>
                <span className={`badge ${totalOrdered === totalReceived ? 'bg-success' : 'bg-warning text-dark'}`}>
                    {totalOrdered === totalReceived ? 'All Matched' : 'Discrepancies Found'}
                </span>
            </div>
            <div className="card-body">
                <div className="row text-center mb-4">
                    <div className="col-md-4">
                        <div className="fs-2 fw-bold text-primary">{totalOrdered}</div>
                        <div className="text-muted small text-uppercase">Total Ordered</div>
                    </div>
                    <div className="col-md-4">
                        <div className="fs-2 fw-bold text-success">{totalReceived}</div>
                        <div className="text-muted small text-uppercase">Total Received</div>
                    </div>
                    <div className="col-md-4">
                        <div className="fs-2 fw-bold text-danger">{totalOrdered - totalReceived}</div>
                        <div className="text-muted small text-uppercase">Gap / Missing</div>
                    </div>
                </div>

                {discrepancies.length > 0 && (
                    <div className="table-responsive">
                        <table className="table table-sm table-dark table-hover mb-0">
                            <thead>
                                <tr>
                                    <th>Batch Name</th>
                                    <th className="text-center">Ordered</th>
                                    <th className="text-center">Received</th>
                                    <th className="text-center">Difference</th>
                                    <th>Potential Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {discrepancies.map(batch => (
                                    <tr key={batch.id}>
                                        <td>{batch.name}</td>
                                        <td className="text-center">{batch.orderedQty}</td>
                                        <td className="text-center">{batch.receivedQty}</td>
                                        <td className="text-center text-danger fw-bold">-{batch.orderedQty - batch.receivedQty}</td>
                                        <td>
                                            <small className="text-info">Verify with vendor (PO: {batch.po?.poNumber || 'N/A'})</small>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};
