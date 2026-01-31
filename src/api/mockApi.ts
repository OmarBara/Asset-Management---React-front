import type { Asset, MasterLicense, LicenseSeat, Accessory, HardwareComponent, ProcurementBatch } from '../types';
import { mockAssets, mockMasterLicenses, mockLicenseSeats, mockAccessories, mockComponents, mockProcurementBatches } from '../data/mockData';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const mockApi = {
    assets: {
        getAll: async () => {
            await delay(300);
            return [...mockAssets];
        },
        create: async (asset: Omit<Asset, 'id'>) => {
            await delay(500);
            return { ...asset, id: crypto.randomUUID() } as Asset;
        }
    },
    licenses: {
        getAll: async () => {
            await delay(300);
            return { licenses: [...mockMasterLicenses], seats: [...mockLicenseSeats] };
        }
    },
    procurement: {
        getAll: async () => {
            await delay(300);
            return [...mockProcurementBatches];
        }
    },
    components: {
        getAll: async () => {
            await delay(300);
            return [...mockComponents];
        }
    }
};
