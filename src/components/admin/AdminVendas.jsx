import { useState, useEffect, useMemo } from 'react';
import { 
  DollarSign, 
  Plus, 
  RefreshCw, 
  CheckCircle2, 
  TrendingUp, 
  Pencil, 
  Trash2, 
  X, 
  AlertTriangle, 
  AlertCircle, 
  Search, 
  Calendar, 
  Phone, 
  User, 
  Truck, 
  Clock, 
  XCircle,
  Tag,
  Check
} from 'lucide-react';

export default function AdminVendas() {
  const [vendas, setVendas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inventory, setInventory] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Feedback Notification Toast
  const [notification, setNotification] = useState(null); // { type: 'success' | 'error', message: string }

  // Modal States
  const [editingSale, setEditingSale] = useState(null);
  const [deletingSale, setDeletingSale] = useState(null);

  // Form Lançar Nova Venda
  const [form, setForm] = useState({
    client_name: '',
    client_phone: '',
    selected_code: 'CU50',
    qty: 1,
    unit_price: 299,
    unit_cost: 25.40,
    delivery_method: 'sedex',
    status: 'Concluída',
    date: new Date().toISOString().split('T')[0]
  });

  // Form Editar Venda
  const [editForm, setEditForm] = useState({
    id: '',
    client_name: '',
    client_phone: '',
    date: '',
    delivery_method: 'sedex',
    status: 'Concluída',
    total_revenue: 0,
    total_cost: 0,
    items: []
  });

  const showToast = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification(prev => (prev?.message === message ? null : prev));
    }, 4000);
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [vendasRes, invRes] = await Promise.all([
        fetch('/api/admin/vendas').then(r => r.json()),
        fetch('/api/admin/inventory').then(r => r.json())
      ]);
      setVendas(Array.isArray(vendasRes) ? vendasRes : []);
      setInventory(Array.isArray(invRes) ? invRes : []);
    } catch (e) {
      console.error(e);
      showToast('error', 'Erro ao carregar vendas e inventário');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSelectSKU = (code) => {
    const found = inventory.find(i => i.code === code);
    if (found) {
      setForm(prev => ({
        ...prev,
        selected_code: found.code,
        unit_price: found.price_b2c || 299,
        unit_cost: found.unit_cost || 25.40
      }));
    }
  };

  // Create Sale
  const handleCreateVenda = async (e) => {
    e.preventDefault();
    if (!form.client_name || !form.qty || !form.unit_price) {
      showToast('error', 'Preencha o nome do cliente e os valores da venda');
      return;
    }

    const selectedInv = inventory.find(i => i.code === form.selected_code);
    const qty = parseInt(form.qty, 10);
    const totalRev = qty * (parseFloat(form.unit_price) || 0);
    const totalCost = qty * (parseFloat(form.unit_cost) || 0);

    const payload = {
      client_name: form.client_name.trim(),
      client_phone: form.client_phone.trim(),
      delivery_method: form.delivery_method,
      status: form.status,
      date: form.date,
      total_revenue: totalRev,
      total_cost: totalCost,
      items: [
        {
          code: form.selected_code,
          name: selectedInv ? selectedInv.name : form.selected_code,
          dosage: selectedInv ? selectedInv.dosage : '',
          qty: qty,
          unit_price: parseFloat(form.unit_price),
          unit_cost: parseFloat(form.unit_cost)
        }
      ]
    };

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/admin/vendas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (res.ok) {
        showToast('success', `Venda faturada com sucesso! Baixa de ${qty} un. efetuada no estoque.`);
        await fetchData();
        setForm(prev => ({ 
          ...prev, 
          client_name: '', 
          client_phone: '',
          date: new Date().toISOString().split('T')[0]
        }));
      } else {
        showToast('error', data.error || 'Erro ao registrar venda');
      }
    } catch (err) {
      console.error(err);
      showToast('error', 'Erro ao comunicar com o servidor');
    }
    setIsSubmitting(false);
  };

  // Open Edit Sale Modal
  const handleOpenEdit = (venda) => {
    setEditingSale(venda);
    setEditForm({
      id: venda.id,
      client_name: venda.client_name || '',
      client_phone: venda.client_phone || '',
      date: venda.date || new Date().toISOString().split('T')[0],
      delivery_method: venda.delivery_method || 'sedex',
      status: normalizeStatusName(venda.status),
      total_revenue: venda.total_revenue !== undefined ? venda.total_revenue : 0,
      total_cost: venda.total_cost !== undefined ? venda.total_cost : 0,
      items: Array.isArray(venda.items) ? JSON.parse(JSON.stringify(venda.items)) : []
    });
  };

  // Save Edit Sale
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editForm.client_name) {
      showToast('error', 'Nome do cliente é obrigatório');
      return;
    }

    const payload = {
      id: editForm.id,
      client_name: editForm.client_name.trim(),
      client_phone: editForm.client_phone.trim(),
      date: editForm.date,
      delivery_method: editForm.delivery_method,
      status: editForm.status,
      total_revenue: parseFloat(editForm.total_revenue) || 0,
      total_cost: parseFloat(editForm.total_cost) || 0,
      items: editForm.items
    };

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/admin/vendas', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (res.ok) {
        showToast('success', `Venda [${editForm.id}] atualizada com sucesso!`);
        setEditingSale(null);
        await fetchData();
      } else {
        showToast('error', data.error || 'Erro ao atualizar venda');
      }
    } catch (err) {
      console.error(err);
      showToast('error', 'Falha na comunicação com o servidor');
    }
    setIsSubmitting(false);
  };

  // Delete Sale
  const handleDeleteConfirm = async () => {
    if (!deletingSale) return;

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/admin/vendas?id=${encodeURIComponent(deletingSale.id)}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: deletingSale.id })
      });
      const data = await res.json();
      if (res.ok) {
        showToast('success', `Venda [${deletingSale.id}] excluída com sucesso!`);
        setDeletingSale(null);
        await fetchData();
      } else {
        showToast('error', data.error || 'Erro ao excluir venda');
      }
    } catch (err) {
      console.error(err);
      showToast('error', 'Falha ao comunicar com o servidor');
    }
    setIsSubmitting(false);
  };

  // Recalculate totals from items in edit modal
  const handleRecalculateEditTotals = () => {
    const rev = editForm.items.reduce((acc, it) => acc + ((parseInt(it.qty, 10) || 0) * (parseFloat(it.unit_price) || 0)), 0);
    const cost = editForm.items.reduce((acc, it) => acc + ((parseInt(it.qty, 10) || 0) * (parseFloat(it.unit_cost) || 0)), 0);
    setEditForm(prev => ({
      ...prev,
      total_revenue: Math.round(rev * 100) / 100,
      total_cost: Math.round(cost * 100) / 100
    }));
    showToast('success', 'Totais recalculados a partir dos itens.');
  };

  // Status Helper
  function normalizeStatusName(status) {
    if (!status) return 'Concluída';
    const s = String(status).toLowerCase();
    if (s === 'completed' || s === 'concluída' || s === 'concluida') return 'Concluída';
    if (s === 'pending' || s === 'pendente' || s === 'pending_pix') return 'Pendente';
    if (s === 'cancelled' || s === 'cancelada') return 'Cancelada';
    return status;
  }

  function renderStatusBadge(status) {
    const norm = normalizeStatusName(status);
    if (norm === 'Concluída') {
      return (
        <span className="inline-flex items-center gap-1 bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full text-[10px] font-bold">
          <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" />
          <span>Concluída</span>
        </span>
      );
    }
    if (norm === 'Pendente') {
      return (
        <span className="inline-flex items-center gap-1 bg-amber-950/80 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-full text-[10px] font-bold">
          <Clock className="w-2.5 h-2.5 text-amber-400" />
          <span>Pendente</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 bg-rose-950/80 text-rose-300 border border-rose-500/40 px-2 py-0.5 rounded-full text-[10px] font-bold">
        <XCircle className="w-2.5 h-2.5 text-rose-400" />
        <span>Cancelada</span>
      </span>
    );
  }

  // Filtered Sales
  const filteredVendas = useMemo(() => {
    return vendas.filter(v => {
      const normStatus = normalizeStatusName(v.status);
      const matchesStatus = 
        statusFilter === 'ALL' || normStatus === statusFilter;

      const itemsText = Array.isArray(v.items) 
        ? v.items.map(it => `${it.name} ${it.code} ${it.dosage}`).join(' ') 
        : '';

      const matchesSearch = 
        (v.id || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (v.client_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (v.client_phone || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        itemsText.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesStatus && matchesSearch;
    });
  }, [vendas, searchTerm, statusFilter]);

  // Overall Financial Metrics
  const activeSales = vendas.filter(v => normalizeStatusName(v.status) !== 'Cancelada');
  const totalFaturado = activeSales.reduce((acc, v) => acc + (parseFloat(v.total_revenue) || 0), 0);
  const totalCusto = activeSales.reduce((acc, v) => acc + (parseFloat(v.total_cost) || 0), 0);
  const totalLucro = totalFaturado - totalCusto;
  const margemMedia = totalFaturado > 0 ? ((totalLucro / totalFaturado) * 100).toFixed(1) : '0.0';

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

      {/* Header & Metrics Summary */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-emerald-400" />
            <span>Registro de Vendas, Faturamento & Pedidos</span>
          </h2>
          <p className="text-xs text-slate-400">
            Gerencie o histórico de vendas faturadas, edite registros de clientes, valores, status e baixe estoque em tempo real.
          </p>
        </div>

        {/* Financial Cards */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl px-4 py-2.5 shadow-md">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Total Faturado</span>
            <span className="text-base font-black text-white">
              R$ {totalFaturado.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl px-4 py-2.5 shadow-md">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Lucro Líquido Real</span>
            <span className="text-base font-black text-emerald-400">
              R$ {totalLucro.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl px-4 py-2.5 shadow-md">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Margem Média</span>
            <span className="text-base font-black text-amber-400">
              {margemMedia}%
            </span>
          </div>
        </div>
      </div>

      {/* Form Nova Venda */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
        <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
          <Plus className="w-4 h-4 text-emerald-400" />
          <span>Lançar Nova Venda com Baixa Automática no Estoque</span>
        </h3>

        <form onSubmit={handleCreateVenda} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div>
            <label className="block text-slate-300 mb-1 font-bold">Nome do Cliente *</label>
            <input
              type="text"
              placeholder="Ex: Dr. Lucas Silveira"
              value={form.client_name}
              onChange={(e) => setForm(prev => ({ ...prev, client_name: e.target.value }))}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-500"
              required
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1 font-medium">WhatsApp / Telefone</label>
            <input
              type="text"
              placeholder="(11) 99999-9999"
              value={form.client_phone}
              onChange={(e) => setForm(prev => ({ ...prev, client_phone: e.target.value }))}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 mb-1 font-bold">Produto / SKU *</label>
            <select
              value={form.selected_code}
              onChange={(e) => handleSelectSKU(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-bold focus:outline-none focus:border-emerald-500"
            >
              {inventory.map(item => (
                <option key={item.code} value={item.code}>
                  {item.name} ({item.dosage}) - Estq: {item.stock_qty ?? 0} un
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-300 mb-1 font-bold">Quantidade Vendida *</label>
            <input
              type="number"
              min="1"
              value={form.qty}
              onChange={(e) => setForm(prev => ({ ...prev, qty: e.target.value }))}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-bold font-mono focus:outline-none focus:border-emerald-500"
              required
            />
          </div>

          <div>
            <label className="block text-slate-300 mb-1 font-bold">Preço de Venda Unit. (R$) *</label>
            <input
              type="number"
              step="0.01"
              value={form.unit_price}
              onChange={(e) => setForm(prev => ({ ...prev, unit_price: e.target.value }))}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-emerald-400 font-bold font-mono focus:outline-none focus:border-emerald-500"
              required
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1 font-medium">Forma de Envio</label>
            <select
              value={form.delivery_method}
              onChange={(e) => setForm(prev => ({ ...prev, delivery_method: e.target.value }))}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="sedex">Sedex Correios (Brasil)</option>
              <option value="uber">Uber Moto Flash SP</option>
              <option value="retirada">Retirada em Mãos SP</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-300 mb-1 font-bold">Status da Venda</label>
            <select
              value={form.status}
              onChange={(e) => setForm(prev => ({ ...prev, status: e.target.value }))}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="Concluída">Concluída (Pago & Faturado)</option>
              <option value="Pendente">Pendente (Aguardando PIX)</option>
              <option value="Cancelada">Cancelada</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-400 mb-1 font-medium">Data do Pedido</label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm(prev => ({ ...prev, date: e.target.value }))}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="sm:col-span-2 lg:col-span-4 flex items-center justify-end pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 active:scale-98 text-white font-bold rounded-xl transition cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Processando Venda...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Faturar Venda & Baixar Estoque</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Histórico de Vendas */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
        {/* Table Top Toolbar */}
        <div className="p-4 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-950/40">
          <div className="flex items-center gap-3">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Vendas Faturadas no Banco de Dados ({filteredVendas.length})
            </h3>
            {/* Status Pills */}
            <div className="flex items-center gap-1">
              {['ALL', 'Concluída', 'Pendente', 'Cancelada'].map(st => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition cursor-pointer ${
                    statusFilter === st
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {st === 'ALL' ? 'Todas' : st}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Buscar cliente, ID ou SKU..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-slate-950 border border-slate-800 text-white text-xs rounded-xl pl-8 pr-3 py-1.5 focus:outline-none focus:border-emerald-500 w-48 sm:w-56"
              />
            </div>

            <button
              onClick={fetchData}
              disabled={loading}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-300 rounded-lg transition"
              title="Recarregar Vendas"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-emerald-400' : ''}`} />
            </button>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/90 text-slate-400 uppercase font-mono text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Venda ID / Data</th>
                <th className="py-3 px-3">Cliente</th>
                <th className="py-3 px-3">Itens / Composto</th>
                <th className="py-3 px-3">Envio</th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 px-3">Faturamento</th>
                <th className="py-3 px-3">Lucro Líquido</th>
                <th className="py-3 px-3">Margem %</th>
                <th className="py-3 px-4 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {loading && vendas.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-emerald-400" />
                    <span>Carregando histórico de vendas...</span>
                  </td>
                </tr>
              ) : filteredVendas.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-10 text-center text-slate-500">
                    Nenhuma venda encontrada com os filtros selecionados.
                  </td>
                </tr>
              ) : (
                filteredVendas.map(v => (
                  <tr key={v.id} className="hover:bg-slate-800/40 transition">
                    {/* ID & Date */}
                    <td className="py-3 px-4">
                      <span className="font-bold text-white block font-mono">{v.id}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{v.date}</span>
                    </td>

                    {/* Client */}
                    <td className="py-3 px-3">
                      <span className="font-bold text-white block">{v.client_name}</span>
                      {v.client_phone && (
                        <a 
                          href={`https://wa.me/55${v.client_phone.replace(/\D/g, '')}`} 
                          target="_blank" 
                          rel="noreferrer"
                          className="text-slate-400 hover:text-emerald-400 text-[10px] font-mono transition flex items-center gap-1"
                        >
                          <Phone className="w-2.5 h-2.5 text-emerald-400" />
                          <span>{v.client_phone}</span>
                        </a>
                      )}
                    </td>

                    {/* Items */}
                    <td className="py-3 px-3 text-slate-300">
                      {Array.isArray(v.items) && v.items.length > 0 ? (
                        v.items.map((it, idx) => (
                          <div key={idx} className="text-[11px] flex items-center gap-1">
                            <span className="font-bold text-emerald-400 font-mono">{it.qty}x</span>
                            <span>{it.name || it.code}</span>
                            {it.dosage && <span className="text-slate-400 font-mono">({it.dosage})</span>}
                          </div>
                        ))
                      ) : (
                        <span className="text-slate-500 italic">Itens diversos</span>
                      )}
                    </td>

                    {/* Delivery */}
                    <td className="py-3 px-3">
                      <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded text-[10px] font-bold uppercase">
                        {v.delivery_method}
                      </span>
                    </td>

                    {/* Status Badge */}
                    <td className="py-3 px-3 text-center">
                      {renderStatusBadge(v.status)}
                    </td>

                    {/* Revenue */}
                    <td className="py-3 px-3 font-mono font-bold text-white">
                      R$ {Number(v.total_revenue || 0).toFixed(2)}
                    </td>

                    {/* Profit */}
                    <td className="py-3 px-3 font-mono font-bold text-emerald-400">
                      R$ {Number(v.gross_profit || 0).toFixed(2)}
                    </td>

                    {/* Margin */}
                    <td className="py-3 px-3 font-mono">
                      <span className="bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded text-[11px] font-bold">
                        {v.margin_percent || 0}%
                      </span>
                    </td>

                    {/* Actions: Edit & Delete */}
                    <td className="py-3 px-4 text-center">
                      <div className="inline-flex items-center gap-1 justify-center">
                        <button
                          onClick={() => handleOpenEdit(v)}
                          className="p-1.5 bg-slate-800 hover:bg-emerald-600 hover:text-white text-slate-300 rounded-lg transition cursor-pointer"
                          title="Editar Venda"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => setDeletingSale(v)}
                          className="p-1.5 bg-slate-800 hover:bg-rose-600 hover:text-white text-slate-400 rounded-lg transition cursor-pointer"
                          title="Excluir Venda"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODAL: Editar Venda                                                       */}
      {/* ========================================================================= */}
      {editingSale && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-emerald-950/80 border border-emerald-500/30 rounded-xl text-emerald-400">
                  <Pencil className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Editar Venda #{editForm.id}</h3>
                  <p className="text-[11px] text-slate-400">Altere informações do cliente, valores e status de pagamento</p>
                </div>
              </div>
              <button
                onClick={() => setEditingSale(null)}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleEditSubmit} className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Cliente */}
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Nome do Cliente *</label>
                  <input
                    type="text"
                    value={editForm.client_name}
                    onChange={(e) => setEditForm(prev => ({ ...prev, client_name: e.target.value }))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-medium focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>

                {/* Telefone */}
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Telefone / WhatsApp</label>
                  <input
                    type="text"
                    value={editForm.client_phone}
                    onChange={(e) => setEditForm(prev => ({ ...prev, client_phone: e.target.value }))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                {/* Data */}
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Data da Venda</label>
                  <input
                    type="date"
                    value={editForm.date}
                    onChange={(e) => setEditForm(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                {/* Forma de Envio */}
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Forma de Envio</label>
                  <select
                    value={editForm.delivery_method}
                    onChange={(e) => setEditForm(prev => ({ ...prev, delivery_method: e.target.value }))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="sedex">Sedex Correios (Brasil)</option>
                    <option value="uber">Uber Moto Flash SP</option>
                    <option value="retirada">Retirada em Mãos SP</option>
                  </select>
                </div>

                {/* Status */}
                <div className="sm:col-span-2">
                  <label className="block text-slate-300 font-bold mb-1">Status da Venda</label>
                  <select
                    value={editForm.status}
                    onChange={(e) => setEditForm(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-bold focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Concluída">Concluída (Pago & Faturado)</option>
                    <option value="Pendente">Pendente (Aguardando Confirmação)</option>
                    <option value="Cancelada">Cancelada</option>
                  </select>
                </div>

                {/* Total Revenue */}
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Faturamento Total (R$) *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editForm.total_revenue}
                    onChange={(e) => setEditForm(prev => ({ ...prev, total_revenue: e.target.value }))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-emerald-400 font-bold font-mono focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>

                {/* Total Cost */}
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Custo Total CMV (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editForm.total_cost}
                    onChange={(e) => setEditForm(prev => ({ ...prev, total_cost: e.target.value }))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-300 font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Profit & Margin Preview */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block">Lucro Calculado:</span>
                  <span className="font-mono font-bold text-emerald-400">
                    R$ {(parseFloat(editForm.total_revenue || 0) - parseFloat(editForm.total_cost || 0)).toFixed(2)}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block">Margem Líquida:</span>
                  <span className="font-mono font-bold text-amber-400">
                    {parseFloat(editForm.total_revenue) > 0 
                      ? (((parseFloat(editForm.total_revenue) - parseFloat(editForm.total_cost || 0)) / parseFloat(editForm.total_revenue)) * 100).toFixed(1)
                      : '0.0'}%
                  </span>
                </div>
                {Array.isArray(editForm.items) && editForm.items.length > 0 && (
                  <button
                    type="button"
                    onClick={handleRecalculateEditTotals}
                    className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] rounded-lg transition font-semibold"
                  >
                    Recalcular dos Itens
                  </button>
                )}
              </div>

              {/* Items List in Sale */}
              {Array.isArray(editForm.items) && editForm.items.length > 0 && (
                <div className="space-y-2 pt-2">
                  <label className="block text-slate-400 font-bold text-[11px] uppercase tracking-wider">
                    Itens Inclusos na Venda ({editForm.items.length})
                  </label>
                  <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                    {editForm.items.map((it, idx) => (
                      <div key={idx} className="bg-slate-950 border border-slate-800 rounded-xl p-2.5 flex items-center justify-between gap-2 text-xs">
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-white truncate">{it.name || it.code}</p>
                          <p className="text-[10px] text-slate-500 font-mono">
                            SKU: {it.code} {it.dosage ? `| ${it.dosage}` : ''}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-16">
                            <label className="block text-[9px] text-slate-500">Qtd</label>
                            <input
                              type="number"
                              min="1"
                              value={it.qty}
                              onChange={(e) => {
                                const val = parseInt(e.target.value, 10) || 1;
                                setEditForm(prev => {
                                  const updated = [...prev.items];
                                  updated[idx] = { ...updated[idx], qty: val };
                                  return { ...prev, items: updated };
                                });
                              }}
                              className="w-full bg-slate-900 border border-slate-700 rounded px-1.5 py-0.5 text-center font-mono text-white text-xs"
                            />
                          </div>
                          <div className="w-20">
                            <label className="block text-[9px] text-slate-500">Preço (R$)</label>
                            <input
                              type="number"
                              step="0.01"
                              value={it.unit_price}
                              onChange={(e) => {
                                const val = parseFloat(e.target.value) || 0;
                                setEditForm(prev => {
                                  const updated = [...prev.items];
                                  updated[idx] = { ...updated[idx], unit_price: val };
                                  return { ...prev, items: updated };
                                });
                              }}
                              className="w-full bg-slate-900 border border-slate-700 rounded px-1.5 py-0.5 text-right font-mono text-emerald-400 text-xs"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Modal Actions */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setEditingSale(null)}
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
                      <span>Salvar Venda</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: Excluir Venda (Confirmação)                                         */}
      {/* ========================================================================= */}
      {deletingSale && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-rose-900/50 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-5 border-b border-slate-800 bg-rose-950/30 flex items-center gap-3">
              <div className="p-2.5 bg-rose-900/50 border border-rose-500/40 rounded-xl text-rose-300">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Excluir Registro de Venda</h3>
                <p className="text-[11px] text-rose-300/80">Esta operação removerá a venda do histórico e DRE</p>
              </div>
            </div>

            <div className="p-5 text-xs text-slate-300 space-y-3">
              <p>
                Tem certeza que deseja excluir permanentemente a venda:
              </p>
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-white font-mono">{deletingSale.id}</span>
                  <span className="text-emerald-400 font-mono font-bold">
                    R$ {Number(deletingSale.total_revenue || 0).toFixed(2)}
                  </span>
                </div>
                <p className="text-slate-400 text-[11px]">Cliente: <strong className="text-white">{deletingSale.client_name}</strong></p>
                <p className="text-slate-500 text-[10px] font-mono mt-0.5">Data: {deletingSale.date}</p>
              </div>
            </div>

            <div className="p-4 border-t border-slate-800 bg-slate-950/40 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setDeletingSale(null)}
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
                    <span>Sim, Excluir Venda</span>
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
