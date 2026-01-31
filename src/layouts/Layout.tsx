import type { ReactNode } from 'react';

interface LayoutProps {
    children: ReactNode;
    activeTab: 'dashboard' | 'assets' | 'accessories' | 'components' | 'procurement' | 'departments' | 'locations' | 'types' | 'history' | 'licenses' | 'reports' | 'users' | 'groups' | 'roles';
    onTabChange: (tab: 'dashboard' | 'assets' | 'accessories' | 'components' | 'procurement' | 'departments' | 'locations' | 'types' | 'history' | 'licenses' | 'reports' | 'users' | 'groups' | 'roles') => void;
}

export const Layout = ({ children, activeTab, onTabChange }: LayoutProps) => {
    return (
        <div className="container-fluid">
            <div className="row flex-nowrap">
                <div className="col-auto col-md-3 col-xl-2 px-sm-2 px-0 bg-dark border-end border-secondary">
                    <div className="d-flex flex-column align-items-center align-items-sm-start px-3 pt-2 text-white min-vh-100">
                        <a href="/" className="d-flex align-items-center pb-3 mb-md-0 me-md-auto text-white text-decoration-none">
                            <span className="fs-5 d-none d-sm-inline fw-bold">AssetFlow</span>
                        </a>
                        <ul className="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start w-100" id="menu">
                            <li className="nav-item w-100 mb-1">
                                <button
                                    className={`nav-link align-middle px-3 w-100 text-start text-white ${activeTab === 'dashboard' ? 'active bg-primary' : ''}`}
                                    onClick={() => onTabChange('dashboard')}
                                    style={{ borderRadius: '6px' }}
                                >
                                    <span className="me-2">📊</span>
                                    <span className="d-none d-sm-inline">Dashboard</span>
                                </button>
                            </li>
                            <li className="nav-item w-100 mb-1">
                                <button
                                    className={`nav-link align-middle px-3 w-100 text-start text-white ${activeTab === 'assets' ? 'active bg-primary' : ''}`}
                                    onClick={() => onTabChange('assets')}
                                    style={{ borderRadius: '6px' }}
                                >
                                    <span className="me-2">📦</span>
                                    <span className="d-none d-sm-inline">Assets</span>
                                </button>
                            </li>
                            <li className="nav-item w-100 mb-3">
                                <button
                                    className={`nav-link align-middle px-3 w-100 text-start text-white ${activeTab === 'licenses' ? 'active bg-primary' : ''}`}
                                    onClick={() => onTabChange('licenses')}
                                    style={{ borderRadius: '6px' }}
                                >
                                    <span className="me-2">🔑</span>
                                    <span className="d-none d-sm-inline">Licenses</span>
                                </button>
                            </li>
                            <li className="nav-item w-100 mb-3">
                                <button
                                    className={`nav-link align-middle px-3 w-100 text-start text-white ${activeTab === 'accessories' ? 'active bg-primary' : ''}`}
                                    onClick={() => onTabChange('accessories')}
                                    style={{ borderRadius: '6px' }}
                                >
                                    <span className="me-2">⌨️</span>
                                    <span className="d-none d-sm-inline">Accessories</span>
                                </button>
                            </li>
                            <li className="nav-item w-100 mb-3">
                                <button
                                    className={`nav-link align-middle px-3 w-100 text-start text-white ${activeTab === 'components' ? 'active bg-primary' : ''}`}
                                    onClick={() => onTabChange('components')}
                                    style={{ borderRadius: '6px' }}
                                >
                                    <span className="me-2">🔌</span>
                                    <span className="d-none d-sm-inline">Components</span>
                                </button>
                            </li>
                            <li className="nav-item w-100 mb-3">
                                <button
                                    className={`nav-link align-middle px-3 w-100 text-start text-white ${activeTab === 'reports' ? 'active bg-primary' : ''}`}
                                    onClick={() => onTabChange('reports')}
                                    style={{ borderRadius: '6px' }}
                                >
                                    <span className="me-2">📊</span>
                                    <span className="d-none d-sm-inline">Reports</span>
                                </button>
                            </li>
                            <li className="nav-item w-100 mb-1">
                                <small className="text-uppercase text-white-50 fw-bold px-3 d-none d-sm-block mb-2" style={{ fontSize: '0.75rem' }}>Management</small>
                            </li>
                            <li className="nav-item w-100 mb-1">
                                <button
                                    className={`nav-link align-middle px-3 w-100 text-start text-white ${activeTab === 'history' ? 'active bg-primary' : ''}`}
                                    onClick={() => onTabChange('history')}
                                    style={{ borderRadius: '6px' }}
                                >
                                    <span className="me-2">🕒</span>
                                    <span className="d-none d-sm-inline">Asset History</span>
                                </button>
                            </li>
                            <li className="nav-item w-100 mb-1">
                                <button
                                    className={`nav-link align-middle px-3 w-100 text-start text-white ${activeTab === 'procurement' ? 'active bg-primary' : ''}`}
                                    onClick={() => onTabChange('procurement')}
                                    style={{ borderRadius: '6px' }}
                                >
                                    <span className="me-2">📜</span>
                                    <span className="d-none d-sm-inline">Procurement</span>
                                </button>
                            </li>


                            <li className="nav-item w-100 mb-1 mt-3">
                                <small className="text-uppercase text-white-50 fw-bold px-3 d-none d-sm-block mb-2" style={{ fontSize: '0.75rem' }}>Administration</small>
                            </li>
                            <li className="nav-item w-100 mb-1">
                                <button
                                    className={`nav-link align-middle px-3 w-100 text-start text-white ${activeTab === 'users' ? 'active bg-primary' : ''}`}
                                    onClick={() => onTabChange('users')}
                                    style={{ borderRadius: '6px' }}
                                >
                                    <span className="me-2">👥</span>
                                    <span className="d-none d-sm-inline">Users</span>
                                </button>
                            </li>
                            <li className="nav-item w-100 mb-1">
                                <button
                                    className={`nav-link align-middle px-3 w-100 text-start text-white ${activeTab === 'groups' ? 'active bg-primary' : ''}`}
                                    onClick={() => onTabChange('groups')}
                                    style={{ borderRadius: '6px' }}
                                >
                                    <span className="me-2">📁</span>
                                    <span className="d-none d-sm-inline">User Groups</span>
                                </button>
                            </li>
                            <li className="nav-item w-100 mb-3">
                                <button
                                    className={`nav-link align-middle px-3 w-100 text-start text-white ${activeTab === 'roles' ? 'active bg-primary' : ''}`}
                                    onClick={() => onTabChange('roles')}
                                    style={{ borderRadius: '6px' }}
                                >
                                    <span className="me-2">🛡️</span>
                                    <span className="d-none d-sm-inline">Roles & Permissions</span>
                                </button>
                            </li>

                            <li className="nav-item w-100 mb-1 mt-3">
                                <small className="text-uppercase text-white-50 fw-bold px-3 d-none d-sm-block mb-2" style={{ fontSize: '0.75rem' }}>Lists</small>
                            </li>
                            <li className="nav-item w-100">
                                <button
                                    className={`nav-link align-middle px-3 w-100 text-start text-white ${activeTab === 'departments' ? 'active bg-primary' : ''}`}
                                    onClick={() => onTabChange('departments')}
                                    style={{ borderRadius: '6px' }}
                                >
                                    <span className="me-2">🏢</span>
                                    <span className="d-none d-sm-inline">Departments</span>
                                </button>
                            </li>
                            <li className="nav-item w-100">
                                <button
                                    className={`nav-link align-middle px-3 w-100 text-start text-white ${activeTab === 'locations' ? 'active bg-primary' : ''}`}
                                    onClick={() => onTabChange('locations')}
                                    style={{ borderRadius: '6px' }}
                                >
                                    <span className="me-2">📍</span>
                                    <span className="d-none d-sm-inline">Locations</span>
                                </button>
                            </li>
                            <li className="nav-item w-100">
                                <button
                                    className={`nav-link align-middle px-3 w-100 text-start text-white ${activeTab === 'types' ? 'active bg-primary' : ''}`}
                                    onClick={() => onTabChange('types')}
                                    style={{ borderRadius: '6px' }}
                                >
                                    <span className="me-2">🏷️</span>
                                    <span className="d-none d-sm-inline">Asset Types</span>
                                </button>
                            </li>
                        </ul>
                        <hr className="w-100 text-white" />
                        <div className="dropdown pb-4">
                            <a href="#" className="d-flex align-items-center text-white text-decoration-none dropdown-toggle" id="dropdownUser1" data-bs-toggle="dropdown" aria-expanded="false">
                                <div className="rounded-circle bg-secondary d-flex align-items-center justify-content-center text-white me-2" style={{ width: 32, height: 32 }}>AD</div>
                                <span className="d-none d-sm-inline mx-1">Admin User</span>
                            </a>
                        </div>
                    </div>
                </div>
                <div className="col py-3 bg-body-tertiary" style={{ height: '100vh', overflowY: 'auto' }}>
                    <header className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom border-secondary">
                        <h1 className="h3 mb-0">
                            {activeTab === 'dashboard' ? 'Overview' :
                                activeTab === 'assets' ? 'Asset Inventory' :
                                    activeTab === 'accessories' ? 'Accessory Management' :
                                        activeTab === 'procurement' ? 'Procurement & Reconciliation' :
                                            activeTab === 'reports' ? 'Reporting & Exports' :
                                                activeTab === 'users' ? 'User Management' :
                                                    activeTab === 'groups' ? 'User Groups' :
                                                        activeTab === 'roles' ? 'Roles & Permissions' :
                                                            activeTab === 'licenses' ? 'License Management' :
                                                                activeTab === 'departments' ? 'Departments' :
                                                                    activeTab === 'locations' ? 'Locations' :
                                                                        activeTab === 'history' ? 'Activity Log' : 'Asset Types'}
                        </h1>
                        <div className="d-flex gap-3">
                            <button className="btn btn-outline-secondary border-0 position-relative">
                                🔔
                                <span className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle">
                                    <span className="visually-hidden">New alerts</span>
                                </span>
                            </button>
                            <button className="btn btn-outline-secondary border-0">⚙️</button>
                        </div>
                    </header>
                    {children}
                </div>
            </div >
        </div >
    );
};
