'use client';

import { useEffect, useRef, useState } from 'react';

interface QrScannerProps {
  onScan: (decodedText: string) => void;
  onError: (error: string) => void;
  scanning: boolean;
  onStop: () => void;
}

export default function QrScanner({ onScan, onError, scanning, onStop }: QrScannerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scannerRef = useRef<any>(null);
  const [cameraReady, setCameraReady] = useState(false);

  useEffect(() => {
    if (!scanning || !containerRef.current) return;

    let html5QrCode: any;

    import('html5-qrcode').then(({ Html5Qrcode }) => {
      html5QrCode = new Html5Qrcode('qr-reader');
      scannerRef.current = html5QrCode;

      html5QrCode.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        (decodedText: string) => {
          onScan(decodedText);
        },
        () => {},
      ).then(() => {
        setCameraReady(true);
      }).catch((err: any) => {
        onError(err?.message || 'Erreur d\'accès à la caméra');
      });
    });

    return () => {
      if (html5QrCode?.isScanning) {
        html5QrCode.stop().catch(() => {});
      }
    };
  }, [scanning, onScan, onError]);

  useEffect(() => {
    return () => {
      if (scannerRef.current?.isScanning) {
        scannerRef.current.stop().catch(() => {});
      }
    };
  }, []);

  if (!scanning) return null;

  return (
    <div className="relative rounded-2xl overflow-hidden" style={{ background: '#000', minHeight: 300 }}>
      <div id="qr-reader" ref={containerRef} className="[&>video]:object-cover" />
      {!cameraReady && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-2" />
            <p className="text-white/60 text-xs">Activation de la caméra...</p>
          </div>
        </div>
      )}
      <button
        onClick={onStop}
        className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center z-10"
        style={{ background: 'rgba(0,0,0,0.5)' }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  );
}
