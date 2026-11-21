import { useState, useEffect, useMemo } from 'react';
import { 
  Package, 
  Search, 
  Plus, 
  Minus, 
  Check, 
  RefreshCw, 
  AlertTriangle, 
  Zap, 
  Pencil, 
  Trash2, 
  X, 
  CheckCircle2, 
  AlertCircle, 
  Filter,
  Layers,
  DollarSign
} from 'lucide-react';

const CATEGORIES = [
  'Metabolismo & Shape',
  'Regeneração & Articulações',
  'Estética & Pele',
  'Longevidade & Biohacking',
  'Cérebro & Foco',
  'Massa Magra & GH',
  'Imunidade & Vitalidade'
];

export default function AdminStock() {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [savingCode, setSavingCode] = useState(null);
  const [qtyInputs, setQtyInputs] = useState({});

  // Feedback Notification Toast
  const [notification, setNotification] = useState(null); // { type: 'success' | 'error', message: string }

  // Modal States
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deletingItem, setDeletingItem] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form States
  const [createForm, setCreateForm] = useState({
    name: '',
    code: '',
    dosage: '',
    category: CATEGORIES[0],
    unit_cost: '',
    price_b2c: '',
    price_b2b: '',
    stock_qty: '0',
    min_stock: '5',
    is_ready_sp: false
  });

  const [editForm, setEditForm] = useState({
    name: '',
    code: '',
    dosage: '',
    category: CATEGORIES[0],
    unit_cost: '',
    price_b2c: '',
    price_b2b: '',
    stock_qty: '0',
    min_stock: '5',
    is_ready_sp: false
  });

  const showToast = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification(prev => (prev?.message === message ? null : prev));
    }, 4000);
  };

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/inventory');
      if (!res.ok) throw new Error('Falha ao buscar estoque');
      const data = await res.json();
      setInventory(Array.isArray(data) ? data : []);
      const initialMap = {};
      (Array.isArray(data) ? data : []).forEach(item => {
        initialMap[item.code] = item.stock_qty;
      });
      setQtyInputs(initialMap);
    } catch (e) {
      console.error(e);
      showToast('error', 'Erro ao carregar dados do estoque.');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  // Quick quantity update
  const handleUpdateQty = async (code, newQty) => {
    const val = parseInt(newQty, 10);
    if (isNaN(val) || val < 0) return;

    setSavingCode(code);
    try {
      const res = await fetch('/api/admin/inventory', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          qty: val,
          is_ready_sp: val > 0
        })
      });
      if (res.ok) {
        setInventory(prev => prev.map(item => 
          item.code === code ? { ...item, stock_qty: val, is_ready_sp: val > 0 } : item
        ));
        showToast('success', `Estoque de [${code}] atualizado para ${val} un.`);
      } else {
        showToast('error', `Erro ao atualizar quantidade de ${code}`);
      }
    } catch (e) {
      console.error(e);
      showToast('error', 'Erro na requisição ao servidor');
    }
    setSavingCode(null);
  };

  const handleQuickAdjust = (code, delta) => {
    const current = qtyInputs[code] ?? 0;
    const nextVal = Math.max(0, current + delta);
    setQtyInputs(prev => ({ ...prev, [code]: nextVal }));
    handleUpdateQty(code, nextVal);
  };

  // Open Edit Modal
  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setEditForm({
      name: item.name || '',
      code: item.code || '',
      dosage: item.dosage || '',
      category: item.category || CATEGORIES[0],
      unit_cost: item.unit_cost !== undefined ? String(item.unit_cost) : '',
      price_b2c: item.price_b2c !== undefined ? String(item.price_b2c) : '',
      price_b2b: item.price_b2b !== undefined ? String(item.price_b2b) : '',
      stock_qty: item.stock_qty !== undefined ? String(item.stock_qty) : '0',
      min_stock: item.min_stock !== undefined ? String(item.min_stock) : '5',
      is_ready_sp: Boolean(item.is_ready_sp)
    });
  };

  // Submit Create Item
  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!createForm.name || !createForm.code || !createForm.dosage) {
      showToast('error', 'Preencha o Nome, SKU e Dosagem do composto.');
      return;
    }

    const payload = {
      name: createForm.name.trim(),
      code: createForm.code.trim().toUpperCase(),
      dosage: createForm.dosage.trim(),
      category: createForm.category,
      unit_cost: parseFloat(createForm.unit_cost) || 0,
      price_b2c: parseFloat(createForm.price_b2c) || 0,
      price_b2b: parseFloat(createForm.price_b2b) || 0,
      stock_qty: parseInt(createForm.stock_qty, 10) || 0,
      min_stock: parseInt(createForm.min_stock, 10) || 5,
      is_ready_sp: Boolean(createForm.is_ready_sp)
    };

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/admin/inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (res.ok) {
        showToast('success', `Item ${payload.name} (${payload.code}) cadastrado com sucesso!`);
        setIsCreateModalOpen(false);
        setCreateForm({
          name: '',
          code: '',
          dosage: '',
          category: CATEGORIES[0],
          unit_cost: '',
          price_b2c: '',
          price_b2b: '',
          stock_qty: '0',
          min_stock: '5',
          is_ready_sp: false
        });
        await fetchInventory();
      } else {
        showToast('error', data.error || 'Erro ao cadastrar novo item');
      }
    } catch (err) {
      console.error(err);
      showToast('error', 'Falha na comunicação com o servidor');
    }
    setIsSubmitting(false);
  };

  // Submit Edit Item
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editForm.name || !editForm.code || !editForm.dosage) {
      showToast('error', 'Preencha os campos obrigatórios.');
      return;
    }

    const payload = {
      code: editingItem.code, // Original code identifier
      new_code: editForm.code.trim().toUpperCase(),
      name: editForm.name.trim(),
      dosage: editForm.dosage.trim(),
      category: editForm.category,
      unit_cost: parseFloat(editForm.unit_cost) || 0,
      price_b2c: parseFloat(editForm.price_b2c) || 0,
      price_b2b: parseFloat(editForm.price_b2b) || 0,
      stock_qty: parseInt(editForm.stock_qty, 10) || 0,
      min_stock: parseInt(editForm.min_stock, 10) || 5,
      is_ready_sp: Boolean(editForm.is_ready_sp)
    };

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/admin/inventory', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (res.ok) {
        showToast('success', `Item [${payload.name}] atualizado com sucesso!`);
        setEditingItem(null);
        await fetchInventory();
      } else {
        showToast('error', data.error || 'Erro ao atualizar item');
      }
    } catch (err) {
      console.error(err);
      showToast('error', 'Falha na comunicação com o servidor');
    }
    setIsSubmitting(false);
  };

  // Confirm Delete Item
  const handleDeleteConfirm = async () => {
    if (!deletingItem) return;

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/admin/inventory?code=${encodeURIComponent(deletingItem.code)}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: deletingItem.code })
      });
      const data = await res.json();
      if (res.ok) {
        showToast('success', `Item ${deletingItem.name} (${deletingItem.code}) excluído.`);
        setDeletingItem(null);
        await fetchInventory();
      } else {
        showToast('error', data.error || 'Erro ao excluir item');
      }
    } catch (err) {
      console.error(err);
      showToast('error', 'Falha ao comunicar com o servidor');
    }
    setIsSubmitting(false);
  };

  // Filtered Inventory
  const filtered = useMemo(() => {
    return inventory.filter(item => {
      const matchesSearch = 
        (item.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.code || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.category || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.dosage || '').toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory = 
        selectedCategory === 'ALL' || item.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [inventory, searchTerm, selectedCategory]);

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts = { ALL: inventory.length };
    CATEGORIES.forEach(cat => {
      counts[cat] = inventory.filter(i => i.category === cat).length;
    });
    return counts;
  }, [inventory]);

  return (
    <div className="space-y-6 relative">
      {/* Toast Notification */}
      {notification && (
        <div 
          className={`fixed top-4 right-4 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-2xl backdrop-blur-md border text-xs font-bold transition-all animate-in slide-in-from-top-2 duration-200 ${
            notification.type === 'success' 
              ? 'bg-emerald-950/90 border-emerald-500/50 text-emerald-200 shadow-emerald-950/50' 
              : 'bg-rose-950/90 border-rose-500/50 text-rose-200 shadow-rose-950/50'
          }`}
        >
          {notification.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          )}
          <span>{notification.message}</span>
          <button 
            onClick={() => setNotification(null)}
            className="ml-2 text-slate-400 hover:text-white transition p-0.5"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Header & Main Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Package className="w-5 h-5 text-emerald-400" />
            <span>Controle Físico de Estoque & Catálogo Completo</span>
          </h2>
          <p className="text-xs text-slate-400">
            Cadastre novos compostos, edite SKUs, preços B2C/B2B e ajuste quantidades para pronta entrega imediata SP.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Button: Cadastrar Novo Item */}
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-3.5 py-2 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-lg shadow-emerald-950/50 hover:shadow-emerald-900/60 active:scale-98 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Cadastrar Novo Item</span>
          </button>

          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Buscar SKU, composto ou dose..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-slate-900 border border-slate-800 text-white text-xs rounded-xl pl-9 pr-8 py-2 focus:outline-none focus:border-emerald-500 w-56 sm:w-64 transition"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Reload Button */}
          <button
            onClick={fetchInventory}
            disabled={loading}
            className="p-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 border border-slate-800 rounded-xl text-slate-300 hover:text-white transition cursor-pointer"
            title="Recarregar Estoque do Banco de Dados"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-emerald-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* Category Pills Filter */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-[11px]">
        <button
          onClick={() => setSelectedCategory('ALL')}
          className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
            selectedCategory === 'ALL'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/40'
              : 'bg-slate-900/90 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          <Layers className="w-3 h-3" />
          <span>Todos</span>
          <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
            selectedCategory === 'ALL' ? 'bg-emerald-800 text-emerald-100' : 'bg-slate-800 text-slate-400'
          }`}>
            {categoryCounts.ALL || 0}
          </span>
        </button>

        {CATEGORIES.map(cat => {
          const count = categoryCounts[cat] || 0;
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/40'
                  : 'bg-slate-900/90 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              <span>{cat}</span>
              {count > 0 && (
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                  isActive ? 'bg-emerald-800 text-emerald-100' : 'bg-slate-800 text-slate-400'
                }`}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Table / Empty State */}
      {loading && inventory.length === 0 ? (
        <div className="p-16 text-center text-slate-400 bg-slate-900/40 border border-slate-800 rounded-3xl">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-3 text-emerald-400" />
          <p className="text-sm font-medium">Sincronizando estoque com a base de dados...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-12 text-center text-slate-400 bg-slate-900 border border-slate-800 rounded-3xl">
          <AlertCircle className="w-8 h-8 mx-auto mb-2 text-slate-500" />
          <p className="text-sm font-bold text-white mb-1">Nenhum peptídeo encontrado</p>
          <p className="text-xs text-slate-500 mb-4">
            Tente redefinir os filtros de busca ou cadastre um novo item no botão acima.
          </p>
          <button
            onClick={() => { setSearchTerm(''); setSelectedCategory('ALL'); }}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs transition font-semibold"
          >
            Limpar Filtros
          </button>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/90 text-slate-400 uppercase font-mono text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Composto / Peptídeo</th>
                  <th className="py-3 px-3">SKU</th>
                  <th className="py-3 px-3">Dosagem</th>
                  <th className="py-3 px-3">Linha / Categoria</th>
                  <th className="py-3 px-3">Custo Unit.</th>
                  <th className="py-3 px-3">Venda Varejo</th>
                  <th className="py-3 px-3">Caixa B2B</th>
                  <th className="py-3 px-3 text-center">Status no Site</th>
                  <th className="py-3 px-3 text-center">Estoque Físico</th>
                  <th className="py-3 px-4 text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-sans">
                {filtered.map(item => {
                  const currentQty = qtyInputs[item.code] ?? item.stock_qty ?? 0;
                  const isReady = currentQty > 0;
                  const isSaving = savingCode === item.code;
                  const isLowStock = currentQty <= (item.min_stock || 5) && currentQty > 0;

                  return (
                    <tr key={item.code} className="hover:bg-slate-800/40 transition">
                      {/* Name */}
                      <td className="py-3 px-4 font-bold text-white">
                        <div className="flex items-center gap-1.5">
                          <span>{item.name}</span>
                          {isLowStock && (
                            <span title="Estoque baixo (próximo do limite de segurança)">
                              <AlertTriangle className="w-3 h-3 text-amber-400" />
                            </span>
                          )}
                        </div>
                      </td>

                      {/* SKU */}
                      <td className="py-3 px-3 font-mono font-bold text-slate-300">
                        {item.code}
                      </td>

                      {/* Dosage */}
                      <td className="py-3 px-3">
                        <span className="bg-slate-800 text-slate-200 px-2 py-0.5 rounded text-[11px] font-bold border border-slate-700/50">
                          {item.dosage}
                        </span>
                      </td>

                      {/* Category */}
                      <td className="py-3 px-3 text-slate-400 text-[11px] max-w-[140px] truncate" title={item.category}>
                        {item.category}
                      </td>

                      {/* Unit Cost */}
                      <td className="py-3 px-3 font-mono text-slate-400">
                        R$ {Number(item.unit_cost || 0).toFixed(2)}
                      </td>

                      {/* B2C Price */}
                      <td className="py-3 px-3 font-mono font-bold text-emerald-400">
                        R$ {Number(item.price_b2c || 0).toFixed(2)}
                      </td>

                      {/* B2B Price */}
                      <td className="py-3 px-3 font-mono text-amber-400 font-semibold">
                        {item.price_b2b ? `R$ ${Number(item.price_b2b).toFixed(2)}` : '-'}
                      </td>

                      {/* Status no Site */}
                      <td className="py-3 px-3 text-center">
                        {isReady ? (
                          <span className="inline-flex items-center gap-1 bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full text-[10px] font-bold">
                            <Zap className="w-2.5 h-2.5 text-emerald-400" />
                            <span>Pronta Entrega SP</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 bg-slate-800/80 text-slate-400 border border-slate-700/40 px-2 py-0.5 rounded-full text-[10px] font-bold">
                            <span>Sob Encomenda (3-5d)</span>
                          </span>
                        )}
                      </td>

                      {/* Quick Adjust +/- */}
                      <td className="py-3 px-3 text-center">
                        <div className="inline-flex items-center gap-1.5 justify-center">
                          <button
                            onClick={() => handleQuickAdjust(item.code, -1)}
                            disabled={currentQty <= 0 || isSaving}
                            className="w-6 h-6 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-200 rounded-lg flex items-center justify-center transition cursor-pointer"
                            title="Subtrair 1 frasco"
                          >
                            <Minus className="w-3 h-3" />
                          </button>

                          <input
                            type="number"
                            min="0"
                            value={currentQty}
                            onChange={(e) => {
                              const val = parseInt(e.target.value, 10) || 0;
                              setQtyInputs(prev => ({ ...prev, [item.code]: val }));
                            }}
                            onBlur={() => handleUpdateQty(item.code, currentQty)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                handleUpdateQty(item.code, currentQty);
                              }
                            }}
                            className="w-12 h-6 bg-slate-950 border border-slate-700 text-center font-mono font-bold text-white text-xs rounded-lg focus:outline-none focus:border-emerald-500"
                          />

                          <button
                            onClick={() => handleQuickAdjust(item.code, 1)}
                            disabled={isSaving}
                            className="w-6 h-6 bg-emerald-700 hover:bg-emerald-600 disabled:opacity-40 text-white rounded-lg flex items-center justify-center transition cursor-pointer"
                            title="Adicionar 1 frasco"
                          >
                            <Plus className="w-3 h-3" />
                          </button>

                          {isSaving && (
                            <span className="text-[10px] text-emerald-400 animate-pulse ml-0.5">...</span>
                          )}
                        </div>
                      </td>

                      {/* Actions: Edit & Delete */}
                      <td className="py-3 px-4 text-center">
                        <div className="inline-flex items-center gap-1 justify-center">
                          <button
                            onClick={() => handleOpenEdit(item)}
                            className="p-1.5 bg-slate-800 hover:bg-emerald-600 hover:text-white text-slate-300 rounded-lg transition cursor-pointer"
                            title="Editar Dados do Composto"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => setDeletingItem(item)}
                            className="p-1.5 bg-slate-800 hover:bg-rose-600 hover:text-white text-slate-400 rounded-lg transition cursor-pointer"
                            title="Excluir Composto do Catálogo"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: Cadastrar Novo Item                                               */}
      {/* ========================================================================= */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-emerald-950/80 border border-emerald-500/30 rounded-xl text-emerald-400">
                  <Plus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Cadastrar Novo Item no Catálogo</h3>
                  <p className="text-[11px] text-slate-400">Insira as informações do novo peptídeo e estoque inicial</p>
                </div>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleCreateSubmit} className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Nome */}
                <div className="sm:col-span-2">
                  <label className="block text-slate-300 font-bold mb-1">Nome do Peptídeo / Composto *</label>
                  <input
                    type="text"
                    placeholder="Ex: Retatrutide, GHK-Cu, BPC-157"
                    value={createForm.name}
                    onChange={(e) => setCreateForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-medium focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>

                {/* SKU / Code */}
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Código SKU *</label>
                  <input
                    type="text"
                    placeholder="Ex: RT10, CU50, BPC10"
                    value={createForm.code}
                    onChange={(e) => setCreateForm(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-mono font-bold focus:outline-none focus:border-emerald-500 uppercase"
                    required
                  />
                </div>

                {/* Dosagem */}
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Dosagem do Frasco *</label>
                  <input
                    type="text"
                    placeholder="Ex: 10mg, 50mg, 10ml"
                    value={createForm.dosage}
                    onChange={(e) => setCreateForm(prev => ({ ...prev, dosage: e.target.value }))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>

                {/* Linha / Categoria */}
                <div className="sm:col-span-2">
                  <label className="block text-slate-300 font-bold mb-1">Categoria / Linha</label>
                  <select
                    value={createForm.category}
                    onChange={(e) => setCreateForm(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-500"
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                {/* Custo Unitário R$ */}
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Custo Unitário (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={createForm.unit_cost}
                    onChange={(e) => setCreateForm(prev => ({ ...prev, unit_cost: e.target.value }))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>

                {/* Preço Venda Varejo R$ */}
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Preço Venda Varejo (R$) *</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={createForm.price_b2c}
                    onChange={(e) => setCreateForm(prev => ({ ...prev, price_b2c: e.target.value }))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-emerald-400 font-mono font-bold focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>

                {/* Preço Caixa B2B R$ */}
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Preço Caixa Fechada B2B (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={createForm.price_b2b}
                    onChange={(e) => setCreateForm(prev => ({ ...prev, price_b2b: e.target.value }))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-amber-400 font-mono font-semibold focus:outline-none focus:border-emerald-500"
                  />
                </div>

                {/* Quantidade Inicial */}
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Quantidade Inicial de Frascos</label>
                  <input
                    type="number"
                    min="0"
                    value={createForm.stock_qty}
                    onChange={(e) => {
                      const qty = e.target.value;
                      setCreateForm(prev => ({ 
                        ...prev, 
                        stock_qty: qty,
                        is_ready_sp: parseInt(qty, 10) > 0 ? true : prev.is_ready_sp
                      }));
                    }}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-mono font-bold focus:outline-none focus:border-emerald-500"
                  />
                </div>

                {/* Estoque Mínimo Alerta */}
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Estoque Mínimo de Alerta</label>
                  <input
                    type="number"
                    min="0"
                    value={createForm.min_stock}
                    onChange={(e) => setCreateForm(prev => ({ ...prev, min_stock: e.target.value }))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>

                {/* Checkbox Pronta Entrega */}
                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="create_is_ready_sp"
                    checked={createForm.is_ready_sp}
                    onChange={(e) => setCreateForm(prev => ({ ...prev, is_ready_sp: e.target.checked }))}
                    className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 bg-slate-950 border-slate-700 cursor-pointer"
                  />
                  <label htmlFor="create_is_ready_sp" className="text-slate-300 font-medium cursor-pointer flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Pronta Entrega SP (Grande SP imediata)</span>
                  </label>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl transition cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-lg shadow-emerald-950/40"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Salvando...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Cadastrar Composto</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: Editar Item                                                        */}
      {/* ========================================================================= */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-emerald-950/80 border border-emerald-500/30 rounded-xl text-emerald-400">
                  <Pencil className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Editar Composto: {editingItem.name}</h3>
                  <p className="text-[11px] text-slate-400 font-mono">SKU: {editingItem.code}</p>
                </div>
              </div>
              <button
                onClick={() => setEditingItem(null)}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleEditSubmit} className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Nome */}
                <div className="sm:col-span-2">
                  <label className="block text-slate-300 font-bold mb-1">Nome do Peptídeo *</label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-medium focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>

                {/* SKU / Code */}
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Código SKU *</label>
                  <input
                    type="text"
                    value={editForm.code}
                    onChange={(e) => setEditForm(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-mono font-bold focus:outline-none focus:border-emerald-500 uppercase"
                    required
                  />
                </div>

                {/* Dosagem */}
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Dosagem *</label>
                  <input
                    type="text"
                    value={editForm.dosage}
                    onChange={(e) => setEditForm(prev => ({ ...prev, dosage: e.target.value }))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>

                {/* Categoria */}
                <div className="sm:col-span-2">
                  <label className="block text-slate-300 font-bold mb-1">Categoria / Linha</label>
                  <select
                    value={editForm.category}
                    onChange={(e) => setEditForm(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-500"
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                {/* Custo Unitário */}
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Custo Unitário (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editForm.unit_cost}
                    onChange={(e) => setEditForm(prev => ({ ...prev, unit_cost: e.target.value }))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>

                {/* Preço B2C */}
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Preço Venda Varejo (R$) *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editForm.price_b2c}
                    onChange={(e) => setEditForm(prev => ({ ...prev, price_b2c: e.target.value }))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-emerald-400 font-mono font-bold focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>

                {/* Preço B2B */}
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Preço Caixa Fechada B2B (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editForm.price_b2b}
                    onChange={(e) => setEditForm(prev => ({ ...prev, price_b2b: e.target.value }))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-amber-400 font-mono font-semibold focus:outline-none focus:border-emerald-500"
                  />
                </div>

                {/* Quantidade Estoque */}
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Estoque Físico Atual</label>
                  <input
                    type="number"
                    min="0"
                    value={editForm.stock_qty}
                    onChange={(e) => {
                      const qty = e.target.value;
                      setEditForm(prev => ({ 
                        ...prev, 
                        stock_qty: qty,
                        is_ready_sp: parseInt(qty, 10) > 0 ? true : prev.is_ready_sp
                      }));
                    }}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-mono font-bold focus:outline-none focus:border-emerald-500"
                  />
                </div>

                {/* Estoque Mínimo */}
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Estoque Mínimo de Alerta</label>
                  <input
                    type="number"
                    min="0"
                    value={editForm.min_stock}
                    onChange={(e) => setEditForm(prev => ({ ...prev, min_stock: e.target.value }))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>

                {/* Checkbox Pronta Entrega */}
                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="edit_is_ready_sp"
                    checked={editForm.is_ready_sp}
                    onChange={(e) => setEditForm(prev => ({ ...prev, is_ready_sp: e.target.checked }))}
                    className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 bg-slate-950 border-slate-700 cursor-pointer"
                  />
                  <label htmlFor="edit_is_ready_sp" className="text-slate-300 font-medium cursor-pointer flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Pronta Entrega SP (Grande SP imediata)</span>
                  </label>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl transition cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-lg shadow-emerald-950/40"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Salvando...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Salvar Alterações</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: Excluir Item (Confirmação)                                         */}
      {/* ========================================================================= */}
      {deletingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-rose-900/50 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-5 border-b border-slate-800 bg-rose-950/30 flex items-center gap-3">
              <div className="p-2.5 bg-rose-900/50 border border-rose-500/40 rounded-xl text-rose-300">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Excluir Composto do Catálogo</h3>
                <p className="text-[11px] text-rose-300/80">Esta ação não poderá ser desfeita</p>
              </div>
            </div>

            <div className="p-5 text-xs text-slate-300 space-y-3">
              <p>
                Tem certeza que deseja excluir permanentemente o item:
              </p>
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-3">
                <p className="font-bold text-white text-sm">{deletingItem.name}</p>
                <div className="flex items-center gap-3 mt-1 text-[11px] text-slate-400">
                  <span>SKU: <strong className="text-slate-200 font-mono">{deletingItem.code}</strong></span>
                  <span>Dose: <strong className="text-slate-200">{deletingItem.dosage}</strong></span>
                  <span>Estoque: <strong className="text-slate-200">{deletingItem.stock_qty} un</strong></span>
                </div>
              </div>
              <p className="text-[11px] text-slate-400">
                O composto deixará de ser exibido na landing page e na lista de estoque administrativo.
              </p>
            </div>

            <div className="p-4 border-t border-slate-800 bg-slate-950/40 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setDeletingItem(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl transition cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                disabled={isSubmitting}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white font-bold rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-lg shadow-rose-950/50"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Excluindo...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Sim, Excluir Composto</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
