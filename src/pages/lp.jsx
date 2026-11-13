import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import QRCameraScanner from '../components/QRCameraScanner';
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
  ChevronDown,
  ChevronRight,
  Layers,
  Thermometer,
  Printer,
  CheckCircle2,
  Info,
  Truck,
  MessageCircle,
  HelpCircle,
  Zap,
  Star,
  QrCode,
  Shield,
  FileCheck2,
  Lock,
  Camera
} from 'lucide-react';

export default function SalesLandingPage() {
  const { theme, toggleTheme } = useTheme();
  const { lang, changeLang } = useLanguage();
  const [activeTabChromato, setActiveTabChromato] = useState('ghk');
  const [isCoaModalOpen, setIsCoaModalOpen] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);
  const [selectedKit, setSelectedKit] = useState('duo'); // 'single', 'duo', 'vip'
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerCity, setCustomerCity] = useState('');

  // WhatsApp Concierge Number (Configure your WhatsApp Business)
  const WHATSAPP_PHONE = "5511999999999"; // Format: DDI + DDD + Number

  const kits = {
    single: {
      id: 'single',
      name: 'Kit Ciclo Essencial (30 Dias)',
      subtitle: '1x Frasco GHK-Cu 50mg + Veículo Estéril 5ml',
      vials: 1,
      badge: 'INICIANTE',
      pricePix: 390,
      priceInstallments: '12x de R$ 39,90',
      economy: null,
      featured: false,
      shipping: 'Frete Seguro com Rastreamento',
      items: [
        '1x Frasco Âmbar GHK-Cu 50mg (Liofilizado Cryo-Dry)',
        '1x Diluente Bacteriostático Estéril de 5.0ml',
        '1x Cânula dosadora de transferência asséptica',
        '1x Dosador conta-gotas de precisão dérmica',
        'Laudo Analítico HPLC > 99% incluso',
        'Selo QR Code de autenticidade unitária'
      ]
    },
    duo: {
      id: 'duo',
      name: 'Protocolo Renovação Total (60 Dias)',
      subtitle: '2x Frascos GHK-Cu 50mg + 2x Veículos Estéreis 5ml',
      vials: 2,
      badge: 'MAIS ESCOLHIDO • ECONOMIZE R$ 100',
      pricePix: 680,
      priceInstallments: '12x de R$ 69,90',
      economy: 'Economia imediata de R$ 100',
      featured: true,
      shipping: 'FRETE PRIORITÁRIO GRÁTIS',
      items: [
        '2x Frascos Âmbar GHK-Cu 50mg (100mg no total)',
        '2x Diluentes Bacteriostáticos Estéreis de 5.0ml',
        '2x Cânulas e 2x dosadores conta-gotas de precisão',
        '1x Estojo térmico protetor de transporte',
        'Frete Expresso Prioritário para todo o Brasil Grátis',
        'Laudos Cromatográficos HPLC independentes',
        'Acesso direto ao Concierge Lab para suporte'
      ]
    },
    vip: {
      id: 'vip',
      name: 'Protocolo Bio-Regenerativo Duo',
      subtitle: '1x GHK-Cu 50mg + 1x BPC-157 10mg (Alta Regeneração)',
      vials: 2,
      badge: 'LONGEVIDADE CELULAR AVANÇADA',
      pricePix: 850,
      priceInstallments: '12x de R$ 87,50',
      economy: 'Combo Exclusivo',
      featured: false,
      shipping: 'FRETE EXPRESSO GRÁTIS',
      items: [
        '1x Frasco GHK-Cu 50mg (Derme e Pró-Colágeno)',
        '1x Frasco BPC-157 10mg (Regeneração Tecidual Sistêmica)',
        '2x Soluções estéreis de reconstituição',
        'Kit completo de aplicação e conservação',
        'Protocolo de dosagem personalizado com Concierge',
        'Frete Expresso Prioritário com cadeia de frio'
      ]
    }
  };

  const getWhatsAppLink = (kitKey = selectedKit) => {
    const k = kits[kitKey] || kits.duo;
    const text = encodeURIComponent(
      `Olá! Tenho interesse no *${k.name}* da PSL Labs (GHK-Cu Liofilizado). Gostaria de tirar dúvidas e garantir meu pedido com a condição especial de R$ ${k.pricePix}.`
    );
    return `https://wa.me/${WHATSAPP_PHONE}?text=${text}`;
  };

  const handleOrderSubmit = (e) => {
    e.preventDefault();
    const k = kits[selectedKit] || kits.duo;
    const message = encodeURIComponent(
      `*NOVO PEDIDO PSL LABS*\n\n` +
      `*Cliente:* ${customerName || 'Não informado'}\n` +
      `*WhatsApp:* ${customerPhone || 'Não informado'}\n` +
      `*Cidade/UF:* ${customerCity || 'Não informado'}\n` +
      `*Plano Escolhido:* ${k.name}\n` +
      `*Valor:* R$ ${k.pricePix} (ou ${k.priceInstallments})\n\n` +
      `Gostaria de receber a chave PIX ou link de pagamento no cartão para finalizar!`
    );
    window.open(`https://wa.me/${WHATSAPP_PHONE}?text=${message}`, '_blank');
    setIsOrderModalOpen(false);
  };

  const faqs = [
    {
      q: 'Por que o peptídeo liofilizado (pó) é superior aos séruns prontos de farmácia?',
      a: 'Peptídeos em solução aquosa líquida sofrem hidrólise natural e começam a perder suas pontes moleculares em cerca de 2 a 3 semanas nas prateleiras comerciais. Ao adquirir o GHK-Cu em pó liofilizado criogênico sob vácuo inerte, ele permanece 100% estável por até 24 meses. A molécula só é ativada quando você mistura o diluente estéril imediatamente antes de iniciar o seu ciclo, garantindo potência e bioatividade máximas a cada gota.'
    },
    {
      q: 'Como é feito o preparo (reconstituição) e aplicação?',
      a: 'O processo leva menos de 1 minuto e é feito em 3 passos: com a cânula estéril que acompanha o kit, você transfere o veículo estéril para dentro do frasco de pó. Em seguida, realiza movimentos circulares suaves por 20 segundos (sem agitar bruscamente). O pó se dissolve instantaneamente formando uma solução límpida azulada característica do cobre quelado. Aplique de 4 a 6 gotas à noite na pele limpa.'
    },
    {
      q: 'Como devo armazenar o frasco após misturado?',
      a: 'Antes da reconstituição (em pó seco), o frasco pode ser mantido em temperatura ambiente (15°C a 25°C) protegido da luz direta. Após misturar o líquido, o frasco deve ser mantido na geladeira (entre 2°C e 8°C) e utilizado em até 30 a 45 dias para preservar o pico de integridade biológica.'
    },
    {
      q: 'Como funciona a verificação de autenticidade por QR Code?',
      a: 'Cada frasco da PSL Labs possui um selo de segurança com código criptográfico único e irrepetível. Ao apontar a câmera do celular para o QR Code da caixa, o sistema oficial abre a tela de verificação informando o número de vezes que aquele código foi consultado, o lote exato e o Certificado de Análise HPLC correspondente.'
    },
    {
      q: 'Qual o prazo e a forma de envio para o Brasil?',
      a: 'Os envios são despachados diariamente com código de rastreamento direto para o seu WhatsApp e e-mail. A embalagem é reforçada e com isolamento térmico protetor. O prazo médio de entrega para o Brasil é de 4 a 8 dias úteis conforme a sua região.'
    },
    {
      q: 'Preciso de receita médica para adquirir?',
      a: 'O GHK-Cu (Tripeptídeo de Cobre-1) é um composto peptídico de aplicação tópica e regeneração dérmica. Nosso produto é fornecido para protocolos individuais estéticos e de biohacking de alta pureza. Nosso Concierge Lab fica disponível via WhatsApp para sanar quaisquer dúvidas de uso e dosagem.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#FAFBF9] dark:bg-[#070A11] text-[#0F172A] dark:text-[#F8FAFC] selection:bg-[#047857] selection:text-white font-sans transition-colors duration-200">
      <Head>
        <title>GHK-Cu 50mg Liofilizado Puro | PSL LABS — The Science of Regeneration</title>
        <meta name="description" content="Adquira GHK-Cu (Tripeptídeo de Cobre Puro 50mg) em pó liofilizado criogênico. Pureza atestada por HPLC ≥ 99.4%, diluente estéril e rastreabilidade por QR Code unitário. PSL LABS." />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500;600;700&family=Montserrat:wght@600;700;800&family=Syne:wght@600;700;800&display=swap" rel="stylesheet" />
      </Head>

      {/* TOP ANNOUNCEMENT BAR (URGENCY & SAFETY) */}
      <div className="bg-emerald-950 text-emerald-200 border-b border-emerald-900 py-2 px-3 text-[11px] sm:text-xs font-mono tracking-wider shadow-inner">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 truncate">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <span className="truncate">
              <strong>LOTE #2026-X1 DISPONÍVEL:</strong> PUREZA HPLC ≥ 99.41% • CADEIA DE FRIO GARANTIDA
            </span>
          </div>
          <a
            href={getWhatsAppLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 text-white hover:text-emerald-300 font-bold transition shrink-0"
          >
            <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span>Atendimento Concierge Lab</span>
          </a>
        </div>
      </div>

      {/* STICKY LUXURY NAVIGATION */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#070A11]/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-3">
          
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2 group shrink-0">
            <img 
              src="/brand/psl-labs-premium-synthesis-line.png" 
              alt="PSL LABS - Premium Synthesis Line" 
              className="h-8 sm:h-11 w-auto max-w-[130px] sm:max-w-none object-contain transition-transform group-hover:scale-[1.02] dark:hidden"
            />
            <img 
              src="/brand/psl-labs-premium-synthesis-line-white.png" 
              alt="PSL LABS - Premium Synthesis Line" 
              className="h-8 sm:h-11 w-auto max-w-[130px] sm:max-w-none object-contain transition-transform group-hover:scale-[1.02] hidden dark:block"
            />
          </Link>

          {/* Quick Nav Links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-7 text-xs font-bold tracking-[0.12em] text-slate-700 dark:text-slate-300 uppercase" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            <a href="#diferencial" className="hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors py-2">Por que Liofilizado?</a>
            <a href="#beneficios" className="hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors py-2">Benefícios</a>
            <a href="#laudo" className="hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors py-2">Laudo HPLC</a>
            <a href="#protocolo" className="hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors py-2">Como Usar</a>
            <a href="#kits" className="hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors py-2">Escolher Kit</a>
            <a href="#faq" className="hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors py-2">Dúvidas</a>
          </nav>

          {/* Actions & CTA */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 sm:p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 dark:border-slate-700 dark:text-amber-400 transition cursor-pointer shadow-sm"
              title="Alternar Modo Claro / Escuro"
              aria-label="Alternar tema"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-800" />
              )}
            </button>

            {/* Verification Terminal Direct Shortcut */}
            <Link
              href="/"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-mono font-bold text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 hover:border-emerald-600 px-3 py-2 rounded-xl transition shadow-sm"
              title="Acessar Terminal de Validação de QR Code"
            >
              <QrCode className="w-3.5 h-3.5 text-emerald-600" />
              <span>Verificar Frasco</span>
            </Link>

            {/* Primary Buy CTA */}
            <a
              href="#kits"
              className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.10em] bg-emerald-700 hover:bg-emerald-600 active:scale-[0.98] text-white px-3.5 sm:px-5 py-2.5 rounded-xl transition shadow-md shadow-emerald-900/20 cursor-pointer"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">ADQUIRIR PROTOCOLO</span>
              <span className="sm:hidden">COMPRAR</span>
            </a>

          </div>

        </div>
      </header>

      <main>
        
        {/* HERO SECTION: THE SCIENCE OF REGENERATION (DIRECT RESPONSE HIGH-TICKET) */}
        <section className="relative pt-10 sm:pt-16 pb-16 sm:pb-24 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-b from-white via-[#FAFBF9] to-slate-100 dark:from-[#070A11] dark:via-[#090D17] dark:to-[#070A11] transition-colors overflow-hidden">
          
          {/* Subtle laboratory glow */}
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
              
              {/* Left Column: Monograph & High-Impact Copy */}
              <div className="lg:col-span-7 space-y-6">
                
                {/* Clinical Pill Badge */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-emerald-600/40 bg-emerald-50 dark:bg-emerald-950/70 text-xs font-mono font-bold tracking-wider text-emerald-900 dark:text-emerald-300 shadow-sm">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 dark:bg-emerald-400 animate-pulse" />
                  <span>PREMIUM SYNTHESIS LINE</span>
                  <span className="text-slate-400">|</span>
                  <span className="font-extrabold uppercase">PROTOCOLO DE BIOESTIMULAÇÃO #01</span>
                </div>

                {/* Primary Headline */}
                <h1 
                  className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-[0.03em] sm:tracking-[0.08em] uppercase text-slate-950 dark:text-white leading-[1.12] break-words"
                  style={{ fontFamily: 'Syne, sans-serif' }}
                >
                  THE SCIENCE OF REGENERATION.
                </h1>

                {/* Subheadline with Medical Authority */}
                <p className="text-base sm:text-lg text-slate-700 dark:text-slate-300 leading-relaxed font-normal max-w-2xl">
                  <strong>Tripeptídeo de Cobre Puro (GHK-Cu 50mg) em pó liofilizado criogênico a vácuo.</strong> Pureza superior a <strong className="text-emerald-700 dark:text-emerald-400 font-bold">99.4% (HPLC)</strong> para estímulo direto da síntese de pró-colágeno I e III, aumento de densidade dérmica e rejuvenescimento biológico profundo — sem diluições cosméticas comerciais.
                </p>

                {/* Dual Call To Actions */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                  <a
                    href="#kits"
                    className="flex items-center justify-center gap-2.5 bg-emerald-700 hover:bg-emerald-600 active:scale-[0.98] text-white font-bold text-xs uppercase tracking-[0.14em] py-4 px-8 rounded-xl transition shadow-lg shadow-emerald-900/20 cursor-pointer"
                    style={{ fontFamily: 'Montserrat, sans-serif' }}
                  >
                    <span>ESCOLHER MEU PROTOCOLO</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>

                  <a
                    href={getWhatsAppLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2.5 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700 font-bold text-xs uppercase tracking-[0.12em] py-4 px-6 rounded-xl transition cursor-pointer shadow-sm"
                    style={{ fontFamily: 'Montserrat, sans-serif' }}
                  >
                    <MessageCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>Falar com Concierge Lab</span>
                  </a>
                </div>

                {/* Assurance Trust Pillars */}
                <div className="pt-4 border-t border-slate-200 dark:border-slate-800 grid grid-cols-3 gap-2.5 sm:gap-4 text-xs font-mono text-slate-700 dark:text-slate-300">
                  <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                    <span className="block text-[10px] text-slate-500 uppercase font-semibold">Pureza Mínima</span>
                    <span className="font-bold text-emerald-700 dark:text-emerald-400 text-xs sm:text-sm">≥ 99.4% HPLC</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                    <span className="block text-[10px] text-slate-500 uppercase font-semibold">Estabilidade</span>
                    <span className="font-bold text-slate-950 dark:text-white text-xs sm:text-sm">24 Meses (Seco)</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                    <span className="block text-[10px] text-slate-500 uppercase font-semibold">Autenticidade</span>
                    <span className="font-bold text-slate-950 dark:text-white text-xs sm:text-sm">1 QR / Frasco</span>
                  </div>
                </div>

              </div>

              {/* Right Column: Hero Specimen Visual Card */}
              <div className="lg:col-span-5">
                <div className="relative rounded-3xl bg-white dark:bg-[#0D121F] border border-slate-300 dark:border-slate-800 p-6 sm:p-8 shadow-2xl overflow-hidden">
                  
                  {/* Card Micro Header */}
                  <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-200 dark:border-slate-800 text-xs font-mono">
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase block font-semibold">COMPOSTO ATIVO</span>
                      <strong className="text-slate-950 dark:text-white text-sm">GHK-Cu (Tripeptide-1)</strong>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-500 uppercase block font-semibold">LAUDO ANALÍTICO</span>
                      <strong className="text-emerald-700 dark:text-emerald-400 font-extrabold text-sm">99.41% Aprovado</strong>
                    </div>
                  </div>

                  {/* Specimen Render */}
                  <div className="relative h-72 sm:h-80 bg-slate-50 dark:bg-[#05080E] rounded-2xl overflow-hidden flex items-center justify-center p-6 border border-slate-200 dark:border-slate-800/80 group">
                    <img 
                      src="/images/ghk-cu-50mg-vial-50x30.jpg" 
                      alt="Frasco de GHK-Cu 50mg liofilizado PSL LABS" 
                      className="max-h-full max-w-full object-contain filter drop-shadow-2xl group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Badge Pill Overlay */}
                    <div className="absolute bottom-3 left-3 bg-white/95 dark:bg-slate-900/95 border border-slate-300 dark:border-slate-700 px-3 py-1.5 rounded-xl text-[11px] font-mono font-bold text-slate-900 dark:text-white shadow-md">
                      50mg Pó Liofilizado + Veículo 5ml
                    </div>
                    <div className="absolute top-3 right-3 bg-emerald-700 text-white px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold uppercase tracking-wider shadow-sm">
                      Lote: #2026-X1
                    </div>
                  </div>

                  {/* Chemical Specs Breakdown */}
                  <div className="mt-5 pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2 text-xs font-mono">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">Massa Molecular:</span>
                      <span className="font-semibold text-slate-900 dark:text-white">403.94 g/mol</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">Sequência Bioativa:</span>
                      <span className="font-semibold text-slate-900 dark:text-white">Gly-His-Lys:Cu²⁺</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">Ação Principal:</span>
                      <span className="font-bold text-emerald-700 dark:text-emerald-400">Síntese de Colágeno I &amp; III</span>
                    </div>
                  </div>

                  {/* Fast Action Footer */}
                  <div className="mt-5 pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center gap-3">
                    <button
                      onClick={() => setIsCoaModalOpen(true)}
                      className="flex-1 text-center py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold text-xs uppercase tracking-wider transition cursor-pointer"
                      style={{ fontFamily: 'Montserrat, sans-serif' }}
                    >
                      Ver Laudo HPLC
                    </button>
                    <a
                      href="#kits"
                      className="flex-1 text-center py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 active:scale-[0.98] text-white font-bold text-xs uppercase tracking-wider transition shadow-sm cursor-pointer"
                      style={{ fontFamily: 'Montserrat, sans-serif' }}
                    >
                      Garantir Frasco
                    </a>
                  </div>

                </div>
              </div>

            </div>
          </div>
        </section>

        {/* SECTION 2: THE PARADIGM SHIFT (WHY LYOPHILIZED DESTROYS REGULAR SERUMS) */}
        <section id="diferencial" className="py-20 sm:py-24 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#070A11] transition-colors">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
              <span className="text-xs font-mono tracking-[0.2em] text-emerald-700 dark:text-emerald-400 uppercase font-extrabold block">
                O FIM DOS COSMÉTICOS DILUÍDOS
              </span>
              <h2 
                className="text-2xl sm:text-4xl font-extrabold tracking-[0.06em] uppercase text-slate-950 dark:text-white"
                style={{ fontFamily: 'Syne, sans-serif' }}
              >
                POR QUE PEPTÍDEOS EM SÉRUM COMUM NÃO FUNCIONAM COMO PROMETIDO?
              </h2>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
                Peptídeos são biomoléculas delicadas. Entenda a diferença científica fundamental entre comprar um frasco comercial de prateleira e utilizar o protocolo liofilizado da PSL Labs.
              </p>
            </div>

            {/* Visual Comparison Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
              
              {/* Common Market Serums */}
              <div className="rounded-3xl border border-red-200 dark:border-red-950/60 bg-red-50/40 dark:bg-red-950/20 p-8 flex flex-col justify-between shadow-sm relative">
                <div>
                  <div className="flex items-center gap-2 text-red-600 dark:text-red-400 font-mono text-xs font-extrabold uppercase tracking-wider mb-3">
                    <X className="w-4 h-4 stroke-[3]" />
                    <span>Séruns e Cremes Comerciais de Prateleira</span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
                    Degradação Molecúlar Prévia em Solução Aquosa
                  </h3>

                  <ul className="space-y-4 text-sm text-slate-700 dark:text-slate-300">
                    <li className="flex items-start gap-3">
                      <span className="w-5 h-5 rounded-full bg-red-100 dark:bg-red-900/40 text-red-600 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">✕</span>
                      <span><strong>Hidrólise Prematura:</strong> Peptídeos misturados em água decompõem suas cadeias ativas após 15 a 30 dias na prateleira.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-5 h-5 rounded-full bg-red-100 dark:bg-red-900/40 text-red-600 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">✕</span>
                      <span><strong>Concentrações Irrisórias:</strong> A maioria das marcas utiliza menos de 0.2% a 0.5% de ativo real, preenchendo o volume com espessantes e silicones.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-5 h-5 rounded-full bg-red-100 dark:bg-red-900/40 text-red-600 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">✕</span>
                      <span><strong>Zero Transparência Analítica:</strong> Não fornecem laudo HPLC de pureza por lote nem garantia de ausência de endotoxinas.</span>
                    </li>
                  </ul>
                </div>

                <div className="mt-8 pt-4 border-t border-red-200 dark:border-red-900/40 text-xs font-mono text-red-700 dark:text-red-400 font-semibold">
                  Resultado: Você paga caro por um cosmético que já perdeu a maior parte do poder regenerativo antes de você abrir.
                </div>
              </div>

              {/* PSL Labs Cryo-Dry Protocol */}
              <div className="rounded-3xl border-2 border-emerald-600 dark:border-emerald-500 bg-white dark:bg-[#0D121F] p-8 flex flex-col justify-between shadow-xl shadow-emerald-950/10 relative">
                <div className="absolute -top-3.5 right-6 bg-emerald-700 text-white text-[11px] font-mono font-extrabold uppercase px-3 py-0.5 rounded-full shadow-sm">
                  PADRÃO LABORATORIAL
                </div>

                <div>
                  <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-mono text-xs font-extrabold uppercase tracking-wider mb-3">
                    <CheckCircle2 className="w-4 h-4 stroke-[3]" />
                    <span>PSL LABS • Liofilização Criogênica a Vácuo</span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
                    Ativação Fresca Imediata no Momento do Uso
                  </h3>

                  <ul className="space-y-4 text-sm text-slate-700 dark:text-slate-300">
                    <li className="flex items-start gap-3">
                      <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">✓</span>
                      <span><strong>Potência Biológica Preservada:</strong> O peptídeo permanece inerte a vácuo sob atmosfera de nitrogênio, mantendo 100% da integridade estrutural por até 24 meses.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">✓</span>
                      <span><strong>Dosagem Terapêutica Real (50mg):</strong> Concentração clínica pura. Cada frasco entrega peptídeo verdadeiro para um ciclo de 30 a 45 dias de tratamento profundo.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">✓</span>
                      <span><strong>Cromatografia HPLC Atestada:</strong> Cada lote possui laudo analítico oficial auditável com pureza certificada superior a 99.4%.</span>
                    </li>
                  </ul>
                </div>

                <div className="mt-8 pt-4 border-t border-slate-200 dark:border-slate-800 text-xs font-mono text-emerald-800 dark:text-emerald-300 font-semibold">
                  Resultado: Máxima absorção celular e estímulo verdadeiro de colágeno desde a primeira aplicação.
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* SECTION 3: CLINICAL BENEFITS (THE PROVEN MECHANISMS) */}
        <section id="beneficios" className="py-20 sm:py-24 border-b border-slate-200 dark:border-slate-800 bg-[#F4F6F8] dark:bg-[#070A11] transition-colors">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
              <span className="text-xs font-mono tracking-[0.2em] text-emerald-700 dark:text-emerald-400 uppercase font-extrabold block">
                EVIDÊNCIAS MOLECULARES
              </span>
              <h2 
                className="text-2xl sm:text-4xl font-extrabold tracking-[0.06em] uppercase text-slate-950 dark:text-white"
                style={{ fontFamily: 'Syne, sans-serif' }}
              >
                O QUE O GHK-Cu PROVOCA NA SUA PELE
              </h2>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
                Descoberto pelo Dr. Loren Pickart, o tripeptídeo de cobre é o padrão-ouro de bioestimulação não invasiva na literatura médica internacional.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              
              <div className="bg-white dark:bg-[#0D121F] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-md flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-300 dark:border-emerald-700/60 flex items-center justify-center text-emerald-700 dark:text-emerald-400 mb-5">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white mb-2" style={{ fontFamily: 'Syne, sans-serif' }}>
                    Estímulo de Pró-Colágeno I e III
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    Estimula fibroblastos de forma até 70% mais eficiente que a vitamina C pura, promovendo recuperação do tônus, firmeza e sustentação dérmica.
                  </p>
                </div>
                <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] font-mono text-emerald-700 dark:text-emerald-400 font-bold">
                  + Firmeza e Densidade
                </div>
              </div>

              <div className="bg-white dark:bg-[#0D121F] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-md flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-300 dark:border-emerald-700/60 flex items-center justify-center text-emerald-700 dark:text-emerald-400 mb-5">
                    <Layers className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white mb-2" style={{ fontFamily: 'Syne, sans-serif' }}>
                    Remodelação da Matriz Extracelular
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    Auxilia na quebra de agregados de colágeno envelhecido e desorganizado, substituindo-os por novas fibras elásticas saudáveis e organizadas.
                  </p>
                </div>
                <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] font-mono text-emerald-700 dark:text-emerald-400 font-bold">
                  Atenuação de Rugas Finas
                </div>
              </div>

              <div className="bg-white dark:bg-[#0D121F] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-md flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-300 dark:border-emerald-700/60 flex items-center justify-center text-emerald-700 dark:text-emerald-400 mb-5">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white mb-2" style={{ fontFamily: 'Syne, sans-serif' }}>
                    Ação Antioxidante &amp; Anti-Inflamatória
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    Neutraliza radicais livres e modula a produção de citocinas inflamatórias, auxiliando na cicatrização pós-procedimentos (microagulhamento, laser).
                  </p>
                </div>
                <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] font-mono text-emerald-700 dark:text-emerald-400 font-bold">
                  Recuperação e Reparação
                </div>
              </div>

              <div className="bg-white dark:bg-[#0D121F] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-md flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-300 dark:border-emerald-700/60 flex items-center justify-center text-emerald-700 dark:text-emerald-400 mb-5">
                    <Zap className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white mb-2" style={{ fontFamily: 'Syne, sans-serif' }}>
                    Estímulo Folicular e Capilar
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    Melhora a microcirculação periférica e o aporte de nutrientes aos folículos, promovendo espessamento da haste capilar e vitalidade do couro cabeludo.
                  </p>
                </div>
                <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] font-mono text-emerald-700 dark:text-emerald-400 font-bold">
                  Uso Dérmico e Capilar
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* SECTION 4: PURITY & HPLC CHROMATOGRAM SHOWCASE */}
        <section id="laudo" className="py-20 sm:py-24 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#070A11] transition-colors">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
              
              <div className="lg:col-span-5 space-y-5">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-600/40 bg-emerald-50 dark:bg-emerald-950/70 text-xs font-mono font-bold text-emerald-900 dark:text-emerald-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 dark:bg-emerald-400" />
                  <span>TRANSPARÊNCIA ANALÍTICA ABSOLUTA</span>
                </div>

                <h2 
                  className="text-2xl sm:text-4xl font-extrabold tracking-[0.06em] uppercase text-slate-950 dark:text-white"
                  style={{ fontFamily: 'Syne, sans-serif' }}
                >
                  CERTIFICADO DE ANÁLISE HPLC &amp; ESI-MS
                </h2>

                <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
                  Não confie em alegações vazias de marketing. A PSL Labs opera sob a norma internacional <strong>ISO/IEC 17025</strong>. Cada lote sintetizado passa por cromatografia líquida de alta performance e espectrometria de massas para comprovação molecular real.
                </p>

                <div className="space-y-3 pt-2">
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span><strong>Pureza Homologada de 99.41%:</strong> Lotes abaixo de 99.0% são descartados sumariamente.</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span><strong>Ensaio LAL de Endotoxinas:</strong> Menor que 0.01 EU/mg (Zero risco de contaminantes pirogênicos).</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span><strong>Rastreabilidade Criptográfica:</strong> Cada frasco é único e auditável pelo terminal do site.</span>
                  </div>
                </div>

                <div className="pt-3">
                  <button
                    onClick={() => setIsCoaModalOpen(true)}
                    className="inline-flex items-center gap-2 bg-slate-950 hover:bg-emerald-700 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200 text-white font-bold text-xs uppercase tracking-[0.12em] py-3.5 px-6 rounded-xl transition cursor-pointer shadow-md"
                    style={{ fontFamily: 'Montserrat, sans-serif' }}
                  >
                    <FileCheck2 className="w-4 h-4" />
                    <span>Abrir Laudo Oficial CoA Completo</span>
                  </button>
                </div>
              </div>

              {/* Chromatogram Panel */}
              <div className="lg:col-span-7">
                <div className="bg-[#F8FAF8] dark:bg-[#0D121F] rounded-3xl border border-slate-300 dark:border-slate-800 p-6 sm:p-8 shadow-xl">
                  
                  <div className="border-b border-slate-200 dark:border-slate-800 pb-4 mb-5 flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <span className="text-[10px] font-mono uppercase text-slate-500 font-bold block">GRÁFICO ANALÍTICO RP-HPLC</span>
                      <strong className="text-sm font-bold text-slate-950 dark:text-white uppercase font-mono">
                        ESPECTRO DE ABSORBÂNCIA UV [λ = 214nm]
                      </strong>
                    </div>
                    <span className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-100/70 dark:bg-emerald-950/70 px-2.5 py-1 rounded-lg border border-emerald-300 dark:border-emerald-700/60">
                      Pico Principal: 99.41% Área
                    </span>
                  </div>

                  {/* SVG Chromatogram Plot */}
                  <div className="bg-white dark:bg-[#05080E] rounded-2xl border border-slate-300 dark:border-slate-800 p-4 mb-5 shadow-inner">
                    <div className="h-44 w-full">
                      <svg className="w-full h-full" viewBox="0 0 500 150" fill="none">
                        <line x1="20" y1="130" x2="480" y2="130" stroke="#94A3B8" strokeWidth="1.5" />
                        <line x1="20" y1="90" x2="480" y2="90" stroke="#CBD5E1" strokeWidth="1" strokeDasharray="3 3" />
                        <line x1="20" y1="50" x2="480" y2="50" stroke="#CBD5E1" strokeWidth="1" strokeDasharray="3 3" />

                        <path 
                          d="M20 130 L160 130 Q185 129 195 110 Q205 70 210 20 Q212 12 215 20 Q220 70 230 110 Q240 129 270 130 L480 130 Z" 
                          fill="rgba(5, 150, 105, 0.18)" 
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
                          tR: 4.82 min (Pureza: 99.41%)
                        </text>
                      </svg>
                    </div>

                    <div className="flex justify-between text-xs font-mono text-slate-500 pt-1 font-semibold">
                      <span>0.0 min</span>
                      <span>3.0 min</span>
                      <span>6.0 min</span>
                      <span>9.0 min</span>
                      <span>12.0 min</span>
                    </div>
                  </div>

                  {/* Test Parameters Table */}
                  <div className="border border-slate-300 dark:border-slate-800 rounded-xl overflow-x-auto bg-white dark:bg-[#05080E] text-xs font-mono shadow-sm">
                    <table className="w-full text-left min-w-[380px]">
                      <thead className="bg-slate-100 dark:bg-slate-900 border-b border-slate-300 dark:border-slate-800 text-[11px] text-slate-700 dark:text-slate-300 uppercase font-bold">
                        <tr>
                          <th className="py-2.5 px-3.5">Parâmetro Analítico</th>
                          <th className="py-2.5 px-3.5">Especificação</th>
                          <th className="py-2.5 px-3.5 text-right">Resultado</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-900 dark:text-slate-100 font-semibold text-[11px]">
                        <tr>
                          <td className="py-2 px-3.5 text-slate-700 dark:text-slate-300">Aparência Física</td>
                          <td className="py-2 px-3.5 text-slate-500">Bolo liofilizado azul/branco</td>
                          <td className="py-2 px-3.5 text-right text-emerald-700 dark:text-emerald-400 font-bold">Conforme</td>
                        </tr>
                        <tr>
                          <td className="py-2 px-3.5 text-slate-700 dark:text-slate-300">Pureza Cromatográfica HPLC</td>
                          <td className="py-2 px-3.5 text-slate-500">≥ 99.0%</td>
                          <td className="py-2 px-3.5 text-right font-extrabold text-emerald-700 dark:text-emerald-400">99.41%</td>
                        </tr>
                        <tr>
                          <td className="py-2 px-3.5 text-slate-700 dark:text-slate-300">Espectrometria de Massas (ESI-MS)</td>
                          <td className="py-2 px-3.5 text-slate-500">Teórico ± 1.0 Da (403.94)</td>
                          <td className="py-2 px-3.5 text-right text-emerald-700 dark:text-emerald-400 font-bold">Confirmado</td>
                        </tr>
                        <tr>
                          <td className="py-2 px-3.5 text-slate-700 dark:text-slate-300">Endotoxinas Bacterianas (LAL)</td>
                          <td className="py-2 px-3.5 text-slate-500">&lt; 0.05 EU/mg</td>
                          <td className="py-2 px-3.5 text-right text-emerald-700 dark:text-emerald-400 font-bold">&lt; 0.01 EU/mg</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                </div>
              </div>

            </div>

          </div>
        </section>

        {/* SECTION 5: HOW TO USE IN 3 STEPS (THE PROTOCOL) */}
        <section id="protocolo" className="py-20 sm:py-24 border-b border-slate-200 dark:border-slate-800 bg-[#F4F6F8] dark:bg-[#070A11] transition-colors">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
              <span className="text-xs font-mono tracking-[0.2em] text-emerald-700 dark:text-emerald-400 uppercase font-extrabold block">
                SIMPLICIDADE &amp; MÁXIMO FRESCOR
              </span>
              <h2 
                className="text-2xl sm:text-4xl font-extrabold tracking-[0.06em] uppercase text-slate-950 dark:text-white"
                style={{ fontFamily: 'Syne, sans-serif' }}
              >
                O PROTOCOLO EM 3 PASSOS RÁPIDOS
              </h2>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
                Você mesmo mistura o frasco no conforto da sua casa em menos de 1 minuto, garantindo a molécula mais fresca e ativa do mercado.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              
              {/* STEP 1 */}
              <div className="bg-white dark:bg-[#0D121F] rounded-3xl border border-slate-300 dark:border-slate-800 p-8 shadow-lg flex flex-col justify-between hover:border-emerald-600 transition">
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-4xl font-extrabold text-emerald-700 dark:text-emerald-400" style={{ fontFamily: 'Syne, sans-serif' }}>01</span>
                    <span className="bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-mono font-bold px-3 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800">
                      TRANSFERÊNCIA
                    </span>
                  </div>

                  <div className="h-32 mb-6 flex items-center justify-center bg-slate-50 dark:bg-[#05080E] rounded-2xl border border-slate-200 dark:border-slate-800">
                    <FlaskConical className="w-14 h-14 text-emerald-700 dark:text-emerald-400" />
                  </div>

                  <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2" style={{ fontFamily: 'Syne, sans-serif' }}>
                    Adicione o Diluente Estéril
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    Com a cânula estéril inclusa no kit, transfira suavemente os 5.0ml do veículo bacteriostático pela parede interna do frasco âmbar.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs font-mono text-slate-500 font-semibold">
                  Ambiente asséptico e prático
                </div>
              </div>

              {/* STEP 2 */}
              <div className="bg-white dark:bg-[#0D121F] rounded-3xl border border-slate-300 dark:border-slate-800 p-8 shadow-lg flex flex-col justify-between hover:border-emerald-600 transition">
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-4xl font-extrabold text-emerald-700 dark:text-emerald-400" style={{ fontFamily: 'Syne, sans-serif' }}>02</span>
                    <span className="bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-mono font-bold px-3 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800">
                      SOLUBILIZAÇÃO
                    </span>
                  </div>

                  <div className="h-32 mb-6 flex items-center justify-center bg-slate-50 dark:bg-[#05080E] rounded-2xl border border-slate-200 dark:border-slate-800">
                    <Sparkles className="w-14 h-14 text-emerald-700 dark:text-emerald-400" />
                  </div>

                  <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2" style={{ fontFamily: 'Syne, sans-serif' }}>
                    Rotação Suave (20 Segundos)
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    Faça movimentos circulares lentos com as mãos por 20 segundos. O pó liofilizado dissolverá perfeitamente. Nunca agite com força.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs font-mono text-slate-500 font-semibold">
                  Preserva as ligações peptídicas
                </div>
              </div>

              {/* STEP 3 */}
              <div className="bg-white dark:bg-[#0D121F] rounded-3xl border border-slate-300 dark:border-slate-800 p-8 shadow-lg flex flex-col justify-between hover:border-emerald-600 transition">
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-4xl font-extrabold text-emerald-700 dark:text-emerald-400" style={{ fontFamily: 'Syne, sans-serif' }}>03</span>
                    <span className="bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-mono font-bold px-3 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800">
                      APLICAÇÃO
                    </span>
                  </div>

                  <div className="h-32 mb-6 flex items-center justify-center bg-slate-50 dark:bg-[#05080E] rounded-2xl border border-slate-200 dark:border-slate-800">
                    <Clock className="w-14 h-14 text-emerald-700 dark:text-emerald-400" />
                  </div>

                  <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2" style={{ fontFamily: 'Syne, sans-serif' }}>
                    4 a 6 Gotas Noturnas
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    Encaixe o dosador conta-gotas. Aplique diretamente na face ou couro cabeludo antes de dormir. Guarde o frasco reconstituído na geladeira.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs font-mono text-slate-500 font-semibold">
                  Conservar refrigerado (2°C a 8°C)
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* SECTION 6: PRICING / KITS SELECTION (THE CORE CONVERSION ENGINE) */}
        <section id="kits" className="py-20 sm:py-28 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#070A11] transition-colors relative">
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
              <span className="text-xs font-mono tracking-[0.2em] text-emerald-700 dark:text-emerald-400 uppercase font-extrabold block">
                CONDIÇÃO DIRETA DO LABORATÓRIO
              </span>
              <h2 
                className="text-3xl sm:text-5xl font-extrabold tracking-[0.06em] uppercase text-slate-950 dark:text-white"
                style={{ fontFamily: 'Syne, sans-serif' }}
              >
                ESCOLHA O SEU PROTOCOLO
              </h2>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
                Envios diretos com embalagem térmica reforçada, código de rastreamento prioritário e suporte técnico especializado.
              </p>
            </div>

            {/* Pricing Cards Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
              
              {/* KIT 1: ESSENTIAL */}
              <div className="bg-[#FAFBF9] dark:bg-[#0D121F] rounded-3xl border border-slate-300 dark:border-slate-800 p-8 flex flex-col justify-between shadow-lg relative">
                <div>
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 block mb-2">
                    {kits.single.badge}
                  </span>
                  <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mb-2" style={{ fontFamily: 'Syne, sans-serif' }}>
                    {kits.single.name}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mb-6">
                    {kits.single.subtitle}
                  </p>

                  <div className="mb-6 p-4 rounded-2xl bg-white dark:bg-[#05080E] border border-slate-200 dark:border-slate-800">
                    <div className="text-xs font-mono text-slate-500 uppercase">Valor Especial à Vista (PIX):</div>
                    <div className="text-3xl font-extrabold text-slate-950 dark:text-white tracking-tight my-1">
                      R$ {kits.single.pricePix}
                    </div>
                    <div className="text-xs text-emerald-700 dark:text-emerald-400 font-bold font-mono">
                      ou em até {kits.single.priceInstallments}
                    </div>
                  </div>

                  <ul className="space-y-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300 mb-8">
                    {kits.single.items.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                  <button
                    onClick={() => {
                      setSelectedKit('single');
                      setIsOrderModalOpen(true);
                    }}
                    className="w-full bg-slate-900 hover:bg-emerald-700 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200 text-white font-bold text-xs uppercase tracking-wider py-3.5 px-4 rounded-xl transition cursor-pointer shadow-md text-center"
                    style={{ fontFamily: 'Montserrat, sans-serif' }}
                  >
                    Quero o Kit 30 Dias
                  </button>
                  <a
                    href={getWhatsAppLink('single')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 hover:text-emerald-600 py-1 font-semibold"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Dúvidas? Falar com Concierge</span>
                  </a>
                </div>
              </div>

              {/* KIT 2: DUO FULL (FEATURED / BEST VALUE) */}
              <div className="bg-white dark:bg-[#0D121F] rounded-3xl border-2 border-emerald-600 dark:border-emerald-500 p-8 sm:p-9 flex flex-col justify-between shadow-2xl relative lg:-translate-y-3 ring-4 ring-emerald-600/10">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-emerald-700 text-white text-[11px] font-mono font-extrabold uppercase px-4 py-1 rounded-full shadow-md tracking-wider">
                  {kits.duo.badge}
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="flex text-amber-400 text-xs">★★★★★</span>
                    <span className="text-[11px] font-mono text-emerald-700 dark:text-emerald-400 font-bold uppercase">Ciclo Recomendado</span>
                  </div>
                  <h3 className="text-2xl font-extrabold text-slate-950 dark:text-white mb-2" style={{ fontFamily: 'Syne, sans-serif' }}>
                    {kits.duo.name}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mb-6">
                    {kits.duo.subtitle}
                  </p>

                  <div className="mb-6 p-5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
                    <div className="text-xs font-mono text-slate-500 dark:text-slate-400 uppercase">Valor Especial à Vista (PIX):</div>
                    <div className="text-4xl font-extrabold text-emerald-800 dark:text-emerald-300 tracking-tight my-1">
                      R$ {kits.duo.pricePix}
                    </div>
                    <div className="text-xs text-slate-700 dark:text-slate-300 font-bold font-mono">
                      ou em até {kits.duo.priceInstallments}
                    </div>
                    <div className="mt-2 text-[11px] font-mono text-emerald-700 dark:text-emerald-400 font-bold">
                      ✓ {kits.duo.economy} + {kits.duo.shipping}
                    </div>
                  </div>

                  <ul className="space-y-3.5 text-xs sm:text-sm text-slate-800 dark:text-slate-200 mb-8 font-medium">
                    {kits.duo.items.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5 stroke-[2.5]" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                  <button
                    onClick={() => {
                      setSelectedKit('duo');
                      setIsOrderModalOpen(true);
                    }}
                    className="w-full bg-emerald-700 hover:bg-emerald-600 active:scale-[0.98] text-white font-bold text-xs uppercase tracking-[0.14em] py-4 px-4 rounded-xl transition cursor-pointer shadow-lg shadow-emerald-900/30 text-center"
                    style={{ fontFamily: 'Montserrat, sans-serif' }}
                  >
                    Garantir Oferta de 60 Dias
                  </button>
                  <a
                    href={getWhatsAppLink('duo')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-1.5 text-xs text-emerald-700 dark:text-emerald-400 hover:underline py-1 font-bold"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Tirar dúvidas no WhatsApp antes de fechar</span>
                  </a>
                </div>
              </div>

              {/* KIT 3: BIO-REGENERATIVE DUO (GHK + BPC) */}
              <div className="bg-[#FAFBF9] dark:bg-[#0D121F] rounded-3xl border border-slate-300 dark:border-slate-800 p-8 flex flex-col justify-between shadow-lg relative">
                <div>
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 block mb-2">
                    {kits.vip.badge}
                  </span>
                  <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mb-2" style={{ fontFamily: 'Syne, sans-serif' }}>
                    {kits.vip.name}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mb-6">
                    {kits.vip.subtitle}
                  </p>

                  <div className="mb-6 p-4 rounded-2xl bg-white dark:bg-[#05080E] border border-slate-200 dark:border-slate-800">
                    <div className="text-xs font-mono text-slate-500 uppercase">Valor Especial à Vista (PIX):</div>
                    <div className="text-3xl font-extrabold text-slate-950 dark:text-white tracking-tight my-1">
                      R$ {kits.vip.pricePix}
                    </div>
                    <div className="text-xs text-emerald-700 dark:text-emerald-400 font-bold font-mono">
                      ou em até {kits.vip.priceInstallments}
                    </div>
                  </div>

                  <ul className="space-y-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300 mb-8">
                    {kits.vip.items.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                  <button
                    onClick={() => {
                      setSelectedKit('vip');
                      setIsOrderModalOpen(true);
                    }}
                    className="w-full bg-slate-900 hover:bg-emerald-700 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200 text-white font-bold text-xs uppercase tracking-wider py-3.5 px-4 rounded-xl transition cursor-pointer shadow-md text-center"
                    style={{ fontFamily: 'Montserrat, sans-serif' }}
                  >
                    Quero o Protocolo Duo
                  </button>
                  <a
                    href={getWhatsAppLink('vip')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 hover:text-emerald-600 py-1 font-semibold"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Consultoria Especializada VIP</span>
                  </a>
                </div>
              </div>

            </div>

            {/* Security Micro Footer Banner */}
            <div className="mt-14 p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-around gap-6 text-xs text-slate-600 dark:text-slate-400 font-mono">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-emerald-600" />
                <span>Envio Imediato com Rastreamento</span>
              </div>
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-emerald-600" />
                <span>Pagamento 100% Blindado</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Garantia de Pureza HPLC ≥ 99.4%</span>
              </div>
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                <span>Suporte Clínico via WhatsApp</span>
              </div>
            </div>

          </div>
        </section>

        {/* SECTION 7: SCIENTIFIC FAQ (OVERCOMING EVERY OBJECTION) */}
        <section id="faq" className="py-20 sm:py-24 border-b border-slate-200 dark:border-slate-800 bg-[#FAFBF9] dark:bg-[#070A11] transition-colors">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="text-center mb-16 space-y-3">
              <span className="text-xs font-mono tracking-[0.2em] text-emerald-700 dark:text-emerald-400 uppercase font-extrabold block">
                ESCLARECIMENTOS TÉCNICOS
              </span>
              <h2 
                className="text-2xl sm:text-4xl font-extrabold tracking-[0.06em] uppercase text-slate-950 dark:text-white"
                style={{ fontFamily: 'Syne, sans-serif' }}
              >
                PERGUNTAS FREQUENTES
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
                Tudo o que você precisa saber antes de iniciar o seu protocolo com a PSL Labs.
              </p>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, index) => {
                const isOpen = openFaq === index;
                return (
                  <div
                    key={index}
                    className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0D121F] overflow-hidden transition shadow-sm"
                  >
                    <button
                      onClick={() => setOpenFaq(isOpen ? -1 : index)}
                      className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 cursor-pointer"
                    >
                      <span className="font-bold text-sm sm:text-base text-slate-900 dark:text-white leading-snug">
                        {faq.q}
                      </span>
                      <ChevronDown
                        className={`w-5 h-5 text-emerald-600 shrink-0 transition-transform duration-300 ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>

                    {isOpen && (
                      <div className="px-5 sm:px-6 pb-6 pt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800/80">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Direct Question Banner */}
            <div className="mt-12 text-center p-8 rounded-3xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
              <h4 className="font-bold text-base text-emerald-950 dark:text-emerald-200 mb-1">
                Ainda possui alguma dúvida clínica sobre o seu caso?
              </h4>
              <p className="text-xs sm:text-sm text-emerald-800 dark:text-emerald-300 mb-4">
                Nosso Concierge Lab está à disposição para tirar dúvidas sobre aplicação, dosagem e rotina personalizada.
              </p>
              <a
                href={getWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs uppercase tracking-wider py-3 px-6 rounded-xl transition shadow-md"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Conversar com Concierge no WhatsApp</span>
              </a>
            </div>

          </div>
        </section>

      </main>

      {/* FOOTER */}
      <footer className="bg-[#090D14] text-slate-300 border-t border-slate-800 pt-16 pb-24 lg:pb-12 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
            
            <div className="md:col-span-2">
              <img 
                src="/brand/psl-labs-premium-synthesis-line-white.png" 
                alt="PSL LABS" 
                className="h-10 w-auto object-contain mb-4"
              />
              <p className="text-sm text-slate-400 max-w-md leading-relaxed mb-4">
                PSL Labs (Premium Synthesis Line) S.A. Instalação biotecnológica de síntese peptídica, liofilização estrutural e protocolos clínicos com pureza cromatográfica atestada superior a 99%.
              </p>
              <div className="text-xs text-slate-500 font-mono">
                Parque Industrial Tecnológico • Assunção / Cidade do Leste • República do Paraguai.
              </div>
            </div>

            <div>
              <h4 className="text-white font-bold text-xs mb-4 uppercase tracking-widest font-mono">
                Padrões &amp; Normas
              </h4>
              <ul className="space-y-2 text-xs text-slate-400 font-mono">
                <li>• Pureza HPLC ≥ 99.4%</li>
                <li>• Sala Limpa Classe 100 GMP</li>
                <li>• Ensaio de Endotoxinas LAL</li>
                <li>• Liofilização sob Nitrogênio</li>
                <li>• Acreditado ISO/IEC 17025</li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold text-xs mb-4 uppercase tracking-widest font-mono">
                Navegação
              </h4>
              <ul className="space-y-2 text-xs text-slate-400">
                <li><a href="#diferencial" className="hover:text-emerald-400 transition">Por que Liofilizado?</a></li>
                <li><a href="#laudo" className="hover:text-emerald-400 transition">Laudo Analítico HPLC</a></li>
                <li><a href="#kits" className="hover:text-emerald-400 transition">Kits e Preços</a></li>
                <li><Link href="/" className="hover:text-emerald-400 transition font-bold text-emerald-400">Terminal de Verificação de Frascos →</Link></li>
              </ul>
            </div>

          </div>

          <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
            <div>
              © 2026 PSL LABS S.A. Todos os direitos reservados.
            </div>
            <div>
              Compostos formulados para protocolos avançados. Desenvolvido com padrão estético e científico de alta fidelidade.
            </div>
          </div>
        </div>
      </footer>

      {/* MOBILE STICKY BOTTOM BAR (CONVERSION BOOSTER) */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#0A0E17]/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 p-3 sm:hidden shadow-2xl flex items-center justify-between gap-3">
        <div>
          <span className="text-[10px] text-slate-500 font-mono block">PLANO RECOMENDADO</span>
          <div className="text-sm font-extrabold text-emerald-800 dark:text-emerald-400 font-mono">
            R$ 680 <span className="text-[10px] text-slate-500 font-normal">(60 Dias)</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={getWhatsAppLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2.5 rounded-xl bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700"
            title="WhatsApp"
          >
            <MessageCircle className="w-5 h-5" />
          </a>

          <a
            href="#kits"
            className="bg-emerald-700 active:scale-[0.98] text-white font-bold text-xs uppercase tracking-wider py-3 px-4 rounded-xl transition shadow-md"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            Garantir Protocolo
          </a>
        </div>
      </div>

      {/* ORDER MODAL (DIRECT CHECKOUT DIALOG) */}
      {isOrderModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-[#0D121F] rounded-3xl border border-slate-300 dark:border-slate-800 max-w-lg w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto text-slate-900 dark:text-white">
            
            <button
              onClick={() => setIsOrderModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-900 dark:hover:text-white p-1 cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-slate-200 dark:border-slate-800">
              <ShoppingBag className="w-5 h-5 text-emerald-600" />
              <h3 className="font-bold text-base uppercase tracking-wider font-mono">
                Finalizar Pedido • PSL LABS
              </h3>
            </div>

            {/* Selected Kit Summary */}
            <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-4 mb-5">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-mono font-bold text-emerald-800 dark:text-emerald-300 uppercase">
                    PRODUTO SELECIONADO:
                  </span>
                  <h4 className="font-extrabold text-slate-950 dark:text-white text-base">
                    {kits[selectedKit]?.name}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                    {kits[selectedKit]?.subtitle}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xl font-extrabold text-emerald-800 dark:text-emerald-300">
                    R$ {kits[selectedKit]?.pricePix}
                  </span>
                  <div className="text-[10px] font-mono text-slate-500">ou {kits[selectedKit]?.priceInstallments}</div>
                </div>
              </div>
            </div>

            <form onSubmit={handleOrderSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                  Seu Nome Completo:
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Ex: Dra. Juliana Santos"
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-[#05080E] border border-slate-300 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                  WhatsApp com DDD:
                </label>
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="Ex: (11) 98765-4321"
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-[#05080E] border border-slate-300 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                  Cidade / Estado para Entrega:
                </label>
                <input
                  type="text"
                  required
                  value={customerCity}
                  onChange={(e) => setCustomerCity(e.target.value)}
                  placeholder="Ex: São Paulo / SP"
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-[#05080E] border border-slate-300 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-emerald-700 hover:bg-emerald-600 active:scale-[0.98] text-white font-bold text-xs uppercase tracking-[0.14em] py-4 px-4 rounded-xl transition shadow-lg shadow-emerald-900/30 flex items-center justify-center gap-2 cursor-pointer"
                  style={{ fontFamily: 'Montserrat, sans-serif' }}
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Concluir Pedido no WhatsApp Concierge</span>
                </button>
                <p className="text-[11px] text-center text-slate-500 mt-2 font-mono">
                  Você será direcionado ao atendimento oficial para confirmação do endereço e chave PIX/Cartão.
                </p>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* COA OFFICIAL MODAL */}
      {isCoaModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-[#0D121F] rounded-3xl border border-slate-300 dark:border-slate-800 max-w-2xl w-full p-4 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto text-slate-900 dark:text-white">
            <button 
              onClick={() => setIsCoaModalOpen(false)}
              className="absolute top-4 right-4 sm:top-5 sm:right-5 text-slate-400 hover:text-slate-950 dark:hover:text-white p-1 cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-200 dark:border-slate-800 pr-8">
              <img src="/brand/psl-labs-premium-synthesis-line.png" alt="PSL LABS" className="h-8 w-auto dark:hidden" />
              <img src="/brand/psl-labs-premium-synthesis-line-white.png" alt="PSL LABS" className="h-8 w-auto hidden dark:block" />
              <div>
                <h4 
                  className="font-bold text-sm sm:text-base tracking-widest text-slate-950 dark:text-white uppercase"
                  style={{ fontFamily: 'Syne, sans-serif' }}
                >
                  Official Certificate of Analysis
                </h4>
                <span className="text-[10px] sm:text-xs font-mono text-slate-500 font-semibold block">DOCUMENT ID: COA-GHK-2026-X1 • ISO/IEC 17025</span>
              </div>
            </div>

            <div className="space-y-4 text-xs font-mono">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 dark:bg-[#05080E] p-3.5 sm:p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                <div>
                  <span className="text-[10px] sm:text-[11px] text-slate-500 uppercase block font-semibold">Composto / Peptide:</span>
                  <strong className="text-slate-950 dark:text-white text-xs sm:text-sm">GHK-Cu (Copper Tripeptide-1)</strong>
                </div>
                <div>
                  <span className="text-[10px] sm:text-[11px] text-slate-500 uppercase block font-semibold">Lote / Batch Number:</span>
                  <strong className="text-slate-950 dark:text-white text-xs sm:text-sm">#PSL-2026-X1</strong>
                </div>
                <div>
                  <span className="text-[10px] sm:text-[11px] text-slate-500 uppercase block font-semibold">Data de Fabricação:</span>
                  <span className="text-slate-700 dark:text-slate-300 font-semibold">Novembro 2026</span>
                </div>
                <div>
                  <span className="text-[10px] sm:text-[11px] text-slate-500 uppercase block font-semibold">Pureza Homologada:</span>
                  <strong className="text-emerald-700 dark:text-emerald-400 font-extrabold text-xs sm:text-sm">99.41% (RP-HPLC)</strong>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
                Certifica-se por meio deste laudo oficial que o lote de peptídeo referenciado foi sintetizado sob as diretrizes de sala limpa GMP Classe 100, confirmado por espectrometria de massas (ESI-MS) e purificado em atmosfera de nitrogênio inerte de grau farmacêutico.
              </p>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-400">
                  Responsável Técnico: <strong className="text-slate-950 dark:text-white block font-bold">Dr. M. Benítez, PhD</strong> Química Analítica, PSL LABS S.A.
                </div>
                <button 
                  onClick={() => window.print()}
                  className="w-full sm:w-auto bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs transition cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Printer className="w-4 h-4" />
                  <span>Imprimir Certificado</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* QR CAMERA MODAL */}
      <QRCameraScanner
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
      />

    </div>
  );
}
