import { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '../context/LanguageContext';
import QRCameraScanner from './QRCameraScanner';
import { ShieldCheck, Globe, Lock, Camera } from 'lucide-react';

export default function Navbar() {
  const { lang, changeLang, t } = useLanguage();
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur border-b border-slate-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Brand Logo with New Official Estrella de Mayo Emblem */}
          <Link href="/" className="flex items-center gap-3.5 group">
            <div className="w-11 h-11 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center shadow-lg shadow-sky-500/10 group-hover:border-sky-500/50 transition-all p-1.5">
              <svg width="32" height="32" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="32" cy="32" r="30" stroke="#38bdf8" strokeWidth="2.2" />
                <circle cx="32" cy="32" r="26" stroke="#38bdf8" strokeWidth="1" strokeDasharray="1.5 2" />
                <circle cx="32" cy="32" r="18" fill="rgba(56,189,248,0.15)" />
                <line x1="32" y1="2" x2="32" y2="7" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" />
                <line x1="32" y1="57" x2="32" y2="62" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" />
                <line x1="2" y1="32" x2="7" y2="32" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" />
                <line x1="57" y1="32" x2="62" y2="32" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" />
                <polygon points="32,13 36.5,24 48,24.8 39.2,32.2 42,43.5 32,37.5 22,43.5 24.8,32.2 16,24.8 27.5,24" 
                         fill="#10b981" stroke="#0a0f18" strokeWidth="1.2" strokeLinejoin="round" />
                <circle cx="32" cy="32" r="3.2" fill="#ffffff" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-2xl tracking-wider text-white">
                  PSL <span className="text-emerald-400">LABS</span>
                </span>
                <span className="bg-red-950/80 text-red-300 border border-red-700/60 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                  🇵🇾 PY
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block tracking-wide">
                {t.nav.tagline}
              </p>
            </div>
          </Link>

          {/* Navigation Links & Language Switcher */}
          <div className="flex items-center gap-2.5 sm:gap-6">
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
              <Link href="/#verify" className="hover:text-emerald-400 transition-colors">
                {t.nav.verify}
              </Link>
              <Link href="/#products" className="hover:text-emerald-400 transition-colors">
                {t.nav.products}
              </Link>
              <Link href="/#quality" className="hover:text-emerald-400 transition-colors">
                {t.nav.quality}
              </Link>
            </nav>

            {/* Camera Quick Button in Nav */}
            <button
              onClick={() => setIsCameraOpen(true)}
              className="flex items-center gap-1.5 text-xs bg-emerald-600/90 hover:bg-emerald-500 text-white font-bold px-3 py-2 rounded-xl shadow-sm shadow-emerald-950 transition cursor-pointer"
              title="Abrir Câmera para Ler QR Code"
            >
              <Camera className="w-4 h-4" />
              <span className="hidden sm:inline">Escanear QR</span>
            </button>

            {/* Bilingual Switcher (PY vs PT-BR) */}
            <div className="flex items-center bg-slate-800/90 rounded-lg p-1 border border-slate-700">
              <button
                onClick={() => changeLang('py')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold transition-all ${
                  lang === 'py'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Español (Paraguay)"
              >
                <span>🇵🇾</span>
                <span>PY</span>
              </button>
              <button
                onClick={() => changeLang('pt')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold transition-all ${
                  lang === 'pt'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Português (Brasil)"
              >
                <span>🇧🇷</span>
                <span>PT-BR</span>
              </button>
            </div>

            {/* Admin link button */}
            <Link
              href="/admin"
              className="flex items-center gap-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-3 py-2 rounded-lg border border-slate-700 transition"
            >
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">{t.nav.admin}</span>
            </Link>
          </div>
        </div>
      </header>

      {/* QR Camera Modal */}
      <QRCameraScanner
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
      />
    </>
  );
}
