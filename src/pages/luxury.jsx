import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useTheme } from '../context/ThemeContext';
import { 
  ShieldCheck, 
  Check, 
  ArrowRight, 
  ShoppingBag, 
  X, 
  FlaskConical, 
  Award, 
  Clock, 
  Sparkles,
  ExternalLink,
  Sun,
  Moon,
  ChevronRight,
  Layers,
  Thermometer,
  Printer,
  CheckCircle2,
  Info
} from 'lucide-react';

export default function LuxuryLandingPage() {
  const { theme, toggleTheme } = useTheme();
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [isCoaOpen, setIsCoaOpen] = useState(false);

  const products = [
    {
      id: 'ghk-cu-10mg',
      number: 'PROTOCOL 01',
      categoryTag: 'CELLULAR REDENSIFICATION',
      name: 'FORMULA 01: GHK-Cu (Copper Peptide) - 10mg',
      shortName: 'GHK-Cu (Copper Peptide)',
      category: 'REPAIR',
      dosage: '10 MG (Sterile Amber Lyovial)',
      purity: '99.4% HPLC',
      image: '/images/ghk-cu-50mg-vial-50x30.jpg',
      price: 145,
      isFlagship: true,
      description: 'High-affinity tripeptide copper complex. Triggers native fibrillar collagen remodeling, decorin mRNA activation, and extensive micro-vascular dermal regeneration.',
      reconstitution: '5.0ml Bacteriostatic Sol.',
      shelfLife: '24 Mo (Dry) / 30d (Mix)'
    },
    {
      id: 'bpc-157-10mg',
      number: 'PROTOCOL 02',
      categoryTag: 'TISSUE REPARATIVE',
      name: 'FORMULA 02: BPC-157 (Tissue Restoration) - 10mg',
      shortName: 'BPC-157 (Tissue Restoration)',
      category: 'REPAIR',
      dosage: '10 MG (15-Amino Acid Stable Sequence)',
      purity: '99.2% HPLC',
      image: '/images/ghk-cu-box-white.jpg',
      price: 130,
      isFlagship: false,
      description: 'Accelerated dermal recovery sequence. Upregulates VEGF angiogenic signaling and modulates early granulation tissue for post-procedure laser or microneedling protocols.',
      reconstitution: '5.0ml Isotonic Vehicle',
      shelfLife: 'Refrigerate 2°C–8°C'
    },
    {
      id: 'tirzepatide-kit',
      number: 'PROTOCOL 04',
      categoryTag: 'CELLULAR LONGEVITY KIT',
      name: 'FORMULA 04: Tirzepatide Protocol Kit (4x Vials)',
      shortName: 'Tirzepatide Aesthetic Protocol',
      category: 'LONGEVITY',
      dosage: 'Box: 4x 3ml Pre-Calibrated Vials (30 MG Total)',
      purity: '99.5% HPLC',
      image: '/images/tirzepatida-box-kit.jpg',
      price: 340,
      isFlagship: false,
      description: 'Dual GIP/GLP-1 receptor agonist research grade compound. Comprehensive systemic and metabolic homeostasis protocol. Enclosed in an embossed luxury presentation case.',
      reconstitution: '4 Lyophilized Vials',
      shelfLife: 'Thermal Box Included'
    }
  ];

  const filteredProducts = selectedCategory === 'ALL'
    ? products
    : products.filter(p => p.category === selectedCategory);

  const addToCart = (product) => {
    setCart((prev) => [...prev, product]);
    setIsCartOpen(true);
  };

  const removeFromCart = (index) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  const cartSubtotal = cart.reduce((acc, item) => acc + item.price, 0);

  return (
    <div className="min-h-screen bg-[#F4F6F8] dark:bg-[#070A11] text-[#0B0F17] dark:text-[#F8FAFC] selection:bg-[#047857] selection:text-white font-sans transition-colors duration-200">
      <Head>
        <title>PSL LABS | Premium Synthesis Line — The Science of Regeneration</title>
        <meta name="description" content="Premium grade lyophilized peptides. >99% clinical purity for advanced aesthetic protocols. High contrast clinical luxury." />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500;600;700&family=Montserrat:wght@600;700;800&family=Syne:wght@600;700;800&display=swap" rel="stylesheet" />
      </Head>

      {/* TECHNICAL CLINICAL TICKER (HIGH CONTRAST) */}
      <aside className="border-b border-slate-300 dark:border-slate-800/90 bg-white dark:bg-[#0D121F] py-2.5 px-4 text-xs font-mono tracking-wider text-slate-700 dark:text-slate-300 shadow-sm transition-colors">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-emerald-600 dark:bg-emerald-400 animate-pulse" />
            <strong className="text-slate-900 dark:text-white font-bold tracking-wider">PSL LABS S.A.</strong>
            <span className="text-slate-400">|</span>
            <span className="font-semibold text-emerald-800 dark:text-emerald-400">REG. SANITARIO PY-2026/884</span>
            <span className="text-slate-400">|</span>
            <span>PUREZA HPLC ≥ 99.2% (ISO/IEC 17025)</span>
          </div>
          <div className="hidden md:flex items-center gap-5 text-slate-600 dark:text-slate-400">
            <Link href="/" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition flex items-center gap-1 font-semibold text-slate-800 dark:text-slate-200">
              <span>← Portal Oficial de Autenticação de Lotes</span>
            </Link>
            <span>•</span>
            <span className="text-emerald-700 dark:text-emerald-400 font-bold">COLD-CHAIN INTEGRITY GUARANTEE</span>
          </div>
        </div>
      </aside>

      {/* HIGH-CONTRAST LUXURY NAVIGATION HEADER */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#0A0E17]/95 backdrop-blur-md border-b border-slate-300 dark:border-slate-800/80 shadow-sm transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Brand Logo with DNA helix motif */}
          <Link href="/luxury" className="flex items-center gap-3.5 group">
            <img 
              src="/brand/psl-labs-premium-synthesis-line.png" 
              alt="PSL LABS - Premium Synthesis Line" 
              className="h-8 sm:h-12 w-auto max-w-[130px] sm:max-w-none object-contain transition-transform group-hover:scale-[1.02] dark:hidden"
            />
            <img 
              src="/brand/psl-labs-premium-synthesis-line-white.png" 
              alt="PSL LABS - Premium Synthesis Line" 
              className="h-8 sm:h-12 w-auto max-w-[130px] sm:max-w-none object-contain transition-transform group-hover:scale-[1.02] hidden dark:block"
            />
          </Link>

          {/* Desktop Navigation Links with High Contrast & Legible Tracking */}
          <nav className="hidden lg:flex items-center gap-8 text-xs font-bold tracking-[0.14em] text-slate-700 dark:text-slate-200 uppercase" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            <a href="#formulas" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors py-2">The Future Pharmacy</a>
            <a href="#purity" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors py-2">Purity &amp; CoA</a>
            <a href="#protocol" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors py-2">The Protocol</a>
            <a href="#clinical" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors py-2">Science Benchmark</a>
          </nav>

          {/* Action Items & Controls */}
          <div className="flex items-center gap-3 sm:gap-4">
            
            {/* Theme Toggle Button (Light/Dark Mode) */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 dark:border-slate-700 dark:text-amber-400 transition cursor-pointer shadow-sm"
              title={theme === 'dark' ? 'Mudar para Modo Claro (Alto Contraste)' : 'Mudar para Modo Escuro (Obsidian Biotech)'}
              aria-label="Alternar tema de cores"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-800" />
              )}
            </button>

            {/* Verify CoA Button */}
            <button 
              onClick={() => setIsCoaOpen(true)}
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 hover:border-emerald-600 dark:hover:border-emerald-500 transition-colors cursor-pointer shadow-sm"
            >
              <Award className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Verify CoA</span>
            </button>

            {/* Protocol Bag Button */}
            <button 
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] bg-emerald-700 hover:bg-emerald-600 active:scale-[0.98] text-white px-4 py-2.5 rounded-xl transition shadow-md shadow-emerald-900/20 cursor-pointer"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>PROTOCOL BAG</span>
              <span className="w-5 h-5 rounded-full bg-white text-emerald-800 text-[11px] font-mono font-bold flex items-center justify-center">
                {cart.length}
              </span>
            </button>

          </div>

        </div>
      </header>

      <main>
        
        {/* HERO SECTION: MINIMALIST, HIGH CONTRAST & IMPOSING */}
        <section className="relative pt-16 pb-20 lg:pt-24 lg:pb-28 overflow-hidden border-b border-slate-300 dark:border-slate-800 bg-white dark:bg-[#070A11] transition-colors">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
              
              {/* Left Column: Monograph & High-Impact Typography */}
              <div className="lg:col-span-7 space-y-6">
                
                <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-emerald-600/40 dark:border-emerald-500/50 bg-emerald-50 dark:bg-emerald-950/70 text-xs font-mono font-bold tracking-wider text-emerald-900 dark:text-emerald-300 shadow-sm">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 dark:bg-emerald-400" />
                  <span>PREMIUM SYNTHESIS LINE</span>
                  <span className="text-slate-400">|</span>
                  <span className="font-extrabold uppercase">CLINICAL MONOGRAPH 01</span>
                </div>

                {/* Mandated User Headline with High-Contrast Punch */}
                <h1 
                  className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-[0.03em] sm:tracking-[0.10em] uppercase text-slate-950 dark:text-white leading-[1.15] break-words"
                  style={{ fontFamily: 'Syne, sans-serif' }}
                >
                  THE SCIENCE OF REGENERATION.
                </h1>

                {/* Mandated User Subheadline - High Legibility (No Washout) */}
                <p className="text-base sm:text-xl text-slate-700 dark:text-slate-300 leading-relaxed max-w-xl font-normal">
                  Premium grade lyophilized peptides. <strong className="text-slate-950 dark:text-white font-bold">&gt;99% clinical purity</strong> for advanced aesthetic protocols.
                </p>

                {/* Technical Coordinates Grid with Distinct Card Frames */}
                <div className="pt-2 border-t border-slate-200 dark:border-slate-800 grid grid-cols-3 gap-2 sm:gap-3 text-xs font-mono text-slate-700 dark:text-slate-300">
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
                    <span className="block text-[11px] text-slate-500 dark:text-slate-400 uppercase font-semibold">Formulation</span>
                    <span className="font-bold text-slate-950 dark:text-white text-sm">Bioactive Lyophilized</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
                    <span className="block text-[11px] text-slate-500 dark:text-slate-400 uppercase font-semibold">HPLC Assay</span>
                    <span className="font-bold text-emerald-700 dark:text-emerald-400 text-sm">≥ 99.4% Pure</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
                    <span className="block text-[11px] text-slate-500 dark:text-slate-400 uppercase font-semibold">Solubilization</span>
                    <span className="font-bold text-slate-950 dark:text-white text-sm">Fresh At-Home Mix</span>
                  </div>
                </div>

                {/* High Contrast CTA Action Buttons */}
                <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                  <a 
                    href="#formulas"
                    className="inline-flex items-center justify-center gap-3 bg-emerald-700 hover:bg-emerald-600 active:scale-[0.98] text-white font-bold text-xs uppercase tracking-[0.16em] py-4 px-8 rounded-xl shadow-lg shadow-emerald-900/25 transition cursor-pointer"
                    style={{ fontFamily: 'Montserrat, sans-serif' }}
                  >
                    <span>EXPLORE FORMULAS</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>

                  <a 
                    href="#protocol"
                    className="inline-flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-bold text-xs uppercase tracking-[0.14em] py-4 px-6 rounded-xl transition shadow-sm"
                    style={{ fontFamily: 'Montserrat, sans-serif' }}
                  >
                    <span>VIEW AT-HOME PROTOCOL</span>
                  </a>
                </div>

              </div>

              {/* Right Column: High-Definition Product Showcase Card */}
              <div className="lg:col-span-5">
                <div className="relative rounded-2xl bg-white dark:bg-[#0D121F] border border-slate-300 dark:border-slate-800 p-6 sm:p-8 shadow-xl">
                  
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
                  <div className="relative h-72 sm:h-80 bg-slate-100 dark:bg-[#05080E] rounded-xl overflow-hidden flex items-center justify-center p-6 border border-slate-200 dark:border-slate-800/80">
                    <img 
                      src="/images/ghk-cu-50mg-vial-50x30.jpg" 
                      alt="Formula 01: GHK-Cu 10mg Clinical Vial" 
                      className="max-h-full max-w-full object-contain filter drop-shadow-2xl hover:scale-105 transition-transform duration-500"
                    />

                    {/* Sharp Contrast Spec Pill */}
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
                      <span className="font-bold text-slate-900 dark:text-white">Copper Tripeptide-1 (GHK-Cu)</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 dark:text-slate-400">Molecular Weight:</span>
                      <span className="font-semibold text-slate-900 dark:text-white">403.94 g/mol</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 dark:text-slate-400">Biological Function:</span>
                      <span className="text-emerald-700 dark:text-emerald-400 font-bold">Pro-Collagen I &amp; III Synthesis</span>
                    </div>
                  </div>

                  {/* Quick Reserve Action */}
                  <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-slate-500 dark:text-slate-400 block font-mono uppercase font-semibold">Single Protocol</span>
                      <span className="text-2xl font-bold text-slate-950 dark:text-white" style={{ fontFamily: 'Syne, sans-serif' }}>
                        $145.00 <span className="text-xs font-normal text-slate-500">USD</span>
                      </span>
                    </div>
                    <button 
                      onClick={() => addToCart(products[0])}
                      className="bg-emerald-700 hover:bg-emerald-600 active:scale-[0.98] text-white font-bold text-xs uppercase tracking-wider py-3 px-6 rounded-xl transition shadow-md cursor-pointer"
                      style={{ fontFamily: 'Montserrat, sans-serif' }}
                    >
                      ADD TO PROTOCOL
                    </button>
                  </div>

                </div>
              </div>

            </div>
          </div>
        </section>

        {/* SECTION 2: PRODUCT SHOWCASE ("THE FUTURE PHARMACY") */}
        <section id="formulas" className="py-24 border-b border-slate-300 dark:border-slate-800 bg-[#F4F6F8] dark:bg-[#070A11] transition-colors">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
              <div className="space-y-3">
                <span className="text-xs font-mono tracking-[0.2em] text-emerald-700 dark:text-emerald-400 uppercase font-extrabold block">
                  CLINICAL PROTOCOLS CATALOG
                </span>
                <h2 
                  className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-[0.12em] uppercase text-slate-950 dark:text-white"
                  style={{ fontFamily: 'Syne, sans-serif' }}
                >
                  THE FUTURE PHARMACY.
                </h2>
                <p className="text-base text-slate-700 dark:text-slate-300 max-w-2xl font-normal leading-relaxed">
                  Formulated as sterile, research-grade bioactive protocols rather than commercial cosmetic dilutions. Each unit is delivered in an inert lyophilized state for peak freshness and cellular potency.
                </p>
              </div>

              {/* Protocol Filter Tabs */}
              <div className="flex flex-wrap gap-2 text-xs font-mono">
                {['ALL', 'REPAIR', 'LONGEVITY'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2.5 rounded-xl transition font-bold cursor-pointer shadow-sm ${
                      selectedCategory === cat
                        ? 'border border-emerald-700 bg-emerald-700 text-white'
                        : 'border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 hover:border-emerald-600'
                    }`}
                  >
                    {cat === 'ALL' ? 'ALL FORMULAS' : cat === 'REPAIR' ? 'CELLULAR REPAIR' : 'LONGEVITY KITS'}
                  </button>
                ))}
              </div>
            </div>

            {/* Clinical Protocols Grid with Deep Visual Separation */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map((p) => (
                <div
                  key={p.id}
                  className={`bg-white dark:bg-[#0D121F] rounded-2xl border p-6 flex flex-col justify-between shadow-lg relative overflow-hidden group transition-all duration-300 ${
                    p.isFlagship 
                      ? 'border-emerald-600/70 dark:border-emerald-500/60 ring-2 ring-emerald-600/30' 
                      : 'border-slate-300 dark:border-slate-800 hover:border-emerald-600 dark:hover:border-emerald-500'
                  }`}
                >
                  {p.isFlagship && (
                    <div className="absolute top-0 right-0 bg-emerald-700 text-white text-[11px] font-mono font-extrabold uppercase tracking-widest px-3.5 py-1 rounded-bl-xl shadow-sm">
                      FLAGSHIP FORMULA
                    </div>
                  )}

                  <div>
                    {/* Image Presentation with Crisp Frame */}
                    <div className="relative h-64 bg-slate-100 dark:bg-[#05080E] rounded-xl border border-slate-200 dark:border-slate-800 mb-6 flex items-center justify-center p-4 overflow-hidden">
                      <img 
                        src={p.image} 
                        alt={p.name} 
                        className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-500 drop-shadow-xl"
                      />
                      <span className="absolute bottom-3 left-3 bg-white/95 dark:bg-slate-900/95 border border-slate-300 dark:border-slate-700 text-xs font-mono font-bold px-2.5 py-1 rounded-lg text-slate-900 dark:text-white shadow-sm">
                        Purity: <strong className="text-emerald-700 dark:text-emerald-400">{p.purity}</strong>
                      </span>
                    </div>

                    {/* Monograph Identifiers */}
                    <div className="space-y-2 mb-4">
                      <div className="text-xs font-mono text-emerald-700 dark:text-emerald-400 font-extrabold uppercase tracking-wider">
                        {p.number} • {p.categoryTag}
                      </div>
                      <h3 
                        className="text-xl font-bold uppercase tracking-[0.08em] text-slate-950 dark:text-white"
                        style={{ fontFamily: 'Syne, sans-serif' }}
                      >
                        {p.shortName}
                      </h3>
                      <div className="text-xs font-mono text-slate-600 dark:text-slate-400 font-semibold">
                        Dosage: {p.dosage}
                      </div>
                      <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed pt-2">
                        {p.description}
                      </p>
                    </div>

                    {/* Technical Details Specs */}
                    <div className="py-3 border-t border-b border-slate-200 dark:border-slate-800 my-4 grid grid-cols-2 gap-2 text-xs font-mono text-slate-700 dark:text-slate-300">
                      <div>
                        <span className="text-slate-500 dark:text-slate-400 block text-[10px] uppercase font-semibold">Reconstitution</span>
                        <span className="font-bold text-slate-900 dark:text-white">{p.reconstitution}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 dark:text-slate-400 block text-[10px] uppercase font-semibold">Shelf Life</span>
                        <span className="font-bold text-slate-900 dark:text-white">{p.shelfLife}</span>
                      </div>
                    </div>
                  </div>

                  {/* Footer Action */}
                  <div className="pt-2 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-slate-500 dark:text-slate-400 font-mono block font-semibold uppercase">Protocol Unit</span>
                      <span className="text-2xl font-bold text-slate-950 dark:text-white" style={{ fontFamily: 'Syne, sans-serif' }}>
                        ${p.price}.00
                      </span>
                    </div>
                    <button 
                      onClick={() => addToCart(p)}
                      className="bg-emerald-700 hover:bg-emerald-600 active:scale-[0.98] text-white font-bold text-xs uppercase tracking-wider py-3 px-5 rounded-xl transition shadow-sm cursor-pointer"
                      style={{ fontFamily: 'Montserrat, sans-serif' }}
                    >
                      SELECT PROTOCOL
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* SECTION 3: PURITY & TRUST (CERTIFICATE OF ANALYSIS - COA) */}
        <section id="purity" className="py-24 border-b border-slate-300 dark:border-slate-800 bg-white dark:bg-[#0A0E17] transition-colors">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
              
              <div className="lg:col-span-5 space-y-6">
                
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-emerald-600/40 bg-emerald-50 dark:bg-emerald-950/70 text-xs font-mono font-bold text-emerald-900 dark:text-emerald-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 dark:bg-emerald-400" />
                  <span>INDEPENDENT ANALYTICAL CERTIFICATION</span>
                </div>

                <h2 
                  className="text-3xl sm:text-4xl font-extrabold tracking-[0.12em] uppercase text-slate-950 dark:text-white leading-tight"
                  style={{ fontFamily: 'Syne, sans-serif' }}
                >
                  THE CERTIFICATE OF ANALYSIS (CoA).
                </h2>

                <p className="text-base text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
                  We operate on absolute transparency. While commercial cosmetics conceal active percentages within opaque marketing claims, PSL Labs publishes raw, third-party verified High-Performance Liquid Chromatography (HPLC) and Mass Spectrometry (MS) data for every single production run.
                </p>

                <div className="space-y-4 pt-2">
                  <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 border border-emerald-600/30 flex items-center justify-center text-emerald-700 dark:text-emerald-400 shrink-0 mt-0.5">
                      <Check className="w-4 h-4 stroke-[3]" />
                    </div>
                    <div className="text-xs">
                      <strong className="text-slate-950 dark:text-white block font-bold text-sm mb-0.5">Verified Purity Floor &gt; 99.0%</strong>
                      <span className="text-slate-600 dark:text-slate-400">Batches falling below 99.0% HPLC purity are rejected at the analytical chromatography gate.</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 border border-emerald-600/30 flex items-center justify-center text-emerald-700 dark:text-emerald-400 shrink-0 mt-0.5">
                      <Check className="w-4 h-4 stroke-[3]" />
                    </div>
                    <div className="text-xs">
                      <strong className="text-slate-950 dark:text-white block font-bold text-sm mb-0.5">Endotoxin Assay &lt; 0.01 EU/mg</strong>
                      <span className="text-slate-600 dark:text-slate-400">Tested via Limulus Amebocyte Lysate (LAL) to guarantee zero pyrogenic microbial trace.</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 border border-emerald-600/30 flex items-center justify-center text-emerald-700 dark:text-emerald-400 shrink-0 mt-0.5">
                      <Check className="w-4 h-4 stroke-[3]" />
                    </div>
                    <div className="text-xs">
                      <strong className="text-slate-950 dark:text-white block font-bold text-sm mb-0.5">Cryogenic Lyophilization Sealed under Nitrogen</strong>
                      <span className="text-slate-600 dark:text-slate-400">Zero moisture content degradation. 24-month stability prior to sterile reconstitution.</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <button 
                    onClick={() => setIsCoaOpen(true)}
                    className="inline-flex items-center gap-2 bg-slate-950 hover:bg-emerald-700 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200 text-white font-bold text-xs uppercase tracking-[0.14em] py-4 px-7 rounded-xl transition cursor-pointer shadow-md"
                    style={{ fontFamily: 'Montserrat, sans-serif' }}
                  >
                    <span>OPEN OFFICIAL COA REPORT</span>
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
                    <span className="px-3.5 py-1.5 rounded-lg text-xs font-mono text-emerald-800 dark:text-emerald-300 font-extrabold border border-emerald-600/40 bg-emerald-100/70 dark:bg-emerald-950/70">
                      STATUS: PASSED (≥99.4%)
                    </span>
                  </div>

                  {/* Chromatographic Vector Plot with High-Contrast Grid */}
                  <div className="bg-white dark:bg-[#05080E] rounded-xl border border-slate-300 dark:border-slate-800 p-5 mb-6 shadow-sm">
                    <div className="flex items-center justify-between text-xs font-mono text-slate-700 dark:text-slate-300 mb-2 font-bold">
                      <span>RP-HPLC CHROMATOGRAM [λ=214nm]</span>
                      <span className="text-emerald-700 dark:text-emerald-400">PEAK RETENTION tR: 4.82 min</span>
                    </div>
                    <div className="h-44 w-full">
                      <svg className="w-full h-full" viewBox="0 0 500 150" fill="none">
                        <line x1="20" y1="130" x2="480" y2="130" stroke="#94A3B8" strokeWidth="1.5" />
                        <line x1="20" y1="90" x2="480" y2="90" stroke="#CBD5E1" strokeWidth="1" strokeDasharray="3 3" />
                        <line x1="20" y1="50" x2="480" y2="50" stroke="#CBD5E1" strokeWidth="1" strokeDasharray="3 3" />

                        {/* Peak Fill */}
                        <path 
                          d="M20 130 L160 130 Q185 129 195 110 Q205 70 210 20 Q212 12 215 20 Q220 70 230 110 Q240 129 270 130 L480 130 Z" 
                          fill="rgba(16, 185, 129, 0.2)" 
                        />
                        {/* Peak Stroke */}
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
                          <td className="py-2.5 px-4 text-right font-extrabold text-emerald-700 dark:text-emerald-400">99.41%</td>
                        </tr>
                        <tr>
                          <td className="py-2.5 px-4 text-slate-700 dark:text-slate-300">Mass Spectrometry (ESI-MS)</td>
                          <td className="py-2.5 px-4 text-slate-500 dark:text-slate-400">403.9 ± 1.0 Da</td>
                          <td className="py-2.5 px-4 text-right text-emerald-700 dark:text-emerald-400 font-bold">403.8 Da</td>
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
                CLINICAL AT-HOME PREPARATION
              </span>
              <h2 
                className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-[0.12em] uppercase text-slate-950 dark:text-white"
                style={{ fontFamily: 'Syne, sans-serif' }}
              >
                THE RECONSTITUTION PROTOCOL.
              </h2>
              <p className="text-base text-slate-700 dark:text-slate-300 font-normal leading-relaxed">
                Peptides in aqueous liquid solutions naturally degrade within weeks on retail shelves. By mixing the lyophilized powder with sterile diluent directly prior to your protocol, you unlock maximum biological potency.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              
              {/* STEP 01 */}
              <div className="bg-white dark:bg-[#0D121F] rounded-2xl border border-slate-300 dark:border-slate-800 p-8 shadow-lg flex flex-col justify-between hover:border-emerald-600 dark:hover:border-emerald-500 transition-all">
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-4xl font-extrabold text-emerald-700 dark:text-emerald-400" style={{ fontFamily: 'Syne, sans-serif' }}>01</span>
                    <span className="border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-900 text-xs font-mono font-bold px-3 py-1 rounded-lg text-slate-900 dark:text-white">
                      STERILE MIX
                    </span>
                  </div>

                  <div className="h-36 mb-6 flex items-center justify-center bg-slate-100 dark:bg-[#05080E] rounded-xl border border-slate-200 dark:border-slate-800">
                    <FlaskConical className="w-16 h-16 text-emerald-700 dark:text-emerald-400" />
                  </div>

                  <h3 
                    className="font-bold text-lg uppercase tracking-wider text-slate-950 dark:text-white mb-2"
                    style={{ fontFamily: 'Syne, sans-serif' }}
                  >
                    Sterile Transfer
                  </h3>
                  <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                    Flip the protective seal from the amber peptide vial. Using the enclosed sterile transfer cannula, draw exactly 2.0ml of bacteriostatic reconstitution vehicle.
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-500 dark:text-slate-400 font-semibold">
                  Phase: Vacuum Release &amp; Aseptic Transfer
                </div>
              </div>

              {/* STEP 02 */}
              <div className="bg-white dark:bg-[#0D121F] rounded-2xl border border-slate-300 dark:border-slate-800 p-8 shadow-lg flex flex-col justify-between hover:border-emerald-600 dark:hover:border-emerald-500 transition-all">
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-4xl font-extrabold text-emerald-700 dark:text-emerald-400" style={{ fontFamily: 'Syne, sans-serif' }}>02</span>
                    <span className="border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-900 text-xs font-mono font-bold px-3 py-1 rounded-lg text-slate-900 dark:text-white">
                      DISSOLUTION
                    </span>
                  </div>

                  <div className="h-36 mb-6 flex items-center justify-center bg-slate-100 dark:bg-[#05080E] rounded-xl border border-slate-200 dark:border-slate-800">
                    <Sparkles className="w-16 h-16 text-emerald-700 dark:text-emerald-400" />
                  </div>

                  <h3 
                    className="font-bold text-lg uppercase tracking-wider text-slate-950 dark:text-white mb-2"
                    style={{ fontFamily: 'Syne, sans-serif' }}
                  >
                    Inert Solubilization
                  </h3>
                  <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                    Direct the sterile diluent smoothly down the inside glass wall of the vial. Gently swirl in a circular motion for 20 seconds. <strong className="text-slate-950 dark:text-white">Never agitate or shake violently</strong> to protect delicate peptide bonds.
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-500 dark:text-slate-400 font-semibold">
                  Time: 20 Seconds Gentle Rotation
                </div>
              </div>

              {/* STEP 03 */}
              <div className="bg-white dark:bg-[#0D121F] rounded-2xl border border-slate-300 dark:border-slate-800 p-8 shadow-lg flex flex-col justify-between hover:border-emerald-600 dark:hover:border-emerald-500 transition-all">
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-4xl font-extrabold text-emerald-700 dark:text-emerald-400" style={{ fontFamily: 'Syne, sans-serif' }}>03</span>
                    <span className="border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-900 text-xs font-mono font-bold px-3 py-1 rounded-lg text-slate-900 dark:text-white">
                      DAILY PROTOCOL
                    </span>
                  </div>

                  <div className="h-36 mb-6 flex items-center justify-center bg-slate-100 dark:bg-[#05080E] rounded-xl border border-slate-200 dark:border-slate-800">
                    <Clock className="w-16 h-16 text-emerald-700 dark:text-emerald-400" />
                  </div>

                  <h3 
                    className="font-bold text-lg uppercase tracking-wider text-slate-950 dark:text-white mb-2"
                    style={{ fontFamily: 'Syne, sans-serif' }}
                  >
                    Precision Topical Delivery
                  </h3>
                  <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                    Attach the enclosed silicone micro-dropper. Dispense 4 to 6 drops directly onto cleansed skin once daily before bedtime. Store the reconstituted vial strictly refrigerated between 2°C and 8°C.
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-500 dark:text-slate-400 font-semibold">
                  Potency Window: 30 Days Refrigerated
                </div>
              </div>

            </div>

          </div>
        </section>

      </main>

      {/* LUXURY CLINICAL FOOTER */}
      <footer className="bg-[#090D14] text-slate-300 py-16 border-t border-slate-800 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            
            <div className="md:col-span-2 space-y-4">
              <img 
                src="/brand/psl-labs-premium-synthesis-line-white.png" 
                alt="PSL LABS" 
                className="h-10 w-auto object-contain mb-2"
              />
              <p className="text-sm text-slate-400 max-w-sm leading-relaxed font-normal">
                PSL Labs (Premium Synthesis Line) S.A. operates as a high-precision biotechnology facility dedicated to research-grade peptide synthesis, structural lyophilization, and clinical aesthetic protocols.
              </p>
              <div className="pt-2 text-xs font-mono text-slate-500">
                FACILITY: PARQUE INDUSTRIAL ASUNCIÓN • CIUDAD DEL ESTE • REPÚBLICA DEL PARAGUAY
              </div>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="text-white font-bold uppercase tracking-widest text-xs">
                ANALYTICAL RIGOR
              </div>
              <ul className="space-y-2 text-slate-400">
                <li>• DIN EN ISO 9001:2015</li>
                <li>• ISO/IEC 17025 Third-Party Tested</li>
                <li>• Class 100 Cleanroom Lyophilization</li>
                <li>• Endotoxin Certified &lt; 0.01 EU/mg</li>
              </ul>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="text-white font-bold uppercase tracking-widest text-xs">
                CLIENT CONCIERGE
              </div>
              <ul className="space-y-2 text-slate-400">
                <li>• Cold-Chain Priority Dispatch</li>
                <li>• Batch Verification Registry</li>
                <li>• Direct Practitioner Inquiries</li>
                <li>• conciergelab@psl-labs.com</li>
              </ul>
            </div>

          </div>

          <div className="border-t border-slate-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-500">
            <p>© 2026 PSL LABS S.A. ALL RIGHTS RESERVED. FOR RESEARCH &amp; ADVANCED AESTHETIC RECONSTITUTION.</p>
            <p>PSL-REG-PY 2026/884</p>
          </div>

        </div>
      </footer>

      {/* CART DRAWER (PROTOCOL BAG) */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
          <div 
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
          />
          
          <div className="relative w-screen max-w-md bg-white dark:bg-[#0D121F] border-l border-slate-300 dark:border-slate-800 shadow-2xl flex flex-col justify-between p-6 sm:p-8 z-10 text-slate-900 dark:text-white">
            <div>
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4 mb-6">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 dark:bg-emerald-400" />
                  <h3 
                    className="font-bold text-xl uppercase tracking-wider text-slate-950 dark:text-white"
                    style={{ fontFamily: 'Syne, sans-serif' }}
                  >
                    Your Protocol Bag
                  </h3>
                </div>
                <button 
                  onClick={() => setIsCartOpen(false)}
                  className="text-slate-400 hover:text-slate-950 dark:hover:text-white p-1 cursor-pointer"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-600/30 rounded-xl p-3.5 text-xs font-mono text-emerald-900 dark:text-emerald-300 mb-6 flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Cold-chain isothermal packing automatically assigned to this order.</span>
              </div>

              <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-1">
                {cart.length === 0 ? (
                  <p className="text-sm font-mono text-slate-500 text-center py-12">
                    Your protocol bag is currently empty.<br />Select a clinical formula above to begin.
                  </p>
                ) : (
                  cart.map((item, index) => (
                    <div key={index} className="flex items-center gap-3 bg-slate-50 dark:bg-[#05080E] p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">
                      <img src={item.image} alt={item.name} className="w-14 h-14 object-contain bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-1" />
                      <div className="flex-grow min-w-0">
                        <h4 className="font-bold text-sm text-slate-950 dark:text-white truncate">{item.name}</h4>
                        <span className="text-xs font-mono text-emerald-700 dark:text-emerald-400 font-bold">${item.price}.00 USD</span>
                      </div>
                      <button 
                        onClick={() => removeFromCart(index)}
                        className="text-slate-400 hover:text-red-600 text-sm font-mono p-1 cursor-pointer"
                      >
                        ✕
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="border-t border-slate-200 dark:border-slate-800 pt-6 space-y-4">
              <div className="flex justify-between items-center text-sm font-mono">
                <span className="text-slate-500 dark:text-slate-400 font-semibold">SUBTOTAL:</span>
                <span className="font-bold text-2xl text-slate-950 dark:text-white" style={{ fontFamily: 'Syne, sans-serif' }}>
                  ${cartSubtotal}.00 USD
                </span>
              </div>
              <div className="text-xs font-mono text-slate-500">
                Includes Certificate of Analysis &amp; Sterile Reconstitution Vehicle.
              </div>
              <button 
                onClick={() => alert("Batch Allocation Reserved. In production, this directs to cold-chain dispatch.")}
                className="w-full bg-emerald-700 hover:bg-emerald-600 active:scale-[0.98] text-white font-bold text-xs uppercase tracking-[0.16em] py-4 rounded-xl transition shadow-lg cursor-pointer"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                RESERVE BATCH ALLOCATION
              </button>
            </div>
          </div>
        </div>
      )}

      {/* COA MODAL */}
      {isCoaOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#0D121F] rounded-2xl border border-slate-300 dark:border-slate-800 max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto text-slate-900 dark:text-white">
            <button 
              onClick={() => setIsCoaOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-950 dark:hover:text-white p-1 cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-200 dark:border-slate-800">
              <img src="/brand/psl-labs-premium-synthesis-line.png" alt="PSL LABS" className="h-8 w-auto dark:hidden" />
              <img src="/brand/psl-labs-premium-synthesis-line-white.png" alt="PSL LABS" className="h-8 w-auto hidden dark:block" />
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
                  <span>Print Certificate</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
