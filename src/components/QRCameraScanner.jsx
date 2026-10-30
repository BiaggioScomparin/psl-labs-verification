import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import { Camera, X, RefreshCw, AlertCircle, Sparkles, Zap, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function QRCameraScanner({ isOpen, onClose }) {
  const router = useRouter();
  const { lang } = useLanguage();
  const scannerRef = useRef(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [isInitializing, setIsInitializing] = useState(true);
  const [hasTorch, setHasTorch] = useState(false);
  const [torchOn, setTorchOn] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    let html5QrCode = null;
    setIsInitializing(true);
    setErrorMsg('');

    const startScanner = async () => {
      try {
        // ID of the target container
        html5QrCode = new Html5Qrcode("qr-camera-viewport", {
          formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE],
          verbose: false
        });
        scannerRef.current = html5QrCode;

        const config = {
          fps: 15,
          qrbox: (viewfinderWidth, viewfinderHeight) => {
            const minEdge = Math.min(viewfinderWidth, viewfinderHeight);
            const edgeSize = Math.floor(minEdge * 0.72);
            return { width: edgeSize, height: edgeSize };
          },
          aspectRatio: 1.0
        };

        await html5QrCode.start(
          { facingMode: "environment" }, // Prefer back camera on smartphones
          config,
          (decodedText) => {
            handleScanSuccess(decodedText, html5QrCode);
          },
          () => {
            // Frame scan failure (ignore continuous scanning noise)
          }
        );

        setIsInitializing(false);

        // Check if torch/flashlight is supported
        try {
          const track = html5QrCode.getRunningTrackCameraCapabilities();
          if (track && track.torchFeature().isSupported()) {
            setHasTorch(true);
          }
        } catch {
          // torch not supported on this device
        }

      } catch (err) {
        console.error("Erro ao iniciar câmera:", err);
        setIsInitializing(false);
        setErrorMsg(
          lang === 'py'
            ? "No se pudo acceder a la cámara. Por favor verifique los permisos de su navegador o ingrese el código manualmente."
            : "Não foi possível acessar a câmera. Por favor autorize a permissão no seu navegador ou digite o código manualmente."
        );
      }
    };

    startScanner();

    // Cleanup when modal closes
    return () => {
      if (scannerRef.current) {
        scannerRef.current
          .stop()
          .then(() => scannerRef.current.clear())
          .catch((e) => console.warn("Erro ao parar scanner:", e));
        scannerRef.current = null;
      }
    };
  }, [isOpen]);

  const handleScanSuccess = (decodedText, qrInstance) => {
    if (!decodedText) return;

    // Vibrate device if supported
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(150);
    }

    // Stop camera
    if (qrInstance) {
      qrInstance.stop().then(() => qrInstance.clear()).catch(() => {});
    }

    // Extract code from URL or raw text
    // E.g.: "https://psl-labs.vercel.app/v/GHK50-8F92K" -> "GHK50-8F92K"
    let cleanCode = decodedText.trim();
    if (cleanCode.includes('/v/')) {
      const parts = cleanCode.split('/v/');
      cleanCode = parts[parts.length - 1].split('?')[0].split('#')[0];
    } else if (cleanCode.includes('code=')) {
      const match = cleanCode.match(/code=([^&]+)/);
      if (match) cleanCode = match[1];
    }

    cleanCode = cleanCode.trim();

    onClose();
    router.push(`/v/${encodeURIComponent(cleanCode)}`);
  };

  const toggleTorch = async () => {
    if (!scannerRef.current || !hasTorch) return;
    try {
      const newStatus = !torchOn;
      await scannerRef.current.applyVideoConstraints({
        advanced: [{ torch: newStatus }]
      });
      setTorchOn(newStatus);
    } catch (e) {
      console.warn("Torch toggle failed:", e);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl shadow-emerald-950/40 flex flex-col">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <span>{lang === 'py' ? 'Escaneo de Código QR' : 'Escanear QR Code'}</span>
                <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800 px-1.5 py-0.5 rounded font-mono font-bold">
                  AO VIVO
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">
                PSL LABS · Sistema Anti-Clonagem
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Camera Viewport Container */}
        <div className="relative bg-black flex items-center justify-center overflow-hidden min-h-[340px]">
          
          {/* HTML5 QR Container */}
          <div id="qr-camera-viewport" className="w-full h-full overflow-hidden" />

          {/* Animated Laser Scanning Reticle */}
          {!errorMsg && !isInitializing && (
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <div className="w-[240px] h-[240px] border-2 border-emerald-400/80 rounded-2xl relative shadow-lg shadow-emerald-500/20">
                {/* Corner markers */}
                <div className="absolute -top-1 -left-1 w-5 h-5 border-t-4 border-l-4 border-emerald-400 rounded-tl-lg" />
                <div className="absolute -top-1 -right-1 w-5 h-5 border-t-4 border-r-4 border-emerald-400 rounded-tr-lg" />
                <div className="absolute -bottom-1 -left-1 w-5 h-5 border-b-4 border-l-4 border-emerald-400 rounded-bl-lg" />
                <div className="absolute -bottom-1 -right-1 w-5 h-5 border-b-4 border-r-4 border-emerald-400 rounded-br-lg" />
                
                {/* Glowing Laser Scan Line */}
                <div className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_8px_#34d399] animate-pulse" 
                     style={{
                       animation: 'laserScan 2.4s ease-in-out infinite alternate',
                       top: '50%'
                     }} 
                />
              </div>
            </div>
          )}

          {/* Initializing Spinner */}
          {isInitializing && (
            <div className="absolute inset-0 bg-slate-950 flex flex-col items-center justify-center text-center p-6 gap-3">
              <RefreshCw className="w-8 h-8 text-emerald-400 animate-spin" />
              <p className="text-xs text-slate-300 font-semibold">
                {lang === 'py' ? 'Iniciando cámara...' : 'Iniciando câmera...'}
              </p>
              <span className="text-[11px] text-slate-500">
                {lang === 'py' ? 'Permita el acceso si su navegador lo solicita' : 'Autorize a permissão caso o navegador solicite'}
              </span>
            </div>
          )}

          {/* Error Message */}
          {errorMsg && (
            <div className="absolute inset-0 bg-slate-950 flex flex-col items-center justify-center text-center p-6 gap-3">
              <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400">
                <AlertCircle className="w-6 h-6" />
              </div>
              <p className="text-xs text-red-300 max-w-xs leading-relaxed">
                {errorMsg}
              </p>
              <button
                onClick={onClose}
                className="mt-2 text-xs bg-slate-800 hover:bg-slate-700 text-white font-bold px-4 py-2 rounded-xl transition cursor-pointer"
              >
                {lang === 'py' ? 'Ingresar código manualmente' : 'Digitar código manualmente'}
              </button>
            </div>
          )}

          {/* Torch Button (if supported) */}
          {hasTorch && !isInitializing && (
            <button
              onClick={toggleTorch}
              className={`absolute bottom-4 right-4 z-20 p-2.5 rounded-full border transition ${
                torchOn
                  ? 'bg-amber-500 text-slate-950 border-amber-300 shadow-lg shadow-amber-500/40'
                  : 'bg-slate-900/80 text-white border-slate-700'
              }`}
              title="Lanterna / Flash"
            >
              <Zap className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Footer Instructions */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 text-center">
          <p className="text-xs text-slate-300 font-medium">
            {lang === 'py'
              ? 'Enfoque el código QR impreso en el frasco PSL LABS'
              : 'Aponte para o QR Code impresso no frasco da PSL LABS'}
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">
            {lang === 'py'
              ? 'La autenticidad y el conteo de consultas se verificarán al instante'
              : 'A autenticidade e contagem de leituras serão abertas automaticamente'}
          </p>
        </div>

      </div>

      <style jsx global>{`
        #qr-camera-viewport video {
          object-fit: cover !important;
          width: 100% !important;
          height: 100% !important;
          border-radius: 0 0 1.5rem 1.5rem;
        }
        @keyframes laserScan {
          0% { top: 8%; opacity: 0.6; }
          50% { opacity: 1; }
          100% { top: 92%; opacity: 0.6; }
        }
      `}</style>
    </div>
  );
}
