import { useState, useEffect, useMemo } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import compoundsData from '../data/compounds.json';
import { 
  ShoppingBag, 
  Search, 
  X, 
  Check, 
  Plus, 
  Minus, 
  Trash2, 
  MessageCircle, 
  Sparkles, 
  Zap, 
  ShieldCheck, 
  HelpCircle, 
  FileText, 
  Layers, 
  Truck, 
  QrCode,
  ArrowRight
} from 'lucide-react';

export default function PSLMarketplaceLP() {
  // Current view: 'catalog' | 'calc'
  const [currentView, setCurrentView] = useState('catalog');

  // Tier: 'b2c' (1 Frasco) | 'b2b' (Atacado 10 Frascos)
  const [tier, setTier] = useState('b2c');

  // Search and Category Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('TODOS');

  // Selected dose index for each compound: { [compoundId]: number }
  const [selectedDoses, setSelectedDoses] = useState({});

  // Cart: Array of { compoundId, name, doseCode, doseLabel, isB2B, unitPrice, qty, stockStatus }
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [shippingMethod, setShippingMethod] = useState('sedex'); // 'uber' | 'sedex'
  const [clientName, setClientName] = useState('');
  const [clientAddress, setClientAddress] = useState('');

  // Seller WhatsApp number
  const [sellerWhatsapp] = useState('5511999999999');

  // Calculator State
  const [calcPeptideSelect, setCalcPeptideSelect] = useState('10');
  const [calcManualMg, setCalcManualMg] = useState(10);
  const [calcWaterMl, setCalcWaterMl] = useState(2.0);
  const [calcDoseAmount, setCalcDoseAmount] = useState(500);
  const [calcDoseUnit, setCalcDoseUnit] = useState('mcg'); // 'mcg' | 'mg'
  const [calcSyringeType, setCalcSyringeType] = useState(100); // 100 | 50 | 30

  // Initialize selected doses and inventory status
  const compounds = useMemo(() => {
    return compoundsData.map((comp) => {
      // In PSL Labs real stock, GHK-Cu 50mg (CU50) has ready stock in SP, others are on-demand
      const doses = comp.doses.map((dose) => {
        const isCu50 = dose.code === 'CU50' || comp.id === 'ghk-cu';
        const stockQty = isCu50 ? 29 : 0;
        return {
          ...dose,
          stockQty,
          stockStatus: stockQty > 0 ? 'in_stock' : 'pre_order'
        };
      });

      const hasStock = doses.some(d => d.stockStatus === 'in_stock');
      return {
        ...comp,
        doses,
        stockStatus: hasStock ? 'in_stock' : 'pre_order',
        defaultDoseIndex: comp.defaultDoseIndex || 0
      };
    });
  }, []);

  // Set default doses on first load
  useEffect(() => {
    const initialDoses = {};
    compounds.forEach((comp) => {
      initialDoses[comp.id] = comp.defaultDoseIndex || 0;
    });
    setSelectedDoses(initialDoses);
  }, [compounds]);

  // Load saved cart from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('psl_cart');
      if (saved) setCart(JSON.parse(saved));
    } catch (e) {
      console.warn(e);
    }
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('psl_cart', JSON.stringify(cart));
    } catch (e) {
      console.warn(e);
    }
  }, [cart]);

  // Handle select dose for a compound
  const handleSelectDose = (compoundId, doseIdx) => {
    setSelectedDoses(prev => ({
      ...prev,
      [compoundId]: doseIdx
    }));
  };

  // Add item to cart
  const addToCart = (compound) => {
    const doseIdx = selectedDoses[compound.id] ?? (compound.defaultDoseIndex || 0);
    const dose = compound.doses[doseIdx] || compound.doses[0];
    const isB2B = tier === 'b2b';
    const unitPrice = isB2B ? dose.b2bBoxPrice : dose.suggestedPriceB2C;

    setCart(prev => {
      const existingIdx = prev.findIndex(item => item.compoundId === compound.id && item.doseCode === dose.code && item.isB2B === isB2B);
      if (existingIdx >= 0) {
        const updated = [...prev];
        updated[existingIdx].qty += 1;
        return updated;
      } else {
        return [
          ...prev,
          {
            compoundId: compound.id,
            name: compound.name,
            doseCode: dose.code,
            doseLabel: dose.label,
            isB2B,
            unitPrice,
            qty: 1,
            stockStatus: dose.stockStatus
          }
        ];
      }
    });

    setIsCartOpen(true);
  };

  const updateCartQty = (index, delta) => {
    setCart(prev => {
      const updated = [...prev];
      const newQty = updated[index].qty + delta;
      if (newQty <= 0) {
        return updated.filter((_, i) => i !== index);
      }
      updated[index].qty = newQty;
      return updated;
    });
  };

  const removeCartItem = (index) => {
    setCart(prev => prev.filter((_, i) => i !== index));
  };

  const cartTotal = cart.reduce((acc, item) => acc + (item.unitPrice * item.qty), 0);
  const cartCount = cart.reduce((acc, item) => acc + item.qty, 0);

  // Filter compounds based on Search & Category
  const filteredCompounds = useMemo(() => {
    return compounds.filter((comp) => {
      // Category Match
      if (selectedCategory === 'PRONTA_ENTREGA') {
        const hasStock = comp.doses.some(d => d.stockStatus === 'in_stock');
        if (!hasStock) return false;
      } else if (selectedCategory !== 'TODOS') {
        if (!comp.line?.toLowerCase().includes(selectedCategory.toLowerCase())) {
          return false;
        }
      }

      // Search Query Match
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = comp.name?.toLowerCase().includes(query);
        const matchesDesc = comp.desc?.toLowerCase().includes(query);
        const matchesDose = comp.doses?.some(d => d.label?.toLowerCase().includes(query) || d.code?.toLowerCase().includes(query));
        if (!matchesName && !matchesDesc && !matchesDose) return false;
      }

      return true;
    });
  }, [compounds, selectedCategory, searchQuery]);

  // Jump to Calculator pre-filling product dose
  const openCalculatorForProduct = (doseNum, doseUnit) => {
    setCurrentView('calc');
    if (doseUnit === 'mg' && ['5', '10', '15', '20', '30', '50', '60'].includes(String(doseNum))) {
      setCalcPeptideSelect(String(doseNum));
    } else {
      setCalcPeptideSelect('custom');
      setCalcManualMg(doseUnit === 'mcg' ? doseNum / 1000 : doseNum);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Calculator calculations
  const calcResults = useMemo(() => {
    const vialMg = calcPeptideSelect === 'custom' 
      ? (parseFloat(calcManualMg) || 10) 
      : (parseFloat(calcPeptideSelect) || 10);
    const waterMl = parseFloat(calcWaterMl) || 2.0;
    const targetDose = parseFloat(calcDoseAmount) || 500;
    const targetDoseMg = calcDoseUnit === 'mcg' ? targetDose / 1000 : targetDose;

    const concentrationMgPerMl = vialMg / waterMl;
    const neededMl = targetDoseMg / concentrationMgPerMl;
    const units = neededMl * 100;
    const totalDoses = Math.max(1, Math.floor(vialMg / targetDoseMg));
    const roundedUnits = Math.round(units * 10) / 10;

    // SVG Syringe fill calculations
    const ratio = Math.min(Math.max(roundedUnits / calcSyringeType, 0), 1);
    const barrelWidth = 230;
    const filledWidth = Math.max(ratio * barrelWidth, 4);

    return {
      vialMg,
      waterMl,
      concentrationMgPerMl,
      roundedUnits,
      totalDoses,
      filledWidth,
      plungerX: 30 + filledWidth,
      rodX: 30 + filledWidth + 2,
      thumbX: 30 + filledWidth + 140
    };
  }, [calcPeptideSelect, calcManualMg, calcWaterMl, calcDoseAmount, calcDoseUnit, calcSyringeType]);

  // Format and send order to WhatsApp
  const handleCheckoutWhatsApp = () => {
    if (cart.length === 0) return;

    let hasInStock = false;
    let hasPreOrder = false;

    let msg = "*NOVO PEDIDO • PSL LABS (PREMIUM SYNTHESIS LINE)*\n";
    msg += "=========================================\n\n";

    cart.forEach(item => {
      const sub = item.unitPrice * item.qty;
      const inStock = item.stockStatus === 'in_stock';
      if (inStock) hasInStock = true;
      else hasPreOrder = true;

      const stockTag = inStock ? "[⚡ Pronta Entrega SP]" : "[⏳ Sob Encomenda 3-5d]";
      const tierTag = item.isB2B ? "Caixa c/ 10 Frascos" : "1 Frasco";

      msg += `• ${item.qty}x ${item.name} (${item.doseLabel}) [${tierTag}] ${stockTag} = R$ ${sub.toFixed(2).replace('.', ',')}\n`;
    });

    msg += "\n-----------------------------------------\n";
    msg += `*TOTAL DO PEDIDO:* R$ ${cartTotal.toFixed(2).replace('.', ',')}\n\n`;

    if (hasPreOrder && hasInStock) {
      msg += "*DISPONIBILIDADE:* ⚠️ *Pedido Misto* (Itens Pronta Entrega SP e Sob Encomenda - Prazo 3 a 5 dias úteis)\n";
    } else if (hasPreOrder) {
      msg += "*DISPONIBILIDADE:* ⏳ *Sob Encomenda* (Envio em 3 a 5 dias úteis)\n";
    } else {
      msg += "*DISPONIBILIDADE:* ⚡ *Pronta Entrega SP* (Envio imediato hoje via Motoboy Flash SP ou Sedex!)\n";
    }

    const shippingLabel = shippingMethod === 'uber' 
      ? "🛵 Uber Moto / Flash (São Paulo - até 2h para Pronta Entrega)" 
      : "📦 Correios Sedex (Todo Brasil)";
    msg += `*FORMA DE ENVIO:* ${shippingLabel}\n`;
    msg += `*NOME:* ${clientName || 'A informar'}\n`;
    msg += `*ENDEREÇO / CIDADE:* ${clientAddress || 'A informar'}\n\n`;
    msg += "Gostaria de confirmar a disponibilidade e receber a chave Pix para pagamento!";

    const encoded = encodeURIComponent(msg);
    window.open(`https://wa.me/${sellerWhatsapp}?text=${encoded}`, '_blank');
  };

  const handleSupportWhatsApp = () => {
    const msg = encodeURIComponent("Olá, PSL Labs! Gostaria de tirar dúvidas sobre os peptídeos, dosagens e pronta entrega.");
    window.open(`https://wa.me/${sellerWhatsapp}?text=${msg}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] font-sans antialiased pb-20 md:pb-10 selection:bg-[#145C46] selection:text-white">
      <Head>
        <title>PSL Labs — Premium Synthesis Line | Peptídeos de Alta Pureza</title>
        <meta name="description" content="Catálogo Oficial PSL Labs. Peptídeos liofilizados de alta pureza HPLC ≥ 99.4%, pronta entrega em São Paulo e envio nacional." />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover" />
        <meta name="theme-color" content="#145C46" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </Head>

      {/* TOP ANNOUNCEMENT FLASH BAR */}
      <div className="bg-gradient-to-r from-[#064E3B] via-[#145C46] to-[#064E3B] text-white py-2 px-3 text-center text-xs font-semibold flex items-center justify-center gap-2">
        <span className="bg-white/20 text-white px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider">
          ⚡ Flash SP
        </span>
        <span className="truncate">
          Entrega em até <strong>2h na Grande SP</strong> via Uber Moto • Sedex Brasil com gelo reutilizável
        </span>
      </div>

      {/* STICKY HEADER */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 flex items-center justify-between gap-3">
          
          {/* Brand Logo */}
          <div 
            onClick={() => setCurrentView('catalog')} 
            className="cursor-pointer flex items-center shrink-0"
            title="PSL Labs - Catálogo Oficial"
          >
            <img 
              src="/brand/psl-labs-premium-synthesis-line.png" 
              alt="PSL Labs - Premium Synthesis Line" 
              className="h-9 sm:h-11 w-auto max-w-[140px] sm:max-w-none object-contain transition-transform hover:scale-102"
            />
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Desktop Navigation Tabs */}
            <div className="hidden md:flex items-center gap-2">
              <div className="flex bg-slate-100 p-1 rounded-full">
                <button
                  onClick={() => setCurrentView('catalog')}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    currentView === 'catalog' 
                      ? 'bg-[#145C46] text-white shadow-xs' 
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  📦 Catálogo
                </button>
                <button
                  onClick={() => setCurrentView('calc')}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    currentView === 'calc' 
                      ? 'bg-[#145C46] text-white shadow-xs' 
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  🧪 Calculadora
                </button>
              </div>

              {/* Verify Bottle Link */}
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-[#145C46] border border-slate-200 px-3 py-1.5 rounded-full transition"
                title="Ir para o Terminal de Validação de QR Code"
              >
                <QrCode className="w-3.5 h-3.5 text-[#145C46]" />
                <span>Verificar Frasco</span>
              </Link>

              {/* Desktop Cart Button */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="bg-[#0F172A] hover:bg-slate-800 text-white font-bold text-xs px-4 py-2 rounded-full flex items-center gap-1.5 transition cursor-pointer shadow-xs"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Pedido ({cartCount})</span>
              </button>
            </div>

            {/* Tier Switcher (B2C vs B2B) */}
            <div className="flex items-center bg-[#E8F5EE] border border-[#A3D4C1] rounded-full p-0.5">
              <button
                onClick={() => setTier('b2c')}
                className={`px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-bold transition-all cursor-pointer ${
                  tier === 'b2c' 
                    ? 'bg-[#145C46] text-white shadow-xs' 
                    : 'text-[#0D4131] hover:text-[#145C46]'
                }`}
              >
                🏷️ 1 Frasco
              </button>
              <button
                onClick={() => setTier('b2b')}
                className={`px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-bold transition-all cursor-pointer ${
                  tier === 'b2b' 
                    ? 'bg-[#145C46] text-white shadow-xs' 
                    : 'text-[#0D4131] hover:text-[#145C46]'
                }`}
              >
                📦 Atacado (10 un)
              </button>
            </div>

          </div>

        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 py-3 sm:py-6">
        
        {/* ================= CATALOG VIEW ================= */}
        {currentView === 'catalog' && (
          <div>
            
            {/* Search and Category Filter Panel */}
            <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200 shadow-xs mb-4">
              
              {/* Search Row */}
              <div className="relative mb-3">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar peptídeo (ex: Retatrutide, BPC-157, GHK-Cu, Tirzepatide)..."
                  className="w-full pl-10 pr-4 py-2.5 bg-[#FAFCFB] border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#145C46] focus:bg-white transition"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Category Chips with Horizontal Touch Scroll */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
                <button
                  onClick={() => setSelectedCategory('TODOS')}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition cursor-pointer shrink-0 ${
                    selectedCategory === 'TODOS'
                      ? 'bg-[#145C46] text-white'
                      : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
                  }`}
                >
                  📦 Todos
                </button>

                <button
                  onClick={() => setSelectedCategory('PRONTA_ENTREGA')}
                  className={`px-3 py-1.5 rounded-full text-xs font-extrabold whitespace-nowrap transition cursor-pointer shrink-0 ${
                    selectedCategory === 'PRONTA_ENTREGA'
                      ? 'bg-[#10B981] text-white'
                      : 'bg-[#ECFDF5] text-[#065F46] border border-[#10B981]'
                  }`}
                >
                  ⚡ Pronta Entrega SP
                </button>

                <button
                  onClick={() => setSelectedCategory('Metabolismo & Shape')}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition cursor-pointer shrink-0 ${
                    selectedCategory === 'Metabolismo & Shape'
                      ? 'bg-[#145C46] text-white'
                      : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
                  }`}
                >
                  🔥 Emagrecimento &amp; GLP-1
                </button>

                <button
                  onClick={() => setSelectedCategory('Regeneração & Articulações')}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition cursor-pointer shrink-0 ${
                    selectedCategory === 'Regeneração & Articulações'
                      ? 'bg-[#145C46] text-white'
                      : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
                  }`}
                >
                  🧬 Regeneração &amp; Articulações
                </button>

                <button
                  onClick={() => setSelectedCategory('Longevidade & Biohacking')}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition cursor-pointer shrink-0 ${
                    selectedCategory === 'Longevidade & Biohacking'
                      ? 'bg-[#145C46] text-white'
                      : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
                  }`}
                >
                  ✨ Longevidade &amp; NAD+
                </button>

                <button
                  onClick={() => setSelectedCategory('Cérebro & Foco')}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition cursor-pointer shrink-0 ${
                    selectedCategory === 'Cérebro & Foco'
                      ? 'bg-[#145C46] text-white'
                      : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
                  }`}
                >
                  🧠 Cérebro &amp; Foco
                </button>

                <button
                  onClick={() => setSelectedCategory('Estética & Pele')}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition cursor-pointer shrink-0 ${
                    selectedCategory === 'Estética & Pele'
                      ? 'bg-[#145C46] text-white'
                      : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
                  }`}
                >
                  💎 Estética &amp; Pele
                </button>

                <button
                  onClick={() => setSelectedCategory('Massa Magra & GH')}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition cursor-pointer shrink-0 ${
                    selectedCategory === 'Massa Magra & GH'
                      ? 'bg-[#145C46] text-white'
                      : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
                  }`}
                >
                  💪 Massa Magra &amp; GH
                </button>

                <button
                  onClick={() => setSelectedCategory('Imunidade & Vitalidade')}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition cursor-pointer shrink-0 ${
                    selectedCategory === 'Imunidade & Vitalidade'
                      ? 'bg-[#145C46] text-white'
                      : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
                  }`}
                >
                  🛡️ Imunidade
                </button>
              </div>

            </div>

            {/* Section Title & Counters */}
            <div className="flex items-center justify-between mb-3 px-1 text-xs font-bold text-slate-500 uppercase tracking-wider">
              <span>Catálogo Oficial PSL Labs ({filteredCompounds.length} compostos)</span>
              <span className="text-[#145C46] bg-[#E8F5EE] px-2 py-0.5 rounded-md font-mono text-[11px]">
                🔥 Mais Procurados
              </span>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
              {filteredCompounds.map((comp) => {
                const doseIdx = selectedDoses[comp.id] ?? (comp.defaultDoseIndex || 0);
                const currentDose = comp.doses[doseIdx] || comp.doses[0];
                const isB2B = tier === 'b2b';
                const price = isB2B ? currentDose.b2bBoxPrice : currentDose.suggestedPriceB2C;
                const isReadyStock = currentDose.stockStatus === 'in_stock';

                return (
                  <div
                    key={comp.id}
                    className={`bg-white rounded-2xl border p-4 sm:p-5 flex flex-col justify-between shadow-xs transition-all ${
                      comp.isTopSeller 
                        ? 'border-emerald-300 bg-gradient-to-b from-white to-[#FAFCFB]' 
                        : 'border-slate-200'
                    }`}
                  >
                    <div>
                      
                      {/* Card Top Badges */}
                      <div className="flex items-center justify-between gap-1.5 mb-2.5 flex-wrap">
                        <span className="text-[10px] font-bold text-[#145C46] bg-[#E8F5EE] px-2 py-0.5 rounded-full">
                          {comp.line}
                        </span>

                        <div className="flex items-center gap-1">
                          {comp.isTopSeller && (
                            <span className="text-[10px] font-extrabold text-[#9A3412] bg-[#FFEDD5] px-1.5 py-0.5 rounded-md">
                              🔥 Top
                            </span>
                          )}
                          <span className="text-[10px] font-bold text-[#065F46] bg-[#D1FAE5] px-1.5 py-0.5 rounded-md">
                            ≥ 99.4% HPLC
                          </span>
                        </div>
                      </div>

                      {/* Compound Name */}
                      <h3 className="text-lg font-black text-[#0F172A] leading-tight mb-1">
                        {comp.name}
                      </h3>

                      {/* Compound Description */}
                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-3">
                        {comp.desc}
                      </p>

                      {/* Dose Selector Box */}
                      <div className="bg-[#F8FAFC] border border-slate-200 rounded-xl p-2.5 mb-3">
                        <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                          <span>Selecione a Dosagem:</span>
                          <span className="text-slate-400">{comp.doses.length} opções</span>
                        </div>

                        {/* If many doses (like Tirzepatide/Retatrutide), render select, otherwise pills */}
                        {comp.doses.length > 5 ? (
                          <select
                            value={doseIdx}
                            onChange={(e) => handleSelectDose(comp.id, parseInt(e.target.value))}
                            className="w-full h-9 px-2 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-900 focus:outline-none focus:border-[#145C46]"
                          >
                            {comp.doses.map((d, i) => (
                              <option key={d.code} value={i}>
                                {d.label} {d.stockStatus === 'in_stock' ? '• (⚡ Pronta Entrega SP)' : '• (⏳ Sob Encomenda)'}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <div className="flex flex-wrap gap-1.5">
                            {comp.doses.map((d, i) => {
                              const isActive = doseIdx === i;
                              return (
                                <button
                                  key={d.code}
                                  onClick={() => handleSelectDose(comp.id, i)}
                                  className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
                                    isActive
                                      ? 'bg-[#145C46] text-white shadow-xs'
                                      : 'bg-white border border-slate-200 text-slate-700 hover:border-slate-300'
                                  }`}
                                >
                                  {d.label}
                                </button>
                              );
                            })}
                          </div>
                        )}

                        {/* Current Dose Stock Indicator */}
                        <div className="mt-2 pt-1.5 border-t border-slate-200/80 flex items-center justify-between text-[11px]">
                          <span className="text-slate-500 font-medium">Disponibilidade:</span>
                          {isReadyStock ? (
                            <span className="text-emerald-700 font-bold flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                              ⚡ Pronta Entrega SP
                            </span>
                          ) : (
                            <span className="text-slate-600 font-semibold flex items-center gap-1">
                              ⏳ Sob Encomenda (3-5d)
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Card Pricing Box */}
                      <div className="bg-slate-100 p-2.5 rounded-xl mb-3">
                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                          {isB2B ? 'Preço Atacado (Caixa c/ 10 Frascos):' : 'Preço Unitário Varejo (1 Frasco):'}
                        </div>
                        <div className="text-2xl font-black text-[#145C46] my-0.5">
                          R$ {price.toFixed(2).replace('.', ',')}
                        </div>
                        <div className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" />
                          <span>À vista via Pix ou Cartão em até 12x</span>
                        </div>
                      </div>

                    </div>

                    {/* Card Actions */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => addToCart(comp)}
                        className="flex-1 h-11 bg-[#145C46] hover:bg-[#0D4131] active:scale-98 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
                      >
                        <Plus className="w-4 h-4 stroke-[3]" />
                        <span>Adicionar</span>
                      </button>

                      <button
                        onClick={() => openCalculatorForProduct(currentDose.doseNum, currentDose.doseUnit)}
                        className="h-11 px-3 bg-white hover:bg-[#E8F5EE] border border-[#A3D4C1] text-[#145C46] font-bold text-xs rounded-xl transition cursor-pointer flex items-center gap-1"
                        title="Calcular dosagem na seringa de insulina"
                      >
                        <span>🧪 Calcular</span>
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>

          </div>
        )}

        {/* ================= CALCULATOR VIEW ================= */}
        {currentView === 'calc' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-4 sm:p-8 shadow-xs max-w-4xl mx-auto">
            
            <div className="text-center mb-6">
              <span className="text-xs font-mono font-bold uppercase text-[#145C46] tracking-wider block mb-1">
                FERRAMENTA CLÍNICA INTERATIVA
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#145C46]">
                🧪 Calculadora de Reconstituição
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Saiba exatamente quantos tracinhos (UI) puxar na seringa de insulina com segurança matemática.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 items-start mb-8">
              
              {/* Left Column: Form Controls */}
              <div className="space-y-4">
                
                {/* 1. Concentration */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                    1. Concentração do Frasco (Pó)
                  </label>
                  <select
                    value={calcPeptideSelect}
                    onChange={(e) => setCalcPeptideSelect(e.target.value)}
                    className="w-full h-11 px-3 bg-white border border-slate-300 rounded-xl text-sm font-semibold focus:outline-none focus:border-[#145C46]"
                  >
                    <option value="5">5 mg (ex: BPC-157 5mg, Retatrutide 5mg)</option>
                    <option value="10">10 mg (Padrão: BPC-157 10mg, Tirzepatide 10mg)</option>
                    <option value="15">15 mg (ex: Tirzepatide 15mg)</option>
                    <option value="20">20 mg (ex: Retatrutide 20mg)</option>
                    <option value="30">30 mg (ex: Tirzepatide 30mg)</option>
                    <option value="50">50 mg (ex: GHK-Cu 50mg, NAD+ 50mg)</option>
                    <option value="60">60 mg (ex: Tirzepatide 60mg)</option>
                    <option value="custom">Outro valor manual...</option>
                  </select>
                </div>

                {calcPeptideSelect === 'custom' && (
                  <div>
                    <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                      Digite os mg no frasco:
                    </label>
                    <input
                      type="number"
                      value={calcManualMg}
                      onChange={(e) => setCalcManualMg(e.target.value)}
                      className="w-full h-11 px-3 bg-white border border-slate-300 rounded-xl text-sm font-semibold focus:outline-none focus:border-[#145C46]"
                    />
                  </div>
                )}

                {/* 2. Water added */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                    2. Água Bacteriostática Adicionada (ml)
                  </label>
                  <select
                    value={calcWaterMl}
                    onChange={(e) => setCalcWaterMl(parseFloat(e.target.value))}
                    className="w-full h-11 px-3 bg-white border border-slate-300 rounded-xl text-sm font-semibold focus:outline-none focus:border-[#145C46]"
                  >
                    <option value="1.0">1.0 ml (Mais concentrado)</option>
                    <option value="2.0">2.0 ml (Recomendado na maioria dos casos)</option>
                    <option value="2.5">2.5 ml</option>
                    <option value="3.0">3.0 ml (Ampola BAC 3ml)</option>
                    <option value="5.0">5.0 ml (Diluição Dérmica / GHK-Cu)</option>
                  </select>
                </div>

                {/* 3. Desired Dose */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                    3. Dose Desejada por Aplicação
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={calcDoseAmount}
                      onChange={(e) => setCalcDoseAmount(parseFloat(e.target.value) || 0)}
                      className="flex-1 h-11 px-3 bg-white border border-slate-300 rounded-xl text-sm font-semibold focus:outline-none focus:border-[#145C46]"
                    />
                    <select
                      value={calcDoseUnit}
                      onChange={(e) => setCalcDoseUnit(e.target.value)}
                      className="w-24 h-11 px-2 bg-white border border-slate-300 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:border-[#145C46]"
                    >
                      <option value="mcg">mcg</option>
                      <option value="mg">mg</option>
                    </select>
                  </div>
                </div>

                {/* 4. Syringe type */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                    4. Tipo de Seringa de Insulina
                  </label>
                  <select
                    value={calcSyringeType}
                    onChange={(e) => setCalcSyringeType(parseInt(e.target.value))}
                    className="w-full h-11 px-3 bg-white border border-slate-300 rounded-xl text-sm font-semibold focus:outline-none focus:border-[#145C46]"
                  >
                    <option value={100}>Seringa U-100 (1.0 ml = 100 UI)</option>
                    <option value={50}>Seringa U-50 (0.5 ml = 50 UI)</option>
                    <option value={30}>Seringa U-30 (0.3 ml = 30 UI)</option>
                  </select>
                </div>

              </div>

              {/* Right Column: Visual Syringe & Exact Result */}
              <div className="bg-slate-100 border border-slate-200 rounded-2xl p-5 text-center">
                
                <div className="bg-[#145C46] text-white p-4 rounded-xl mb-4 shadow-sm">
                  <div className="text-[11px] font-mono uppercase text-emerald-200 font-bold">
                    Puxe na seringa exatamente até:
                  </div>
                  <div className="text-4xl font-black my-1">
                    {calcResults.roundedUnits} UI
                  </div>
                  <div className="text-xs text-white/90">
                    {calcResults.roundedUnits} Unidades de Insulina
                  </div>
                </div>

                {/* Interactive Dynamic SVG Syringe */}
                <div className="w-full py-2">
                  <svg viewBox="0 0 320 80" className="w-full h-auto max-h-20">
                    {/* Barrel */}
                    <rect x="30" y="20" width="230" height="40" rx="4" fill="#FFFFFF" stroke="#334155" strokeWidth="2" />
                    {/* Fluid */}
                    <rect x="30" y="22" width={calcResults.filledWidth} height="36" fill="#10B981" opacity="0.75" />
                    {/* Plunger */}
                    <rect x={calcResults.plungerX} y="16" width="6" height="48" fill="#145C46" rx="2" />
                    {/* Rod */}
                    <rect x={calcResults.rodX} y="36" width="140" height="8" fill="#94A3B8" />
                    {/* Thumb Rest */}
                    <rect x={calcResults.thumbX} y="22" width="12" height="36" rx="3" fill="#64748B" />
                    {/* Tip & Needle */}
                    <polygon points="30,28 16,36 16,44 30,52" fill="#94A3B8" />
                    <line x1="16" y1="40" x2="0" y2="40" stroke="#64748B" strokeWidth="2" />
                    {/* Ruler ticks */}
                    <g stroke="#475569" strokeWidth="1.5">
                      <line x1="30" y1="20" x2="30" y2="32" />
                      <line x1="76" y1="20" x2="76" y2="30" />
                      <line x1="122" y1="20" x2="122" y2="30" />
                      <line x1="168" y1="20" x2="168" y2="30" />
                      <line x1="214" y1="20" x2="214" y2="30" />
                      <line x1="260" y1="20" x2="260" y2="32" />
                    </g>
                    {/* Labels */}
                    <text x="30" y="14" fontSize="9" fontWeight="700" fill="#64748B" textAnchor="middle">0</text>
                    <text x="76" y="14" fontSize="9" fontWeight="700" fill="#145C46" textAnchor="middle">20</text>
                    <text x="145" y="14" fontSize="9" fontWeight="700" fill="#64748B" textAnchor="middle">50</text>
                    <text x="260" y="14" fontSize="9" fontWeight="700" fill="#64748B" textAnchor="middle">{calcSyringeType} UI</text>
                  </svg>
                </div>

                <div className="text-xs font-bold text-slate-700 mt-2">
                  Rendimento: <strong>{calcResults.totalDoses} aplicações</strong>
                </div>
                <div className="text-[11px] text-emerald-700 font-semibold mt-1">
                  Concentração: {calcResults.concentrationMgPerMl.toFixed(2)} mg/ml ({(calcResults.concentrationMgPerMl * 10).toFixed(0)} mcg a cada 10 UI)
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200">
                  <button
                    onClick={() => setCurrentView('catalog')}
                    className="w-full py-2.5 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 transition cursor-pointer"
                  >
                    ← Voltar ao Catálogo
                  </button>
                </div>

              </div>

            </div>

            {/* Reconstitution 3 Steps Guide */}
            <div className="pt-6 border-t border-slate-200 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-[#FAFCFB] border border-slate-200 p-4 rounded-xl">
                <div className="w-6 h-6 rounded-full bg-[#E8F5EE] text-[#145C46] flex items-center justify-center font-black text-xs mb-2">
                  1
                </div>
                <div className="font-bold text-xs text-slate-900 mb-1">Higienização</div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Passe álcool 70% na tampa de borracha do frasco de peptídeo e da água bacteriostática estéril.
                </p>
              </div>

              <div className="bg-[#FAFCFB] border border-slate-200 p-4 rounded-xl">
                <div className="w-6 h-6 rounded-full bg-[#E8F5EE] text-[#145C46] flex items-center justify-center font-black text-xs mb-2">
                  2
                </div>
                <div className="font-bold text-xs text-slate-900 mb-1">Transferência Lenta</div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Injete a água pelas paredes de vidro do frasco. Não mire direto no pó liofilizado.
                </p>
              </div>

              <div className="bg-[#FAFCFB] border border-slate-200 p-4 rounded-xl">
                <div className="w-6 h-6 rounded-full bg-[#E8F5EE] text-[#145C46] flex items-center justify-center font-black text-xs mb-2">
                  3
                </div>
                <div className="font-bold text-xs text-slate-900 mb-1">Dissolução &amp; Geladeira</div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Gire suavemente por 20s até ficar translúcido (sem agitar). Guarde na geladeira entre 2°C e 8°C.
                </p>
              </div>
            </div>

          </div>
        )}

      </main>

      {/* FLOATING DIRECT SUPPORT BUTTON (WHATSAPP) */}
      <button
        onClick={handleSupportWhatsApp}
        className="fixed right-4 bottom-20 md:bottom-6 z-30 bg-[#25D366] hover:bg-[#20ba5a] active:scale-95 text-white font-bold text-xs px-4 py-3 rounded-full shadow-lg flex items-center gap-2 cursor-pointer transition"
        title="Falar no WhatsApp oficial da PSL Labs"
      >
        <MessageCircle className="w-5 h-5" />
        <span className="hidden sm:inline">Dúvidas? Fale no WhatsApp</span>
      </button>

      {/* MOBILE BOTTOM NAVIGATION BAR (NATIVE APP STYLE) */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 h-16 flex items-center justify-around md:hidden shadow-lg">
        <button
          onClick={() => {
            setCurrentView('catalog');
            setSelectedCategory('TODOS');
          }}
          className={`flex flex-col items-center justify-center flex-1 h-full text-[10px] font-bold cursor-pointer ${
            currentView === 'catalog' && selectedCategory === 'TODOS' ? 'text-[#145C46]' : 'text-slate-500'
          }`}
        >
          <span className="text-lg">📦</span>
          <span>Catálogo</span>
        </button>

        <button
          onClick={() => {
            setCurrentView('catalog');
            setSelectedCategory('PRONTA_ENTREGA');
          }}
          className={`flex flex-col items-center justify-center flex-1 h-full text-[10px] font-bold cursor-pointer ${
            currentView === 'catalog' && selectedCategory === 'PRONTA_ENTREGA' ? 'text-[#145C46]' : 'text-slate-500'
          }`}
        >
          <span className="text-lg">⚡</span>
          <span>Pronta SP</span>
        </button>

        <button
          onClick={() => setCurrentView('calc')}
          className={`flex flex-col items-center justify-center flex-1 h-full text-[10px] font-bold cursor-pointer ${
            currentView === 'calc' ? 'text-[#145C46]' : 'text-slate-500'
          }`}
        >
          <span className="text-lg">🧪</span>
          <span>Calculadora</span>
        </button>

        <button
          onClick={() => setIsCartOpen(true)}
          className="flex flex-col items-center justify-center flex-1 h-full text-[10px] font-bold text-slate-500 relative cursor-pointer"
        >
          <span className="text-lg">🛒</span>
          <span>Pedido</span>
          {cartCount > 0 && (
            <span className="absolute top-2 right-1/4 bg-red-500 text-white text-[9px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </button>
      </div>

      {/* CART MODAL / SLIDE-OVER */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-lg w-full p-5 sm:p-7 shadow-2xl relative max-h-[92vh] flex flex-col justify-between">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-[#145C46]" />
                <h3 className="font-black text-base uppercase tracking-wider">
                  Seu Pedido • PSL Labs
                </h3>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1 max-h-[40vh]">
              {cart.length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                  <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                  <p className="text-sm font-semibold">Seu carrinho está vazio.</p>
                  <p className="text-xs text-slate-400 mt-0.5">Adicione compostos do catálogo para avançar.</p>
                </div>
              ) : (
                cart.map((item, idx) => {
                  const isStock = item.stockStatus === 'in_stock';
                  return (
                    <div 
                      key={`${item.compoundId}-${item.doseCode}-${item.isB2B}-${idx}`}
                      className="bg-slate-50 border border-slate-200 p-3 rounded-2xl flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="font-extrabold text-slate-900 truncate">
                          {item.name}
                        </div>
                        <div className="text-slate-500 text-[11px] mt-0.5">
                          {item.doseLabel} • {item.isB2B ? 'Caixa 10 Un' : '1 Frasco'}
                        </div>
                        <div className="mt-1">
                          {isStock ? (
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                              ⚡ Pronta Entrega SP
                            </span>
                          ) : (
                            <span className="text-[10px] font-semibold text-slate-600 bg-slate-200 px-1.5 py-0.5 rounded">
                              ⏳ Sob Encomenda (3-5d)
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Quantity & Subtotal */}
                      <div className="flex flex-col items-end gap-1.5 shrink-0">
                        <div className="font-black text-sm text-[#145C46]">
                          R$ {(item.unitPrice * item.qty).toFixed(2).replace('.', ',')}
                        </div>
                        
                        <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg p-0.5">
                          <button
                            onClick={() => updateCartQty(idx, -1)}
                            className="w-6 h-6 flex items-center justify-center text-slate-600 hover:bg-slate-100 rounded cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-bold px-1 min-w-4 text-center">
                            {item.qty}
                          </span>
                          <button
                            onClick={() => updateCartQty(idx, 1)}
                            className="w-6 h-6 flex items-center justify-center text-slate-600 hover:bg-slate-100 rounded cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => removeCartItem(idx)}
                            className="w-6 h-6 flex items-center justify-center text-red-500 hover:bg-red-50 rounded ml-1 cursor-pointer"
                            title="Remover"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Cart Footer & Form */}
            {cart.length > 0 && (
              <div className="pt-4 border-t border-slate-200 mt-4 space-y-3">
                
                {/* Shipping Method */}
                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
                    Forma de Entrega:
                  </label>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => setShippingMethod('sedex')}
                      className={`p-2 rounded-xl border text-left font-semibold transition cursor-pointer ${
                        shippingMethod === 'sedex' 
                          ? 'border-[#145C46] bg-[#E8F5EE] text-[#145C46]' 
                          : 'border-slate-200 text-slate-600'
                      }`}
                    >
                      📦 Sedex Correios (Brasil)
                    </button>
                    <button
                      type="button"
                      onClick={() => setShippingMethod('uber')}
                      className={`p-2 rounded-xl border text-left font-semibold transition cursor-pointer ${
                        shippingMethod === 'uber' 
                          ? 'border-[#145C46] bg-[#E8F5EE] text-[#145C46]' 
                          : 'border-slate-200 text-slate-600'
                      }`}
                    >
                      🛵 Uber Moto / Flash (SP)
                    </button>
                  </div>
                </div>

                {/* Name & Address */}
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="Seu Nome / WhatsApp"
                    className="h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#145C46]"
                  />
                  <input
                    type="text"
                    value={clientAddress}
                    onChange={(e) => setClientAddress(e.target.value)}
                    placeholder="Cidade / Estado"
                    className="h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#145C46]"
                  />
                </div>

                {/* Subtotal */}
                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs font-bold text-slate-500 uppercase">Total do Pedido:</span>
                  <span className="text-xl font-black text-[#145C46]">
                    R$ {cartTotal.toFixed(2).replace('.', ',')}
                  </span>
                </div>

                {/* WhatsApp Checkout Button */}
                <button
                  onClick={handleCheckoutWhatsApp}
                  className="w-full h-12 bg-[#25D366] hover:bg-[#20ba5a] active:scale-98 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition cursor-pointer shadow-md flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>Concluir Pedido no WhatsApp</span>
                </button>

                <p className="text-[10px] text-center text-slate-400">
                  Ao clicar, uma mensagem pré-formatada será aberta no WhatsApp da PSL Labs com seu pedido e cálculo de entrega.
                </p>

              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
