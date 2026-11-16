import { useState, useEffect } from 'react';
import { Package, Search, Plus, Minus, Check, RefreshCw, AlertTriangle, Zap } from 'lucide-react';

export default function AdminStock() {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [savingCode, setSavingCode] = useState(null);
  const [qtyInputs, setQtyInputs] = useState({});

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/inventory');
      const data = await res.json();
      setInventory(data);
      const initialMap = {};
      data.forEach(item => {
        initialMap[item.code] = item.stock_qty;
      });
      setQtyInputs(initialMap);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchInventory();
  }, []);

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
      }
    } catch (e) {
      console.error(e);
    }
    setSavingCode(null);
  };

  const handleQuickAdjust = (code, delta) => {
    const current = qtyInputs[code] ?? 0;
    const nextVal = Math.max(0, current + delta);
    setQtyInputs(prev => ({ ...prev, [code]: nextVal }));
    handleUpdateQty(code, nextVal);
  };

  const filtered = inventory.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Package className="w-5 h-5 text-emerald-400" />
            <span>Controle Físico de Estoque (47 Compostos)</span>
          </h2>
          <p className="text-xs text-slate-400">
            Atualize as quantidades físicas disponíveis na Grande São Paulo para saída imediata via Motoboy ou Sedex.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Buscar SKU ou peptídeo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-slate-900 border border-slate-800 text-white text-xs rounded-xl pl-9 pr-3 py-2 focus:outline-none focus:border-emerald-500 w-60"
            />
          </div>

          <button
            onClick={fetchInventory}
            className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-slate-300 hover:text-white transition cursor-pointer"
            title="Recarregar Estoque"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {loading && inventory.length === 0 ? (
        <div className="p-12 text-center text-slate-400">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2 text-emerald-400" />
          <p className="text-sm">Carregando estoque do banco de dados...</p>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 text-slate-400 uppercase font-mono text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Composto / Peptídeo</th>
                  <th className="py-3 px-3">SKU</th>
                  <th className="py-3 px-3">Dosagem</th>
                  <th className="py-3 px-3">Linha / Categoria</th>
                  <th className="py-3 px-3">Custo Unit.</th>
                  <th className="py-3 px-3">Venda Varejo</th>
                  <th className="py-3 px-4 text-center">Status no Site</th>
                  <th className="py-3 px-4 text-right">Ajuste de Estoque Físico</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-sans">
                {filtered.map(item => {
                  const currentQty = qtyInputs[item.code] ?? item.stock_qty;
                  const isReady = currentQty > 0;
                  const isSaving = savingCode === item.code;

                  return (
                    <tr key={item.code} className="hover:bg-slate-800/40 transition">
                      <td className="py-3 px-4 font-bold text-white">
                        {item.name}
                      </td>
                      <td className="py-3 px-3 font-mono font-bold text-slate-300">
                        {item.code}
                      </td>
                      <td className="py-3 px-3">
                        <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded text-[11px] font-bold">
                          {item.dosage}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-400 text-[11px]">
                        {item.category}
                      </td>
                      <td className="py-3 px-3 font-mono text-slate-400">
                        R$ {Number(item.unit_cost || 0).toFixed(2)}
                      </td>
                      <td className="py-3 px-3 font-mono font-bold text-emerald-400">
                        R$ {Number(item.price_b2c || 0).toFixed(2)}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {isReady ? (
                          <span className="inline-flex items-center gap-1 bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full text-[10px] font-bold">
                            <Zap className="w-2.5 h-2.5 text-emerald-400" />
                            <span>Pronta Entrega SP</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full text-[10px] font-bold">
                            <span>Sob Encomenda (3-5d)</span>
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="inline-flex items-center gap-1.5 justify-end">
                          <button
                            onClick={() => handleQuickAdjust(item.code, -1)}
                            disabled={currentQty <= 0 || isSaving}
                            className="w-7 h-7 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 rounded-lg flex items-center justify-center transition cursor-pointer"
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
                            className="w-14 h-7 bg-slate-950 border border-slate-700 text-center font-bold text-white text-xs rounded-lg focus:outline-none focus:border-emerald-500"
                          />

                          <button
                            onClick={() => handleQuickAdjust(item.code, 1)}
                            disabled={isSaving}
                            className="w-7 h-7 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg flex items-center justify-center transition cursor-pointer"
                            title="Adicionar 1 frasco"
                          >
                            <Plus className="w-3 h-3" />
                          </button>

                          {isSaving && (
                            <span className="text-[10px] text-emerald-400 animate-pulse ml-1">...</span>
                          )}
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
    </div>
  );
}
