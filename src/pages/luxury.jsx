import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { 
  ShieldCheck, 
  Check, 
  ArrowRight, 
  ShoppingBag, 
  X, 
  FlaskConical, 
  Award, 
  FileText, 
  Clock, 
  Sparkles,
  ExternalLink,
  ChevronRight,
  Layers,
  Thermometer,
  Printer
} from 'lucide-react';

export default function LuxuryLandingPage() {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [isCoaOpen, setIsCoaOpen] = useState(false);
  const [activeCoaBatch, setActiveCoaBatch] = useState('GHK-2026-X1');

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
    <div className="min-h-screen bg-[#FAF9F5] text-[#1F2421] selection:bg-[#064E3B] selection:text-white font-sans">
      <Head>
        <title>PSL LABS | Premium Synthesis Line — The Science of Regeneration</title>
        <meta name="description" content="Premium grade lyophilized peptides. >99% clinical purity for advanced aesthetic protocols. PSL Labs (Premium Synthesis Line)." />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500;600&family=Montserrat:wght@400;500;600;700&family=Syne:wght@500;700;800&display=swap" rel="stylesheet" />
      </Head>

      {/* CLINICAL DISCLOSURE STRIP */}
      <aside className="border-b border-[#E5E7E2] bg-[#FAF9F5] py-2 px-4 text-xs font-mono tracking-wider text-[#4A524D]">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#064E3B] animate-pulse" />
            <span className="font-semibold text-[#1F2421]">CLINICAL SPECIFICATION</span>
            <span>•</span>
            <span>PEPTIDE STABILITY PROTOCOL GRADE A</span>
            <span>•</span>
            <span>PURITY &gt; 99.2% (HPLC ASSAY CERTIFIED)</span>
          </div>
          <div className="hidden md:flex items-center gap-5 text-[#7E8781]">
            <Link href="/" className="hover:text-[#064E3B] transition flex items-center gap-1 text-[11px]">
              <span>← Switch to Batch Verification Portal</span>
            </Link>
            <span>•</span>
            <span className="text-[#064E3B] font-semibold">COLD-CHAIN INTEGRITY GUARANTEE</span>
          </div>
        </div>
      </aside>

      {/* LUXURY NAVIGATION HEADER */}
      <header className="sticky top-0 z-40 bg-[#FAF9F5]/90 backdrop-blur-md border-b border-[#E5E7E2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Brand Logo with DNA helix motif */}
          <Link href="/luxury" className="flex items-center gap-3.5 group">
            <img 
              src="/brand/psl-labs-premium-synthesis-line.png" 
              alt="PSL LABS - Premium Synthesis Line" 
              className="h-10 sm:h-12 w-auto object-contain transition-transform group-hover:scale-[1.02]"
            />
          </Link>

          {/* Desktop Navigation Links with wide letter spacing */}
          <nav className="hidden lg:flex items-center gap-8 text-xs font-semibold tracking-[0.2em] text-[#4A524D] uppercase" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            <a href="#formulas" className="hover:text-[#064E3B] transition-colors py-2">The Future Pharmacy</a>
            <a href="#purity" className="hover:text-[#064E3B] transition-colors py-2">Purity &amp; CoA</a>
            <a href="#protocol" className="hover:text-[#064E3B] transition-colors py-2">The Protocol</a>
            <a href="#clinical" className="hover:text-[#064E3B] transition-colors py-2">Science Benchmark</a>
          </nav>

          {/* Action Items & Protocol Bag */}
          <div className="flex items-center gap-3 sm:gap-4">
            <button 
              onClick={() => setIsCoaOpen(true)}
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider px-3.5 py-2 rounded border border-[#E5E7E2] bg-white text-[#1F2421] hover:border-[#064E3B] transition-colors cursor-pointer"
            >
              <Award className="w-3.5 h-3.5 text-[#064E3B]" />
              <span>Verify CoA</span>
            </button>

            <button 
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] bg-[#064E3B] hover:bg-[#04382A] text-white px-4 py-2.5 rounded transition shadow-sm cursor-pointer"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>PROTOCOL BAG</span>
              <span className="w-4 h-4 rounded-full bg-white text-[#064E3B] text-[10px] font-mono font-bold flex items-center justify-center">
                {cart.length}
              </span>
            </button>
          </div>

        </div>
      </header>

      <main>
        
        {/* HERO SECTION: MINIMALIST & IMPOSING */}
        <section className="relative pt-16 pb-24 lg:pt-24 lg:pb-32 overflow-hidden border-b border-[#E5E7E2]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
              
              {/* Left Column: Monograph & Typography */}
              <div className="lg:col-span-7 space-y-8">
                
                <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border border-[#D1D5DB] bg-gradient-to-r from-white via-slate-100 to-white text-xs font-mono tracking-wider text-[#1F2421] shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-[#064E3B]" />
                  <span className="font-semibold">PREMIUM SYNTHESIS LINE</span>
                  <span className="text-[#7E8781]">|</span>
                  <span className="text-[#064E3B] font-bold">CLINICAL MONOGRAPH 01</span>
                </div>

                {/* Mandated User Headline */}
                <h1 
                  className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-[0.18em] uppercase text-[#1F2421] leading-[1.12]"
                  style={{ fontFamily: 'Syne, sans-serif' }}
                >
                  THE SCIENCE OF REGENERATION.
                </h1>

                {/* Mandated User Subheadline */}
                <p className="text-base sm:text-lg text-[#4A524D] leading-relaxed max-w-xl font-normal">
                  Premium grade lyophilized peptides. &gt;99% clinical purity for advanced aesthetic protocols.
                </p>

                {/* Technical Coordinates Grid */}
                <div className="pt-2 border-t border-[#E5E7E2] grid grid-cols-3 gap-4 text-xs font-mono text-[#4A524D]">
                  <div>
                    <span className="block text-[10px] text-[#7E8781] uppercase tracking-wider">Formulation</span>
                    <span className="font-semibold text-[#1F2421]">Bioactive Lyophilized</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-[#7E8781] uppercase tracking-wider">HPLC Assay</span>
                    <span className="font-bold text-[#064E3B]">≥ 99.4% Pure</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-[#7E8781] uppercase tracking-wider">Solubilization</span>
                    <span className="font-semibold text-[#1F2421]">Fresh At-Home Mix</span>
                  </div>
                </div>

                {/* CTA Action Buttons */}
                <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                  <a 
                    href="#formulas"
                    className="inline-flex items-center justify-center gap-3 bg-[#064E3B] hover:bg-[#04382A] text-white font-semibold text-xs uppercase tracking-[0.22em] py-4 px-8 rounded shadow-sm transition hover:shadow-md cursor-pointer"
                    style={{ fontFamily: 'Montserrat, sans-serif' }}
                  >
                    <span>EXPLORE FORMULAS</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>

                  <a 
                    href="#protocol"
                    className="inline-flex items-center justify-center gap-2 bg-white hover:bg-[#FAF9F5] border border-[#E5E7E2] hover:border-[#064E3B] text-[#1F2421] font-semibold text-xs uppercase tracking-[0.18em] py-4 px-6 rounded transition"
                    style={{ fontFamily: 'Montserrat, sans-serif' }}
                  >
                    <span>VIEW AT-HOME PROTOCOL</span>
                  </a>
                </div>

              </div>

              {/* Right Column: Sterile Luxury Visual Centerpiece */}
              <div className="lg:col-span-5">
                <div className="relative rounded-2xl bg-white border border-[#E5E7E2] p-6 sm:p-8 shadow-sm overflow-hidden">
                  
                  {/* Card Header */}
                  <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#E5E7E2] text-xs font-mono text-[#4A524D]">
                    <div>
                      <span className="text-[10px] text-[#7E8781] block">REFERENCE PROTOCOL</span>
                      <span className="font-bold text-[#1F2421]">PSL-GHK-10MG</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-[#7E8781] block">ESTABLISHED PURITY</span>
                      <span className="text-[#064E3B] font-bold">99.4% (HPLC)</span>
                    </div>
                  </div>

                  {/* Product Visual Container */}
                  <div className="relative h-72 sm:h-80 bg-[#FAF9F5] rounded-xl overflow-hidden flex items-center justify-center p-6 border border-[#E5E7E2]">
                    <img 
                      src="/images/ghk-cu-50mg-vial-50x30.jpg" 
                      alt="Formula 01: GHK-Cu 10mg Clinical Vial" 
                      className="max-h-full max-w-full object-contain filter drop-shadow-xl hover:scale-105 transition-transform duration-700"
                    />

                    {/* Floating Metallic Spec Pill */}
                    <div className="absolute bottom-4 left-4 bg-white/95 border border-[#D1D5DB] px-3 py-1 rounded text-[11px] font-mono font-semibold text-[#1F2421] shadow-sm">
                      10mg Lyophilized Powder + 5ml Vehicle
                    </div>
                    <div className="absolute top-4 right-4 bg-[#064E3B] text-white px-2.5 py-1 rounded text-[10px] font-mono tracking-wider uppercase font-semibold">
                      Batch: #2026-X1
                    </div>
                  </div>

                  {/* Chemical Coordinates */}
                  <div className="mt-6 pt-4 border-t border-[#E5E7E2] space-y-2 text-xs font-mono">
                    <div className="flex justify-between items-center text-[#4A524D]">
                      <span className="text-[#7E8781]">Active Tripeptide:</span>
                      <span className="font-semibold text-[#1F2421]">Copper Tripeptide-1 (GHK-Cu)</span>
                    </div>
                    <div className="flex justify-between items-center text-[#4A524D]">
                      <span className="text-[#7E8781]">Molecular Weight:</span>
                      <span className="text-[#1F2421]">403.94 g/mol</span>
                    </div>
                    <div className="flex justify-between items-center text-[#4A524D]">
                      <span className="text-[#7E8781]">Biological Function:</span>
                      <span className="text-[#064E3B] font-semibold">Pro-Collagen I &amp; III Synthesis</span>
                    </div>
                  </div>

                  {/* Quick Reserve Action */}
                  <div className="mt-6 pt-4 border-t border-[#E5E7E2] flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-[#7E8781] block font-mono uppercase">Single Protocol</span>
                      <span className="text-xl font-bold text-[#1F2421]" style={{ fontFamily: 'Syne, sans-serif' }}>
                        $145.00 <span className="text-xs font-normal text-[#7E8781]">USD</span>
                      </span>
                    </div>
                    <button 
                      onClick={() => addToCart(products[0])}
                      className="bg-[#064E3B] hover:bg-[#04382A] text-white font-semibold text-xs uppercase tracking-wider py-2.5 px-5 rounded transition shadow-sm cursor-pointer"
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
        <section id="formulas" className="py-24 border-b border-[#E5E7E2] bg-[#FAF9F5]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
              <div className="space-y-3">
                <span className="text-xs font-mono tracking-[0.25em] text-[#064E3B] uppercase font-bold block">
                  CLINICAL PROTOCOLS CATALOG
                </span>
                <h2 
                  className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-[0.16em] uppercase text-[#1F2421]"
                  style={{ fontFamily: 'Syne, sans-serif' }}
                >
                  THE FUTURE PHARMACY.
                </h2>
                <p className="text-sm sm:text-base text-[#4A524D] max-w-2xl font-normal leading-relaxed">
                  Formulated as sterile, research-grade bioactive protocols rather than commercial cosmetic dilutions. Each unit is delivered in an inert lyophilized state for peak freshness and cellular potency.
                </p>
              </div>

              {/* Protocol Filter Tabs */}
              <div className="flex flex-wrap gap-2 text-xs font-mono">
                {['ALL', 'REPAIR', 'LONGEVITY'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3.5 py-2 rounded transition font-semibold cursor-pointer ${
                      selectedCategory === cat
                        ? 'border border-[#064E3B] bg-[#064E3B] text-white'
                        : 'border border-[#E5E7E2] bg-white text-[#4A524D] hover:border-[#064E3B]'
                    }`}
                  >
                    {cat === 'ALL' ? 'ALL FORMULAS' : cat === 'REPAIR' ? 'CELLULAR REPAIR' : 'LONGEVITY KITS'}
                  </button>
                ))}
              </div>
            </div>

            {/* Clinical Protocols Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map((p) => (
                <div
                  key={p.id}
                  className={`bg-white rounded-xl border p-6 flex flex-col justify-between shadow-sm relative overflow-hidden group transition-all duration-300 ${
                    p.isFlagship ? 'border-[#064E3B]/60 ring-1 ring-[#064E3B]/20' : 'border-[#E5E7E2] hover:border-[#064E3B]'
                  }`}
                >
                  {p.isFlagship && (
                    <div className="absolute top-0 right-0 bg-[#064E3B] text-white text-[10px] font-mono font-bold uppercase tracking-widest px-3 py-1 rounded-bl">
                      FLAGSHIP FORMULA
                    </div>
                  )}

                  <div>
                    {/* Image Presentation */}
                    <div className="relative h-60 bg-[#FAF9F5] rounded-lg border border-[#E5E7E2] mb-6 flex items-center justify-center p-4 overflow-hidden">
                      <img 
                        src={p.image} 
                        alt={p.name} 
                        className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-500"
                      />
                      <span className="absolute bottom-3 left-3 bg-white/90 border border-[#D1D5DB] text-[10px] font-mono px-2 py-0.5 rounded text-[#1F2421]">
                        Purity: {p.purity}
                      </span>
                    </div>

                    {/* Monograph Identifiers */}
                    <div className="space-y-2 mb-4">
                      <div className="text-[11px] font-mono text-[#064E3B] font-bold uppercase tracking-wider">
                        {p.number} • {p.categoryTag}
                      </div>
                      <h3 
                        className="text-xl font-bold uppercase tracking-[0.1em] text-[#1F2421]"
                        style={{ fontFamily: 'Syne, sans-serif' }}
                      >
                        {p.shortName}
                      </h3>
                      <div className="text-xs font-mono text-[#7E8781]">
                        Dosage: {p.dosage}
                      </div>
                      <p className="text-xs text-[#4A524D] leading-relaxed pt-2">
                        {p.description}
                      </p>
                    </div>

                    {/* Technical Details Specs */}
                    <div className="py-3 border-t border-b border-[#E5E7E2] my-4 grid grid-cols-2 gap-2 text-[11px] font-mono text-[#4A524D]">
                      <div>
                        <span className="text-[#7E8781] block text-[9px] uppercase">Reconstitution</span>
                        <span>{p.reconstitution}</span>
                      </div>
                      <div>
                        <span className="text-[#7E8781] block text-[9px] uppercase">Shelf Life</span>
                        <span>{p.shelfLife}</span>
                      </div>
                    </div>
                  </div>

                  {/* Footer Action */}
                  <div className="pt-2 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-[#7E8781] font-mono block">Protocol Unit</span>
                      <span className="text-lg font-bold text-[#1F2421]" style={{ fontFamily: 'Syne, sans-serif' }}>
                        ${p.price}.00
                      </span>
                    </div>
                    <button 
                      onClick={() => addToCart(p)}
                      className="bg-[#064E3B] hover:bg-[#04382A] text-white font-semibold text-xs uppercase tracking-wider py-2.5 px-4 rounded transition cursor-pointer"
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
        <section id="purity" className="py-24 border-b border-[#E5E7E2] bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
              
              <div className="lg:col-span-5 space-y-6">
                
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#D1D5DB] bg-[#FAF9F5] text-xs font-mono text-[#1F2421]">
                  <span className="w-2 h-2 rounded-full bg-[#064E3B]" />
                  <span>INDEPENDENT ANALYTICAL CERTIFICATION</span>
                </div>

                <h2 
                  className="text-3xl sm:text-4xl font-bold tracking-[0.16em] uppercase text-[#1F2421] leading-tight"
                  style={{ fontFamily: 'Syne, sans-serif' }}
                >
                  THE CERTIFICATE OF ANALYSIS (CoA).
                </h2>

                <p className="text-sm sm:text-base text-[#4A524D] leading-relaxed">
                  We operate on absolute transparency. While commercial cosmetics conceal active percentages within opaque marketing claims, PSL Labs publishes raw, third-party verified High-Performance Liquid Chromatography (HPLC) and Mass Spectrometry (MS) data for every single production run.
                </p>

                <div className="space-y-4 pt-2">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#ECFDF5] border border-[#064E3B]/30 flex items-center justify-center text-[#064E3B] shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <div className="text-xs">
                      <strong className="text-[#1F2421] block font-semibold mb-0.5">Verified Purity Floor &gt; 99.0%</strong>
                      <span className="text-[#4A524D]">Batches falling below 99.0% HPLC purity are rejected at the analytical chromatography gate.</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#ECFDF5] border border-[#064E3B]/30 flex items-center justify-center text-[#064E3B] shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <div className="text-xs">
                      <strong className="text-[#1F2421] block font-semibold mb-0.5">Endotoxin Assay &lt; 0.01 EU/mg</strong>
                      <span className="text-[#4A524D]">Tested via Limulus Amebocyte Lysate (LAL) to guarantee zero pyrogenic microbial trace.</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#ECFDF5] border border-[#064E3B]/30 flex items-center justify-center text-[#064E3B] shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <div className="text-xs">
                      <strong className="text-[#1F2421] block font-semibold mb-0.5">Cryogenic Lyophilization Sealed under Nitrogen</strong>
                      <span className="text-[#4A524D]">Zero moisture content degradation. 24-month stability prior to sterile reconstitution.</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <button 
                    onClick={() => setIsCoaOpen(true)}
                    className="inline-flex items-center gap-2 bg-[#1F2421] hover:bg-[#064E3B] text-white font-semibold text-xs uppercase tracking-[0.18em] py-3.5 px-6 rounded transition cursor-pointer"
                    style={{ fontFamily: 'Montserrat, sans-serif' }}
                  >
                    <span>OPEN OFFICIAL COA REPORT</span>
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>

              </div>

              {/* Right Column: Interactive Real Certificate Preview */}
              <div className="lg:col-span-7">
                <div className="bg-[#FAF9F5] rounded-2xl border border-[#E5E7E2] p-6 sm:p-8 shadow-sm">
                  
                  <div className="border-b border-[#E5E7E2] pb-4 mb-6 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-[#064E3B] text-white flex items-center justify-center font-bold text-xs font-mono">
                        CoA
                      </div>
                      <div>
                        <h3 
                          className="font-bold text-sm tracking-wider text-[#1F2421] uppercase"
                          style={{ fontFamily: 'Syne, sans-serif' }}
                        >
                          Certificate of Analytical Release
                        </h3>
                        <p className="text-[11px] font-mono text-[#7E8781]">ISO/IEC 17025 ACREDITADO • BATCH: #PSL-2026-X1</p>
                      </div>
                    </div>
                    <span className="px-3 py-1 rounded text-xs font-mono text-[#064E3B] font-bold border border-[#D1D5DB] bg-white">
                      STATUS: PASSED (≥99.4%)
                    </span>
                  </div>

                  {/* Chromatographic Vector Plot */}
                  <div className="bg-white rounded-xl border border-[#E5E7E2] p-4 sm:p-5 mb-6">
                    <div className="flex items-center justify-between text-xs font-mono text-[#7E8781] mb-2">
                      <span>RP-HPLC CHROMATOGRAM [λ=214nm]</span>
                      <span className="text-[#064E3B] font-semibold">PEAK RETENTION tR: 4.82 min</span>
                    </div>
                    <div className="h-44 w-full">
                      <svg className="w-full h-full" viewBox="0 0 500 150" fill="none">
                        <line x1="20" y1="130" x2="480" y2="130" stroke="#E2E8F0" strokeWidth="1.5" />
                        <line x1="20" y1="90" x2="480" y2="90" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="2 2" />
                        <line x1="20" y1="50" x2="480" y2="50" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="2 2" />

                        <path 
                          d="M20 130 L160 130 Q185 129 195 110 Q205 70 210 20 Q212 12 215 20 Q220 70 230 110 Q240 129 270 130 L480 130" 
                          stroke="#064E3B" 
                          strokeWidth="2.2" 
                          fill="none" 
                        />
                        <path 
                          d="M20 130 L160 130 Q185 129 195 110 Q205 70 210 20 Q212 12 215 20 Q220 70 230 110 Q240 129 270 130 L480 130 Z" 
                          fill="rgba(6, 78, 59, 0.08)" 
                        />

                        <circle cx="212" cy="14" r="3" fill="#064E3B" />
                        <line x1="212" y1="14" x2="250" y2="14" stroke="#064E3B" strokeWidth="1" />
                        <text x="256" y="18" fill="#064E3B" fontSize="10" fontFamily="monospace" fontWeight="bold">
                          Main Peak: 99.41% Area
                        </text>
                      </svg>
                    </div>
                    <div className="flex justify-between text-[10px] font-mono text-[#7E8781] pt-1">
                      <span>0.0 min</span>
                      <span>3.0 min</span>
                      <span>6.0 min</span>
                      <span>9.0 min</span>
                      <span>12.0 min</span>
                    </div>
                  </div>

                  {/* Lab Test Parameters Table */}
                  <div className="border border-[#E5E7E2] rounded-lg overflow-hidden bg-white text-xs font-mono">
                    <table className="w-full text-left">
                      <thead className="bg-[#FAF9F5] border-b border-[#E5E7E2] text-[10px] text-[#7E8781] uppercase">
                        <tr>
                          <th className="py-2.5 px-3">Test Parameter</th>
                          <th className="py-2.5 px-3">Specification</th>
                          <th className="py-2.5 px-3 text-right">Result</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#E5E7E2] text-[#1F2421]">
                        <tr>
                          <td className="py-2 px-3 text-[#4A524D]">Appearance</td>
                          <td className="py-2 px-3 text-[#7E8781]">Fine white/blue cake</td>
                          <td className="py-2 px-3 text-right text-[#064E3B] font-semibold">Conforms</td>
                        </tr>
                        <tr>
                          <td className="py-2 px-3 text-[#4A524D]">HPLC Chromatographic Purity</td>
                          <td className="py-2 px-3 text-[#7E8781]">≥ 99.0%</td>
                          <td className="py-2 px-3 text-right font-bold text-[#064E3B]">99.41%</td>
                        </tr>
                        <tr>
                          <td className="py-2 px-3 text-[#4A524D]">Mass Spectrometry (ESI-MS)</td>
                          <td className="py-2 px-3 text-[#7E8781]">403.9 ± 1.0 Da</td>
                          <td className="py-2 px-3 text-right text-[#064E3B] font-semibold">403.8 Da</td>
                        </tr>
                        <tr>
                          <td className="py-2 px-3 text-[#4A524D]">Bacterial Endotoxins</td>
                          <td className="py-2 px-3 text-[#7E8781]">&lt; 0.05 EU/mg</td>
                          <td className="py-2 px-3 text-right text-[#064E3B] font-semibold">&lt; 0.01 EU/mg</td>
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
        <section id="protocol" className="py-24 border-b border-[#E5E7E2] bg-[#FAF9F5]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="text-center max-w-3xl mx-auto mb-20 space-y-3">
              <span className="text-xs font-mono tracking-[0.25em] text-[#064E3B] uppercase font-bold block">
                CLINICAL AT-HOME PREPARATION
              </span>
              <h2 
                className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-[0.16em] uppercase text-[#1F2421]"
                style={{ fontFamily: 'Syne, sans-serif' }}
              >
                THE RECONSTITUTION PROTOCOL.
              </h2>
              <p className="text-sm sm:text-base text-[#4A524D] font-normal leading-relaxed">
                Peptides in aqueous liquid solutions naturally degrade within weeks on retail shelves. By mixing the lyophilized powder with sterile diluent directly prior to your protocol, you unlock maximum biological potency.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              
              {/* STEP 01 */}
              <div className="bg-white rounded-xl border border-[#E5E7E2] p-8 shadow-sm flex flex-col justify-between hover:border-[#064E3B] transition-all">
                <div>
                  <div className="flex items-center justify-between mb-8">
                    <span className="text-3xl font-bold text-[#064E3B]" style={{ fontFamily: 'Syne, sans-serif' }}>01</span>
                    <span className="border border-[#D1D5DB] bg-[#FAF9F5] text-[10px] font-mono px-2.5 py-1 rounded text-[#1F2421]">
                      STERILE MIX
                    </span>
                  </div>

                  <div className="h-32 mb-6 flex items-center justify-center bg-[#FAF9F5] rounded-lg border border-[#E5E7E2]">
                    <FlaskConical className="w-14 h-14 text-[#064E3B]" />
                  </div>

                  <h3 
                    className="font-bold text-base uppercase tracking-wider text-[#1F2421] mb-2"
                    style={{ fontFamily: 'Syne, sans-serif' }}
                  >
                    Sterile Transfer
                  </h3>
                  <p className="text-xs text-[#4A524D] leading-relaxed">
                    Flip the protective seal from the amber peptide vial. Using the enclosed sterile transfer cannula, draw exactly 2.0ml of bacteriostatic reconstitution vehicle.
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#E5E7E2] text-[11px] font-mono text-[#7E8781]">
                  Phase: Vacuum Release &amp; Aseptic Transfer
                </div>
              </div>

              {/* STEP 02 */}
              <div className="bg-white rounded-xl border border-[#E5E7E2] p-8 shadow-sm flex flex-col justify-between hover:border-[#064E3B] transition-all">
                <div>
                  <div className="flex items-center justify-between mb-8">
                    <span className="text-3xl font-bold text-[#064E3B]" style={{ fontFamily: 'Syne, sans-serif' }}>02</span>
                    <span className="border border-[#D1D5DB] bg-[#FAF9F5] text-[10px] font-mono px-2.5 py-1 rounded text-[#1F2421]">
                      DISSOLUTION
                    </span>
                  </div>

                  <div className="h-32 mb-6 flex items-center justify-center bg-[#FAF9F5] rounded-lg border border-[#E5E7E2]">
                    <Sparkles className="w-14 h-14 text-[#064E3B]" />
                  </div>

                  <h3 
                    className="font-bold text-base uppercase tracking-wider text-[#1F2421] mb-2"
                    style={{ fontFamily: 'Syne, sans-serif' }}
                  >
                    Inert Solubilization
                  </h3>
                  <p className="text-xs text-[#4A524D] leading-relaxed">
                    Direct the sterile diluent smoothly down the inside glass wall of the vial. Gently swirl in a circular motion for 20 seconds. <strong>Never agitate or shake violently</strong> to protect delicate tertiary peptide bonds.
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#E5E7E2] text-[11px] font-mono text-[#7E8781]">
                  Time: 20 Seconds Gentle Rotation
                </div>
              </div>

              {/* STEP 03 */}
              <div className="bg-white rounded-xl border border-[#E5E7E2] p-8 shadow-sm flex flex-col justify-between hover:border-[#064E3B] transition-all">
                <div>
                  <div className="flex items-center justify-between mb-8">
                    <span className="text-3xl font-bold text-[#064E3B]" style={{ fontFamily: 'Syne, sans-serif' }}>03</span>
                    <span className="border border-[#D1D5DB] bg-[#FAF9F5] text-[10px] font-mono px-2.5 py-1 rounded text-[#1F2421]">
                      DAILY PROTOCOL
                    </span>
                  </div>

                  <div className="h-32 mb-6 flex items-center justify-center bg-[#FAF9F5] rounded-lg border border-[#E5E7E2]">
                    <Clock className="w-14 h-14 text-[#064E3B]" />
                  </div>

                  <h3 
                    className="font-bold text-base uppercase tracking-wider text-[#1F2421] mb-2"
                    style={{ fontFamily: 'Syne, sans-serif' }}
                  >
                    Precision Topical Delivery
                  </h3>
                  <p className="text-xs text-[#4A524D] leading-relaxed">
                    Attach the enclosed silicone micro-dropper. Dispense 4 to 6 drops directly onto cleansed skin once daily before bedtime. Store the reconstituted vial strictly refrigerated between 2°C and 8°C.
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#E5E7E2] text-[11px] font-mono text-[#7E8781]">
                  Potency Window: 30 Days Refrigerated
                </div>
              </div>

            </div>

          </div>
        </section>

      </main>

      {/* LUXURY CLINICAL FOOTER */}
      <footer className="bg-[#1F2421] text-[#A6AEA8] py-16 border-t border-[#363E38] text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            
            <div className="md:col-span-2 space-y-4">
              <img 
                src="/brand/psl-labs-premium-synthesis-line.png" 
                alt="PSL LABS" 
                className="h-10 w-auto object-contain brightness-0 invert opacity-90 mb-2"
              />
              <p className="text-xs text-[#8A938C] max-w-sm leading-relaxed font-normal">
                PSL Labs (Premium Synthesis Line) S.A. operates as a high-precision biotechnology facility dedicated to research-grade peptide synthesis, structural lyophilization, and clinical aesthetic protocols.
              </p>
              <div className="pt-2 text-[11px] font-mono text-[#6D766F]">
                FACILITY: PARQUE INDUSTRIAL ASUNCIÓN • CIUDAD DEL ESTE • REPÚBLICA DEL PARAGUAY
              </div>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="text-white font-bold uppercase tracking-widest text-[11px]">
                ANALYTICAL RIGOR
              </div>
              <ul className="space-y-2 text-[#8A938C]">
                <li>• DIN EN ISO 9001:2015</li>
                <li>• ISO/IEC 17025 Third-Party Tested</li>
                <li>• Class 100 Cleanroom Lyophilization</li>
                <li>• Endotoxin Certified &lt; 0.01 EU/mg</li>
              </ul>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="text-white font-bold uppercase tracking-widest text-[11px]">
                CLIENT CONCIERGE
              </div>
              <ul className="space-y-2 text-[#8A938C]">
                <li>• Cold-Chain Priority Dispatch</li>
                <li>• Batch Verification Registry</li>
                <li>• Direct Practitioner Inquiries</li>
                <li>• conciergelab@psl-labs.com</li>
              </ul>
            </div>

          </div>

          <div className="border-t border-[#2F3631] pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-mono text-[#6D766F]">
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
            className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity" 
          />
          
          <div className="relative w-screen max-w-md bg-[#FAF9F5] border-l border-[#E5E7E2] shadow-2xl flex flex-col justify-between p-6 sm:p-8 z-10">
            <div>
              <div className="flex items-center justify-between border-b border-[#E5E7E2] pb-4 mb-6">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#064E3B]" />
                  <h3 
                    className="font-bold text-lg uppercase tracking-wider text-[#1F2421]"
                    style={{ fontFamily: 'Syne, sans-serif' }}
                  >
                    Your Protocol Bag
                  </h3>
                </div>
                <button 
                  onClick={() => setIsCartOpen(false)}
                  className="text-[#7E8781] hover:text-[#1F2421] p-1 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="bg-[#ECFDF5] border border-[#064E3B]/30 rounded-lg p-3 text-xs font-mono text-[#064E3B] mb-6 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#064E3B] shrink-0" />
                <span>Cold-chain isothermal packing automatically assigned to this order.</span>
              </div>

              <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-1">
                {cart.length === 0 ? (
                  <p className="text-xs font-mono text-[#7E8781] text-center py-12">
                    Your protocol bag is currently empty.<br />Select a clinical formula above to begin.
                  </p>
                ) : (
                  cart.map((item, index) => (
                    <div key={index} className="flex items-center gap-3 bg-white p-3 rounded-lg border border-[#E5E7E2]">
                      <img src={item.image} alt={item.name} className="w-12 h-12 object-contain bg-[#FAF9F5] rounded border border-[#E5E7E2] p-1" />
                      <div className="flex-grow min-w-0">
                        <h4 className="font-bold text-xs text-[#1F2421] truncate">{item.name}</h4>
                        <span className="text-[11px] font-mono text-[#064E3B] font-semibold">${item.price}.00 USD</span>
                      </div>
                      <button 
                        onClick={() => removeFromCart(index)}
                        className="text-[#7E8781] hover:text-red-600 text-xs font-mono p-1 cursor-pointer"
                      >
                        ✕
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="border-t border-[#E5E7E2] pt-6 space-y-4">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-[#7E8781]">SUBTOTAL:</span>
                <span className="font-bold text-lg text-[#1F2421]" style={{ fontFamily: 'Syne, sans-serif' }}>
                  ${cartSubtotal}.00 USD
                </span>
              </div>
              <div className="text-[11px] font-mono text-[#7E8781]">
                Includes Certificate of Analysis &amp; Sterile Reconstitution Vehicle.
              </div>
              <button 
                onClick={() => alert("Batch Allocation Reserved. In production, this directs to cold-chain dispatch.")}
                className="w-full bg-[#064E3B] hover:bg-[#04382A] text-white font-semibold text-xs uppercase tracking-[0.2em] py-4 rounded transition shadow-sm cursor-pointer"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl border border-[#E5E7E2] max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setIsCoaOpen(false)}
              className="absolute top-5 right-5 text-[#7E8781] hover:text-[#1F2421] p-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#E5E7E2]">
              <img src="/brand/psl-labs-premium-synthesis-line.png" alt="PSL LABS" className="h-8 w-auto" />
              <div>
                <h4 
                  className="font-bold text-sm tracking-widest text-[#1F2421] uppercase"
                  style={{ fontFamily: 'Syne, sans-serif' }}
                >
                  Official Certificate of Analysis
                </h4>
                <span className="text-[10px] font-mono text-[#7E8781]">DOCUMENT ID: COA-GHK-2026-X1 • ACCREDITED TESTING</span>
              </div>
            </div>

            <div className="space-y-4 text-xs font-mono">
              <div className="grid grid-cols-2 gap-3 bg-[#FAF9F5] p-3.5 rounded-lg border border-[#E5E7E2]">
                <div>
                  <span className="text-[10px] text-[#7E8781] block">Compound Name:</span>
                  <strong className="text-[#1F2421]">GHK-Cu (Copper Tripeptide-1)</strong>
                </div>
                <div>
                  <span className="text-[10px] text-[#7E8781] block">Batch Number:</span>
                  <strong className="text-[#1F2421]">#PSL-2026-X1</strong>
                </div>
                <div>
                  <span className="text-[10px] text-[#7E8781] block">Production Date:</span>
                  <span className="text-[#4A524D]">November 2026</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#7E8781] block">Certified Purity:</span>
                  <strong className="text-[#064E3B]">99.41% (RP-HPLC)</strong>
                </div>
              </div>

              <p className="text-xs text-[#4A524D] leading-relaxed">
                This certifies that the referenced peptide batch was synthesized under standard GMP cleanroom guidelines, confirmed through electrospray ionization mass spectrometry (ESI-MS), and packaged under inert pharmaceutical grade nitrogen atmosphere.
              </p>

              <div className="pt-4 border-t border-[#E5E7E2] flex items-center justify-between">
                <div className="text-[10px] text-[#7E8781]">
                  Verified by: <strong className="text-[#1F2421] block">Dr. M. Benítez, PhD</strong> Head of Analytical Chemistry, PSL LABS S.A.
                </div>
                <button 
                  onClick={() => window.print()}
                  className="bg-[#FAF9F5] hover:bg-[#E5E7E2] text-[#1F2421] font-semibold px-4 py-2 rounded border border-[#E5E7E2] text-xs transition cursor-pointer flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
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
