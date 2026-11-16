import { useState, useEffect } from 'react';
import { DollarSign, Plus, RefreshCw, CheckCircle2, TrendingUp } from 'lucide-react';

export default function AdminVendas() {
  const [vendas, setVendas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inventory, setInventory] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    client_name: '',
    client_phone: '',
    selected_code: 'CU50',
    qty: 1,
    unit_price: 299,
    unit_cost: 25.40,
    delivery_method: 'sedex'
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [vendasRes, invRes] = await Promise.all([
        fetch('/api/admin/vendas').then(r => r.json()),
        fetch('/api/admin/inventory').then(r => r.json())
      ]);
      setVendas(vendasRes);
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
        selected_code: found.code,
        unit_price: found.price_b2c || 299,
        unit_cost: found.unit_cost || 25.40
      }));
    }
  };

  const handleCreateVenda = async (e) => {
    e.preventDefault();
    if (!form.client_name || !form.qty || !form.unit_price) {
      alert("Preencha o nome do cliente e os valores da venda");
      return;
    }

    const selectedInv = inventory.find(i => i.code === form.selected_code);
    const qty = parseInt(form.qty, 10);
    const totalRev = qty * (parseFloat(form.unit_price) || 0);
    const totalCost = qty * (parseFloat(form.unit_cost) || 0);

    const payload = {
      client_name: form.client_name,
      client_phone: form.client_phone,
      delivery_method: form.delivery_method,
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
      if (res.ok) {
        alert("Venda faturada e registrada com sucesso! Baixa de estoque efetuada.");
        fetchData();
        setForm(prev => ({ ...prev, client_name: '', client_phone: '' }));
      } else {
        alert("Erro ao registrar venda");
      }
    } catch (err) {
      console.error(err);
      alert("Erro ao comunicar com o servidor");
    }
    setIsSubmitting(false);
  };

  const totalFaturado = vendas.reduce((acc, v) => acc + (parseFloat(v.total_revenue) || 0), 0);
  const totalLucro = vendas.reduce((acc, v) => acc + (parseFloat(v.gross_profit) || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-emerald-400" />
            <span>Registro de Vendas & Faturamento</span>
          </h2>
          <p className="text-xs text-slate-400">
            Lance pedidos faturados. O sistema dá baixa no estoque do banco de dados e calcula a margem líquida da operação.
          </p>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-right">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Total Faturado:</span>
            <span className="text-lg font-black text-white">
              R$ {totalFaturado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Lucro Real:</span>
            <span className="text-lg font-black text-emerald-400">
              R$ {totalLucro.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </div>

      {/* Form Nova Venda */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
        <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
          <Plus className="w-4 h-4 text-emerald-400" />
          <span>Lançar Nova Venda com Baixa de Estoque</span>
        </h3>

        <form onSubmit={handleCreateVenda} className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <label className="block text-slate-400 mb-1 font-bold">Nome do Cliente:</label>
            <input
              type="text"
              placeholder="Ex: Dr. Lucas Silveira"
              value={form.client_name}
              onChange={(e) => setForm(prev => ({ ...prev, client_name: e.target.value }))}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
              required
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1">WhatsApp / Telefone:</label>
            <input
              type="text"
              placeholder="(11) 99999-9999"
              value={form.client_phone}
              onChange={(e) => setForm(prev => ({ ...prev, client_phone: e.target.value }))}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1 font-bold">Produto / SKU:</label>
            <select
              value={form.selected_code}
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
            <label className="block text-slate-400 mb-1 font-bold">Quantidade Vendida:</label>
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
            <label className="block text-slate-400 mb-1 font-bold">Preço de Venda Unit. (R$):</label>
            <input
              type="number"
              step="0.01"
              value={form.unit_price}
              onChange={(e) => setForm(prev => ({ ...prev, unit_price: e.target.value }))}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-bold"
              required
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Forma de Envio:</label>
            <select
              value={form.delivery_method}
              onChange={(e) => setForm(prev => ({ ...prev, delivery_method: e.target.value }))}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
            >
              <option value="sedex">Sedex Correios (Brasil)</option>
              <option value="uber">Uber Moto Flash SP</option>
              <option value="retirada">Retirada em Mãos SP</option>
            </select>
          </div>

          <div className="sm:col-span-2 flex items-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-10 bg-emerald-600 hover:bg-emerald-500 active:scale-98 text-white font-bold rounded-xl transition cursor-pointer flex items-center justify-center gap-2 shadow"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isSubmitting ? 'Processando...' : 'Faturar Venda & Baixar Estoque'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Histórico de Vendas */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-lg">
        <div className="p-4 border-b border-slate-800 flex justify-between items-center">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Vendas Faturadas no Banco de Dados
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
                <th className="py-3 px-4">Venda ID / Data</th>
                <th className="py-3 px-3">Cliente</th>
                <th className="py-3 px-3">Itens / Composto</th>
                <th className="py-3 px-3">Envio</th>
                <th className="py-3 px-3">Faturamento</th>
                <th className="py-3 px-3">Lucro Líquido</th>
                <th className="py-3 px-4">Margem %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {vendas.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500">
                    Nenhuma venda registrada ainda. Realize a primeira venda pelo formulário acima!
                  </td>
                </tr>
              ) : (
                vendas.map(v => (
                  <tr key={v.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3 px-4">
                      <span className="font-bold text-white block">{v.id}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{v.date}</span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-bold text-white block">{v.client_name}</span>
                      {v.client_phone && <span className="text-slate-400 text-[10px]">{v.client_phone}</span>}
                    </td>
                    <td className="py-3 px-3 text-slate-300">
                      {Array.isArray(v.items) && v.items.length > 0 
                        ? v.items.map((it, idx) => (
                            <div key={idx} className="text-[11px]">
                              {it.qty}x {it.name} ({it.dosage || it.code})
                            </div>
                          ))
                        : 'Itens diversos'}
                    </td>
                    <td className="py-3 px-3">
                      <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded text-[10px] font-bold uppercase">
                        {v.delivery_method}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-white">
                      R$ {Number(v.total_revenue || 0).toFixed(2)}
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-emerald-400">
                      R$ {Number(v.gross_profit || 0).toFixed(2)}
                    </td>
                    <td className="py-3 px-4 font-mono">
                      <span className="bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded text-[11px] font-bold">
                        {v.margin_percent || 0}%
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
