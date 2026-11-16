import { useState, useEffect } from 'react';
import { AlertOctagon, Plus, RefreshCw, CheckCircle2 } from 'lucide-react';

export default function AdminPerdas() {
  const [losses, setLosses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inventory, setInventory] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const fetchData = async () => {
    setLoading(true);
    try {
      const [lossesRes, invRes] = await Promise.all([
        fetch('/api/admin/perdas').then(r => r.json()),
        fetch('/api/admin/inventory').then(r => r.json())
      ]);
      setLosses(lossesRes);
      setInventory(invRes);
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

      {/* Form Nova Perda */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
        <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
          <Plus className="w-4 h-4 text-red-400" />
          <span>Lançar Ocorrência de Perda / Baixa</span>
        </h3>

        <form onSubmit={handleCreateLoss} className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <label className="block text-slate-400 mb-1 font-bold">Selecionar SKU / Peptídeo:</label>
            <select
              value={form.code}
              onChange={(e) => handleSelectSKU(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-bold"
            >
              {inventory.map(item => (
                <option key={item.code} value={item.code}>
                  {item.name} ({item.dosage}) - Estoque: {item.stock_qty} un
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-400 mb-1 font-bold">Quantidade de Frascos:</label>
            <input
              type="number"
              min="1"
              value={form.qty}
              onChange={(e) => setForm(prev => ({ ...prev, qty: e.target.value }))}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-bold"
              required
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1 font-bold">Motivo da Perda:</label>
            <select
              value={form.reason}
              onChange={(e) => setForm(prev => ({ ...prev, reason: e.target.value }))}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-bold"
            >
              <option value="Uso próprio">Uso próprio / Protocolo pessoal</option>
              <option value="Fornecedor não enviou">Fornecedor não enviou (Falta na remessa)</option>
              <option value="Frasco quebrado">Frasco quebrado / Avaria física</option>
              <option value="Validade expirada">Validade expirada</option>
              <option value="Amostra grátis">Amostra grátis / Médico parceiro</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-400 mb-1 font-bold">Custo Unitário (R$):</label>
            <input
              type="number"
              step="0.01"
              value={form.unit_cost}
              onChange={(e) => setForm(prev => ({ ...prev, unit_cost: e.target.value }))}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-bold"
              required
            />
          </div>

          <div className="sm:col-span-3">
            <label className="block text-slate-400 mb-1">Notas / Detalhes:</label>
            <input
              type="text"
              placeholder="Ex: Frasco quebrou durante o transporte ou retirado para teste"
              value={form.notes}
              onChange={(e) => setForm(prev => ({ ...prev, notes: e.target.value }))}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
            />
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-10 bg-red-700 hover:bg-red-600 active:scale-98 text-white font-bold rounded-xl transition cursor-pointer flex items-center justify-center gap-2 shadow"
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

        <div className="overflow-x-auto">
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
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {losses.map(l => (
                <tr key={l.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-3 px-4">
                    <span className="font-bold text-white block">{l.id}</span>
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
