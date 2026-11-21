import { useState, useEffect } from 'react';
import { ShoppingCart, Plus, RefreshCw, CheckCircle2, Pencil, Trash2, X } from 'lucide-react';

export default function AdminCompras() {
  const [compras, setCompras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inventory, setInventory] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingCompra, setEditingCompra] = useState(null);
  const [deletingCompra, setDeletingCompra] = useState(null);

  const [form, setForm] = useState({
    code: 'CU50',
    name: 'GHK-Cu',
    dosage: '50mg',
    category: 'peptide',
    qty: 10,
    unit_cost: 25.40,
    supplier: 'Fábrica Chinesa / SinoPept',
    notes: ''
  });

  const [editForm, setEditForm] = useState({
    id: '',
    code: '',
    name: '',
    dosage: '',
    category: '',
    qty: 0,
    unit_cost: 0,
    supplier: '',
    notes: '',
    date: ''
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [comprasRes, invRes] = await Promise.all([
        fetch('/api/admin/compras').then(r => r.json()),
        fetch('/api/admin/inventory').then(r => r.json())
      ]);
      setCompras(Array.isArray(comprasRes) ? comprasRes : []);
      setInventory(Array.isArray(invRes) ? invRes : []);
    } catch (e) {
      console.error(e);
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
        code: found.code,
        name: found.name,
        dosage: found.dosage,
        category: found.category,
        unit_cost: found.unit_cost || 25.00
      }));
    }
  };

  const handleCreateCompra = async (e) => {
    e.preventDefault();
    if (!form.name || !form.qty || !form.unit_cost) {
      alert("Preencha todos os campos obrigatórios");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/admin/compras', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      if (res.ok) {
        alert("Compra registrada com sucesso! Estoque incrementado automaticamente no banco de dados.");
        fetchData();
        setForm(prev => ({ ...prev, notes: '' }));
      } else {
        alert("Erro ao registrar compra");
      }
    } catch (err) {
      console.error(err);
      alert("Erro de comunicação com o servidor");
    }
    setIsSubmitting(false);
  };

  const handleOpenEdit = (compra) => {
    setEditingCompra(compra);
    setEditForm({
      id: compra.id,
      code: compra.code || '',
      name: compra.name || '',
      dosage: compra.dosage || '',
      category: compra.category || '',
      qty: compra.qty || 0,
      unit_cost: compra.unit_cost || 0,
      supplier: compra.supplier || '',
      notes: compra.notes || '',
      date: compra.date || new Date().toISOString().split('T')[0]
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/admin/compras', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm)
      });
      if (res.ok) {
        setEditingCompra(null);
        await fetchData();
      } else {
        const data = await res.json();
        alert(data.error || 'Erro ao atualizar compra');
      }
    } catch (err) {
      console.error(err);
      alert('Erro de comunicação com o servidor');
    }
    setIsSubmitting(false);
  };

  const handleDeleteCompra = async () => {
    if (!deletingCompra) return;
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/admin/compras?id=${encodeURIComponent(deletingCompra.id)}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setDeletingCompra(null);
        await fetchData();
      } else {
        const data = await res.json();
        alert(data.error || 'Erro ao excluir compra');
      }
    } catch (err) {
      console.error(err);
      alert('Erro de comunicação com o servidor');
    }
    setIsSubmitting(false);
  };

  const totalInvestido = compras.reduce((acc, c) => acc + (parseFloat(c.total_cost) || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-emerald-400" />
            <span>Entrada de Insumos & Compras (Fornecedores)</span>
          </h2>
          <p className="text-xs text-slate-400">
            Cadastre os pedidos de fábrica e compras de peptídeos. A quantidade dá entrada automática no estoque do banco de dados.
          </p>
        </div>

        <div className="text-right">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Total Compras Realizadas:</span>
          <span className="text-xl font-black text-emerald-400">
            R$ {totalInvestido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </span>
        </div>
      </div>

      {/* Formulário de Nova Compra */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl">
        <h3 className="text-xs font-bold text-white mb-4 uppercase tracking-wider flex items-center gap-2">
          <Plus className="w-4 h-4 text-emerald-400" />
          <span>Registrar Nova Compra de Lote / Insumo</span>
        </h3>

        <form onSubmit={handleCreateCompra} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
            <div>
              <label className="block text-slate-400 mb-1 font-semibold">SKU / Composto Rápido</label>
              <select
                value={form.code}
                onChange={(e) => handleSelectSKU(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-2.5 focus:border-emerald-500"
              >
                {inventory.map(i => (
                  <option key={i.code} value={i.code}>
                    {i.code} - {i.name} ({i.dosage})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Nome do Item</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-2.5 focus:border-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Dosagem / Apresentação</label>
              <input
                type="text"
                value={form.dosage}
                onChange={(e) => setForm(prev => ({ ...prev, dosage: e.target.value }))}
                className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-2.5 focus:border-emerald-500"
                placeholder="Ex: 50mg, 10mg"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Quantidade Comprada (Unidades)</label>
              <input
                type="number"
                min="1"
                value={form.qty}
                onChange={(e) => setForm(prev => ({ ...prev, qty: parseInt(e.target.value, 10) || 0 }))}
                className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-2.5 font-mono font-bold focus:border-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Custo Unitário (R$)</label>
              <input
                type="number"
                step="0.01"
                value={form.unit_cost}
                onChange={(e) => setForm(prev => ({ ...prev, unit_cost: parseFloat(e.target.value) || 0 }))}
                className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-2.5 font-mono focus:border-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Custo Total Previsto</label>
              <div className="w-full bg-slate-950 border border-slate-800 text-emerald-400 rounded-xl p-2.5 font-mono font-bold">
                R$ {(form.qty * form.unit_cost).toFixed(2)}
              </div>
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Fornecedor / Origem</label>
              <input
                type="text"
                value={form.supplier}
                onChange={(e) => setForm(prev => ({ ...prev, supplier: e.target.value }))}
                className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-2.5 focus:border-emerald-500"
                placeholder="Ex: SinoPept, Fábrica CN"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Observações / Rastreio</label>
              <input
                type="text"
                value={form.notes}
                onChange={(e) => setForm(prev => ({ ...prev, notes: e.target.value }))}
                className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-2.5 focus:border-emerald-500"
                placeholder="Ex: Código de rastreio, invoice"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-11 bg-emerald-600 hover:bg-emerald-500 active:scale-98 text-white font-bold rounded-xl transition cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/50"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isSubmitting ? 'Salvando...' : 'Dar Entrada no Estoque'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Histórico de Compras */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-lg">
        <div className="p-4 border-b border-slate-800 flex justify-between items-center">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Histórico de Compras Registradas no Banco
          </h3>
          <button
            onClick={fetchData}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Mobile View: Cards */}
        <div className="block md:hidden divide-y divide-slate-800/80">
          {compras.map(c => (
            <div key={c.id} className="p-4 space-y-2 bg-slate-900/60">
              <div className="flex justify-between items-center">
                <div>
                  <span className="font-bold text-white text-sm block">{c.name}</span>
                  <span className="text-[10px] text-slate-400 font-mono">{c.id} · {c.date}</span>
                </div>
                <span className="bg-blue-950/80 text-blue-300 border border-blue-500/30 px-2 py-0.5 rounded text-[11px] font-bold font-mono">
                  +{c.qty} un
                </span>
              </div>
              <div className="flex justify-between text-xs text-slate-400">
                <span>Custo Unit: R$ {Number(c.unit_cost || 0).toFixed(2)}</span>
                <span className="font-bold text-emerald-400 font-mono">Total: R$ {Number(c.total_cost || 0).toFixed(2)}</span>
              </div>
              {c.supplier && <div className="text-[11px] text-slate-400">Fornecedor: {c.supplier}</div>}
              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => handleOpenEdit(c)}
                  className="flex-1 py-1.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1 transition"
                >
                  <Pencil className="w-3 h-3" />
                  <span>Editar</span>
                </button>
                <button
                  type="button"
                  onClick={() => setDeletingCompra(c)}
                  className="py-1.5 px-3 bg-slate-800 hover:bg-rose-600 hover:text-white text-slate-400 text-xs rounded-xl flex items-center justify-center transition"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 uppercase font-mono text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">ID / Data</th>
                <th className="py-3 px-3">Composto</th>
                <th className="py-3 px-3">SKU / Dose</th>
                <th className="py-3 px-3">Quantidade</th>
                <th className="py-3 px-3">Custo Unit.</th>
                <th className="py-3 px-3">Total Compra</th>
                <th className="py-3 px-4">Fornecedor / Notas</th>
                <th className="py-3 px-4 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {compras.map(c => (
                <tr key={c.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white block">{c.id}</span>
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(c)}
                        className="px-2 py-0.5 bg-emerald-600/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-600 hover:text-white rounded text-[10px] font-bold flex items-center gap-1 transition"
                      >
                        <Pencil className="w-2.5 h-2.5" />
                        <span>Editar</span>
                      </button>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">{c.date}</span>
                  </td>
                  <td className="py-3 px-3 font-bold text-white">{c.name}</td>
                  <td className="py-3 px-3">
                    <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded text-[11px] font-bold">
                      {c.code} · {c.dosage}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono font-bold text-blue-400">
                    +{c.qty} un
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-400">
                    R$ {Number(c.unit_cost || 0).toFixed(2)}
                  </td>
                  <td className="py-3 px-3 font-mono font-bold text-emerald-400">
                    R$ {Number(c.total_cost || 0).toFixed(2)}
                  </td>
                  <td className="py-3 px-4 text-slate-300 text-[11px]">
                    <div>{c.supplier}</div>
                    {c.notes && <div className="text-slate-400 text-[10px]">{c.notes}</div>}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="inline-flex items-center gap-1.5 justify-center">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(c)}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition flex items-center gap-1 font-bold text-xs"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                        <span>Editar</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeletingCompra(c)}
                        className="px-2 py-1.5 bg-slate-800 hover:bg-rose-600 hover:text-white text-slate-400 rounded-lg transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Editar Compra */}
      {editingCompra && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Pencil className="w-4 h-4 text-emerald-400" />
                <span>Editar Compra #{editForm.id}</span>
              </h3>
              <button
                onClick={() => setEditingCompra(null)}
                className="p-1 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleEditSubmit} className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Nome do Item</label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-2.5"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Data</label>
                  <input
                    type="date"
                    value={editForm.date}
                    onChange={(e) => setEditForm(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-2.5"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Quantidade</label>
                  <input
                    type="number"
                    value={editForm.qty}
                    onChange={(e) => setEditForm(prev => ({ ...prev, qty: parseInt(e.target.value, 10) || 0 }))}
                    className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-2.5 font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Custo Unitário (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editForm.unit_cost}
                    onChange={(e) => setEditForm(prev => ({ ...prev, unit_cost: parseFloat(e.target.value) || 0 }))}
                    className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-2.5 font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Fornecedor</label>
                  <input
                    type="text"
                    value={editForm.supplier}
                    onChange={(e) => setEditForm(prev => ({ ...prev, supplier: e.target.value }))}
                    className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-2.5"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Observações</label>
                  <input
                    type="text"
                    value={editForm.notes}
                    onChange={(e) => setEditForm(prev => ({ ...prev, notes: e.target.value }))}
                    className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-2.5"
                  />
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingCompra(null)}
                  className="flex-1 py-2.5 bg-slate-800 text-slate-300 font-bold rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow"
                >
                  {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Excluir Compra */}
      {deletingCompra && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-sm p-6 text-center shadow-2xl">
            <Trash2 className="w-10 h-10 text-rose-500 mx-auto mb-3" />
            <h3 className="text-base font-bold text-white mb-2">Excluir Compra?</h3>
            <p className="text-xs text-slate-400 mb-6">
              Deseja realmente remover o registro de compra #{deletingCompra.id} ({deletingCompra.name})?
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setDeletingCompra(null)}
                className="flex-1 py-2.5 bg-slate-800 text-slate-300 font-bold rounded-xl text-xs"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteCompra}
                disabled={isSubmitting}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-xs shadow"
              >
                {isSubmitting ? 'Excluindo...' : 'Sim, Excluir'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
