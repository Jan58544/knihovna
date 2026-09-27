import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import { X, Loader } from 'lucide-react';

export function ScannerModal({ onClose, onScanSuccess }) {
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const scannerRef = useRef(null);
  const isScanningRef = useRef(false);

  useEffect(() => {
    const config = {
      fps: 10,
      qrbox: { width: 280, height: 180 },
      formatsToSupport: [
        Html5QrcodeSupportedFormats.EAN_13,
        Html5QrcodeSupportedFormats.EAN_8,
        Html5QrcodeSupportedFormats.UPC_A,
        Html5QrcodeSupportedFormats.UPC_E,
        Html5QrcodeSupportedFormats.CODE_128,
      ],
    };

    const html5Qrcode = new Html5Qrcode('reader');
    scannerRef.current = html5Qrcode;

    html5Qrcode
      .start(
        { facingMode: 'environment' },
        config,
        async (decodedText) => {
          if (isScanningRef.current) return;
          isScanningRef.current = true;

          try {
            if (html5Qrcode.isScanning) {
              await html5Qrcode.stop();
            }
          } catch (e) {
            console.warn('Scanner stop error:', e);
          }

          onScanSuccess(decodedText);
        },
        () => {
          // Frame match fail - ignore
        }
      )
      .then(() => {
        setLoading(false);
      })
      .catch((err) => {
        console.error('Camera start error:', err);
        setLoading(false);
        setErrorMessage('Nepodařilo se přístup k fotoaparátu. Zkontrolujte prosím oprávnění.');
      });

    return () => {
      if (scannerRef.current && scannerRef.current.isScanning) {
        scannerRef.current
          .stop()
          .catch((err) => console.warn('Error stopping scanner during cleanup:', err));
      }
    };
  }, [onScanSuccess]);

  const handleClose = async () => {
    if (scannerRef.current && scannerRef.current.isScanning) {
      try {
        await scannerRef.current.stop();
      } catch (e) {
        console.warn('Error stopping scanner on close:', e);
      }
    }
    onClose();
  };

  return (
    <div className="scanner-overlay">
      <div className="scanner-header">
        <span className="scanner-title">Naskenujte ISBN knihy</span>
        <button className="btn-close" onClick={handleClose}>
          <X size={26} />
        </button>
      </div>

      <div className="scanner-viewport">
        {loading && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#a8a8a8' }}>
            <Loader size={20} className="spin" /> Spouštění fotoaparátu...
          </div>
        )}

        {errorMessage && (
          <div style={{ color: '#ff4d4d', textAlign: 'center', padding: '16px' }}>
            {errorMessage}
          </div>
        )}

        <div id="reader"></div>
      </div>
    </div>
  );
}
