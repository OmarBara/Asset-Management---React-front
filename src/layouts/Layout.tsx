import { useState, type ReactNode } from 'react';
import { useAuth } from '../providers/AuthContext';

interface LayoutProps {
    children: ReactNode;
    activeTab: 'dashboard' | 'assets' | 'accessories' | 'components' | 'procurement' | 'departments' | 'locations' | 'types' | 'history' | 'licenses' | 'reports' | 'users' | 'groups' | 'roles';
    onTabChange: (tab: 'dashboard' | 'assets' | 'accessories' | 'components' | 'procurement' | 'departments' | 'locations' | 'types' | 'history' | 'licenses' | 'reports' | 'users' | 'groups' | 'roles') => void;
}

export const Layout = ({ children, activeTab, onTabChange }: LayoutProps) => {
    const { user: authUser, logout } = useAuth();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);

    const toggleDropdown = (name: string) => {
        setOpenDropdown(openDropdown === name ? null : name);
    };

    const isTabInManagement = ['history', 'procurement'].includes(activeTab);
    const isTabInAdmin = ['users', 'groups', 'roles'].includes(activeTab);
    const isTabInLists = ['departments', 'locations', 'types'].includes(activeTab);

    return (
        <div className="container-fluid">
            <div className="row flex-nowrap">
                <div className={`col-auto px-0 bg-dark border-end border-secondary sidebar ${isCollapsed ? 'sidebar-collapsed' : ''}`} style={{ width: isCollapsed ? '80px' : '260px' }}>
                    <div className="d-flex flex-column align-items-center align-items-sm-start px-3 pt-2 text-white min-vh-100">
                        <div className={`d-flex align-items-center w-100 pb-3 mb-md-0 me-md-auto text-decoration-none ${isCollapsed ? 'justify-content-center' : 'justify-content-between'}`}>
                            <span className="fs-5 fw-bold sidebar-label">AssetFlow</span>
                            <button className="sidebar-toggle-btn d-none d-md-block" onClick={() => setIsCollapsed(!isCollapsed)}>
                                ☰
                            </button>
                        </div>
                        <ul className="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start w-100" id="menu">
                            <li className="nav-item w-100 mb-1">
                                <button
                                    className={`nav-link align-middle px-3 w-100 text-start text-white border-0 bg-transparent ${activeTab === 'dashboard' ? 'active bg-primary' : ''}`}
                                    onClick={() => onTabChange('dashboard')}
                                    style={{ borderRadius: '6px' }}
                                >
                                    <span className={isCollapsed ? '' : 'me-2'}>📊</span>
                                    <span className="sidebar-label">Dashboard</span>
                                </button>
                            </li>
                            <li className="nav-item w-100 mb-1">
                                <button
                                    className={`nav-link align-middle px-3 w-100 text-start text-white border-0 bg-transparent ${activeTab === 'assets' ? 'active bg-primary' : ''}`}
                                    onClick={() => onTabChange('assets')}
                                    style={{ borderRadius: '6px' }}
                                >
                                    <span className={isCollapsed ? '' : 'me-2'}>📦</span>
                                    <span className="sidebar-label">Assets</span>
                                </button>
                            </li>
                            <li className="nav-item w-100 mb-1">
                                <button
                                    className={`nav-link align-middle px-3 w-100 text-start text-white border-0 bg-transparent ${activeTab === 'licenses' ? 'active bg-primary' : ''}`}
                                    onClick={() => onTabChange('licenses')}
                                    style={{ borderRadius: '6px' }}
                                >
                                    <span className={isCollapsed ? '' : 'me-2'}>🔑</span>
                                    <span className="sidebar-label">Licenses</span>
                                </button>
                            </li>
                            <li className="nav-item w-100 mb-1">
                                <button
                                    className={`nav-link align-middle px-3 w-100 text-start text-white border-0 bg-transparent ${activeTab === 'accessories' ? 'active bg-primary' : ''}`}
                                    onClick={() => onTabChange('accessories')}
                                    style={{ borderRadius: '6px' }}
                                >
                                    <span className={isCollapsed ? '' : 'me-2'}>⌨️</span>
                                    <span className="sidebar-label">Accessories</span>
                                </button>
                            </li>
                            <li className="nav-item w-100 mb-1">
                                <button
                                    className={`nav-link align-middle px-3 w-100 text-start text-white border-0 bg-transparent ${activeTab === 'components' ? 'active bg-primary' : ''}`}
                                    onClick={() => onTabChange('components')}
                                    style={{ borderRadius: '6px' }}
                                >
                                    <span className={isCollapsed ? '' : 'me-2'}>🔌</span>
                                    <span className="sidebar-label">Components</span>
                                </button>
                            </li>
                            <li className="nav-item w-100 mb-1">
                                <button
                                    className={`nav-link align-middle px-3 w-100 text-start text-white border-0 bg-transparent ${activeTab === 'reports' ? 'active bg-primary' : ''}`}
                                    onClick={() => onTabChange('reports')}
                                    style={{ borderRadius: '6px' }}
                                >
                                    <span className={isCollapsed ? '' : 'me-2'}>📊</span>
                                    <span className="sidebar-label">Reports</span>
                                </button>
                            </li>

                            {/* Management Dropdown */}
                            <li className="nav-item w-100 mb-1 mt-1">
                                <button
                                    className={`nav-link align-middle px-3 w-100 text-start text-white border-0 bg-transparent dropdown-toggle ${isTabInManagement ? 'text-primary' : ''} ${openDropdown === 'management' || isTabInManagement ? 'is-open' : ''}`}
                                    onClick={() => toggleDropdown('management')}
                                    style={{ borderRadius: '6px' }}
                                >
                                    <span className={isCollapsed ? '' : 'me-2'}>⚙️</span>
                                    <span className="sidebar-label">Management</span>
                                </button>
                                <ul className={`nav flex-column ms-3 mt-1 dropdown-container ${openDropdown === 'management' || isTabInManagement ? 'is-open' : ''}`}>
                                    <li className="w-100">
                                        <button className={`nav-link px-3 text-white border-0 bg-transparent w-100 text-start small ${activeTab === 'history' ? 'text-primary' : ''}`} onClick={() => onTabChange('history')}>
                                            🕒 Asset History
                                        </button>
                                    </li>
                                    <li className="w-100">
                                        <button className={`nav-link px-3 text-white border-0 bg-transparent w-100 text-start small ${activeTab === 'procurement' ? 'text-primary' : ''}`} onClick={() => onTabChange('procurement')}>
                                            📜 Procurement
                                        </button>
                                    </li>
                                </ul>
                            </li>

                            {/* Administration Dropdown */}
                            <li className="nav-item w-100 mb-1">
                                <button
                                    className={`nav-link align-middle px-3 w-100 text-start text-white border-0 bg-transparent dropdown-toggle ${isTabInAdmin ? 'text-primary' : ''} ${openDropdown === 'admin' || isTabInAdmin ? 'is-open' : ''}`}
                                    onClick={() => toggleDropdown('admin')}
                                    style={{ borderRadius: '6px' }}
                                >
                                    <span className={isCollapsed ? '' : 'me-2'}>🛡️</span>
                                    <span className="sidebar-label">Administration</span>
                                </button>
                                <ul className={`nav flex-column ms-3 mt-1 dropdown-container ${openDropdown === 'admin' || isTabInAdmin ? 'is-open' : ''}`}>
                                    <li className="w-100">
                                        <button className={`nav-link px-3 text-white border-0 bg-transparent w-100 text-start small ${activeTab === 'users' ? 'text-primary' : ''}`} onClick={() => onTabChange('users')}>
                                            👥 Users
                                        </button>
                                    </li>
                                    <li className="w-100">
                                        <button className={`nav-link px-3 text-white border-0 bg-transparent w-100 text-start small ${activeTab === 'groups' ? 'text-primary' : ''}`} onClick={() => onTabChange('groups')}>
                                            📁 User Groups
                                        </button>
                                    </li>
                                    <li className="w-100">
                                        <button className={`nav-link px-3 text-white border-0 bg-transparent w-100 text-start small ${activeTab === 'roles' ? 'text-primary' : ''}`} onClick={() => onTabChange('roles')}>
                                            🛡️ Roles & Permissions
                                        </button>
                                    </li>
                                </ul>
                            </li>

                            {/* Lists Dropdown */}
                            <li className="nav-item w-100 mb-1">
                                <button
                                    className={`nav-link align-middle px-3 w-100 text-start text-white border-0 bg-transparent dropdown-toggle ${isTabInLists ? 'text-primary' : ''} ${openDropdown === 'lists' || isTabInLists ? 'is-open' : ''}`}
                                    onClick={() => toggleDropdown('lists')}
                                    style={{ borderRadius: '6px' }}
                                >
                                    <span className={isCollapsed ? '' : 'me-2'}>📑</span>
                                    <span className="sidebar-label">Lists</span>
                                </button>
                                <ul className={`nav flex-column ms-3 mt-1 dropdown-container ${openDropdown === 'lists' || isTabInLists ? 'is-open' : ''}`}>
                                    <li className="w-100">
                                        <button className={`nav-link px-3 text-white border-0 bg-transparent w-100 text-start small ${activeTab === 'departments' ? 'text-primary' : ''}`} onClick={() => onTabChange('departments')}>
                                            🏢 Departments
                                        </button>
                                    </li>
                                    <li className="w-100">
                                        <button className={`nav-link px-3 text-white border-0 bg-transparent w-100 text-start small ${activeTab === 'locations' ? 'text-primary' : ''}`} onClick={() => onTabChange('locations')}>
                                            📍 Locations
                                        </button>
                                    </li>
                                    <li className="w-100">
                                        <button className={`nav-link px-3 text-white border-0 bg-transparent w-100 text-start small ${activeTab === 'types' ? 'text-primary' : ''}`} onClick={() => onTabChange('types')}>
                                            🏷️ Asset Types
                                        </button>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                        <hr className="w-100 text-white" />
                        <div className="dropdown pb-4 w-100">
                            <a href="#" className="d-flex align-items-center text-white text-decoration-none dropdown-toggle px-3" id="dropdownUser1" data-bs-toggle="dropdown" aria-expanded="false">
                                <div className="rounded-circle bg-secondary d-flex align-items-center justify-content-center text-white me-2" style={{ width: 32, height: 32, flexShrink: 0 }}>
                                    {authUser?.name.charAt(0)}
                                </div>
                                <span className="sidebar-label mx-1">{authUser?.name}</span>
                            </a>
                            <ul className="dropdown-menu dropdown-menu-dark text-small shadow" aria-labelledby="dropdownUser1">
                                <li><a className="dropdown-item" href="#">Profile</a></li>
                                <li><a className="dropdown-item" href="#">Settings</a></li>
                                <li><hr className="dropdown-divider" /></li>
                                <li><button className="dropdown-item text-danger" onClick={logout}>Sign out</button></li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="col py-3 bg-body-tertiary" style={{ height: '100vh', overflowY: 'auto' }}>
                    <header className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom border-secondary">
                        <h1 className="h3 mb-0">
                            {activeTab === 'dashboard' ? 'Overview' :
                                activeTab === 'assets' ? 'Asset Inventory' :
                                    activeTab === 'accessories' ? 'Accessory Management' :
                                        activeTab === 'procurement' ? 'Procurement' :
                                            activeTab === 'reports' ? 'Reporting' :
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
                            <div className="dropdown">
                                <button className="btn btn-outline-secondary border-0 dropdown-toggle no-caret" id="topSettingsDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                                    ⚙️
                                </button>
                                <ul className="dropdown-menu dropdown-menu-dark dropdown-menu-end shadow" aria-labelledby="topSettingsDropdown">
                                    <li><h6 className="dropdown-header">{authUser?.name}</h6></li>
                                    <li><a className="dropdown-item" href="#">Profile Settings</a></li>
                                    <li><hr className="dropdown-divider" /></li>
                                    <li>
                                        <button className="dropdown-item text-danger" onClick={logout}>
                                            🚪 Sign Out
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </header>
                    {children}
                </div>
            </div >
        </div >
    );
};
