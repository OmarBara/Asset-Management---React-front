import type { Asset, MasterLicense, LicenseSeat, Accessory, HardwareComponent, ProcurementBatch, User, UserGroup, Role, Privilege } from '../types';

export const departments = ['Engineering', 'Design', 'HR', 'Operations', 'Sales'];

export const mockAssets: Asset[] = [
    {
        id: '1',
        name: 'MacBook Pro M3',
        image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=200',
        assetTag: 'AST-001',
        serialNumber: 'C02XYZ123',
        model: 'M3 Pro 14-inch',
        type: 'Laptop',
        status: 'active',
        location: 'HQ - Floor 2',
        purchaseCost: 2499,
        currentValue: 2100,
        assignee: 'Sarah Johnson',
        department: 'Engineering',
        purchaseDate: '2024-01-15',
        history: [
            {
                id: 'h1',
                assetId: '1',
                date: '2024-01-15T09:00:00Z',
                type: 'creation',
                description: 'Asset created and assigned to Sarah Johnson',
                changedTo: 'Sarah Johnson'
            }
        ]
    },
    {
        id: '2',
        name: 'Dell XPS 15',
        image: 'https://images.unsplash.com/photo-1593642632823-8f78536788c6?auto=format&fit=crop&q=80&w=200',
        assetTag: 'AST-002',
        serialNumber: 'DL-456-ABC',
        model: '9530',
        type: 'Laptop',
        status: 'maintenance',
        location: 'IT Repair Bay',
        purchaseCost: 1899,
        currentValue: 1200,
        assignee: 'Mike Peters',
        department: 'Engineering',
        purchaseDate: '2023-11-20',
        history: []
    },
    {
        id: '3',
        name: 'iPhone 15 Pro',
        image: 'https://images.unsplash.com/photo-1696446701796-da61225697cc?auto=format&fit=crop&q=80&w=200',
        assetTag: 'AST-003',
        serialNumber: 'IP15-789',
        model: 'Pro 256GB',
        type: 'Mobile',
        status: 'active',
        location: 'Remote',
        purchaseCost: 999,
        currentValue: 850,
        assignee: 'Sarah Johnson',
        department: 'Design',
        purchaseDate: '2024-02-01',
        history: []
    },
];

export const mockMasterLicenses: MasterLicense[] = [
    {
        id: 'l1',
        name: 'Adobe Creative Cloud',
        key: 'ADOBE-CC-2024-XXXX',
        category: 'Design',
        manufacturer: 'Adobe',
        totalSeats: 3,
        expirationDate: '2025-12-31',
        status: 'active',
        history: []
    },
    {
        id: 'l2',
        name: 'Microsoft Office 365',
        key: 'MSFT-O365-YYYY',
        category: 'Productivity',
        manufacturer: 'Microsoft',
        totalSeats: 2,
        expirationDate: '2024-11-15',
        status: 'expiring',
        history: []
    }
];

export const mockLicenseSeats: LicenseSeat[] = [
    {
        id: 's1',
        masterLicenseId: 'l1',
        seatNumber: 'Seat 001',
        status: 'assigned',
        assignedToType: 'person',
        assignedToId: 'Sarah Johnson',
        history: []
    },
    {
        id: 's2',
        masterLicenseId: 'l1',
        seatNumber: 'Seat 002',
        status: 'assigned',
        assignedToType: 'asset',
        assignedToId: '1',
        history: []
    },
    {
        id: 's3',
        masterLicenseId: 'l1',
        seatNumber: 'Seat 003',
        status: 'available',
        assignedToType: 'unassigned',
        history: []
    },
    {
        id: 's4',
        masterLicenseId: 'l2',
        seatNumber: 'Seat 001',
        status: 'available',
        assignedToType: 'unassigned',
        history: []
    },
    {
        id: 's5',
        masterLicenseId: 'l2',
        seatNumber: 'Seat 002',
        status: 'available',
        assignedToType: 'unassigned',
        history: []
    }
];

export const mockAccessories: Accessory[] = [
    {
        id: 'acc1',
        name: 'USB Keyboard',
        image: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&q=80&w=200',
        category: 'Keyboards',
        modelNumber: '15451018',
        location: 'New Paulineville',
        minQty: 2,
        totalQty: 15,
        checkedOutQty: 0,
        unitCost: 25,
        history: []
    },
    {
        id: 'acc2',
        name: 'Bluetooth Keyboard',
        image: 'https://images.unsplash.com/photo-1587829741301-dc798b83dadc?auto=format&fit=crop&q=80&w=200',
        category: 'Keyboards',
        modelNumber: '9824292',
        location: 'Zitafurt',
        minQty: 2,
        totalQty: 10,
        checkedOutQty: 0,
        unitCost: 45,
        history: []
    },
    {
        id: 'acc3',
        name: 'Magic Mouse',
        image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=200',
        category: 'Mouse',
        modelNumber: '32276485',
        location: 'Port Haylee',
        minQty: 2,
        totalQty: 13,
        checkedOutQty: 0,
        unitCost: 79,
        history: []
    },
    {
        id: 'acc4',
        name: 'Sculpt Comfort Mouse',
        image: 'https://images.unsplash.com/photo-1615663248861-2446a855502a?auto=format&fit=crop&q=80&w=200',
        category: 'Mouse',
        modelNumber: '4874953',
        location: 'Jaskolskishire',
        minQty: 2,
        totalQty: 13,
        checkedOutQty: 0,
        unitCost: 35,
        history: []
    }
];

