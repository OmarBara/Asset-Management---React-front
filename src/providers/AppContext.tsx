import React, { createContext, useContext, useReducer, type ReactNode } from 'react';
import type { Asset, MasterLicense, LicenseSeat, Accessory, HardwareComponent, ProcurementBatch, AssetHistoryEvent, User, UserGroup, Role, Privilege } from '../types';
import { mockAssets, mockMasterLicenses, mockLicenseSeats, mockAccessories, mockComponents, mockProcurementBatches, mockUsers, mockUserGroups, mockRoles, mockPrivileges } from '../data/mockData';

interface AppState {
    assets: Asset[];
    masterLicenses: MasterLicense[];
    licenseSeats: LicenseSeat[];
    accessories: Accessory[];
    components: HardwareComponent[];
    procurementBatches: ProcurementBatch[];
    departments: string[];
    locations: string[];
    assetTypes: string[];
    users: User[];
    groups: UserGroup[];
    roles: Role[];
    privileges: Privilege[];
}

type Action =
    | { type: 'SET_ASSETS'; payload: Asset[] }
    | { type: 'ADD_ASSET'; payload: Asset }
    | { type: 'UPDATE_ASSET'; payload: Asset }
    | { type: 'DELETE_ASSET'; payload: string }
    | { type: 'SET_LICENSES'; payload: MasterLicense[] }
    | { type: 'ADD_LICENSE'; payload: { license: MasterLicense; seats: LicenseSeat[] } }
    | { type: 'UPDATE_LICENSE'; payload: MasterLicense }
    | { type: 'DELETE_LICENSE'; payload: string }
    | { type: 'UPDATE_SEAT'; payload: LicenseSeat }
    | { type: 'SET_ACCESSORIES'; payload: Accessory[] }
    | { type: 'UPDATE_ACCESSORY'; payload: Accessory }
    | { type: 'SET_COMPONENTS'; payload: HardwareComponent[] }
    | { type: 'UPDATE_COMPONENT'; payload: HardwareComponent }
    | { type: 'DELETE_COMPONENT'; payload: string }
    | { type: 'SET_PROCUREMENT'; payload: ProcurementBatch[] }
    | { type: 'ADD_BATCH'; payload: ProcurementBatch }
    | { type: 'UPDATE_BATCH'; payload: ProcurementBatch }
    | { type: 'DELETE_BATCH'; payload: string }
    | { type: 'SET_DEPARTMENTS'; payload: string[] }
    | { type: 'SET_LOCATIONS'; payload: string[] }
    | { type: 'SET_ASSET_TYPES'; payload: string[] }
    | { type: 'SET_USERS'; payload: User[] }
    | { type: 'ADD_USER'; payload: User }
    | { type: 'UPDATE_USER'; payload: User }
    | { type: 'DELETE_USER'; payload: string }
    | { type: 'SET_GROUPS'; payload: UserGroup[] }
    | { type: 'ADD_GROUP'; payload: UserGroup }
    | { type: 'UPDATE_GROUP'; payload: UserGroup }
    | { type: 'DELETE_GROUP'; payload: string }
    | { type: 'SET_ROLES'; payload: Role[] }
    | { type: 'ADD_ROLE'; payload: Role }
    | { type: 'UPDATE_ROLE'; payload: Role }
    | { type: 'DELETE_ROLE'; payload: string };

const initialState: AppState = {
    assets: mockAssets,
    masterLicenses: mockMasterLicenses,
    licenseSeats: mockLicenseSeats,
    accessories: mockAccessories,
    components: mockComponents,
    procurementBatches: mockProcurementBatches,
    departments: ['Engineering', 'Design', 'HR', 'Operations', 'Sales'],
    locations: Array.from(new Set(mockAssets.map(a => a.location))).sort(),
    assetTypes: Array.from(new Set(mockAssets.map(a => a.type))).sort(),
    users: mockUsers,
    groups: mockUserGroups,
    roles: mockRoles,
    privileges: mockPrivileges,
};

