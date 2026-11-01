import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { 
  ShieldCheck, 
  Lock, 
  Plus, 
  Printer, 
  Layers, 
  AlertTriangle, 
  CheckCircle2, 
  RefreshCw, 
  Database, 
  FileText, 
  QrCode, 
  TrendingUp, 
  FlaskConical, 
  ExternalLink, 
  Download,
  Edit3,
  Image as ImageIcon,
  Upload,
  X
} from 'lucide-react';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState(false);

  const [activeTab, setActiveTab] = useState('labels'); // 'labels', 'products', 'batches', 'logs'
  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(false);

  // Editing state
  const [editingProductId, setEditingProductId] = useState(null);

  // Product form
  const [prodForm, setProdForm] = useState({
    name: '',
    chemicalName: '',
    category: 'Peptídeos & Longevidade',
    concentration: '',
    purity: '99.2% (HPLC)',
    presentation: 'Frasco Vial Liofilizado',
    image: '',
    description_py: '',
    description_pt: '',
    storage_py: 'Conservar refrigerado a 2°C - 8°C.',
    storage_pt: 'Conservar refrigerado a 2°C - 8°C.'
  });

  // New batch form
  const [batchForm, setBatchForm] = useState({
    productId: 'ghk-cu-50mg',
    batchNumber: 'LOT-2026-02',
    mfgDate: '10/2026',
    expDate: '10/2028',
    quantityLabels: 65
  });

  // Label printing state
  const [selectedBatchId, setSelectedBatchId] = useState('');
  const [baseUrl, setBaseUrl] = useState('');
  const [labelsData, setLabelsData] = useState(null);
  const [loadingLabels, setLoadingLabels] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setBaseUrl(window.location.origin);
      if (sessionStorage.getItem('psl_admin_auth') === 'true') {
        setIsAuthenticated(true);
      }
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [statsRes, prodRes, batchRes] = await Promise.all([
        fetch('/api/admin/stats').then(r => r.json()),
        fetch('/api/admin/products').then(r => r.json()),
        fetch('/api/admin/batches').then(r => r.json())
      ]);
      setStats(statsRes);
      setProducts(prodRes);
      setBatches(batchRes);
      if (batchRes.length > 0 && !selectedBatchId) {
        setSelectedBatchId(batchRes[0].id);
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    // Default admin password
    if (password === 'psl2026' || password === 'admin123' || password === 'admin') {
      setIsAuthenticated(true);
      setAuthError(false);
      sessionStorage.setItem('psl_admin_auth', 'true');
    } else {
      setAuthError(true);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("A imagem deve ter no máximo 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setProdForm(prev => ({ ...prev, image: event.target.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleStartEditProduct = (p) => {
    setEditingProductId(p.id);
    setProdForm({
      name: p.name || '',
      chemicalName: p.chemicalName || '',
      category: p.category || 'Peptídeos & Longevidade',
      concentration: p.concentration || '',
      purity: p.purity || '99.2% (HPLC)',
      presentation: p.presentation || 'Frasco Vial Liofilizado',
      image: p.image || '',
      description_py: p.description_py || '',
      description_pt: p.description_pt || '',
      storage_py: p.storage_py || 'Conservar refrigerado a 2°C - 8°C.',
      storage_pt: p.storage_pt || 'Conservar refrigerado a 2°C - 8°C.'
    });

    // Scroll smoothly to form
    const el = document.getElementById('product-form-box');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingProductId(null);
    setProdForm({
      name: '',
      chemicalName: '',
      category: 'Peptídeos & Longevidade',
      concentration: '',
      purity: '99.2% (HPLC)',
      presentation: 'Frasco Vial Liofilizado',
      image: '',
      description_py: '',
      description_pt: '',
      storage_py: 'Conservar refrigerado a 2°C - 8°C.',
      storage_pt: 'Conservar refrigerado a 2°C - 8°C.'
    });
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (!prodForm.name || !prodForm.concentration) {
      alert("Preencha o nome e a concentração do produto");
      return;
    }

    try {
      const isEditing = !!editingProductId;
      const method = isEditing ? 'PUT' : 'POST';
      const payload = isEditing ? { id: editingProductId, ...prodForm } : prodForm;

      const res = await fetch('/api/admin/products', {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        alert(isEditing ? "Produto e imagem atualizados com sucesso!" : "Produto cadastrado com sucesso!");
        handleCancelEdit();
        loadData();
      } else {
        const errData = await res.json();
        alert(errData.error || "Erro ao salvar produto");
      }
    } catch (err) {
      alert("Erro ao comunicar com o servidor");
    }
  };

  const handleCreateBatch = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/batches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(batchForm)
      });
      const data = await res.json();
      if (res.ok) {
        alert(`Lote ${data.batch.batchNumber} criado com sucesso! ${data.generatedCodesCount} códigos únicos gerados.`);
        loadData();
        setSelectedBatchId(data.batch.id);
        setActiveTab('labels');
      } else {
        alert(data.error || "Erro ao criar lote");
      }
    } catch (err) {
      alert("Erro de comunicação ao criar lote");
    }
  };

  const handleLoadLabelsForPrint = async () => {
    setLoadingLabels(true);
    try {
      const url = `/api/admin/labels-data?batchId=${encodeURIComponent(selectedBatchId)}&baseUrl=${encodeURIComponent(baseUrl)}`;
      const res = await fetch(url);
      const json = await res.json();
      setLabelsData(json);
    } catch (err) {
      alert("Erro ao carregar etiquetas");
    }
    setLoadingLabels(false);
  };

  const handleTriggerPrint = () => {
    window.print();
  };

  // IF NOT LOGGED IN
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 text-slate-100">
        <Head>
          <title>Acesso Restrito ADM | PSL LABS</title>
        </Head>
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">
          <div className="text-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto mb-4">
              <Lock className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-bold text-white">Painel Administrativo</h1>
            <p className="text-xs text-slate-400 mt-1">PSL LABS S.A. | República del Paraguay</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wider">
                Senha de Acesso
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite a senha (padrão: psl2026)"
                className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {authError && (
              <div className="p-3 bg-red-950/60 border border-red-800 rounded-xl text-xs text-red-300">
                Senha incorreta. A senha padrão do sistema é: <strong>psl2026</strong>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 rounded-xl text-sm transition cursor-pointer"
            >
              Entrar no Painel ADM
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link href="/" className="text-xs text-slate-500 hover:text-slate-300 transition">
              ← Voltar ao site público
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // IF AUTHENTICATED
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Head>
        <title>Painel ADM | PSL LABS Paraguay</title>
      </Head>

      {/* Top Admin Header */}
      <header className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex flex-wrap items-center justify-between gap-4 no-print">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-black text-xl shadow">
            P
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg text-white">PSL LABS</span>
              <span className="bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                ADM PORTAL
              </span>
            </div>
            <span className="text-[11px] text-slate-400">Sistema Anti-Clonagem &amp; Gerador Spiral A4351</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="text-xs text-slate-400 hover:text-white bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700 transition"
          >
            Ver Site Público ↗
          </Link>
          <button
            onClick={() => {
              sessionStorage.removeItem('psl_admin_auth');
              setIsAuthenticated(false);
            }}
            className="text-xs text-red-400 hover:text-red-300 bg-red-950/40 px-3 py-1.5 rounded-lg border border-red-800 transition cursor-pointer"
          >
            Sair
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full no-print">
        
        {/* Metric Cards */}
        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-8">
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
              <div className="text-xs text-slate-400 mb-1">Produtos Ativos</div>
              <div className="text-2xl font-black text-white">{stats.totalProducts}</div>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
              <div className="text-xs text-slate-400 mb-1">Lotes Criados</div>
              <div className="text-2xl font-black text-white">{stats.totalBatches}</div>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
              <div className="text-xs text-slate-400 mb-1">Códigos Gerados</div>
              <div className="text-2xl font-black text-emerald-400">{stats.totalCodes}</div>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
              <div className="text-xs text-slate-400 mb-1">Total de Leituras</div>
              <div className="text-2xl font-black text-blue-400">{stats.totalScans}</div>
            </div>
            <div className="bg-slate-900 border border-amber-900/60 p-4 rounded-2xl">
              <div className="text-xs text-amber-400 mb-1">Alertas (&gt;1 Scan)</div>
              <div className="text-2xl font-black text-amber-400">{stats.alertScans}</div>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-4 mb-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab('labels')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'labels'
                ? 'bg-emerald-600 text-white shadow'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            <Printer className="w-4 h-4" />
            <span>Gerador Spiral A4351 (65 Etiquetas)</span>
          </button>

          <button
            onClick={() => setActiveTab('batches')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'batches'
                ? 'bg-emerald-600 text-white shadow'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Gerenciar Lotes &amp; Códigos</span>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'products'
                ? 'bg-emerald-600 text-white shadow'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            <FlaskConical className="w-4 h-4" />
            <span>Catálogo de Produtos</span>
          </button>

          <button
            onClick={() => setActiveTab('logs')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'logs'
                ? 'bg-emerald-600 text-white shadow'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            <AlertTriangle className="w-4 h-4" />
            <span>Auditoria &amp; Logs de Consulta</span>
          </button>
        </div>

        {/* TAB 1: SPIRAL A4351 PRINT GENERATOR */}
        {activeTab === 'labels' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
              <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                <Printer className="w-5 h-5 text-emerald-400" />
                <span>Impressão de Etiquetas - Gabarito Spiral A4351</span>
              </h2>
              <p className="text-xs text-slate-400 mb-6">
                Configurado com dimensões exatas de fábrica: folha A4 com <strong>65 etiquetas</strong> (5 colunas × 13 linhas), tamanho unitário de <strong>38,2 × 21,2 mm</strong>. Cada etiqueta possui QR Code criptográfico único.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Selecione o Lote
                  </label>
                  <select
                    value={selectedBatchId}
                    onChange={(e) => setSelectedBatchId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white"
                  >
                    {batches.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.batchNumber} - {products.find(p => p.id === b.productId)?.name || b.productId} ({b.mfgDate} - {b.expDate})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    URL Base do Site (Domínio / Vercel)
                  </label>
                  <input
                    type="text"
                    value={baseUrl}
                    onChange={(e) => setBaseUrl(e.target.value)}
                    placeholder="https://seu-site.vercel.app"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white"
                  />
                </div>

                <div className="flex items-end gap-2">
                  <button
                    onClick={handleLoadLabelsForPrint}
                    disabled={loadingLabels}
                    className="bg-slate-800 hover:bg-slate-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition cursor-pointer flex-grow"
                  >
                    {loadingLabels ? 'Gerando...' : 'Carregar 65 Etiquetas'}
                  </button>

                  {labelsData && (
                    <button
                      onClick={handleTriggerPrint}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-6 py-2.5 rounded-xl text-xs flex items-center gap-1.5 shadow transition cursor-pointer"
                    >
                      <Printer className="w-4 h-4" />
                      <span>Imprimir / PDF</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Instructions Callout */}
              <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 text-xs text-slate-400 space-y-1">
                <p className="font-bold text-slate-300">💡 Instruções para Impressão Perfeita:</p>
                <p>1. Na janela de impressão do navegador, defina a <strong>Escala em 100%</strong> (Tamanho Real) e desmarque "Ajustar à página".</p>
                <p>2. Deixe as <strong>Margens em "Nenhuma"</strong> (as margens de 10,7 mm superior e 4,5 mm lateral já estão embutidas no gabarito).</p>
                <p>3. Marque a opção <strong>"Gráficos de plano de fundo"</strong> para imprimir as molduras e contraste corretos.</p>
              </div>
            </div>

            {/* PREVIEW OF 65 LABELS */}
            {labelsData && (
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Folha Carregada: {labelsData.labels.length} Etiquetas Geradas para {labelsData.product.name}</span>
                  </h3>
                  <button
                    onClick={handleTriggerPrint}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow cursor-pointer"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Imprimir Agora</span>
                  </button>
                </div>

                <div className="overflow-x-auto p-4 bg-slate-950 rounded-2xl border border-slate-800">
                  <div className="grid grid-cols-5 gap-2 min-w-[750px]">
                    {labelsData.labels.slice(0, 15).map((lbl, idx) => (
                      <div
                        key={idx}
                        className="bg-[#0b1528] text-slate-100 p-1.5 rounded border border-slate-800 flex items-center gap-1.5 shadow-sm text-[8px]"
                        style={{ height: '70px' }}
                      >
                        <div className="w-12 h-12 bg-white rounded p-0.5 shrink-0 flex items-center justify-center">
                          <img src={lbl.qrDataUrl} alt="QR" className="w-full h-full" />
                        </div>
                        <div className="overflow-hidden leading-tight">
                          <div className="font-black text-[9px] text-white tracking-tighter">PSL <span className="text-sky-400">LABS</span></div>
                          <div className="font-bold text-[8px] text-sky-400 truncate">{lbl.productName}</div>
                          <div className="text-[7px] text-slate-400 mt-0.5">L:{lbl.batchNumber}</div>
                          <div className="text-[6.5px] text-slate-500 font-mono truncate">{lbl.code}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="text-center text-xs text-slate-500 mt-3">
                    Exibindo 15 de {labelsData.labels.length} etiquetas geradas. Clique em "Imprimir / PDF" para ver a folha A4 completa.
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: BATCHES & CODE GENERATOR */}
        {activeTab === 'batches' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Create Batch Form */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
              <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                <Plus className="w-4 h-4 text-emerald-400" />
                <span>Criar Novo Lote</span>
              </h2>

              <form onSubmit={handleCreateBatch} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Produto
                  </label>
                  <select
                    value={batchForm.productId}
                    onChange={(e) => setBatchForm({ ...batchForm, productId: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white"
                  >
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.concentration})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Número do Lote (Batch Number)
                  </label>
                  <input
                    type="text"
                    value={batchForm.batchNumber}
                    onChange={(e) => setBatchForm({ ...batchForm, batchNumber: e.target.value })}
                    placeholder="Ex: LOT-2026-02"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Data Fabricação
                    </label>
                    <input
                      type="text"
                      value={batchForm.mfgDate}
                      onChange={(e) => setBatchForm({ ...batchForm, mfgDate: e.target.value })}
                      placeholder="10/2026"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Data Validade
                    </label>
                    <input
                      type="text"
                      value={batchForm.expDate}
                      onChange={(e) => setBatchForm({ ...batchForm, expDate: e.target.value })}
                      placeholder="10/2028"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Quantidade de Etiquetas
                  </label>
                  <select
                    value={batchForm.quantityLabels}
                    onChange={(e) => setBatchForm({ ...batchForm, quantityLabels: parseInt(e.target.value, 10) })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    <option value={65}>65 etiquetas (1 folha Spiral A4351)</option>
                    <option value={130}>130 etiquetas (2 folhas)</option>
                    <option value={195}>195 etiquetas (3 folhas)</option>
                    <option value={325}>325 etiquetas (5 folhas)</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl text-xs transition cursor-pointer"
                >
                  Criar Lote &amp; Gerar Chaves Únicas
                </button>
              </form>
            </div>

            {/* List Existing Batches */}
            <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-6">
              <h2 className="text-base font-bold text-white mb-4">Lotes Registrados</h2>

              <div className="space-y-3">
                {batches.map((b) => {
                  const prod = products.find(p => p.id === b.productId);
                  return (
                    <div
                      key={b.id}
                      className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-wrap items-center justify-between gap-4"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-emerald-400 text-sm">{b.batchNumber}</span>
                          <span className="text-xs text-white font-bold">({prod?.name || b.productId})</span>
                        </div>
                        <div className="text-xs text-slate-400 mt-1">
                          Fab: <strong>{b.mfgDate}</strong> | Val: <strong>{b.expDate}</strong> | Qtd: <strong>{b.quantityLabels} un</strong>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setSelectedBatchId(b.id);
                          setActiveTab('labels');
                        }}
                        className="text-xs bg-slate-800 hover:bg-emerald-600 text-white px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>Imprimir Folha A4351</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        )}

        {/* TAB 3: PRODUCTS MANAGEMENT */}
        {activeTab === 'products' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Create / Edit Product Form */}
            <div id="product-form-box" className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  {editingProductId ? (
                    <>
                      <Edit3 className="w-4 h-4 text-amber-400" />
                      <span>Editar Produto</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 text-emerald-400" />
                      <span>Adicionar Novo Produto</span>
                    </>
                  )}
                </h2>

                {editingProductId && (
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="text-xs text-slate-400 hover:text-white bg-slate-800 px-2.5 py-1 rounded-lg flex items-center gap-1 transition"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Cancelar</span>
                  </button>
                )}
              </div>

              {editingProductId && (
                <div className="mb-4 p-2.5 bg-amber-950/40 border border-amber-800/60 rounded-xl text-xs text-amber-300 flex items-center gap-2">
                  <span className="font-bold">Editando:</span>
                  <span className="truncate">{prodForm.name}</span>
                </div>
              )}

              <form onSubmit={handleSaveProduct} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Nome Comercial
                  </label>
                  <input
                    type="text"
                    value={prodForm.name}
                    onChange={(e) => setProdForm({ ...prodForm, name: e.target.value })}
                    placeholder="Ex: GHK CU 50 MG"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Concentração
                    </label>
                    <input
                      type="text"
                      value={prodForm.concentration}
                      onChange={(e) => setProdForm({ ...prodForm, concentration: e.target.value })}
                      placeholder="Ex: 50 MG"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Pureza HPLC
                    </label>
                    <input
                      type="text"
                      value={prodForm.purity}
                      onChange={(e) => setProdForm({ ...prodForm, purity: e.target.value })}
                      placeholder="Ex: 99.4% (HPLC)"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Nome Químico / Científico
                  </label>
                  <input
                    type="text"
                    value={prodForm.chemicalName}
                    onChange={(e) => setProdForm({ ...prodForm, chemicalName: e.target.value })}
                    placeholder="Ex: Copper Tripeptide-1"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>

                {/* FOTO DO PRODUTO (Upload ou URL) */}
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-2xl space-y-2.5">
                  <label className="block text-xs font-bold text-emerald-400 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <ImageIcon className="w-3.5 h-3.5" />
                      <span>Foto do Produto</span>
                    </span>
                    {prodForm.image && (
                      <button
                        type="button"
                        onClick={() => setProdForm({ ...prodForm, image: '' })}
                        className="text-[10px] text-red-400 hover:underline"
                      >
                        Remover Foto
                      </button>
                    )}
                  </label>

                  {/* Preview da foto se existir */}
                  {prodForm.image && (
                    <div className="relative w-full h-32 rounded-xl overflow-hidden border border-slate-700 bg-slate-900">
                      <img
                        src={prodForm.image}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {/* Botão de Upload de Arquivo */}
                  <div>
                    <label className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-slate-600 rounded-xl px-3 py-2 text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition">
                      <Upload className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Carregar Foto do Computador / Celular</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {/* Ou input de URL direta */}
                  <div>
                    <input
                      type="url"
                      value={prodForm.image}
                      onChange={(e) => setProdForm({ ...prodForm, image: e.target.value })}
                      placeholder="Ou cole a URL direta da imagem (https://...)"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-[11px] text-slate-300 placeholder-slate-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Descripción (Español - PY)
                  </label>
                  <textarea
                    rows={2}
                    value={prodForm.description_py}
                    onChange={(e) => setProdForm({ ...prodForm, description_py: e.target.value })}
                    placeholder="Descripción del producto para clientes paraguayos..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Descrição (Português - PT-BR)
                  </label>
                  <textarea
                    rows={2}
                    value={prodForm.description_pt}
                    onChange={(e) => setProdForm({ ...prodForm, description_pt: e.target.value })}
                    placeholder="Descrição do produto para clientes brasileiros..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl text-xs transition cursor-pointer shadow-lg shadow-emerald-950/40"
                  >
                    {editingProductId ? "Salvar Alterações do Produto" : "Salvar Produto no Catálogo"}
                  </button>

                  {editingProductId && (
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold px-4 py-3 rounded-xl text-xs transition cursor-pointer"
                    >
                      Cancelar
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* List Existing Products */}
            <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-bold text-white">Catálogo de Produtos Cadastrados</h2>
                <span className="text-xs text-slate-400">Total: {products.length} itens</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {products.map((p) => {
                  const isCurrentEditing = editingProductId === p.id;
                  return (
                    <div
                      key={p.id}
                      className={`p-4 rounded-2xl bg-slate-950 border transition flex flex-col justify-between ${
                        isCurrentEditing
                          ? 'border-amber-500/80 ring-2 ring-amber-500/20'
                          : 'border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex gap-3.5 mb-3">
                        <img
                          src={p.image || "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&q=80"}
                          alt={p.name}
                          className="w-16 h-16 rounded-xl object-cover bg-slate-900 shrink-0 border border-slate-800"
                        />
                        <div className="overflow-hidden flex-1">
                          <div className="text-[10px] text-emerald-400 font-bold uppercase">{p.category}</div>
                          <div className="font-bold text-white text-sm truncate">{p.name}</div>
                          <div className="text-xs text-slate-400 font-mono">{p.concentration} | {p.purity}</div>
                          <div className="text-[11px] text-slate-500 mt-0.5 truncate">{p.presentation}</div>
                        </div>
                      </div>

                      <div className="border-t border-slate-800/80 pt-3 flex items-center justify-between">
                        <span className="text-[10px] text-slate-500 font-mono">ID: {p.id}</span>
                        <button
                          type="button"
                          onClick={() => handleStartEditProduct(p)}
                          className="text-xs bg-slate-800 hover:bg-amber-600 text-slate-200 hover:text-white px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5 font-semibold"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Editar Produto &amp; Foto</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        )}

        {/* TAB 4: AUDIT LOGS */}
        {activeTab === 'logs' && stats && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
            <h2 className="text-base font-bold text-white mb-2 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>Registro de Consultas em Tempo Real</span>
            </h2>
            <p className="text-xs text-slate-400 mb-6">
              Cada escaneamento de QR Code é registrado com endereço IP, navegador e data/hora. Leituras suspeitas (&gt; 1 consulta) são destacadas em amarelo.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Código</th>
                    <th className="py-3 px-4">Data e Hora</th>
                    <th className="py-3 px-4">IP</th>
                    <th className="py-3 px-4">Dispositivo</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {stats.recentScans.map((s) => (
                    <tr key={s.id} className={s.isAlert ? "bg-amber-950/20" : ""}>
                      <td className="py-3 px-4">
                        {s.isAlert ? (
                          <span className="bg-amber-950 text-amber-300 border border-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                            ⚠️ Alerta Clonagem
                          </span>
                        ) : (
                          <span className="bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                            ✓ Autêntico
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-white">
                        <Link href={`/v/${s.code}`} target="_blank" className="hover:underline text-emerald-400">
                          {s.code}
                        </Link>
                      </td>
                      <td className="py-3 px-4 text-slate-400">
                        {new Date(s.scannedAt).toLocaleString('pt-BR')}
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-400">{s.ip}</td>
                      <td className="py-3 px-4 text-slate-500 truncate max-w-xs">{s.userAgent}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>

      {/* PRINT-ONLY CONTAINER FOR SPIRAL A4351 */}
      {labelsData && (
        <div className="hidden print-only">
          <div
            style={{
              width: '210mm',
              height: '297mm',
              paddingTop: '10.7mm',
              paddingBottom: '10.7mm',
              paddingLeft: '4.5mm',
              paddingRight: '4.5mm',
              display: 'grid',
              gridTemplateColumns: '38.2mm 2.5mm 38.2mm 2.5mm 38.2mm 2.5mm 38.2mm 2.5mm 38.2mm',
              gridTemplateRows: 'repeat(13, 21.2mm)',
              boxSizing: 'border-box'
            }}
          >
            {labelsData.labels.map((lbl, idx) => (
              <>
                <div
                  key={idx}
                  style={{
                    width: '38.2mm',
                    height: '21.2mm',
                    maxHeight: '21.2mm',
                    overflow: 'hidden',
                    padding: '1.0mm 1.2mm',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: '#0b1528',
                    boxSizing: 'border-box'
                  }}
                >
                  {/* Left Column: QR Code + Serial Text */}
                  <div style={{ width: '13.0mm', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <div style={{ width: '12.2mm', height: '12.2mm', background: '#ffffff', borderRadius: '0.8mm', padding: '0.3mm', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <img
                        src={lbl.qrDataUrl}
                        alt="QR"
                        style={{ width: '100%', height: '100%', display: 'block' }}
                      />
                    </div>
                    <div
                      style={{
                        fontSize: '3.6pt',
                        fontFamily: 'monospace',
                        fontWeight: '800',
                        color: '#94a3b8',
                        letterSpacing: '-0.2px',
                        marginTop: '0.3mm',
                        textAlign: 'center',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {lbl.code}
                    </div>
                  </div>

                  {/* Right Column: Brand + Product + Batch */}
                  <div style={{ width: '22.2mm', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', paddingLeft: '0.7mm', overflow: 'hidden', textAlign: 'left' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6mm', lineHeight: '1' }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'inline-block', flexShrink: 0 }}>
                        <path d="M12 2L3 7V12C3 17.5 6.8 21.7 12 23C17.2 21.7 21 17.5 21 12V7L12 2Z" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.4"/>
                        <path d="M12 6V18M7.5 9.5L16.5 14.5M16.5 9.5L7.5 14.5" stroke="#38bdf8" strokeWidth="1.6" strokeLinecap="round"/>
                        <circle cx="12" cy="12" r="2.8" fill="#10b981" stroke="#ffffff" strokeWidth="0.8"/>
                      </svg>
                      <span style={{ fontSize: '6.2pt', fontWeight: '900', color: '#ffffff', letterSpacing: '-0.2px' }}>
                        PSL <span style={{ color: '#38bdf8' }}>LABS</span>
                      </span>
                      <span style={{ fontSize: '3.6pt', fontWeight: '800', color: '#34d399', background: 'rgba(16,185,129,0.2)', padding: '0.2mm 0.6mm', borderRadius: '0.3mm', marginLeft: 'auto' }}>
                        🇵🇾 PY
                      </span>
                    </div>

                    <div style={{ fontSize: '7.2pt', fontWeight: '900', color: '#38bdf8', letterSpacing: '-0.3px', lineHeight: '1.1', marginTop: '0.2mm' }}>
                      {lbl.productName}
                    </div>

                    <div style={{ fontSize: '3.9pt', fontWeight: '600', color: '#94a3b8', lineHeight: '1.25', marginTop: '0.2mm' }}>
                      <div>LOTE: <strong style={{ color: '#f1f5f9', fontWeight: '800' }}>{lbl.batchNumber}</strong></div>
                      <div>FAB: <strong>{lbl.mfgDate}</strong> · VAL: <strong>{lbl.expDate}</strong></div>
                    </div>

                    <div style={{ fontSize: '3.3pt', fontWeight: '800', color: '#34d399', textTransform: 'uppercase', letterSpacing: '0.1px', lineHeight: '1' }}>
                      ✓ Verifique Autenticidade
                    </div>
                  </div>
                </div>
                {(idx % 5 < 4) && <div style={{ width: '2.5mm', height: '21.2mm', background: '#0b1528' }} />}
              </>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
