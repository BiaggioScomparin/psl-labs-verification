import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
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
  Sparkles,
  Award,
  Clock,
  Check,
  Printer,
  X
} from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const { lang, t } = useLanguage();
  const [inputCode, setInputCode] = useState('');
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [activeTabChromato, setActiveTabChromato] = useState('ghk');
  const [isCoaModalOpen, setIsCoaModalOpen] = useState(false);

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
    <div className="min-h-screen flex flex-col bg-[#F4F6F8] dark:bg-[#070A11] text-[#0B0F17] dark:text-[#F8FAFC] selection:bg-[#047857] selection:text-white font-sans transition-colors duration-200">
      <Head>
        <title>PSL LABS | Premium Synthesis Line — The Science of Regeneration</title>
        <meta name="description" content="Sistema Oficial de Verificação de Lotes, QR Code Criptográfico e Protocolos Peptídicos de Alta Pureza. PSL LABS S.A. Paraguai." />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500;600;700&family=Montserrat:wght@600;700;800&family=Syne:wght@600;700;800&display=swap" rel="stylesheet" />
      </Head>

      <Navbar />

      {/* TECHNICAL CLINICAL TICKER (HIGH CONTRAST) */}
      <aside className="border-b border-slate-300 dark:border-slate-800 bg-white dark:bg-[#0D121F] py-2.5 px-4 text-xs font-mono tracking-wider text-slate-700 dark:text-slate-300 shadow-sm transition-colors">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-emerald-600 dark:bg-emerald-400 animate-pulse" />
            <strong className="text-slate-900 dark:text-white font-bold tracking-wider">PSL LABS S.A.</strong>
            <span className="text-slate-400">|</span>
            <span className="font-semibold text-emerald-800 dark:text-emerald-400">{t.hero.regLine}</span>
          </div>
          <div className="hidden md:flex items-center gap-5 text-slate-600 dark:text-slate-400 font-semibold">
            <span>SALA LIMPA CLASSE 100</span>
            <span>•</span>
            <span>DIN EN ISO 9001:2015</span>
            <span>•</span>
            <span className="text-emerald-700 dark:text-emerald-400 font-bold">ASUNCIÓN / CIUDAD DEL ESTE</span>
          </div>
        </div>
      </aside>

      <main className="flex-grow">
        
        {/* HERO SECTION: THE SCIENCE OF REGENERATION & BATCH VERIFICATION TERMINAL */}
        <section id="verify" className="relative pt-14 pb-20 lg:pt-20 lg:pb-28 border-b border-slate-300 dark:border-slate-800 bg-white dark:bg-[#070A11] transition-colors">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
              
              {/* Left Column: Heading & Verification Terminal */}
              <div className="lg:col-span-7 space-y-6">
                
                <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-emerald-600/40 dark:border-emerald-500/50 bg-emerald-50 dark:bg-emerald-950/70 text-xs font-mono font-bold tracking-wider text-emerald-900 dark:text-emerald-300 shadow-sm">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 dark:bg-emerald-400" />
                  <span>{t.hero.badge}</span>
                </div>

                <h1 
                  className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-[0.12em] uppercase text-slate-950 dark:text-white leading-[1.14]"
                  style={{ fontFamily: 'Syne, sans-serif' }}
                >
                  {t.hero.title}
                </h1>

                <p className="text-base sm:text-xl text-slate-700 dark:text-slate-300 leading-relaxed max-w-xl font-normal">
                  {t.hero.subtitle}
                </p>

                {/* Analytical Verification Instrument Console (Old Site Functionality Elevated) */}
                <div className="rounded-2xl border border-slate-300 dark:border-slate-800 bg-[#F4F6F8] dark:bg-[#0D121F] p-6 sm:p-7 shadow-xl">
                  
                  <div className="flex items-center justify-between text-xs font-mono mb-3 pb-2.5 border-b border-slate-300 dark:border-slate-800">
                    <span className="flex items-center gap-2 font-bold text-slate-900 dark:text-white uppercase tracking-wider text-xs">
                      <QrCode className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                      {t.hero.terminalBadge}
                    </span>
                    <span className="text-xs text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5 font-bold">
                      <span className="w-2 h-2 rounded-full bg-emerald-600 dark:bg-emerald-400" />
                      SISTEMA ONLINE
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-400 mb-4">
                    {t.hero.terminalSub}
                  </p>

                  <form onSubmit={handleVerify} className="space-y-3">
                    <div className="relative">
                      <input
                        type="text"
                        value={inputCode}
                        onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                        placeholder={t.hero.inputPlaceholder}
                        className="w-full px-4 py-4 bg-white dark:bg-[#05080E] border border-slate-300 dark:border-slate-700 rounded-xl text-slate-950 dark:text-white font-mono text-base uppercase tracking-widest placeholder:text-slate-400 placeholder:normal-case placeholder:tracking-normal focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition shadow-inner font-bold"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <button
                        type="submit"
                        disabled={!inputCode.trim()}
                        className="w-full bg-emerald-700 hover:bg-emerald-600 active:scale-[0.98] disabled:opacity-50 text-white font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition cursor-pointer text-xs uppercase tracking-wider shadow-md"
                        style={{ fontFamily: 'Montserrat, sans-serif' }}
                      >
                        <Search className="w-4 h-4" />
                        <span>{t.hero.verifyBtn}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setIsCameraOpen(true)}
                        className="w-full bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 active:scale-[0.98] text-slate-900 dark:text-white font-bold py-3.5 px-4 rounded-xl border border-slate-300 dark:border-slate-700 flex items-center justify-center gap-2 transition cursor-pointer text-xs uppercase tracking-wider shadow-sm"
                        style={{ fontFamily: 'Montserrat, sans-serif' }}
                      >
                        <Camera className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                        <span>{t.hero.scanCameraBtn}</span>
                      </button>
                    </div>
                  </form>

                  {/* Micro Quick Samples */}
                  <div className="mt-4 pt-3.5 border-t border-slate-300 dark:border-slate-800 text-xs flex flex-wrap items-center justify-between gap-2 font-mono">
                    <span className="text-slate-500 dark:text-slate-400 text-xs font-semibold">
                      {t.hero.quickExamples}
                    </span>
                    <div className="flex items-center gap-2 font-bold">
                      <button
                        type="button"
                        onClick={() => router.push('/v/GHK50-EO0HH')}
                        className="text-emerald-700 dark:text-emerald-400 hover:underline"
                      >
                        GHK50-EO0HH (1ª Consulta)
                      </button>
                      <span className="text-slate-400">|</span>
                      <button
                        type="button"
                        onClick={() => router.push('/v/TRZ30-PY991')}
                        className="text-sky-700 dark:text-sky-400 hover:underline"
                      >
                        TRZ30-PY991 (Tirzepatida)
                      </button>
                      <span className="text-slate-400">|</span>
                      <button
                        type="button"
                        onClick={() => router.push('/v/PSL-ALERT-DEMO')}
                        className="text-amber-700 dark:text-amber-400 hover:underline"
                      >
                        Alerta Duplicidade
                      </button>
                    </div>
                  </div>

                </div>

                {/* Assurance Metrics Row */}
                <div className="grid grid-cols-3 gap-3 text-xs font-mono text-slate-700 dark:text-slate-300">
                  <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-sm">
                    <div className="text-slate-500 text-[10px] uppercase font-semibold">Pureza Mínima</div>
                    <div className="text-emerald-700 dark:text-emerald-400 font-bold text-sm">≥ 99.2% HPLC</div>
                  </div>
                  <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-sm">
                    <div className="text-slate-500 text-[10px] uppercase font-semibold">Rastreamento</div>
                    <div className="text-slate-950 dark:text-white font-bold text-sm">1 Código / Frasco</div>
                  </div>
                  <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-sm">
                    <div className="text-slate-500 text-[10px] uppercase font-semibold">Origem Oficial</div>
                    <div className="text-slate-950 dark:text-white font-bold text-sm">Paraguay S.A.</div>
                  </div>
                </div>

              </div>

              {/* Right Column: Specimen Showcase Visual (High Contrast Product Presentation) */}
              <div className="lg:col-span-5">
                <div className="relative rounded-2xl bg-white dark:bg-[#0D121F] border border-slate-300 dark:border-slate-800 p-6 sm:p-8 shadow-xl overflow-hidden">
                  
                  {/* Card Header */}
                  <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-200 dark:border-slate-800 text-xs font-mono">
                    <div>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-semibold uppercase">REFERENCE PROTOCOL</span>
                      <span className="font-bold text-slate-950 dark:text-white text-sm">PSL-GHK-10MG</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-semibold uppercase">ESTABLISHED PURITY</span>
                      <span className="text-emerald-700 dark:text-emerald-400 font-extrabold text-sm">99.4% (HPLC)</span>
                    </div>
                  </div>

                  {/* High Contrast Product Visual Container */}
                  <div className="relative h-72 sm:h-80 bg-slate-100 dark:bg-[#05080E] rounded-xl overflow-hidden flex items-center justify-center p-6 border border-slate-200 dark:border-slate-800">
                    <img 
                      src="/images/ghk-cu-50mg-vial-50x30.jpg" 
                      alt="Formula 01: GHK-Cu 10mg Clinical Vial" 
                      className="max-h-full max-w-full object-contain filter drop-shadow-2xl hover:scale-105 transition-transform duration-500"
                    />

                    {/* Spec Pill */}
                    <div className="absolute bottom-4 left-4 bg-white/95 dark:bg-slate-900/95 border border-slate-300 dark:border-slate-700 px-3 py-1.5 rounded-lg text-xs font-mono font-bold text-slate-900 dark:text-white shadow-md">
                      10mg Lyophilized Powder + 5ml Vehicle
                    </div>
                    <div className="absolute top-4 right-4 bg-emerald-700 text-white px-3 py-1 rounded-lg text-xs font-mono tracking-wider uppercase font-bold shadow-sm">
                      Batch: #2026-X1
                    </div>
                  </div>

                  {/* Chemical Coordinates */}
                  <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2.5 text-xs font-mono">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 dark:text-slate-400">Active Tripeptide:</span>
                      <span className="font-bold text-slate-950 dark:text-white">Copper Tripeptide-1 (GHK-Cu)</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 dark:text-slate-400">Molecular Weight:</span>
                      <span className="font-semibold text-slate-950 dark:text-white">403.94 g/mol</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 dark:text-slate-400">Biological Function:</span>
                      <span className="text-emerald-700 dark:text-emerald-400 font-bold">Pro-Collagen I &amp; III Synthesis</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
                    <Link
                      href="/product/ghk-cu-50mg"
                      className="flex-1 text-center py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold text-xs uppercase tracking-wider transition"
                      style={{ fontFamily: 'Montserrat, sans-serif' }}
                    >
                      {t.pharmacy.viewMonograph}
                    </Link>
                    <button 
                      type="button"
                      onClick={() => {
                        setInputCode('GHK50-EO0HH');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="flex-1 bg-emerald-700 hover:bg-emerald-600 active:scale-[0.98] text-white font-bold text-xs uppercase tracking-wider py-2.5 rounded-xl transition shadow-sm cursor-pointer"
                      style={{ fontFamily: 'Montserrat, sans-serif' }}
                    >
                      Testar Lote
                    </button>
                  </div>

                </div>
              </div>

            </div>
          </div>
        </section>

        {/* SECTION 2: THE FUTURE PHARMACY (PRODUCT MONOGRAPH GRID) */}
        <section id="formulas" className="py-24 border-b border-slate-300 dark:border-slate-800 bg-[#F4F6F8] dark:bg-[#070A11] transition-colors">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
              <div className="space-y-3">
                <span className="text-xs font-mono tracking-[0.2em] text-emerald-700 dark:text-emerald-400 uppercase font-extrabold block">
                  {t.pharmacy.badge}
                </span>
                <h2 
                  className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-[0.12em] uppercase text-slate-950 dark:text-white"
                  style={{ fontFamily: 'Syne, sans-serif' }}
                >
                  {t.pharmacy.title}
                </h2>
                <p className="text-base text-slate-700 dark:text-slate-300 max-w-2xl font-normal leading-relaxed">
                  {t.pharmacy.subtitle}
                </p>
              </div>

              {/* Protocol Filter Tabs */}
              <div className="flex flex-wrap gap-2 text-xs font-mono">
                {['ALL', 'Longevidade', 'Regeneração', 'Metabolismo'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2.5 rounded-xl transition font-bold cursor-pointer shadow-sm ${
                      selectedCategory === cat
                        ? 'border border-emerald-700 bg-emerald-700 text-white'
                        : 'border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 hover:border-emerald-600'
                    }`}
                  >
                    {cat === 'ALL' ? t.pharmacy.filterAll : cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Clinical Protocols Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map((p) => {
                const desc = lang === 'pt' ? p.description_pt : (lang === 'en' ? p.description_pt : p.description_py);
                const isGHK = p.id === 'ghk-cu-50mg';
                const isTirz = p.id === 'tirzepatida';

                return (
                  <div
                    key={p.id}
                    className={`bg-white dark:bg-[#0D121F] rounded-2xl border p-6 flex flex-col justify-between shadow-lg relative overflow-hidden group transition-all duration-300 ${
                      isGHK 
                        ? 'border-emerald-600/70 dark:border-emerald-500/60 ring-2 ring-emerald-600/30' 
                        : 'border-slate-300 dark:border-slate-800 hover:border-emerald-600 dark:hover:border-emerald-500'
                    }`}
                  >
                    {isGHK && (
                      <div className="absolute top-0 right-0 bg-emerald-700 text-white text-[11px] font-mono font-extrabold uppercase tracking-widest px-3.5 py-1 rounded-bl-xl shadow-sm">
                        {t.pharmacy.flagship}
                      </div>
                    )}

                    <div>
                      {/* Image Presentation */}
                      <div className="relative h-64 bg-slate-100 dark:bg-[#05080E] rounded-xl border border-slate-200 dark:border-slate-800 mb-6 flex items-center justify-center p-4 overflow-hidden">
                        <img 
                          src={p.image} 
                          alt={p.name} 
                          className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-500 drop-shadow-xl"
                        />
                        <span className="absolute bottom-3 left-3 bg-white/95 dark:bg-slate-900/95 border border-slate-300 dark:border-slate-700 text-xs font-mono font-bold px-2.5 py-1 rounded-lg text-slate-900 dark:text-white shadow-sm">
                          Pureza: <strong className="text-emerald-700 dark:text-emerald-400">{p.purity}</strong>
                        </span>
                        <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur text-white font-mono text-[11px] px-2.5 py-0.5 rounded-md font-bold">
                          {p.concentration}
                        </div>
                      </div>

                      {/* Monograph Identifiers */}
                      <div className="space-y-2 mb-4">
                        <div className="text-xs font-mono text-emerald-700 dark:text-emerald-400 font-extrabold uppercase tracking-wider">
                          {p.category}
                        </div>
                        <h3 
                          className="text-xl font-bold uppercase tracking-[0.08em] text-slate-950 dark:text-white"
                          style={{ fontFamily: 'Syne, sans-serif' }}
                        >
                          {p.name}
                        </h3>
                        <div className="text-xs font-mono text-slate-600 dark:text-slate-400 font-semibold truncate">
                          {p.chemicalName}
                        </div>
                        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed pt-2 line-clamp-3">
                          {desc}
                        </p>
                      </div>

                      {/* Technical Details Specs */}
                      <div className="py-3 border-t border-b border-slate-200 dark:border-slate-800 my-4 grid grid-cols-2 gap-2 text-xs font-mono text-slate-700 dark:text-slate-300">
                        <div>
                          <span className="text-slate-500 dark:text-slate-400 block text-[10px] uppercase font-semibold">Forma Farmacêutica</span>
                          <span className="font-bold text-slate-950 dark:text-white">{p.presentation}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 dark:text-slate-400 block text-[10px] uppercase font-semibold">Trazabilidade</span>
                          <span className="font-bold text-emerald-700 dark:text-emerald-400">QR Unitário Ativo</span>
                        </div>
                      </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="pt-2 grid grid-cols-2 gap-3">
                      <Link
                        href={`/product/${p.id}`}
                        className="py-3 text-center rounded-xl border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-bold text-xs uppercase tracking-wider hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                        style={{ fontFamily: 'Montserrat, sans-serif' }}
                      >
                        {t.pharmacy.viewMonograph}
                      </Link>
                      <button 
                        type="button"
                        onClick={() => {
                          if (isGHK) setInputCode('GHK50-EO0HH');
                          else if (isTirz) setInputCode('TRZ30-PY991');
                          else setInputCode('PSL-TEST-ORIGINAL');
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="py-3 text-center rounded-xl bg-emerald-700 hover:bg-emerald-600 active:scale-[0.98] text-white font-bold text-xs uppercase tracking-wider transition shadow-sm cursor-pointer"
                        style={{ fontFamily: 'Montserrat, sans-serif' }}
                      >
                        {t.hero.verifyBtn}
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>

          </div>
        </section>

        {/* SECTION 3: PURITY & TRUST (CERTIFICATE OF ANALYSIS - COA & HPLC) */}
        <section id="purity" className="py-24 border-b border-slate-300 dark:border-slate-800 bg-white dark:bg-[#0A0E17] transition-colors">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
              
              <div className="lg:col-span-5 space-y-6">
                
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-emerald-600/40 bg-emerald-50 dark:bg-emerald-950/70 text-xs font-mono font-bold text-emerald-900 dark:text-emerald-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 dark:bg-emerald-400" />
                  <span>{t.chromatogram.badge}</span>
                </div>

                <h2 
                  className="text-3xl sm:text-4xl font-extrabold tracking-[0.12em] uppercase text-slate-950 dark:text-white leading-tight"
                  style={{ fontFamily: 'Syne, sans-serif' }}
                >
                  {t.chromatogram.title}
                </h2>

                <p className="text-base text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
                  {t.chromatogram.subtitle}
                </p>

                <div className="space-y-4 pt-2">
                  <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 border border-emerald-600/30 flex items-center justify-center text-emerald-700 dark:text-emerald-400 shrink-0 mt-0.5">
                      <Check className="w-4 h-4 stroke-[3]" />
                    </div>
                    <div className="text-xs">
                      <strong className="text-slate-950 dark:text-white block font-bold text-sm mb-0.5">{t.chromatogram.trustPill1}</strong>
                      <span className="text-slate-600 dark:text-slate-400">Rejeição estrita em ensaio cromatográfico instrumental.</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 border border-emerald-600/30 flex items-center justify-center text-emerald-700 dark:text-emerald-400 shrink-0 mt-0.5">
                      <Check className="w-4 h-4 stroke-[3]" />
                    </div>
                    <div className="text-xs">
                      <strong className="text-slate-950 dark:text-white block font-bold text-sm mb-0.5">{t.chromatogram.trustPill2}</strong>
                      <span className="text-slate-600 dark:text-slate-400">Aprovado pelo ensaio LAL para segurança clínica total.</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 border border-emerald-600/30 flex items-center justify-center text-emerald-700 dark:text-emerald-400 shrink-0 mt-0.5">
                      <Check className="w-4 h-4 stroke-[3]" />
                    </div>
                    <div className="text-xs">
                      <strong className="text-slate-950 dark:text-white block font-bold text-sm mb-0.5">{t.chromatogram.trustPill3}</strong>
                      <span className="text-slate-600 dark:text-slate-400">Atmósfera estéril para proteção da estrutura terciária dos peptídeos.</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <button 
                    onClick={() => setIsCoaModalOpen(true)}
                    className="inline-flex items-center gap-2 bg-slate-950 hover:bg-emerald-700 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200 text-white font-bold text-xs uppercase tracking-[0.14em] py-4 px-7 rounded-xl transition cursor-pointer shadow-md"
                    style={{ fontFamily: 'Montserrat, sans-serif' }}
                  >
                    <span>{t.chromatogram.downloadCOA}</span>
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>

              </div>

              {/* Right Column: High Contrast Chromatogram Panel */}
              <div className="lg:col-span-7">
                <div className="bg-[#F4F6F8] dark:bg-[#0D121F] rounded-2xl border border-slate-300 dark:border-slate-800 p-6 sm:p-8 shadow-xl">
                  
                  <div className="border-b border-slate-300 dark:border-slate-800 pb-4 mb-6 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-bold text-xs font-mono shadow-sm">
                        CoA
                      </div>
                      <div>
                        <h3 
                          className="font-bold text-base tracking-wider text-slate-950 dark:text-white uppercase"
                          style={{ fontFamily: 'Syne, sans-serif' }}
                        >
                          Certificate of Analytical Release
                        </h3>
                        <p className="text-xs font-mono text-slate-600 dark:text-slate-400 font-semibold">ISO/IEC 17025 ACREDITADO • BATCH: #PSL-2026-X1</p>
                      </div>
                    </div>

                    {/* Switcher Tab between GHK-Cu and Tirzepatide */}
                    <div className="flex gap-1 bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-mono">
                      <button
                        onClick={() => setActiveTabChromato('ghk')}
                        className={`px-3 py-1.5 rounded-lg font-bold transition ${
                          activeTabChromato === 'ghk' ? 'bg-emerald-700 text-white' : 'text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        GHK-Cu 50mg
                      </button>
                      <button
                        onClick={() => setActiveTabChromato('tirz')}
                        className={`px-3 py-1.5 rounded-lg font-bold transition ${
                          activeTabChromato === 'tirz' ? 'bg-emerald-700 text-white' : 'text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        Tirzepatida
                      </button>
                    </div>
                  </div>

                  {/* Chromatographic Vector Plot with High-Contrast Grid */}
                  <div className="bg-white dark:bg-[#05080E] rounded-xl border border-slate-300 dark:border-slate-800 p-5 mb-6 shadow-sm">
                    <div className="flex items-center justify-between text-xs font-mono text-slate-700 dark:text-slate-300 mb-2 font-bold">
                      <span>RP-HPLC CHROMATOGRAM [λ=214nm]</span>
                      <span className="text-emerald-700 dark:text-emerald-400">
                        {activeTabChromato === 'ghk' ? 'PEAK RETENTION tR: 4.82 min' : 'PEAK RETENTION tR: 8.14 min'}
                      </span>
                    </div>

                    <div className="h-44 w-full">
                      <svg className="w-full h-full" viewBox="0 0 500 150" fill="none">
                        <line x1="20" y1="130" x2="480" y2="130" stroke="#94A3B8" strokeWidth="1.5" />
                        <line x1="20" y1="90" x2="480" y2="90" stroke="#CBD5E1" strokeWidth="1" strokeDasharray="3 3" />
                        <line x1="20" y1="50" x2="480" y2="50" stroke="#CBD5E1" strokeWidth="1" strokeDasharray="3 3" />

                        {activeTabChromato === 'ghk' ? (
                          <>
                            <path 
                              d="M20 130 L160 130 Q185 129 195 110 Q205 70 210 20 Q212 12 215 20 Q220 70 230 110 Q240 129 270 130 L480 130 Z" 
                              fill="rgba(16, 185, 129, 0.2)" 
                            />
                            <path 
                              d="M20 130 L160 130 Q185 129 195 110 Q205 70 210 20 Q212 12 215 20 Q220 70 230 110 Q240 129 270 130 L480 130" 
                              stroke="#059669" 
                              strokeWidth="2.5" 
                              fill="none" 
                            />
                            <circle cx="212" cy="14" r="4" fill="#059669" />
                            <line x1="212" y1="14" x2="250" y2="14" stroke="#059669" strokeWidth="1.5" />
                            <text x="256" y="18" fill="#059669" fontSize="11" fontFamily="monospace" fontWeight="bold">
                              Main Peak: 99.41% Area
                            </text>
                          </>
                        ) : (
                          <>
                            <path 
                              d="M20 130 L230 130 Q255 129 265 110 Q275 70 280 18 Q282 10 285 18 Q290 70 300 110 Q310 129 340 130 L480 130 Z" 
                              fill="rgba(2, 132, 199, 0.2)" 
                            />
                            <path 
                              d="M20 130 L230 130 Q255 129 265 110 Q275 70 280 18 Q282 10 285 18 Q290 70 300 110 Q310 129 340 130 L480 130" 
                              stroke="#0284c7" 
                              strokeWidth="2.5" 
                              fill="none" 
                            />
                            <circle cx="282" cy="12" r="4" fill="#0284c7" />
                            <line x1="282" y1="12" x2="320" y2="12" stroke="#0284c7" strokeWidth="1.5" />
                            <text x="326" y="16" fill="#0284c7" fontSize="11" fontFamily="monospace" fontWeight="bold">
                              Main Peak: 99.52% Area
                            </text>
                          </>
                        )}
                      </svg>
                    </div>

                    <div className="flex justify-between text-xs font-mono text-slate-500 dark:text-slate-400 pt-1 font-semibold">
                      <span>0.0 min</span>
                      <span>3.0 min</span>
                      <span>6.0 min</span>
                      <span>9.0 min</span>
                      <span>12.0 min</span>
                    </div>
                  </div>

                  {/* Lab Test Parameters Table */}
                  <div className="border border-slate-300 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-[#05080E] text-xs font-mono shadow-sm">
                    <table className="w-full text-left">
                      <thead className="bg-slate-100 dark:bg-slate-900 border-b border-slate-300 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 uppercase font-bold">
                        <tr>
                          <th className="py-3 px-4">Test Parameter</th>
                          <th className="py-3 px-4">Specification</th>
                          <th className="py-3 px-4 text-right">Result</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-900 dark:text-slate-100 font-semibold">
                        <tr>
                          <td className="py-2.5 px-4 text-slate-700 dark:text-slate-300">Appearance</td>
                          <td className="py-2.5 px-4 text-slate-500 dark:text-slate-400">Fine white/blue cake</td>
                          <td className="py-2.5 px-4 text-right text-emerald-700 dark:text-emerald-400 font-bold">Conforms</td>
                        </tr>
                        <tr>
                          <td className="py-2.5 px-4 text-slate-700 dark:text-slate-300">HPLC Chromatographic Purity</td>
                          <td className="py-2.5 px-4 text-slate-500 dark:text-slate-400">≥ 99.0%</td>
                          <td className="py-2.5 px-4 text-right font-extrabold text-emerald-700 dark:text-emerald-400">
                            {activeTabChromato === 'ghk' ? '99.41%' : '99.52%'}
                          </td>
                        </tr>
                        <tr>
                          <td className="py-2.5 px-4 text-slate-700 dark:text-slate-300">Mass Spectrometry (ESI-MS)</td>
                          <td className="py-2.5 px-4 text-slate-500 dark:text-slate-400">Theoretical ± 1.0 Da</td>
                          <td className="py-2.5 px-4 text-right text-emerald-700 dark:text-emerald-400 font-bold">Confirmed</td>
                        </tr>
                        <tr>
                          <td className="py-2.5 px-4 text-slate-700 dark:text-slate-300">Bacterial Endotoxins</td>
                          <td className="py-2.5 px-4 text-slate-500 dark:text-slate-400">&lt; 0.05 EU/mg</td>
                          <td className="py-2.5 px-4 text-right text-emerald-700 dark:text-emerald-400 font-bold">&lt; 0.01 EU/mg</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                </div>
              </div>

            </div>

          </div>
        </section>

        {/* SECTION 4: THE PROTOCOL (3-STEP HOW TO USE GUIDE) */}
        <section id="protocol" className="py-24 border-b border-slate-300 dark:border-slate-800 bg-[#F4F6F8] dark:bg-[#070A11] transition-colors">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="text-center max-w-3xl mx-auto mb-20 space-y-3">
              <span className="text-xs font-mono tracking-[0.2em] text-emerald-700 dark:text-emerald-400 uppercase font-extrabold block">
                {t.protocol.badge}
              </span>
              <h2 
                className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-[0.12em] uppercase text-slate-950 dark:text-white"
                style={{ fontFamily: 'Syne, sans-serif' }}
              >
                {t.protocol.title}
              </h2>
              <p className="text-base text-slate-700 dark:text-slate-300 font-normal leading-relaxed">
                {t.protocol.subtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              
              {/* STEP 01 */}
              <div className="bg-white dark:bg-[#0D121F] rounded-2xl border border-slate-300 dark:border-slate-800 p-8 shadow-lg flex flex-col justify-between hover:border-emerald-600 dark:hover:border-emerald-500 transition-all">
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-4xl font-extrabold text-emerald-700 dark:text-emerald-400" style={{ fontFamily: 'Syne, sans-serif' }}>01</span>
                    <span className="border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-900 text-xs font-mono font-bold px-3 py-1 rounded-lg text-slate-900 dark:text-white">
                      TRANSFERÊNCIA
                    </span>
                  </div>

                  <div className="h-36 mb-6 flex items-center justify-center bg-slate-100 dark:bg-[#05080E] rounded-xl border border-slate-200 dark:border-slate-800">
                    <FlaskConical className="w-16 h-16 text-emerald-700 dark:text-emerald-400" />
                  </div>

                  <h3 
                    className="font-bold text-lg uppercase tracking-wider text-slate-950 dark:text-white mb-2"
                    style={{ fontFamily: 'Syne, sans-serif' }}
                  >
                    {t.protocol.step1Title}
                  </h3>
                  <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                    {t.protocol.step1Desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-500 dark:text-slate-400 font-semibold">
                  {t.protocol.step1Tag}
                </div>
              </div>

              {/* STEP 02 */}
              <div className="bg-white dark:bg-[#0D121F] rounded-2xl border border-slate-300 dark:border-slate-800 p-8 shadow-lg flex flex-col justify-between hover:border-emerald-600 dark:hover:border-emerald-500 transition-all">
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-4xl font-extrabold text-emerald-700 dark:text-emerald-400" style={{ fontFamily: 'Syne, sans-serif' }}>02</span>
                    <span className="border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-900 text-xs font-mono font-bold px-3 py-1 rounded-lg text-slate-900 dark:text-white">
                      SOLUBILIZAÇÃO
                    </span>
                  </div>

                  <div className="h-36 mb-6 flex items-center justify-center bg-slate-100 dark:bg-[#05080E] rounded-xl border border-slate-200 dark:border-slate-800">
                    <Sparkles className="w-16 h-16 text-emerald-700 dark:text-emerald-400" />
                  </div>

                  <h3 
                    className="font-bold text-lg uppercase tracking-wider text-slate-950 dark:text-white mb-2"
                    style={{ fontFamily: 'Syne, sans-serif' }}
                  >
                    {t.protocol.step2Title}
                  </h3>
                  <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                    {t.protocol.step2Desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-500 dark:text-slate-400 font-semibold">
                  {t.protocol.step2Tag}
                </div>
              </div>

              {/* STEP 03 */}
              <div className="bg-white dark:bg-[#0D121F] rounded-2xl border border-slate-300 dark:border-slate-800 p-8 shadow-lg flex flex-col justify-between hover:border-emerald-600 dark:hover:border-emerald-500 transition-all">
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-4xl font-extrabold text-emerald-700 dark:text-emerald-400" style={{ fontFamily: 'Syne, sans-serif' }}>03</span>
                    <span className="border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-900 text-xs font-mono font-bold px-3 py-1 rounded-lg text-slate-900 dark:text-white">
                      APLICAÇÃO
                    </span>
                  </div>

                  <div className="h-36 mb-6 flex items-center justify-center bg-slate-100 dark:bg-[#05080E] rounded-xl border border-slate-200 dark:border-slate-800">
                    <Clock className="w-16 h-16 text-emerald-700 dark:text-emerald-400" />
                  </div>

                  <h3 
                    className="font-bold text-lg uppercase tracking-wider text-slate-950 dark:text-white mb-2"
                    style={{ fontFamily: 'Syne, sans-serif' }}
                  >
                    {t.protocol.step3Title}
                  </h3>
                  <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                    {t.protocol.step3Desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-500 dark:text-slate-400 font-semibold">
                  {t.protocol.step3Tag}
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

      {/* CoA Official Modal */}
      {isCoaModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#0D121F] rounded-2xl border border-slate-300 dark:border-slate-800 max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto text-slate-900 dark:text-white">
            <button 
              onClick={() => setIsCoaModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-950 dark:hover:text-white p-1 cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-200 dark:border-slate-800">
              <img src="/brand/psl-labs-premium-synthesis-line.png" alt="PSL LABS" className="h-8 w-auto filter dark:brightness-110" />
              <div>
                <h4 
                  className="font-bold text-base tracking-widest text-slate-950 dark:text-white uppercase"
                  style={{ fontFamily: 'Syne, sans-serif' }}
                >
                  Official Certificate of Analysis
                </h4>
                <span className="text-xs font-mono text-slate-500 font-semibold">DOCUMENT ID: COA-GHK-2026-X1 • ACCREDITED TESTING</span>
              </div>
            </div>

            <div className="space-y-4 text-xs font-mono">
              <div className="grid grid-cols-2 gap-3 bg-slate-50 dark:bg-[#05080E] p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                <div>
                  <span className="text-[11px] text-slate-500 uppercase block font-semibold">Compound Name:</span>
                  <strong className="text-slate-950 dark:text-white text-sm">GHK-Cu (Copper Tripeptide-1)</strong>
                </div>
                <div>
                  <span className="text-[11px] text-slate-500 uppercase block font-semibold">Batch Number:</span>
                  <strong className="text-slate-950 dark:text-white text-sm">#PSL-2026-X1</strong>
                </div>
                <div>
                  <span className="text-[11px] text-slate-500 uppercase block font-semibold">Production Date:</span>
                  <span className="text-slate-700 dark:text-slate-300 font-semibold">November 2026</span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-500 uppercase block font-semibold">Certified Purity:</span>
                  <strong className="text-emerald-700 dark:text-emerald-400 font-extrabold text-sm">99.41% (RP-HPLC)</strong>
                </div>
              </div>

              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
                This certifies that the referenced peptide batch was synthesized under standard GMP cleanroom guidelines, confirmed through electrospray ionization mass spectrometry (ESI-MS), and packaged under inert pharmaceutical grade nitrogen atmosphere.
              </p>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div className="text-xs text-slate-600 dark:text-slate-400">
                  Verified by: <strong className="text-slate-950 dark:text-white block font-bold">Dr. M. Benítez, PhD</strong> Head of Analytical Chemistry, PSL LABS S.A.
                </div>
                <button 
                  onClick={() => window.print()}
                  className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs transition cursor-pointer flex items-center gap-1.5"
                >
                  <Printer className="w-4 h-4" />
                  <span>{t.chromatogram.printCOA}</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
