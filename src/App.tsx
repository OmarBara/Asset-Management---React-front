import { useState, useMemo } from 'react';
import { Layout } from './layouts/Layout';
import { StatCard } from './components/shared/StatCard';
import { AssetTable } from './features/assets/AssetTable';
import { Button } from './components/shared/Button';
import { Modal } from './components/shared/Modal';
import { AssetForm } from './features/assets/AssetForm';
import { LicenseForm } from './features/licenses/LicenseForm';
import { LicenseTable } from './features/licenses/LicenseTable';
import { ListManager } from './components/shared/ListManager';
import { HistoryView } from './features/history/HistoryView';
import { ReportsView } from './features/reports/ReportsView';
import { UserView } from './features/users/UserView';
import { GroupsView } from './features/users/GroupsView';
import { RolesView } from './features/users/RolesView';
import { GlobalHistoryView } from './features/history/GlobalHistoryView';
import { useAuth } from './providers/AuthContext';
import { LoginView } from './features/auth/LoginView';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { QRCodeTag } from './components/shared/QRCodeTag';
import { AccessoryForm } from './features/accessories/AccessoryForm';
import { AccessoryTable } from './features/accessories/AccessoryTable';
import { ComponentForm } from './features/components/ComponentForm';
import { ComponentTable } from './features/components/ComponentTable';
import { ProcurementTable } from './features/procurement/ProcurementTable';
import { ProcurementForm } from './features/procurement/ProcurementForm';
import { ReconciliationReport } from './features/procurement/ReconciliationReport';
import { useAppContext } from './providers/AppContext';
import type { Asset, MasterLicense, LicenseSeat, Accessory, HardwareComponent, ProcurementBatch } from './types';