export const mockComponents: HardwareComponent[] = [
    {
        id: 'comp1',
        name: 'Crucial 4GB DDR3L-1600 SODIMM',
        serial: '12ecc97f-6ca8-34c6-99e4-3d870d14fb65',
        category: 'RAM',
        modelNumber: '6695905',
        location: 'Zitafurt',
        orderNumber: '13964051',
        purchaseDate: '2020-10-19',
        minQty: 2,
        totalQty: 10,
        remainingQty: 10,
        unitCost: 521.12,
        history: []
    },
    {
        id: 'comp2',
        name: 'Crucial 8GB DDR3L-1600 SODIMM Memory for Mac',
        serial: '709cdae8-f3e3-3d36-9eeb-e1562d407b76',
        category: 'RAM',
        modelNumber: '28793727',
        location: 'Arvelmouth',
        orderNumber: '30866139',
        purchaseDate: '1986-05-13',
        minQty: 2,
        totalQty: 10,
        remainingQty: 10,
        unitCost: 437038275.28,
        history: []
    },
    {
        id: 'comp3',
        name: 'Crucial BX300 120GB SATA Internal SSD',
        serial: '663c5e9f-7295-3617-b7bf-acd9ece50ef8',
        category: 'HDD/SSD',
        modelNumber: '8030373',
        location: 'Botsfordmouth',
        orderNumber: '47455811',
        purchaseDate: '1999-06-03',
        minQty: 2,
        totalQty: 10,
        remainingQty: 10,
        unitCost: 6987.09,
        history: []
    },
    {
        id: 'comp4',
        name: 'Crucial BX300 240GB SATA Internal SSD',
        serial: '56931a73-765f-3be6-a7f7-1ce02e03f5aa',
        category: 'HDD/SSD',
        modelNumber: '19918485',
        location: 'New Paulineville',
        orderNumber: '42325832',
        purchaseDate: '2009-12-11',
        minQty: 2,
        totalQty: 10,
        remainingQty: 10,
        unitCost: 652653.25,
        history: []
    }
];

export const mockProcurementBatches: ProcurementBatch[] = [
    {
        id: 'pb1',
        name: 'Batch 2024-001 - Laptops for Engineering',
        po: {
            poNumber: 'PO-2024-001',
            vendor: 'Dell Technologies',
            totalCost: 150000,
            date: '2024-01-15'
        },
        dn: {
            waybillNumber: 'WB-Dell-9981',
            receivedDate: '2024-01-20',
            condition: 'good'
        },
        minutes: {
            meetingRefNo: 'WM-2024-01',
            meetingDate: '2024-01-22',
            committeeSignOff: true
        },
        orderedQty: 100,
        receivedQty: 95,
        itemType: 'asset',
        status: 'commissioned',
        notes: '5 units delayed by vendor.'
    },
    {
        id: 'pb2',
        name: 'Batch 2024-002 - Microsoft Office 365 Licenses',
        po: {
            poNumber: 'PO-2024-002',
            vendor: 'Microsoft Corp',
            totalCost: 5000,
            date: '2024-02-01'
        },
        orderedQty: 50,
        receivedQty: 0,
        itemType: 'license',
        status: 'pending'
    }
];
export const mockPrivileges: Privilege[] = [
    { id: 'p1', name: 'assets.view', description: 'Can view assets' },
    { id: 'p2', name: 'assets.create', description: 'Can create assets' },
    { id: 'p3', name: 'assets.edit', description: 'Can edit assets' },
    { id: 'p4', name: 'assets.delete', description: 'Can delete assets' },
    { id: 'p5', name: 'users.view', description: 'Can view users' },
    { id: 'p6', name: 'users.manage', description: 'Can manage users, roles, and groups' },
    { id: 'p7', name: 'reports.view', description: 'Can view and export reports' },
];

export const mockRoles: Role[] = [
    {
        id: 'r1',
        name: 'Administrator',
        privileges: mockPrivileges.map(p => p.id)
    },
    {
        id: 'r2',
        name: 'IT Manager',
        privileges: ['p1', 'p2', 'p3', 'p5', 'p7']
    },
    {
        id: 'r3',
        name: 'Staff',
        privileges: ['p1', 'p7']
    }
];

export const mockUserGroups: UserGroup[] = [
    { id: 'g1', name: 'IT Department', description: 'Core IT team', roleId: 'r1' },
    { id: 'g2', name: 'Management', description: 'Executive team', roleId: 'r2' },
    { id: 'g3', name: 'General Staff', description: 'All other employees', roleId: 'r3' }
];

export const mockUsers: User[] = [
    {
        id: 'u1',
        name: 'Admin User',
        email: 'admin@example.com',
        username: 'admin',
        status: 'active',
        groupId: 'g1',
        department: 'Operations',
        location: 'HQ - Floor 1'
    },
    {
        id: 'u2',
        name: 'Sarah Johnson',
        email: 'sarah.j@example.com',
        username: 'sjohnson',
        status: 'active',
        groupId: 'g1',
        department: 'Engineering',
        location: 'HQ - Floor 2'
    },
    {
        id: 'u3',
        name: 'Mike Peters',
        email: 'mike.p@example.com',
        username: 'mpeters',
        status: 'active',
        groupId: 'g3',
        department: 'Engineering',
        location: 'HQ - Floor 2'
    }
];
