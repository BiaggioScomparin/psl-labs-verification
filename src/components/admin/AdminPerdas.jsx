import { useState, useEffect } from 'react';
import { AlertOctagon, Plus, RefreshCw, CheckCircle2, Pencil, Trash2, X } from 'lucide-react';

export default function AdminPerdas() {
  const [losses, setLosses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inventory, setInventory] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingLoss, setEditingLoss] = useState(null);
  const [deletingLoss, setDeletingLoss] = useState(null);

  const [form, setForm] = useState({
    code: 'CU50',
    name: 'GHK-Cu',
    dosage: '50mg',
    category: 'peptide',
    qty: 1,
    unit_cost: 25.40,
    reason: 'Uso próprio',
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
    reason: '',
    notes: '',
    date: ''
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [lossesRes, invRes] = await Promise.all([
        fetch('/api/admin/perdas').then(r => r.json()),
        fetch('/api/admin/inventory').then(r => r.json())
      ]);
      setLosses(Array.isArray(lossesRes) ? lossesRes : []);
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
        unit_cost: found.unit_cost || 25.40
      }));
    }
  };

  const handleCreateLoss = async (e) => {
    e.preventDefault();
    if (!form.name || !form.qty || !form.reason) {
      alert("Preencha todos os campos obrigatórios");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/admin/perdas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      if (res.ok) {
        alert("Perda registrada com sucesso! Baixa de estoque efetuada no banco de dados.");
        fetchData();
        setForm(prev => ({ ...prev, notes: '' }));
      } else {
        alert("Erro ao registrar perda");
      }
    } catch (err) {
      console.error(err);
      alert("Erro de comunicação com o servidor");
    }
    setIsSubmitting(false);
  };

  const handleOpenEdit = (loss) => {
    setEditingLoss(loss);
    setEditForm({
      id: loss.id,
      code: loss.code || '',
      name: loss.name || '',
      dosage: loss.dosage || '',
      category: loss.category || '',
      qty: loss.qty || 0,
      unit_cost: loss.unit_cost || 0,
      reason: loss.reason || 'Uso próprio',
      notes: loss.notes || '',
      date: loss.date || new Date().toISOString().split('T')[0]
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/admin/perdas', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm)
      });
      if (res.ok) {
        setEditingLoss(null);
        await fetchData();
      } else {
        const data = await res.json();
        alert(data.error || 'Erro ao atualizar perda');
      }
    } catch (err) {
      console.error(err);
      alert('Erro de comunicação com o servidor');
    }
    setIsSubmitting(false);
  };

  const handleDeleteLoss = async () => {
    if (!deletingLoss) return;
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/admin/perdas?id=${encodeURIComponent(deletingLoss.id)}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setDeletingLoss(null);
        await fetchData();
      } else {
        const data = await res.json();
        alert(data.error || 'Erro ao excluir perda');
      }
    } catch (err) {
      console.error(err);
      alert('Erro de comunicação com o servidor');
    }
    setIsSubmitting(false);
  };

  const totalPerdas = losses.reduce((acc, l) => acc + (parseFloat(l.loss_total) || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <AlertOctagon className="w-5 h-5 text-red-400" />
            <span>Registro de Perdas, Avarias &amp; Uso Próprio</span>
          </h2>
          <p className="text-xs text-slate-400">
            Dê baixa em frascos quebrados, faltas de envio pelo fornecedor ou frascos retirados para protocolo próprio.
          </p>
        </div>

        <div className="text-right">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Prejuízo Total em Perdas:</span>
          <span className="text-xl font-black text-red-400">
            R$ {totalPerdas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </span>
        </div>
      </div>

      {/* Formulário de Registro de Perda */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl">
        <h3 className="text-xs font-bold text-white mb-4 uppercase tracking-wider flex items-center gap-2">
          <Plus className="w-4 h-4 text-red-400" />
          <span>Lançar Ocorrência de Perda / Avaria / Consumo</span>
        </h3>

        <form onSubmit={handleCreateLoss} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
            <div>
              <label className="block text-slate-400 mb-1 font-semibold">SKU / Composto Rápido</label>
              <select
                value={form.code}
                onChange={(e) => handleSelectSKU(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-2.5 focus:border-red-500"
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
                className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-2.5 focus:border-red-500"
                required
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Quantidade Perdida</label>
              <input
                type="number"
                min="1"
                value={form.qty}
                onChange={(e) => setForm(prev => ({ ...prev, qty: parseInt(e.target.value, 10) || 0 }))}
                className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-2.5 font-mono font-bold focus:border-red-500"
                required
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Motivo da Perda</label>
              <select
                value={form.reason}
                onChange={(e) => setForm(prev => ({ ...prev, reason: e.target.value }))}
                className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-2.5 focus:border-red-500"
              >
                <option value="Uso próprio">Uso próprio (Protocolo pessoal)</option>
                <option value="Frasco quebrado">Frasco quebrado / Avaria no transporte</option>
                <option value="Fornecedor não enviou">Falta na remessa do fornecedor</option>
                <option value="Vencimento / Descarte">Vencimento / Descarte técnico</option>
                <option value="Amostra grátis / Médico">Amostra grátis / Médico parceiro</option>
                <option value="Outro">Outro motivo</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Custo Unitário (R$)</label>
              <input
                type="number"
                step="0.01"
                value={form.unit_cost}
                onChange={(e) => setForm(prev => ({ ...prev, unit_cost: parseFloat(e.target.value) || 0 }))}
                className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-2.5 font-mono focus:border-red-500"
                required
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Prejuízo Total Calculado</label>
              <div className="w-full bg-slate-950 border border-slate-800 text-red-400 rounded-xl p-2.5 font-mono font-bold">
                R$ {(form.qty * form.unit_cost).toFixed(2)}
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-slate-400 mb-1 font-semibold">Observações / Detalhes</label>
              <input
                type="text"
                value={form.notes}
                onChange={(e) => setForm(prev => ({ ...prev, notes: e.target.value }))}
                className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-2.5 focus:border-red-500"
                placeholder="Ex: Frasco quebrou na chegada dos Correios"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-11 bg-red-700 hover:bg-red-600 active:scale-98 text-white font-bold rounded-xl transition cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-red-950/50"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isSubmitting ? 'Salvando...' : 'Lançar Perda'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Histórico de Perdas */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-lg">
        <div className="p-4 border-b border-slate-800 flex justify-between items-center">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Ocorrências de Perdas Registradas
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
          {losses.map(l => (
            <div key={l.id} className="p-4 space-y-2 bg-slate-900/60">
              <div className="flex justify-between items-center">
                <div>
                  <span className="font-bold text-white text-sm block">{l.name}</span>
                  <span className="text-[10px] text-slate-400 font-mono">{l.id} · {l.date}</span>
                </div>
                <span className="bg-red-950/80 text-red-300 border border-red-500/30 px-2 py-0.5 rounded text-[11px] font-bold font-mono">
                  -{l.qty} un
                </span>
              </div>
              <div className="flex justify-between text-xs text-slate-400">
                <span>Motivo: <strong className="text-slate-200">{l.reason}</strong></span>
                <span className="font-bold text-red-400 font-mono">- R$ {Number(l.loss_total || 0).toFixed(2)}</span>
              </div>
              {l.notes && <div className="text-[11px] text-slate-400 italic">"{l.notes}"</div>}
              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => handleOpenEdit(l)}
                  className="flex-1 py-1.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1 transition"
                >
                  <Pencil className="w-3 h-3" />
                  <span>Editar</span>
                </button>
                <button
                  type="button"
                  onClick={() => setDeletingLoss(l)}
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
                <th className="py-3 px-3">Motivo</th>
                <th className="py-3 px-3">Prejuízo Total</th>
                <th className="py-3 px-4">Observações</th>
                <th className="py-3 px-4 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {losses.map(l => (
                <tr key={l.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white block">{l.id}</span>
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(l)}
                        className="px-2 py-0.5 bg-emerald-600/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-600 hover:text-white rounded text-[10px] font-bold flex items-center gap-1 transition"
                      >
                        <Pencil className="w-2.5 h-2.5" />
                        <span>Editar</span>
                      </button>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">{l.date}</span>
                  </td>
                  <td className="py-3 px-3 font-bold text-white">{l.name}</td>
                  <td className="py-3 px-3">
                    <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded text-[11px] font-bold">
                      {l.code} · {l.dosage}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono font-bold text-red-400">
                    -{l.qty} un
                  </td>
                  <td className="py-3 px-3">
                    <span className="bg-red-950/80 text-red-300 border border-red-500/30 px-2 py-0.5 rounded text-[10px] font-bold">
                      {l.reason}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono font-bold text-red-400">
                    - R$ {Number(l.loss_total || 0).toFixed(2)}
                  </td>
                  <td className="py-3 px-4 text-slate-400 text-[11px]">
                    {l.notes || '—'}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="inline-flex items-center gap-1.5 justify-center">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(l)}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition flex items-center gap-1 font-bold text-xs"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                        <span>Editar</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeletingLoss(l)}
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

      {/* Modal Editar Perda */}
      {editingLoss && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Pencil className="w-4 h-4 text-emerald-400" />
                <span>Editar Perda #{editForm.id}</span>
              </h3>
              <button
                onClick={() => setEditingLoss(null)}
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
                  <label className="block text-slate-400 mb-1 font-semibold">Quantidade Perdida</label>
                  <input
                    type="number"
                    value={editForm.qty}
                    onChange={(e) => setEditForm(prev => ({ ...prev, qty: parseInt(e.target.value, 10) || 0 }))}
                    className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-2.5 font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Motivo</label>
                  <select
                    value={editForm.reason}
                    onChange={(e) => setEditForm(prev => ({ ...prev, reason: e.target.value }))}
                    className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-2.5"
                  >
                    <option value="Uso próprio">Uso próprio</option>
                    <option value="Frasco quebrado">Frasco quebrado</option>
                    <option value="Fornecedor não enviou">Fornecedor não enviou</option>
                    <option value="Vencimento / Descarte">Vencimento / Descarte</option>
                    <option value="Amostra grátis / Médico">Amostra grátis / Médico</option>
                    <option value="Outro">Outro</option>
                  </select>
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
                  onClick={() => setEditingLoss(null)}
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

      {/* Modal Excluir Perda */}
      {deletingLoss && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-sm p-6 text-center shadow-2xl">
            <Trash2 className="w-10 h-10 text-rose-500 mx-auto mb-3" />
            <h3 className="text-base font-bold text-white mb-2">Excluir Registro de Perda?</h3>
            <p className="text-xs text-slate-400 mb-6">
              Deseja realmente remover o registro de perda #{deletingLoss.id} ({deletingLoss.name})?
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setDeletingLoss(null)}
                className="flex-1 py-2.5 bg-slate-800 text-slate-300 font-bold rounded-xl text-xs"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteLoss}
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
