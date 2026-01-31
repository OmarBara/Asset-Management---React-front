import { QRCodeSVG } from 'qrcode.react';
import type { Asset } from '../types';

interface QRCodeTagProps {
    asset: Asset;
}

export const QRCodeTag = ({ asset }: QRCodeTagProps) => {
    return (
        <div className="qr-tag-container bg-white text-dark p-3 rounded border border-secondary shadow-sm d-inline-block" style={{ width: '350px' }}>
            <div className="d-flex align-items-center gap-3">
                <div className="qr-code-wrapper p-2 bg-white rounded border">
                    <QRCodeSVG
                        value={asset.assetTag}
                        size={120}
                        level="H"
                        includeMargin={false}
                    />
                </div>
                <div className="asset-info flex-grow-1 overflow-hidden">
                    <h5 className="mb-1 text-truncate fw-bold">{asset.name}</h5>
                    <div className="small mb-1 text-muted text-truncate">{asset.model}</div>
                    <div className="badge bg-dark font-monospace mb-2" style={{ fontSize: '1.1rem' }}>
                        {asset.assetTag}
                    </div>
                    <div className="small text-secondary fw-bold text-uppercase" style={{ letterSpacing: '1px', fontSize: '0.65rem' }}>
                        Asset Property Management
                    </div>
                </div>
            </div>

            {/* Hidden printable label (formatted for 2x1 inch) */}
            <div className="d-none d-print-block label-print-area">
                <div className="print-label" style={{
                    width: '2in',
                    height: '1in',
                    padding: '0.1in',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.1in',
                    backgroundColor: 'white',
                    color: 'black',
                    fontFamily: 'sans-serif'
                }}>
                    <QRCodeSVG value={asset.assetTag} size={80} level="H" />
                    <div style={{ overflow: 'hidden' }}>
                        <div style={{ fontWeight: 'bold', fontSize: '10pt', whiteSpace: 'nowrap', overflow: 'hidden' }}>{asset.name}</div>
                        <div style={{ fontSize: '8pt', marginBottom: '4pt' }}>{asset.assetTag}</div>
                        <div style={{ fontSize: '5pt', textTransform: 'uppercase', opacity: 0.7 }}>Property Of Company</div>
                    </div>
                </div>
            </div>
        </div>
    );
};
