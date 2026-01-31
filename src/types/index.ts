export type AssetStatus = 'active' | 'maintenance' | 'retired';

export interface AssetHistoryEvent {
  id: string;
  assetId: string;
  date: string; // ISO string
  type: 'assignment' | 'status' | 'maintenance' | 'creation' | 'update' | 'location' | 'checkout' | 'checkin' | 'procurement';
  description: string;
  changedFrom?: string;
  changedTo?: string;
}

export interface Asset {
  id: string;
  name: string;
  type: string;
  image: string;
  assetTag: string;
  serialNumber: string;
  model: string;
  status: AssetStatus;
  location: string;
  purchaseCost: number;
  currentValue: number;
  assignee: string;
  department: string;
  purchaseDate: string;
  history?: AssetHistoryEvent[];
  assignedLicenses?: string[]; // Array of LicenseSeat IDs
  procurementBatchId?: string;
}

export interface LicenseSeat {
  id: string;
  masterLicenseId: string;
  seatNumber: string; // e.g., "Seat 001"
  status: 'available' | 'assigned';
  assignedToType: 'person' | 'asset' | 'unassigned';
  assignedToId?: string; // Person Name or Asset ID
  history?: AssetHistoryEvent[];
}

export interface MasterLicense {
  id: string;
  name: string;
  key: string;
  category: string;
  manufacturer: string;
  totalSeats: number;
  purchaseDate?: string;
  expirationDate: string;
  status: 'active' | 'expired' | 'expiring';
  notes?: string;
  history?: AssetHistoryEvent[];
  procurementBatchId?: string;
}

export interface Accessory {
  id: string;
  name: string;
  image: string;
  category: string;
  modelNumber: string;
  location: string;
  minQty: number;
  totalQty: number;
  checkedOutQty: number;
  unitCost: number;
  notes?: string;
  history?: AssetHistoryEvent[];
}

export interface HardwareComponent {
  id: string;
  name: string;
  serial: string;
  category: string;
  modelNumber: string;
  location: string;
  orderNumber: string;
  purchaseDate: string;
  minQty: number;
  totalQty: number;
  remainingQty: number;
  unitCost: number;
  notes?: string;
  history?: AssetHistoryEvent[];
}

export interface PurchaseOrder {
  poNumber: string;
  vendor: string;
  totalCost: number;
  date: string;
  documentUrl?: string;
}

export interface DeliveryNote {
  waybillNumber: string;
  receivedDate: string;
  condition: 'good' | 'damaged' | 'partial';
  documentUrl?: string;
}

export interface WardMinutes {
  meetingRefNo: string;
  meetingDate: string;
  committeeSignOff: boolean;
  documentUrl?: string;
}

export interface ProcurementBatch {
  id: string;
  name: string;
  po?: PurchaseOrder;
  dn?: DeliveryNote;
  minutes?: WardMinutes;
  orderedQty: number;
  receivedQty: number;
  itemType: 'asset' | 'license';
  status: 'pending' | 'partially_received' | 'received' | 'commissioned';
  notes?: string;
}
export interface Privilege {
  id: string;
  name: string;
  description: string;
}

export interface Role {
  id: string;
  name: string;
  privileges: string[]; // IDs of Privileges
}

export interface UserGroup {
  id: string;
  name: string;
  description?: string;
  roleId: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  username: string;
  status: 'active' | 'inactive';
  groupId: string;
  department: string;
  location: string;
}
