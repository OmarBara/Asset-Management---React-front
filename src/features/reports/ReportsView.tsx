import { useState, useMemo } from 'react';
import { useAppContext } from '../../providers/AppContext';
import { ReportExporter } from '../../utils/ReportExporter';
import { Button } from '../../components/shared/Button';
import { StatusBadge } from '../../components/shared/StatusBadge';

type ReportType = 'assets' | 'licenses' | 'accessories' | 'components';

export const ReportsView = () => {
    const { state } = useAppContext();
    const { assets, masterLicenses, licenseSeats, accessories, components, departments, locations } = state;

    const [reportType, setReportType] = useState<ReportType>('assets');
    const [filterDepartment, setFilterDepartment] = useState<string>('All');
    const [filterStatus, setFilterStatus] = useState<string>('All');

    const filteredData = useMemo(() => {
        switch (reportType) {
            case 'assets':
                return assets.filter(a =>
                    (filterDepartment === 'All' || a.department === filterDepartment) &&
                    (filterStatus === 'All' || a.status === filterStatus)
                );
            case 'licenses':
                return masterLicenses.filter(l =>
                    (filterStatus === 'All' || l.status === filterStatus)
                );
            case 'accessories':
                return accessories.filter(acc =>
                    (filterDepartment === 'All' || acc.location === filterDepartment) // Using location for accessories as they don't have dept directly usually, or just filter by location
                );
            case 'components':
                return components.filter(comp =>
                    (filterStatus === 'All' || comp.category === filterStatus)
                );
            default:
                return [];
        }
    }, [reportType, filterDepartment, filterStatus, assets, masterLicenses, accessories, components]);

    const handleExport = () => {
        let exportData: any[] = [];
        let fileName = `Report_${reportType}_${new Date().toISOString().split('T')[0]}`;

        switch (reportType) {
            case 'assets':
                exportData = ReportExporter.formatAssetData(filteredData);
                break;
            case 'licenses':
                exportData = ReportExporter.formatLicenseData(filteredData, licenseSeats);
                break;
            case 'accessories':
                exportData = ReportExporter.formatAccessoryData(filteredData);
                break;
            case 'components':
                exportData = ReportExporter.formatComponentData(filteredData);
                break;
        }

        ReportExporter.exportToExcel(exportData, fileName, reportType.charAt(0).toUpperCase() + reportType.slice(1));
    };

    return (
        <div className="reports-container">
            <div className="card bg-dark border-secondary mb-4">
                <div className="card-body">
                    <h5 className="card-title mb-4">Report Configuration</h5>
                    <div className="row g-3">
                        <div className="col-md-3">
                            <label className="form-label small text-secondary fw-bold">ENTITY TYPE</label>
                            <select
                                className="form-select bg-dark text-white border-secondary"
                                value={reportType}
                                onChange={(e) => {
                                    setReportType(e.target.value as ReportType);
                                    setFilterDepartment('All');
                                    setFilterStatus('All');
                                }}
                            >
                                <option value="assets">Assets Inventory</option>
                                <option value="licenses">License Compliance</option>
                                <option value="accessories">Accessories Stock</option>
                                <option value="components">Hardware Components</option>
                            </select>
                        </div>

                        {reportType === 'assets' && (
                            <div className="col-md-3">
                                <label className="form-label small text-secondary fw-bold">DEPARTMENT</label>
                                <select
                                    className="form-select bg-dark text-white border-secondary"
                                    value={filterDepartment}
                                    onChange={(e) => setFilterDepartment(e.target.value)}
                                >
                                    <option value="All">All Departments</option>
                                    {departments.map(d => <option key={d} value={d}>{d}</option>)}
                                </select>
                            </div>
                        )}

                        {(reportType === 'assets' || reportType === 'licenses') && (
                            <div className="col-md-3">
                                <label className="form-label small text-secondary fw-bold">STATUS</label>
                                <select
                                    className="form-select bg-dark text-white border-secondary"
                                    value={filterStatus}
                                    onChange={(e) => setFilterStatus(e.target.value)}
                                >
                                    <option value="All">All Statuses</option>
                                    {reportType === 'assets' ? (
                                        <>
                                            <option value="active">Active</option>
                                            <option value="maintenance">Maintenance</option>
                                            <option value="retired">Retired</option>
                                        </>
                                    ) : (
                                        <>
                                            <option value="active">Active</option>
                                            <option value="expiring">Expiring</option>
                                            <option value="expired">Expired</option>
                                        </>
                                    )}
                                </select>
                            </div>
                        )}

                        <div className="col-md-3 d-flex align-items-end">
                            <Button onClick={handleExport} variant="success" className="w-100">
                                📊 Export to Excel
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card bg-dark border-secondary">
                <div className="card-header border-secondary d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">Data Preview ({filteredData.length} records)</h5>
                    <Button onClick={() => window.print()} variant="outline-light" size="sm">
                        🖨️ Print View
                    </Button>
                </div>
                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table table-dark table-hover mb-0">
                            <thead>
                                <tr>
                                    {reportType === 'assets' && (
                                        <>
                                            <th>Name</th>
                                            <th>Tag</th>
                                            <th>Department</th>
                                            <th>Status</th>
                                            <th>Assignee</th>
                                        </>
                                    )}
                                    {reportType === 'licenses' && (
                                        <>
                                            <th>Name</th>
                                            <th>Key</th>
                                            <th>Manufacturer</th>
                                            <th>Status</th>
                                            <th>Expiraton</th>
                                        </>
                                    )}
                                    {reportType === 'accessories' && (
                                        <>
                                            <th>Name</th>
                                            <th>Category</th>
                                            <th>Location</th>
                                            <th>Stock</th>
                                        </>
                                    )}
                                    {reportType === 'components' && (
                                        <>
                                            <th>Name</th>
                                            <th>Category</th>
                                            <th>Location</th>
                                            <th>Remaining</th>
                                        </>
                                    )}
                                </tr>
                            </thead>
                            <tbody>
                                {filteredData.map((item: any) => (
                                    <tr key={item.id}>
                                        {reportType === 'assets' && (
                                            <>
                                                <td>{item.name}</td>
                                                <td>{item.assetTag}</td>
                                                <td>{item.department}</td>
                                                <td><StatusBadge status={item.status} /></td>
                                                <td>{item.assignee}</td>
                                            </>
                                        )}
                                        {reportType === 'licenses' && (
                                            <>
                                                <td>{item.name}</td>
                                                <td>{item.key}</td>
                                                <td>{item.manufacturer}</td>
                                                <td><StatusBadge status={item.status} /></td>
                                                <td>{item.expirationDate}</td>
                                            </>
                                        )}
                                        {reportType === 'accessories' && (
                                            <>
                                                <td>{item.name}</td>
                                                <td>{item.category}</td>
                                                <td>{item.location}</td>
                                                <td>{item.totalQty - item.checkedOutQty} / {item.totalQty}</td>
                                            </>
                                        )}
                                        {reportType === 'components' && (
                                            <>
                                                <td>{item.name}</td>
                                                <td>{item.category}</td>
                                                <td>{item.location}</td>
                                                <td>{item.remainingQty} / {item.totalQty}</td>
                                            </>
                                        )}
                                    </tr>
                                ))}
                                {filteredData.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="text-center py-4 text-muted">No records match the selected filters.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};
