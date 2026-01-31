import * as XLSX from 'xlsx';

export class ReportExporter {
    static exportToExcel(data: any[], fileName: string, sheetName: string = 'Sheet1') {
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

        // Use XLSX.writeFile for download in browser environment
        // Note: In some environments, this might need a different approach,
        // but for standard web apps, this works by triggering a download.
        XLSX.writeFile(workbook, `${fileName}.xlsx`);
    }

    static formatAssetData(assets: any[]) {
        return assets.map(asset => ({
            'Asset Name': asset.name,
            'Tag': asset.assetTag,
            'Serial': asset.serialNumber,
            'Model': asset.model,
            'Status': asset.status,
            'Location': asset.location,
            'Department': asset.department,
            'Purchase Date': asset.purchaseDate,
            'Purchase Cost': asset.purchaseCost,
            'Current Value': asset.currentValue,
            'Assignee': asset.assignee
        }));
    }

    static formatLicenseData(licenses: any[], seats: any[]) {
        return licenses.map(license => {
            const licenseSeats = seats.filter(s => s.masterLicenseId === license.id);
            const assignedCount = licenseSeats.filter(s => s.status === 'assigned').length;

            return {
                'License Name': license.name,
                'Key': license.key,
                'Category': license.category,
                'Manufacturer': license.manufacturer,
                'Total Seats': license.totalSeats,
                'Assigned Seats': assignedCount,
                'Available Seats': license.totalSeats - assignedCount,
                'Expiration Date': license.expirationDate,
                'Status': license.status
            };
        });
    }

    static formatAccessoryData(accessories: any[]) {
        return accessories.map(acc => ({
            'Name': acc.name,
            'Category': acc.category,
            'Model': acc.modelNumber,
            'Location': acc.location,
            'Total Qty': acc.totalQty,
            'Checked Out': acc.checkedOutQty,
            'Remaining': acc.totalQty - acc.checkedOutQty,
            'Unit Cost': acc.unitCost,
            'Total Value': acc.totalQty * acc.unitCost
        }));
    }

    static formatComponentData(components: any[]) {
        return components.map(comp => ({
            'Name': comp.name,
            'Serial': comp.serial,
            'Category': comp.category,
            'Model': comp.modelNumber,
            'Location': comp.location,
            'Total Qty': comp.totalQty,
            'Remaining': comp.remainingQty,
            'Unit Cost': comp.unitCost,
            'Total Value': comp.totalQty * comp.unitCost,
            'Purchase Date': comp.purchaseDate
        }));
    }
}