const appReducer = (state: AppState, action: Action): AppState => {
    const now = new Date().toISOString();

    switch (action.type) {
        case 'SET_ASSETS': return { ...state, assets: action.payload };
        case 'ADD_ASSET': {
            const history: AssetHistoryEvent[] = [{
                id: crypto.randomUUID(),
                assetId: action.payload.id,
                date: now,
                type: 'creation',
                description: 'Asset created',
                changedTo: action.payload.assignee
            }];
            const newAsset = { ...action.payload, history: [...(action.payload.history || []), ...history] };

            // Link license seats
            const updatedSeats = state.licenseSeats.map(s => {
                if (action.payload.assignedLicenses?.includes(s.id)) {
                    return {
                        ...s,
                        status: 'assigned' as const,
                        assignedToType: 'asset' as const,
                        assignedToId: action.payload.id,
                        history: [...(s.history || []), {
                            id: crypto.randomUUID(),
                            assetId: s.id,
                            date: now,
                            type: 'assignment' as AssetHistoryEvent['type'],
                            description: `Assigned to new asset: ${action.payload.name}`,
                            changedTo: action.payload.name
                        }]
                    };
                }
                return s;
            });

            return {
                ...state,
                assets: [newAsset, ...state.assets],
                licenseSeats: updatedSeats
            };
        }
        case 'UPDATE_ASSET': {
            const oldAsset = state.assets.find(a => a.id === action.payload.id);
            if (!oldAsset) return state;

            const newHistoryEvents: AssetHistoryEvent[] = [];
            if (oldAsset.assignee !== action.payload.assignee) {
                newHistoryEvents.push({ id: crypto.randomUUID(), assetId: oldAsset.id, date: now, type: 'assignment', description: 'Asset reassigned', changedFrom: oldAsset.assignee, changedTo: action.payload.assignee });
            }
            if (oldAsset.status !== action.payload.status) {
                newHistoryEvents.push({ id: crypto.randomUUID(), assetId: oldAsset.id, date: now, type: 'status', description: `Status changed to ${action.payload.status}`, changedFrom: oldAsset.status, changedTo: action.payload.status });
            }

            const updatedAsset = { ...action.payload, history: [...(oldAsset.history || []), ...newHistoryEvents] };

            // Update seats: unassign old, assign new
            const assetId = action.payload.id;
            const newSeats = action.payload.assignedLicenses || [];

            const updatedSeats = state.licenseSeats.map(s => {
                // Unassign
                if (s.assignedToId === assetId && !newSeats.includes(s.id)) {
                    return {
                        ...s,
                        status: 'available' as const,
                        assignedToType: 'unassigned' as const,
                        assignedToId: undefined,
                        history: [...(s.history || []), {
                            id: crypto.randomUUID(),
                            assetId: s.id,
                            date: now,
                            type: 'assignment' as const,
                            description: 'Unassigned due to asset update',
                            changedFrom: oldAsset.name
                        }]
                    };
                }
                // Assign
                if (newSeats.includes(s.id) && s.assignedToId !== assetId) {
                    return {
                        ...s,
                        status: 'assigned' as const,
                        assignedToType: 'asset' as const,
                        assignedToId: assetId,
                        history: [...(s.history || []), {
                            id: crypto.randomUUID(),
                            assetId: s.id,
                            date: now,
                            type: 'assignment' as const,
                            description: `Assigned to asset: ${action.payload.name}`,
                            changedTo: action.payload.name
                        }]
                    };
                }
                return s;
            });

            return {
                ...state,
                assets: state.assets.map(a => a.id === assetId ? updatedAsset : a),
                licenseSeats: updatedSeats
            };
        }
        // ... rest of cases (I'll add them in a multi-replace if needed, but for now I'm focusing on complex ones)
        case 'DELETE_ASSET': return { ...state, assets: state.assets.filter(a => a.id !== action.payload) };

        case 'SET_LICENSES': return { ...state, masterLicenses: action.payload };
        case 'ADD_LICENSE': return {
            ...state,
            masterLicenses: [action.payload.license, ...state.masterLicenses],
            licenseSeats: [...state.licenseSeats, ...action.payload.seats]
        };
        case 'UPDATE_LICENSE': return { ...state, masterLicenses: state.masterLicenses.map(l => l.id === action.payload.id ? action.payload : l) };
        case 'DELETE_LICENSE': return {
            ...state,
            masterLicenses: state.masterLicenses.filter(l => l.id !== action.payload),
            licenseSeats: state.licenseSeats.filter(s => s.masterLicenseId !== action.payload)
        };

        case 'UPDATE_SEAT': {
            const oldSeat = state.licenseSeats.find(s => s.id === action.payload.id);
            if (!oldSeat) return state;
            const historyEvent: AssetHistoryEvent = {
                id: crypto.randomUUID(),
                assetId: action.payload.id,
                date: now,
                type: 'assignment',
                description: action.payload.status === 'assigned' ? 'Seat assigned' : 'Seat unassigned',
                changedFrom: oldSeat.assignedToId || 'None',
                changedTo: action.payload.assignedToId || 'None'
            };
            return {
                ...state,
                licenseSeats: state.licenseSeats.map(s => s.id === action.payload.id ? { ...action.payload, history: [...(s.history || []), historyEvent] } : s)
            };
        }

        case 'SET_ACCESSORIES': return { ...state, accessories: action.payload };
        case 'UPDATE_ACCESSORY': return { ...state, accessories: state.accessories.map(a => a.id === action.payload.id ? action.payload : a) };

        case 'SET_COMPONENTS': return { ...state, components: action.payload };
        case 'UPDATE_COMPONENT': return { ...state, components: state.components.map(c => c.id === action.payload.id ? action.payload : c) };
        case 'DELETE_COMPONENT': return { ...state, components: state.components.filter(c => c.id !== action.payload) };

        case 'SET_PROCUREMENT': return { ...state, procurementBatches: action.payload };
        case 'ADD_BATCH': return { ...state, procurementBatches: [action.payload, ...state.procurementBatches] };
        case 'UPDATE_BATCH': return { ...state, procurementBatches: state.procurementBatches.map(b => b.id === action.payload.id ? action.payload : b) };
        case 'DELETE_BATCH': return { ...state, procurementBatches: state.procurementBatches.filter(b => b.id !== action.payload) };

        case 'SET_DEPARTMENTS': return { ...state, departments: action.payload };
        case 'SET_LOCATIONS': return { ...state, locations: action.payload };
        case 'SET_ASSET_TYPES': return { ...state, assetTypes: action.payload };

        case 'SET_USERS': return { ...state, users: action.payload };
        case 'ADD_USER': return { ...state, users: [action.payload, ...state.users] };
        case 'UPDATE_USER': return { ...state, users: state.users.map(u => u.id === action.payload.id ? action.payload : u) };
        case 'DELETE_USER': return { ...state, users: state.users.filter(u => u.id !== action.payload) };

        case 'SET_GROUPS': return { ...state, groups: action.payload };
        case 'ADD_GROUP': return { ...state, groups: [action.payload, ...state.groups] };
        case 'UPDATE_GROUP': return { ...state, groups: state.groups.map(g => g.id === action.payload.id ? action.payload : g) };
        case 'DELETE_GROUP': return { ...state, groups: state.groups.filter(g => g.id !== action.payload) };

        case 'SET_ROLES': return { ...state, roles: action.payload };
        case 'ADD_ROLE': return { ...state, roles: [action.payload, ...state.roles] };
        case 'UPDATE_ROLE': return { ...state, roles: state.roles.map(r => r.id === action.payload.id ? action.payload : r) };
        case 'DELETE_ROLE': return { ...state, roles: state.roles.filter(r => r.id !== action.payload) };

        default: return state;
    }
};

interface AppContextType {
    state: AppState;
    dispatch: React.Dispatch<Action>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
    const [state, dispatch] = useReducer(appReducer, initialState);

    return (
        <AppContext.Provider value={{ state, dispatch }}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};
