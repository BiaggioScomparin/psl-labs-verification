import { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import QRCameraScanner from './QRCameraScanner';
import { ShieldCheck, Lock, Camera, Sun, Moon } from 'lucide-react';

export default function Navbar() {
  const { lang, changeLang, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/95 dark:bg-[#0A0E17]/95 backdrop-blur-md border-b border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white transition-colors duration-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Brand Logo with PSL Labs Premium Synthesis Line */}
          <Link href="/" className="flex items-center gap-3.5 group">
            <img 
              src="/brand/psl-labs-premium-synthesis-line.png" 
              alt="PSL LABS - Premium Synthesis Line" 
              className="h-10 sm:h-12 w-auto object-contain transition-transform group-hover:scale-[1.02] filter dark:brightness-110"
            />
          </Link>

          {/* Navigation Links with High Contrast & Legible Tracking */}
          <div className="flex items-center gap-2 sm:gap-4">
            <nav className="hidden lg:flex items-center gap-6 text-xs font-bold tracking-[0.12em] text-slate-700 dark:text-slate-200 uppercase" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              <Link href="/#verify" className="hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors py-2">
                {t.nav.verify}
              </Link>
              <Link href="/#formulas" className="hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors py-2">
                {t.nav.products}
              </Link>
              <Link href="/#purity" className="hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors py-2">
                {t.nav.chromatography}
              </Link>
              <Link href="/#protocol" className="hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors py-2">
                {t.nav.protocol}
              </Link>
            </nav>

            {/* Camera Quick Button in Nav */}
            <button
              onClick={() => setIsCameraOpen(true)}
              className="flex items-center gap-1.5 text-xs bg-emerald-700 hover:bg-emerald-600 active:scale-[0.98] text-white font-bold px-3.5 py-2.5 rounded-xl shadow-md transition cursor-pointer"
              title="Abrir Câmera para Ler QR Code"
            >
              <Camera className="w-4 h-4" />
              <span className="hidden sm:inline">Escanear QR</span>
            </button>

            {/* Theme Toggle Button (Light/Dark Mode) */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 dark:border-slate-700 dark:text-amber-400 transition cursor-pointer shadow-sm"
              title={theme === 'dark' ? 'Mudar para Modo Claro (Alto Contraste)' : 'Mudar para Modo Escuro (Obsidian Biotech)'}
              aria-label="Alternar tema"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-800" />
              )}
            </button>

            {/* Trilingual Switcher (PT-BR vs EN vs PY) */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-800/90 rounded-xl p-1 border border-slate-300 dark:border-slate-700 font-mono text-xs">
              <button
                onClick={() => changeLang('pt')}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg font-bold transition-all ${
                  lang === 'pt'
                    ? 'bg-emerald-700 text-white shadow-sm'
                    : 'text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white'
                }`}
                title="Português (Brasil)"
              >
                <span>🇧🇷</span>
                <span>PT</span>
              </button>
              <button
                onClick={() => changeLang('en')}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg font-bold transition-all ${
                  lang === 'en'
                    ? 'bg-emerald-700 text-white shadow-sm'
                    : 'text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white'
                }`}
                title="English (US)"
              >
                <span>🇺🇸</span>
                <span>EN</span>
              </button>
              <button
                onClick={() => changeLang('py')}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg font-bold transition-all ${
                  lang === 'py'
                    ? 'bg-emerald-700 text-white shadow-sm'
                    : 'text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white'
                }`}
                title="Español (Paraguay)"
              >
                <span>🇵🇾</span>
                <span>PY</span>
              </button>
            </div>

            {/* Admin Link Button */}
            <Link
              href="/admin"
              className="flex items-center gap-1.5 text-xs bg-slate-100 hover:bg-slate-200 text-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300 dark:hover:text-white p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 transition shadow-sm"
              title="Painel Administrativo"
            >
              <Lock className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
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
