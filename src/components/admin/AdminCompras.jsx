import { useState, useEffect } from 'react';
import { ShoppingCart, Plus, RefreshCw, CheckCircle2 } from 'lucide-react';

export default function AdminCompras() {
  const [compras, setCompras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inventory, setInventory] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const fetchData = async () => {
    setLoading(true);
    try {
      const [comprasRes, invRes] = await Promise.all([
        fetch('/api/admin/compras').then(r => r.json()),
        fetch('/api/admin/inventory').then(r => r.json())
      ]);
      setCompras(comprasRes);
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

      {/* Form Nova Compra */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
        <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
          <Plus className="w-4 h-4 text-emerald-400" />
          <span>Registrar Nova Compra / Entrada de Lote</span>
        </h3>

        <form onSubmit={handleCreateCompra} className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <label className="block text-slate-400 mb-1 font-bold">Selecionar SKU / Peptídeo:</label>
            <select
              value={form.code}
              onChange={(e) => handleSelectSKU(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-bold"
            >
              {inventory.map(item => (
                <option key={item.code} value={item.code}>
                  {item.name} ({item.dosage}) - {item.code}
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

          <div>
            <label className="block text-slate-400 mb-1 font-bold">Fornecedor:</label>
            <input
              type="text"
              value={form.supplier}
              onChange={(e) => setForm(prev => ({ ...prev, supplier: e.target.value }))}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
            />
          </div>

          <div className="sm:col-span-3">
            <label className="block text-slate-400 mb-1">Notas / Observações:</label>
            <input
              type="text"
              placeholder="Ex: Lote importado com frete expresso e gelo"
              value={form.notes}
              onChange={(e) => setForm(prev => ({ ...prev, notes: e.target.value }))}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
            />
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-10 bg-emerald-600 hover:bg-emerald-500 active:scale-98 text-white font-bold rounded-xl transition cursor-pointer flex items-center justify-center gap-2 shadow"
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

        <div className="overflow-x-auto">
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
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {compras.map(c => (
                <tr key={c.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-3 px-4">
                    <span className="font-bold text-white block">{c.id}</span>
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
