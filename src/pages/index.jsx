import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import QRCameraScanner from '../components/QRCameraScanner';
import { useLanguage } from '../context/LanguageContext';
import { 
  ShieldCheck, 
  QrCode, 
  Search, 
  Camera, 
  CheckCircle2, 
  AlertTriangle, 
  FlaskConical, 
  FileCheck2, 
  Layers,
  ArrowRight,
  Activity,
  Lock,
  ExternalLink,
  ChevronRight,
  Sparkles
} from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const { lang, t } = useLanguage();
  const [inputCode, setInputCode] = useState('');
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [activeTabChromato, setActiveTabChromato] = useState('ghk');

  useEffect(() => {
    fetch('/api/admin/products')
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error(err));
  }, []);

  const handleVerify = (e) => {
    e.preventDefault();
    const clean = inputCode.trim();
    if (!clean) return;
    router.push(`/v/${encodeURIComponent(clean)}`);
  };

  const filteredProducts = selectedCategory === 'ALL' 
    ? products 
    : products.filter(p => p.category?.toLowerCase().includes(selectedCategory.toLowerCase()));

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-emerald-500 selection:text-white transition-colors duration-150">
      <Navbar />

      {/* TECHNICAL REGISTRY HEADER TICKER */}
      <div className="border-b border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 backdrop-blur text-[11px] font-mono tracking-wider py-2 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-semibold text-slate-700 dark:text-slate-300">PSL LABS S.A.</span>
            <span>•</span>
            <span>{t.hero.regLine}</span>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <span>SALA LIMPIA CLASE 100</span>
            <span>•</span>
            <span>ESTÁNDAR DIN EN ISO 9001</span>
            <span>•</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-bold">ASUNCIÓN / PY</span>
          </div>
        </div>
      </div>

      <main className="flex-grow">
        
        {/* HERO SECTION: PRECISION ANALYTICAL TERMINAL */}
        <section id="verify" className="relative border-b border-slate-200 dark:border-slate-800 py-12 lg:py-16 bg-white dark:bg-slate-950">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              
              {/* Left Column: Heading & Verification Terminal */}
              <div className="lg:col-span-7 space-y-6">
                
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/80 text-emerald-700 dark:text-emerald-400 text-xs font-mono font-medium uppercase tracking-wider">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{t.hero.badge}</span>
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-950 dark:text-white tracking-tight leading-[1.15]">
                  {t.hero.title}
                </h1>

                <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
                  {t.hero.subtitle}
                </p>

                {/* Analytical Instrument Console */}
                <div className="rounded-xl border border-slate-300 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-900/90 p-5 sm:p-7 shadow-sm">
                  
                  <div className="flex items-center justify-between text-xs font-mono text-slate-500 dark:text-slate-400 mb-3 pb-2 border-b border-slate-200 dark:border-slate-800">
                    <span className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-300 uppercase">
                      <QrCode className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      {lang === 'py' ? 'Terminal de Consulta Serial' : 'Terminal de Consulta Serial'}
                    </span>
                    <span className="text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      ONLINE
                    </span>
                  </div>

                  <form onSubmit={handleVerify} className="space-y-3">
                    <div className="relative">
                      <input
                        type="text"
                        value={inputCode}
                        onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                        placeholder={t.hero.inputPlaceholder}
                        className="w-full px-4 py-3.5 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-950 dark:text-white font-mono text-base uppercase tracking-widest placeholder:text-slate-400 placeholder:normal-case placeholder:tracking-normal focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <button
                        type="submit"
                        disabled={!inputCode.trim()}
                        className="w-full bg-emerald-600 hover:bg-emerald-500 active:scale-[0.99] disabled:opacity-50 text-white font-bold py-3.5 px-4 rounded-lg flex items-center justify-center gap-2 transition cursor-pointer text-sm shadow-sm"
                      >
                        <Search className="w-4 h-4" />
                        <span>{t.hero.verifyBtn}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setIsCameraOpen(true)}
                        className="w-full bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 active:scale-[0.99] text-slate-800 dark:text-slate-100 font-bold py-3.5 px-4 rounded-lg border border-slate-300 dark:border-slate-700 flex items-center justify-center gap-2 transition cursor-pointer text-sm"
                      >
                        <Camera className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        <span>{t.hero.scanCameraBtn}</span>
                      </button>
                    </div>
                  </form>

                  {/* Micro Quick Samples */}
                  <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 text-xs flex flex-wrap items-center justify-between gap-2">
                    <span className="text-slate-500 dark:text-slate-400 font-mono text-[11px]">
                      {t.hero.quickExamples}
                    </span>
                    <div className="flex items-center gap-2 font-mono text-[11px]">
                      <button
                        type="button"
                        onClick={() => router.push('/v/GHK50-EO0HH')}
                        className="text-emerald-700 dark:text-emerald-400 hover:underline font-semibold"
                      >
                        GHK50-EO0HH (1ª Consulta)
                      </button>
                      <span className="text-slate-300 dark:text-slate-700">|</span>
                      <button
                        type="button"
                        onClick={() => router.push('/v/TRZ30-PY991')}
                        className="text-sky-700 dark:text-sky-400 hover:underline font-semibold"
                      >
                        TRZ30-PY991 (Tirzepatida)
                      </button>
                      <span className="text-slate-300 dark:text-slate-700">|</span>
                      <button
                        type="button"
                        onClick={() => router.push('/v/PSL-ALERT-DEMO')}
                        className="text-amber-700 dark:text-amber-400 hover:underline font-semibold"
                      >
                        Alerta Duplicidade
                      </button>
                    </div>
                  </div>

                </div>

                {/* Assurance Metrics Row */}
                <div className="grid grid-cols-3 gap-3 text-xs font-mono text-slate-600 dark:text-slate-400">
                  <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50">
                    <div className="text-slate-400 text-[10px] uppercase">Pureza Mínima</div>
                    <div className="text-emerald-600 dark:text-emerald-400 font-bold text-sm">≥ 99.2% HPLC</div>
                  </div>
                  <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50">
                    <div className="text-slate-400 text-[10px] uppercase">Rastreamento</div>
                    <div className="text-slate-900 dark:text-white font-bold text-sm">1 Código / Vial</div>
                  </div>
                  <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50">
                    <div className="text-slate-400 text-[10px] uppercase">Origem Laboratorial</div>
                    <div className="text-slate-900 dark:text-white font-bold text-sm">Paraguay S.A.</div>
                  </div>
                </div>

              </div>

              {/* Right Column: Specimen Showcase Visual (Authentic Real Photographic Renders) */}
              <div className="lg:col-span-5">
                <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
                  
                  {/* Card Header */}
                  <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950/60 font-mono text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span className="font-bold text-slate-800 dark:text-slate-200">ESPECIMEN OFICIAL #TRZ-2026</span>
                    </div>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">LOTE 2026-01</span>
                  </div>

                  {/* Real Product Image Showcase */}
                  <div className="relative h-64 sm:h-72 overflow-hidden bg-slate-100 dark:bg-slate-950 flex items-center justify-center p-4">
                    <img 
                      src="/images/tirzepatida-box-kit.jpg"
                      alt="Kit Tirzepatida PSL LABS"
                      className="max-h-full max-w-full object-contain hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute bottom-3 left-3 bg-white/95 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-700/80 px-2.5 py-1 rounded text-[11px] font-mono text-slate-700 dark:text-slate-300 shadow-sm">
                      Kit Estuche 4x 3ml • Liofilizado
                    </div>
                    <div className="absolute bottom-3 right-3 bg-emerald-600 text-white px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase font-mono shadow-sm">
                      HPLC 99.5%
                    </div>
                  </div>

                  {/* Laboratory Parameters Strip */}
                  <div className="p-4 space-y-2.5 text-xs font-mono border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30">
                    <div className="flex justify-between items-center py-1 border-b border-slate-200 dark:border-slate-800/60">
                      <span className="text-slate-500 dark:text-slate-400">Compuesto Activo:</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">Tirzepatida (GIP/GLP-1)</span>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-slate-200 dark:border-slate-800/60">
                      <span className="text-slate-500 dark:text-slate-400">Fórmula Molecular:</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">C₂₂₅H₃₄₈N₄₈O₆₈</span>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-slate-200 dark:border-slate-800/60">
                      <span className="text-slate-500 dark:text-slate-400">Espectrometría ESI-MS:</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">4813.5 Da (Conforme)</span>
                    </div>
                    <div className="flex justify-between items-center pt-1">
                      <span className="text-slate-500 dark:text-slate-400">Atmósfera de Envase:</span>
                      <span className="text-slate-800 dark:text-slate-200">Nitrógeno Grado Farmacéutico</span>
                    </div>
                  </div>

                  {/* Card Action Footer */}
                  <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex gap-2">
                    <Link
                      href="/product/tirzepatida"
                      className="flex-1 py-2 text-center text-xs font-bold uppercase tracking-wider rounded border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                    >
                      Ver Monografía
                    </Link>
                    <button
                      type="button"
                      onClick={() => router.push('/v/TRZ30-PY991')}
                      className="flex-1 py-2 text-center text-xs font-bold uppercase tracking-wider rounded bg-emerald-600 hover:bg-emerald-500 text-white transition cursor-pointer"
                    >
                      Test de Lote
                    </button>
                  </div>

                </div>
              </div>

            </div>
          </div>
        </section>

        {/* SECTION 2: HPLC CHROMATOGRAM & INSTRUMENTAL SPECIFICATIONS */}
        <section id="chromatography" className="py-16 border-b border-slate-200 dark:border-slate-800 bg-slate-100/70 dark:bg-slate-900/40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
              <div>
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800/70 text-sky-700 dark:text-sky-400 text-xs font-mono font-medium uppercase tracking-wider mb-2">
                  <Activity className="w-3.5 h-3.5" />
                  <span>{t.chromatogram.badge}</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 dark:text-white tracking-tight">
                  {t.chromatogram.title}
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-400 max-w-2xl mt-1">
                  {t.chromatogram.subtitle}
                </p>
              </div>

              {/* Sample Selector Tabs */}
              <div className="inline-flex rounded-lg border border-slate-300 dark:border-slate-700 p-1 bg-white dark:bg-slate-900 font-mono text-xs">
                <button
                  onClick={() => setActiveTabChromato('ghk')}
                  className={`px-3 py-1.5 rounded font-semibold transition ${
                    activeTabChromato === 'ghk'
                      ? 'bg-emerald-600 text-white'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  GHK-Cu 50mg (tR 4.82m)
                </button>
                <button
                  onClick={() => setActiveTabChromato('tirz')}
                  className={`px-3 py-1.5 rounded font-semibold transition ${
                    activeTabChromato === 'tirz'
                      ? 'bg-emerald-600 text-white'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Tirzepatida (tR 8.14m)
                </button>
              </div>
            </div>

            {/* HPLC Chromatogram Display Board */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              
              {/* Chromatogram Vector Curve */}
              <div className="lg:col-span-8 rounded-xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-950 p-5 sm:p-6 flex flex-col justify-between shadow-sm">
                
                <div className="flex items-center justify-between text-xs font-mono border-b border-slate-200 dark:border-slate-800 pb-3 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      CROMATOGRAMA DE FASE REVERSA (RP-HPLC)
                    </span>
                    <span className="text-[10px] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-600 dark:text-slate-400">
                      DETECTOR UV 214nm
                    </span>
                  </div>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                    PICO PRINCIPAL: {activeTabChromato === 'ghk' ? '99.4%' : '99.5%'}
                  </span>
                </div>

                {/* SVG HPLC Chromatogram Curve */}
                <div className="relative w-full h-56 sm:h-64 my-2">
                  <svg className="w-full h-full" viewBox="0 0 600 220" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* Grid Lines */}
                    <line x1="40" y1="20" x2="580" y2="20" stroke="currentColor" strokeOpacity="0.08" strokeDasharray="3 3" />
                    <line x1="40" y1="60" x2="580" y2="60" stroke="currentColor" strokeOpacity="0.08" strokeDasharray="3 3" />
                    <line x1="40" y1="100" x2="580" y2="100" stroke="currentColor" strokeOpacity="0.08" strokeDasharray="3 3" />
                    <line x1="40" y1="140" x2="580" y2="140" stroke="currentColor" strokeOpacity="0.08" strokeDasharray="3 3" />
                    <line x1="40" y1="180" x2="580" y2="180" stroke="currentColor" strokeOpacity="0.15" />

                    {/* Vertical Time Markers */}
                    <line x1="40" y1="20" x2="40" y2="180" stroke="currentColor" strokeOpacity="0.15" />
                    <line x1="160" y1="20" x2="160" y2="180" stroke="currentColor" strokeOpacity="0.08" strokeDasharray="3 3" />
                    <line x1="280" y1="20" x2="280" y2="180" stroke="currentColor" strokeOpacity="0.08" strokeDasharray="3 3" />
                    <line x1="400" y1="20" x2="400" y2="180" stroke="currentColor" strokeOpacity="0.08" strokeDasharray="3 3" />
                    <line x1="520" y1="20" x2="520" y2="180" stroke="currentColor" strokeOpacity="0.08" strokeDasharray="3 3" />

                    {/* Peak Area Fill & Chromatographic Peak Curve */}
                    {activeTabChromato === 'ghk' ? (
                      <>
                        {/* Peak Fill */}
                        <path 
                          d="M40 180 L180 180 Q215 179 230 160 Q240 120 245 35 Q247 18 250 35 Q255 120 265 160 Q275 179 320 180 L580 180 Z" 
                          fill="url(#gradient-hplc)" 
                          opacity="0.25"
                        />
                        {/* Peak Stroke */}
                        <path 
                          d="M40 180 L180 180 Q215 179 230 160 Q240 120 245 35 Q247 18 250 35 Q255 120 265 160 Q275 179 320 180 L580 180" 
                          stroke="#10b981" 
                          strokeWidth="2.5" 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                        />
                        {/* Annotation Callout */}
                        <circle cx="248" cy="22" r="3.5" fill="#10b981" />
                        <line x1="248" y1="22" x2="280" y2="22" stroke="#10b981" strokeWidth="1.2" />
                        <text x="286" y="26" fill="#10b981" fontSize="11" fontFamily="monospace" fontWeight="bold">
                          tR = 4.82 min (99.4%)
                        </text>
                      </>
                    ) : (
                      <>
                        {/* Peak Fill for Tirzepatide */}
                        <path 
                          d="M40 180 L280 180 Q320 179 340 155 Q355 100 360 30 Q362 16 365 30 Q370 100 385 155 Q405 179 450 180 L580 180 Z" 
                          fill="url(#gradient-hplc-sky)" 
                          opacity="0.25"
                        />
                        {/* Peak Stroke */}
                        <path 
                          d="M40 180 L280 180 Q320 179 340 155 Q355 100 360 30 Q362 16 365 30 Q370 100 385 155 Q405 179 450 180 L580 180" 
                          stroke="#0284c7" 
                          strokeWidth="2.5" 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                        />
                        {/* Annotation Callout */}
                        <circle cx="363" cy="20" r="3.5" fill="#0284c7" />
                        <line x1="363" y1="20" x2="400" y2="20" stroke="#0284c7" strokeWidth="1.2" />
                        <text x="406" y="24" fill="#0284c7" fontSize="11" fontFamily="monospace" fontWeight="bold">
                          tR = 8.14 min (99.5%)
                        </text>
                      </>
                    )}

                    {/* Gradient Definitions */}
                    <defs>
                      <linearGradient id="gradient-hplc" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                      </linearGradient>
                      <linearGradient id="gradient-hplc-sky" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#0284c7" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#0284c7" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>

                {/* Axis Labels */}
                <div className="flex justify-between text-[11px] font-mono text-slate-400 pt-2 border-t border-slate-200 dark:border-slate-800">
                  <span>0.0 min (Inyección)</span>
                  <span>4.0 min</span>
                  <span>8.0 min</span>
                  <span>12.0 min</span>
                  <span>16.0 min (Gradiente Final)</span>
                </div>

              </div>

              {/* Analytical Method Parameters Card */}
              <div className="lg:col-span-4 rounded-xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-950 p-5 flex flex-col justify-between shadow-sm">
                <div>
                  <h3 className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-4 pb-2 border-b border-slate-200 dark:border-slate-800">
                    Parámetros del Método Instrumental
                  </h3>

                  <div className="space-y-3 text-xs font-mono">
                    <div>
                      <div className="text-slate-400 text-[10px] uppercase">Columna Analítica</div>
                      <div className="font-semibold text-slate-800 dark:text-slate-200">
                        C18 Hypersil Gold (4.6 x 250 mm, 5 µm)
                      </div>
                    </div>

                    <div>
                      <div className="text-slate-400 text-[10px] uppercase">Fase Móvil (A / B)</div>
                      <div className="font-semibold text-slate-800 dark:text-slate-200">
                        A: 0.1% TFA en H₂O | B: 0.1% TFA en ACN
                      </div>
                    </div>

                    <div>
                      <div className="text-slate-400 text-[10px] uppercase">Vazão &amp; Temperatura</div>
                      <div className="font-semibold text-slate-800 dark:text-slate-200">
                        1.0 mL/min • 25°C Isocrático/Gradiente
                      </div>
                    </div>

                    <div>
                      <div className="text-slate-400 text-[10px] uppercase">Contenido de Endotoxinas</div>
                      <div className="font-bold text-emerald-600 dark:text-emerald-400">
                        &lt; 0.01 EU/mg (LAL Test Aprobado)
                      </div>
                    </div>

                    <div>
                      <div className="text-slate-400 text-[10px] uppercase">Estado de Liofilizado</div>
                      <div className="font-semibold text-slate-800 dark:text-slate-200">
                        Polvo Amorfo Blanco Estéril (Vial Sellado)
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-200 dark:border-slate-800">
                  <button
                    onClick={() => alert("El informe analítico completo (COA) se encuentra disponible al consultar el código único de cada frasco.")}
                    className="w-full py-2.5 px-3 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-mono font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <FileCheck2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>{t.chromatogram.downloadCOA}</span>
                  </button>
                </div>

              </div>

            </div>

          </div>
        </section>

        {/* SECTION 3: PRODUCT MONOGRAPH CATALOG */}
        <section id="products" className="py-16 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
              <div>
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/80 text-emerald-700 dark:text-emerald-400 text-xs font-mono font-medium uppercase tracking-wider mb-2">
                  <FlaskConical className="w-3.5 h-3.5" />
                  <span>{t.products.badge}</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 dark:text-white tracking-tight">
                  {t.products.title}
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-400 max-w-2xl mt-1">
                  {t.products.subtitle}
                </p>
              </div>

              {/* Category Filter */}
              <div className="flex flex-wrap gap-1.5 font-mono text-xs">
                {['ALL', 'Longevidade', 'Regeneração', 'Metabolismo'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-md transition ${
                      selectedCategory === cat
                        ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-bold'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800'
                    }`}
                  >
                    {cat === 'ALL' ? (lang === 'py' ? 'Todos los Péptidos' : 'Todos os Peptídeos') : cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Product Cards Grid: Clean High-Density Pharmaceutical Architecture */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredProducts.map((p) => {
                const desc = lang === 'py' ? p.description_py : p.description_pt;
                const isTirz = p.id === 'tirzepatida';
                const isGHK = p.id === 'ghk-cu-50mg';

                return (
                  <div
                    key={p.id}
                    className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden flex flex-col justify-between hover:border-slate-400 dark:hover:border-slate-700 hover:-translate-y-0.5 transition-all duration-200 shadow-sm"
                  >
                    <div>
                      {/* Photo Header */}
                      <div className="relative h-48 bg-slate-100 dark:bg-slate-950 overflow-hidden flex items-center justify-center p-3">
                        <img
                          src={p.image}
                          alt={p.name}
                          className="max-h-full max-w-full object-contain hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-2.5 right-2.5 bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800 font-mono text-[10px] font-bold px-2 py-0.5 rounded text-emerald-600 dark:text-emerald-400 shadow-sm">
                          {p.purity}
                        </div>
                        <div className="absolute bottom-2.5 left-2.5 bg-slate-900/80 backdrop-blur text-white font-mono text-[10px] px-2 py-0.5 rounded">
                          {p.concentration}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-4 space-y-2">
                        <div className="text-[10px] font-mono text-emerald-700 dark:text-emerald-400 uppercase tracking-wider font-semibold">
                          {p.category}
                        </div>

                        <h3 className="font-extrabold text-base text-slate-950 dark:text-white leading-tight">
                          {p.name}
                        </h3>

                        <p className="text-xs font-mono text-slate-500 dark:text-slate-400 truncate">
                          {p.chemicalName}
                        </p>

                        <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed pt-1">
                          {desc}
                        </p>
                      </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="p-4 pt-0 space-y-2">
                      <div className="text-[11px] font-mono text-slate-400 border-t border-slate-100 dark:border-slate-800/80 pt-2 flex justify-between">
                        <span>Formato:</span>
                        <span className="text-slate-700 dark:text-slate-300 font-semibold">{p.presentation}</span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <Link
                          href={`/product/${p.id}`}
                          className="w-full py-2 text-center rounded border border-slate-300 dark:border-slate-700 font-mono text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                        >
                          {t.products.viewProduct}
                        </Link>
                        <button
                          type="button"
                          onClick={() => {
                            if (isGHK) setInputCode('GHK50-EO0HH');
                            else if (isTirz) setInputCode('TRZ30-PY991');
                            else setInputCode('PSL-TEST-ORIGINAL');
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className="w-full py-2 text-center rounded bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold transition cursor-pointer"
                        >
                          {t.products.verifyThis}
                        </button>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>

          </div>
        </section>

        {/* SECTION 4: ANTI-COUNTERFEIT SECURITY ARCHITECTURE (THREE-LAYER PROTOCOL) */}
        <section id="security" className="py-16 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="max-w-3xl mb-12">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-mono font-medium uppercase tracking-wider mb-2">
                <Lock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>{t.security.badge}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 dark:text-white tracking-tight">
                {t.security.title}
              </h2>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mt-2">
                {t.security.subtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Layer 1 */}
              <div className="p-6 rounded-xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="font-mono text-xs text-emerald-600 dark:text-emerald-400 font-bold mb-2">
                    CAMADA 01 • CRIPTOGRAFÍA
                  </div>
                  <h3 className="text-base font-bold text-slate-950 dark:text-white mb-2">
                    {t.security.layer1Title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {t.security.layer1Desc}
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80 font-mono text-[11px] text-slate-400 flex items-center justify-between">
                  <span>Algoritmo:</span>
                  <span className="font-bold text-slate-700 dark:text-slate-300">SHA-256 Unidireccional</span>
                </div>
              </div>

              {/* Layer 2 */}
              <div className="p-6 rounded-xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="font-mono text-xs text-sky-600 dark:text-sky-400 font-bold mb-2">
                    CAMADA 02 • TAMPER-EVIDENT
                  </div>
                  <h3 className="text-base font-bold text-slate-950 dark:text-white mb-2">
                    {t.security.layer2Title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {t.security.layer2Desc}
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80 font-mono text-[11px] text-slate-400 flex items-center justify-between">
                  <span>Substrato:</span>
                  <span className="font-bold text-slate-700 dark:text-slate-300">Vinil Destrutível Casca de Ovo</span>
                </div>
              </div>

              {/* Layer 3 */}
              <div className="p-6 rounded-xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="font-mono text-xs text-purple-600 dark:text-purple-400 font-bold mb-2">
                    CAMADA 03 • ANÁLISIS HPLC
                  </div>
                  <h3 className="text-base font-bold text-slate-950 dark:text-white mb-2">
                    {t.security.layer3Title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {t.security.layer3Desc}
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80 font-mono text-[11px] text-slate-400 flex items-center justify-between">
                  <span>Certificación:</span>
                  <span className="font-bold text-slate-700 dark:text-slate-300">COA Tercero Acreditado</span>
                </div>
              </div>

            </div>

          </div>
        </section>

      </main>

      <Footer />

      {/* QR Camera Scanner Modal */}
      <QRCameraScanner
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
      />
    </div>
  );
}