function App() {
  const { state, dispatch } = useAppContext();
  const { assets, masterLicenses, licenseSeats, accessories, components, procurementBatches, departments, locations, assetTypes } = state;

  const [activeTab, setActiveTab] = useState<'dashboard' | 'assets' | 'accessories' | 'components' | 'procurement' | 'departments' | 'locations' | 'types' | 'history' | 'licenses' | 'reports' | 'users' | 'groups' | 'roles'>('dashboard');
  const [searchFilters, setSearchFilters] = useState({
    assets: { id: '', name: '', date: '' },
    licenses: { name: '', manufacturer: '' },
    accessories: { name: '', type: '' },
    components: { name: '', serial: '' }
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);
  const [editingLicense, setEditingLicense] = useState<MasterLicense | null>(null);
  const [editingAccessory, setEditingAccessory] = useState<Accessory | null>(null);
  const [editingComponent, setEditingComponent] = useState<HardwareComponent | null>(null);
  const [editingBatch, setEditingBatch] = useState<ProcurementBatch | null>(null);
  const [viewingHistory, setViewingHistory] = useState<{ type: string, item: any } | null>(null);
  const [printingAsset, setPrintingAsset] = useState<Asset | null>(null);

  // Statistics
  const stats = useMemo(() => {
    const assetValue = assets.reduce((sum, asset) => sum + asset.purchaseCost, 0);
    const accessoryValue = accessories.reduce((sum, acc) => sum + (acc.totalQty * acc.unitCost), 0);
    const componentValue = components.reduce((sum, comp) => sum + (comp.totalQty * comp.unitCost), 0);
    const totalValue = assetValue + accessoryValue + componentValue;

    const activeCount = assets.filter(a => a.status === 'active').length;
    const assignedSeats = licenseSeats.filter(s => s.status === 'assigned').length;

    return {
      totalAssets: assets.length,
      totalLicenses: masterLicenses.length,
      totalAccessories: accessories.length,
      totalComponents: components.length,
      assignedSeats,
      totalSeats: licenseSeats.length,
      totalValue,
      activeCount,
      expiringLicenses: masterLicenses.filter(l => l.status === 'expiring').length
    };
  }, [assets, masterLicenses, licenseSeats, accessories, components]);

  // Asset Handlers
  const handleAddAsset = (data: Omit<Asset, 'id'>, licenseAssignments: string[]) => {
    const newAsset: Asset = { ...data, id: crypto.randomUUID(), assignedLicenses: licenseAssignments };
    dispatch({ type: 'ADD_ASSET', payload: newAsset });
    setIsModalOpen(false);
  };

  const handleUpdateAsset = (data: Omit<Asset, 'id'>, licenseAssignments: string[]) => {
    if (!editingAsset) return;
    dispatch({ type: 'UPDATE_ASSET', payload: { ...data, id: editingAsset.id, assignedLicenses: licenseAssignments } as Asset });
    setIsModalOpen(false);
    setEditingAsset(null);
  };

  const handleDeleteAsset = (id: string) => {
    if (confirm('Are you sure you want to delete this asset?')) {
      dispatch({ type: 'DELETE_ASSET', payload: id });
    }
  };

  // License Handlers
  const handleAddLicense = (data: Omit<MasterLicense, 'id'>, initialSeats: Omit<LicenseSeat, 'id' | 'masterLicenseId'>[]) => {
    const masterId = crypto.randomUUID();
    const license: MasterLicense = { ...data, id: masterId };
    const seats: LicenseSeat[] = initialSeats.map(s => ({ ...s, id: crypto.randomUUID(), masterLicenseId: masterId }));
    dispatch({ type: 'ADD_LICENSE', payload: { license, seats } });
    setIsModalOpen(false);
  };

  const handleUpdateLicense = (data: Omit<MasterLicense, 'id'>) => {
    if (!editingLicense) return;
    dispatch({ type: 'UPDATE_LICENSE', payload: { ...data, id: editingLicense.id } as MasterLicense });
    setIsModalOpen(false);
    setEditingLicense(null);
  };

  const handleDeleteLicense = (id: string) => {
    if (confirm('Are you sure you want to delete this license and all its seats?')) {
      dispatch({ type: 'DELETE_LICENSE', payload: id });
    }
  };

  const handleUpdateSeat = (seatId: string, updates: Partial<LicenseSeat>) => {
    const seat = licenseSeats.find(s => s.id === seatId);
    if (seat) dispatch({ type: 'UPDATE_SEAT', payload: { ...seat, ...updates } });
  };

  // Accessory Handlers
  const handleAddAccessory = (data: Omit<Accessory, 'id'>) => {
    const newAcc: Accessory = { ...data, id: crypto.randomUUID() };
    dispatch({ type: 'SET_ACCESSORIES', payload: [newAcc, ...accessories] }); // Simple SET for now
    setIsModalOpen(false);
  };

  const handleUpdateAccessory = (data: Omit<Accessory, 'id'>) => {
    if (!editingAccessory) return;
    dispatch({ type: 'UPDATE_ACCESSORY', payload: { ...data, id: editingAccessory.id } as Accessory });
    setIsModalOpen(false);
    setEditingAccessory(null);
  };

  const handleDeleteAccessory = (id: string) => {
    if (confirm('Are you sure you want to delete this accessory?')) {
      dispatch({ type: 'SET_ACCESSORIES', payload: accessories.filter(a => a.id !== id) });
    }
  };

  const handleCheckoutAccessory = (acc: Accessory) => {
    dispatch({ type: 'UPDATE_ACCESSORY', payload: { ...acc, checkedOutQty: acc.checkedOutQty + 1 } });
  };

  const handleCheckinAccessory = (acc: Accessory) => {
    if (acc.checkedOutQty > 0) {
      dispatch({ type: 'UPDATE_ACCESSORY', payload: { ...acc, checkedOutQty: acc.checkedOutQty - 1 } });
    }
  };

  // Component Handlers
  const handleAddComponent = (data: Omit<HardwareComponent, 'id'>) => {
    const newComp: HardwareComponent = { ...data, id: crypto.randomUUID() };
    dispatch({ type: 'SET_COMPONENTS', payload: [newComp, ...components] });
    setIsModalOpen(false);
  };

  const handleUpdateComponent = (data: Omit<HardwareComponent, 'id'>) => {
    if (!editingComponent) return;
    dispatch({ type: 'UPDATE_COMPONENT', payload: { ...data, id: editingComponent.id } as HardwareComponent });
    setIsModalOpen(false);
    setEditingComponent(null);
  };

  const handleDeleteComponent = (id: string) => {
    if (confirm('Are you sure you want to delete this component?')) {
      dispatch({ type: 'DELETE_COMPONENT', payload: id });
    }
  };

  // Filtering Logic
  const filteredAssets = useMemo(() => {
    return assets.filter(asset => {
      const filters = searchFilters.assets;
      const matchId = !filters.id || asset.assetTag.toLowerCase().includes(filters.id.toLowerCase()) || asset.id.toLowerCase().includes(filters.id.toLowerCase());
      const matchName = !filters.name || asset.name.toLowerCase().includes(filters.name.toLowerCase());
      const matchDate = !filters.date || asset.purchaseDate.includes(filters.date);
      return matchId && matchName && matchDate;
    });
  }, [assets, searchFilters.assets]);

  const filteredLicenses = useMemo(() => {
    return masterLicenses.filter(license => {
      const filters = searchFilters.licenses;
      const matchName = !filters.name || license.name.toLowerCase().includes(filters.name.toLowerCase());
      const matchManufacturer = !filters.manufacturer || license.manufacturer.toLowerCase().includes(filters.manufacturer.toLowerCase());
      return matchName && matchManufacturer;
    });
  }, [masterLicenses, searchFilters.licenses]);

  const filteredAccessories = useMemo(() => {
    return accessories.filter(acc => {
      const filters = searchFilters.accessories;
      const matchName = !filters.name || acc.name.toLowerCase().includes(filters.name.toLowerCase());
      const matchType = !filters.type || acc.category.toLowerCase().includes(filters.type.toLowerCase());
      return matchName && matchType;
    });
  }, [accessories, searchFilters.accessories]);

  const filteredComponents = useMemo(() => {
    return components.filter(comp => {
      const filters = searchFilters.components;
      const matchName = !filters.name || comp.name.toLowerCase().includes(filters.name.toLowerCase());
      const matchSerial = !filters.serial || comp.serial.toLowerCase().includes(filters.serial.toLowerCase());
      return matchName && matchSerial;
    });
  }, [components, searchFilters.components]);

  const handleScanQR = () => {
    const mockId = prompt("Enter Asset Tag or Scan QR Code (Mock):");
    if (mockId) {
      setSearchFilters(prev => ({ ...prev, assets: { ...prev.assets, id: mockId } }));
    }
  };

  const clearFilters = (entity: keyof typeof searchFilters) => {
    setSearchFilters(prev => ({
      ...prev,
      [entity]: entity === 'assets' ? { id: '', name: '', date: '' } :
        entity === 'licenses' ? { name: '', manufacturer: '' } :
          entity === 'accessories' ? { name: '', type: '' } :
            { name: '', serial: '' }
    }));
  };

  const handleCheckoutComponent = (comp: HardwareComponent) => {
    if (comp.remainingQty > 0) {
      dispatch({ type: 'UPDATE_COMPONENT', payload: { ...comp, remainingQty: comp.remainingQty - 1 } });
    }
  };

  const handleCheckinComponent = (comp: HardwareComponent) => {
    if (comp.remainingQty < comp.totalQty) {
      dispatch({ type: 'UPDATE_COMPONENT', payload: { ...comp, remainingQty: comp.remainingQty + 1 } });
    }
  };

  // Procurement Handlers
  const handleAddBatch = (data: Omit<ProcurementBatch, 'id'>) => {
    dispatch({ type: 'ADD_BATCH', payload: { ...data, id: crypto.randomUUID() } as ProcurementBatch });
    setIsModalOpen(false);
  };

  const handleUpdateBatch = (data: Omit<ProcurementBatch, 'id'>) => {
    if (!editingBatch) return;
    dispatch({ type: 'UPDATE_BATCH', payload: { ...data, id: editingBatch.id } as ProcurementBatch });
    setIsModalOpen(false);
    setEditingBatch(null);
  };

  const handleDeleteBatch = (id: string) => {
    if (confirm('Are you sure you want to delete this batch?')) {
      dispatch({ type: 'DELETE_BATCH', payload: id });
    }
  };

  // Modal State Management
  const openAddModal = () => {
    setEditingAsset(null);
    setEditingLicense(null);
    setEditingAccessory(null);
    setEditingComponent(null);
    setEditingBatch(null);
    setIsModalOpen(true);
  };

  const openAssetEditModal = (asset: Asset) => {
    setEditingAsset(asset);
    setIsModalOpen(true);
  };

  const openLicenseEditModal = (license: MasterLicense) => {
    setEditingLicense(license);
    setIsModalOpen(true);
  };

  const openAccessoryEditModal = (acc: Accessory) => {
    setEditingAccessory(acc);
    setIsModalOpen(true);
  };

  const openComponentEditModal = (comp: HardwareComponent) => {
    setEditingComponent(comp);
    setIsModalOpen(true);
  };

  const openBatchEditModal = (batch: ProcurementBatch) => {
    setEditingBatch(batch);
    setIsModalOpen(true);
  };

  const openHistoryModal = (type: string, item: any) => {
    setViewingHistory({ type, item });
    setIsHistoryModalOpen(true);
  };

  const handlePrintAsset = (asset: Asset) => {
    setPrintingAsset(asset);
    setIsPrintModalOpen(true);
  };

  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <LoginView />;
  }

  return (
    <ProtectedRoute>
      <Layout activeTab={activeTab} onTabChange={setActiveTab}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div></div>
          {(['assets', 'licenses', 'accessories', 'components', 'procurement'].includes(activeTab)) && (
            <Button onClick={openAddModal} variant="primary">
              + Add {activeTab === 'assets' ? 'Asset' : activeTab === 'accessories' ? 'Accessory' : activeTab === 'components' ? 'Component' : activeTab === 'procurement' ? 'Batch' : 'License'}
            </Button>
          )}
        </div>

        {activeTab === 'dashboard' && (
          <>
            <div className="row g-4 mb-4">
              <div className="col-md-3"><StatCard title="Total Assets" value={stats.totalAssets} icon="📦" /></div>
              <div className="col-md-3"><StatCard title="Licenses" value={stats.totalLicenses} icon="🔑" /></div>
              <div className="col-md-3"><StatCard title="Accessories" value={stats.totalAccessories} icon="⌨️" /></div>
              <div className="col-md-3"><StatCard title="Inventory Value" value={`$${stats.totalValue.toLocaleString()}`} icon="💰" /></div>
            </div>
            <div className="card bg-dark border-secondary">
              <div className="card-header border-secondary"><h5 className="mb-0">Recent Assets</h5></div>
              <div className="card-body">
                <AssetTable assets={assets.slice(0, 5)} onEdit={openAssetEditModal} onDelete={handleDeleteAsset} onViewHistory={(a) => openHistoryModal('asset', a)} onPrint={handlePrintAsset} />
              </div>
            </div>
          </>
        )}

        {activeTab === 'assets' && (
          <div className="assets-view">
            <div className="card bg-dark border-secondary mb-4">
              <div className="card-body">
                <div className="row g-3 align-items-end">
                  <div className="col-md-3">
                    <label className="form-label small text-secondary fw-bold">SEARCH BY NAME</label>
                    <input
                      type="text"
                      className="form-control bg-dark text-white border-secondary"
                      placeholder="e.g. MacBook Pro"
                      value={searchFilters.assets.name}
                      onChange={(e) => setSearchFilters(prev => ({ ...prev, assets: { ...prev.assets, name: e.target.value } }))}
                    />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label small text-secondary fw-bold">ASSET ID / TAG</label>
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control bg-dark text-white border-secondary"
                        placeholder="e.g. ASSET-001"
                        value={searchFilters.assets.id}
                        onChange={(e) => setSearchFilters(prev => ({ ...prev, assets: { ...prev.assets, id: e.target.value } }))}
                      />
                      <button className="btn btn-outline-secondary border-secondary" onClick={handleScanQR} title="Scan QR Code">
                        📷
                      </button>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <label className="form-label small text-secondary fw-bold">PURCHASE DATE</label>
                    <input
                      type="date"
                      className="form-control bg-dark text-white border-secondary"
                      value={searchFilters.assets.date}
                      onChange={(e) => setSearchFilters(prev => ({ ...prev, assets: { ...prev.assets, date: e.target.value } }))}
                    />
                  </div>
                  <div className="col-md-3 d-flex gap-2">
                    <Button variant="secondary" className="flex-grow-1" onClick={() => clearFilters('assets')}>Reset</Button>
                  </div>
                </div>
              </div>
            </div>
            <AssetTable assets={filteredAssets} onEdit={openAssetEditModal} onDelete={handleDeleteAsset} onViewHistory={(a) => openHistoryModal('asset', a)} onPrint={handlePrintAsset} />
          </div>
        )}
        {activeTab === 'licenses' && (
          <div className="licenses-view">
            <div className="card bg-dark border-secondary mb-4">
              <div className="card-body">
                <div className="row g-3 align-items-end">
                  <div className="col-md-4">
                    <label className="form-label small text-secondary fw-bold">SOFTWARE NAME</label>
                    <input
                      type="text"
                      className="form-control bg-dark text-white border-secondary"
                      placeholder="e.g. Office 365"
                      value={searchFilters.licenses.name}
                      onChange={(e) => setSearchFilters(prev => ({ ...prev, licenses: { ...prev.licenses, name: e.target.value } }))}
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label small text-secondary fw-bold">MANUFACTURER</label>
                    <input
                      type="text"
                      className="form-control bg-dark text-white border-secondary"
                      placeholder="e.g. Microsoft"
                      value={searchFilters.licenses.manufacturer}
                      onChange={(e) => setSearchFilters(prev => ({ ...prev, licenses: { ...prev.licenses, manufacturer: e.target.value } }))}
                    />
                  </div>
                  <div className="col-md-4 d-flex gap-2">
                    <Button variant="secondary" className="flex-grow-1" onClick={() => clearFilters('licenses')}>Reset</Button>
                  </div>
                </div>
              </div>
            </div>
            <LicenseTable masterLicenses={filteredLicenses} seats={licenseSeats} assets={assets} onEdit={openLicenseEditModal} onDelete={handleDeleteLicense} onUpdateSeat={handleUpdateSeat} onViewHistory={(l) => openHistoryModal('license', l)} onViewSeatHistory={(s) => openHistoryModal('seat', s)} />
          </div>
        )}
        {activeTab === 'accessories' && (
          <div className="accessories-view">
            <div className="card bg-dark border-secondary mb-4">
              <div className="card-body">
                <div className="row g-3 align-items-end">
                  <div className="col-md-4">
                    <label className="form-label small text-secondary fw-bold">ACCESSORY NAME</label>
                    <input
                      type="text"
                      className="form-control bg-dark text-white border-secondary"
                      placeholder="e.g. Wireless Mouse"
                      value={searchFilters.accessories.name}
                      onChange={(e) => setSearchFilters(prev => ({ ...prev, accessories: { ...prev.accessories, name: e.target.value } }))}
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label small text-secondary fw-bold">CATEGORY</label>
                    <input
                      type="text"
                      className="form-control bg-dark text-white border-secondary"
                      placeholder="e.g. Peripherals"
                      value={searchFilters.accessories.type}
                      onChange={(e) => setSearchFilters(prev => ({ ...prev, accessories: { ...prev.accessories, type: e.target.value } }))}
                    />
                  </div>
                  <div className="col-md-4 d-flex gap-2">
                    <Button variant="secondary" className="flex-grow-1" onClick={() => clearFilters('accessories')}>Reset</Button>
                  </div>
                </div>
              </div>
            </div>
            <AccessoryTable accessories={filteredAccessories} onEdit={openAccessoryEditModal} onDelete={handleDeleteAccessory} onCheckout={handleCheckoutAccessory} onCheckin={handleCheckinAccessory} onViewHistory={(acc) => openHistoryModal('accessory', acc)} />
          </div>
        )}
        {activeTab === 'components' && (
          <div className="components-view">
            <div className="card bg-dark border-secondary mb-4">
              <div className="card-body">
                <div className="row g-3 align-items-end">
                  <div className="col-md-4">
                    <label className="form-label small text-secondary fw-bold">COMPONENT NAME</label>
                    <input
                      type="text"
                      className="form-control bg-dark text-white border-secondary"
                      placeholder="e.g. 16GB RAM"
                      value={searchFilters.components.name}
                      onChange={(e) => setSearchFilters(prev => ({ ...prev, components: { ...prev.components, name: e.target.value } }))}
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label small text-secondary fw-bold">SERIAL NUMBER</label>
                    <input
                      type="text"
                      className="form-control bg-dark text-white border-secondary"
                      placeholder="e.g. SN-12345"
                      value={searchFilters.components.serial}
                      onChange={(e) => setSearchFilters(prev => ({ ...prev, components: { ...prev.components, serial: e.target.value } }))}
                    />
                  </div>
                  <div className="col-md-4 d-flex gap-2">
                    <Button variant="secondary" className="flex-grow-1" onClick={() => clearFilters('components')}>Reset</Button>
                  </div>
                </div>
              </div>
            </div>
            <ComponentTable components={filteredComponents} onEdit={openComponentEditModal} onDelete={handleDeleteComponent} onCheckout={handleCheckoutComponent} onCheckin={handleCheckinComponent} onViewHistory={(comp) => openHistoryModal('component', comp)} />
          </div>
        )}
        {activeTab === 'procurement' && (
          <>
            <ReconciliationReport batches={procurementBatches} />
            <ProcurementTable batches={procurementBatches} onEdit={openBatchEditModal} onDelete={handleDeleteBatch} onUpdateStatus={(batch, status) => dispatch({ type: 'UPDATE_BATCH', payload: { ...batch, status } })} />
          </>
        )}
        {activeTab === 'reports' && <ReportsView />}
        {activeTab === 'users' && <UserView />}
        {activeTab === 'groups' && <GroupsView />}
        {activeTab === 'roles' && <RolesView />}
        {activeTab === 'history' && <GlobalHistoryView assets={assets} masterLicenses={masterLicenses} seats={licenseSeats} accessories={accessories} components={components} />}

        {activeTab === 'departments' && <ListManager title="Departments" items={departments} onAdd={(item) => dispatch({ type: 'SET_DEPARTMENTS', payload: [...departments, item].sort() })} onDelete={(item) => dispatch({ type: 'SET_DEPARTMENTS', payload: departments.filter(i => i !== item) })} />}
        {activeTab === 'locations' && <ListManager title="Locations" items={locations} onAdd={(item) => dispatch({ type: 'SET_LOCATIONS', payload: [...locations, item].sort() })} onDelete={(item) => dispatch({ type: 'SET_LOCATIONS', payload: locations.filter(i => i !== item) })} />}
        {activeTab === 'types' && <ListManager title="Asset Types" items={assetTypes} onAdd={(item) => dispatch({ type: 'SET_ASSET_TYPES', payload: [...assetTypes, item].sort() })} onDelete={(item) => dispatch({ type: 'SET_ASSET_TYPES', payload: assetTypes.filter(i => i !== item) })} />}

        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingAsset ? 'Edit Asset' : 'Add Item'}>
          {activeTab === 'assets' || editingAsset ? <AssetForm initialData={editingAsset} onSubmit={editingAsset ? handleUpdateAsset : handleAddAsset} onCancel={() => setIsModalOpen(false)} departments={departments} locations={locations} types={assetTypes} masterLicenses={masterLicenses} licenseSeats={licenseSeats} /> :
            activeTab === 'licenses' || editingLicense ? <LicenseForm initialData={editingLicense} onSubmit={editingLicense ? handleUpdateLicense : handleAddLicense} onCancel={() => setIsModalOpen(false)} /> :
              activeTab === 'accessories' || editingAccessory ? <AccessoryForm initialData={editingAccessory} onSubmit={editingAccessory ? handleUpdateAccessory : handleAddAccessory} onCancel={() => setIsModalOpen(false)} locations={locations} /> :
                activeTab === 'components' || editingComponent ? <ComponentForm initialData={editingComponent} onSubmit={editingComponent ? handleUpdateComponent : handleAddComponent} onCancel={() => setIsModalOpen(false)} locations={locations} /> :
                  activeTab === 'procurement' || editingBatch ? <ProcurementForm initialData={editingBatch} onSubmit={editingBatch ? handleUpdateBatch : handleAddBatch} onCancel={() => setIsModalOpen(false)} /> : null}
        </Modal>

        <Modal isOpen={isHistoryModalOpen} onClose={() => setIsHistoryModalOpen(false)} title="Item History">
          {viewingHistory && <HistoryView history={viewingHistory.item.history || []} />}
        </Modal>

        <Modal isOpen={isPrintModalOpen} onClose={() => setIsPrintModalOpen(false)} title="Print Asset Tag">
          {printingAsset && <div className="text-center py-4"><QRCodeTag asset={printingAsset} /><div className="mt-4"><button className="btn btn-primary" onClick={() => window.print()}>Print Label</button></div></div>}
        </Modal>
      </Layout>
    </ProtectedRoute>
  );
};

export default App;
