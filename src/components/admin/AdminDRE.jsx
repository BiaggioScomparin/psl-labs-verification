import { useState, useEffect } from 'react';
import { TrendingUp, DollarSign, Package, AlertOctagon, RefreshCw, Database } from 'lucide-react';

export default function AdminDRE() {
  const [dre, setDre] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDRE = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/dre');
      const data = await res.json();
      setDre(data);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDRE();
  }, []);

  if (loading && !dre) {
    return (
      <div className="p-12 text-center text-slate-400">
        <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2 text-emerald-400" />
        <p className="text-sm">Carregando métricas financeiras do banco de dados...</p>
      </div>
    );
  }

  const isCloud = dre?.is_cloud_supabase;

  return (
    <div className="space-y-6">
      {/* Cloud Status Banner */}
      <div className={`p-4 rounded-2xl border flex items-center justify-between text-xs ${
        isCloud 
          ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300' 
          : 'bg-amber-950/40 border-amber-500/50 text-amber-300'
      }`}>
        <div className="flex items-center gap-2">
          <Database className="w-4 h-4" />
          <span>
            {isCloud 
              ? 'Conectado ao Supabase (PostgreSQL em Nuvem) — Sincronização em Tempo Real Ativa' 
              : 'Modo Local Ativo — Para salvar permanentemente na nuvem, adicione as chaves do Supabase no .env'}
          </span>
        </div>
        <button
          onClick={fetchDRE}
          className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded-lg text-white font-bold transition flex items-center gap-1 cursor-pointer"
        >
          <RefreshCw className="w-3 h-3" />
          <span>Atualizar</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Receita Bruta */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
          <div className="text-xs text-slate-400 mb-1 flex items-center justify-between">
            <span>Receita Bruta Total</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white">
            R$ {(dre?.receita_bruta || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-emerald-400 font-bold mt-1">Total Faturado em Vendas</div>
        </div>

        {/* Lucro Bruto & Margem */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
          <div className="text-xs text-slate-400 mb-1 flex items-center justify-between">
            <span>Lucro Bruto Real</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400">
            R$ {(dre?.lucro_bruto || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Margem Bruta: <strong className="text-white">{dre?.margem_bruta_percent || 0}%</strong>
          </div>
        </div>

        {/* Valor do Estoque a Custo */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
          <div className="text-xs text-slate-400 mb-1 flex items-center justify-between">
            <span>Estoque Físico SP</span>
            <Package className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-black text-blue-400">
            {dre?.total_frascos_estoque || 0} <span className="text-sm font-semibold text-slate-400">frascos</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Custo Imobilizado: R$ {(dre?.estoque_valor_custo || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
        </div>

        {/* Total Perdas */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
          <div className="text-xs text-slate-400 mb-1 flex items-center justify-between">
            <span>Perdas & Avarias</span>
            <AlertOctagon className="w-4 h-4 text-red-400" />
          </div>
          <div className="text-2xl font-black text-red-400">
            R$ {(dre?.total_perdas || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Quebras / Não enviados / Uso próprio</div>
        </div>
      </div>

      {/* DRE Summary Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
        <h3 className="text-base font-extrabold text-white mb-4">
          Demonstrativo do Resultado do Exercício (DRE Sintético)
        </h3>
        
        <div className="space-y-3 font-mono text-xs">
          <div className="flex justify-between p-3 bg-slate-950/60 rounded-xl border border-slate-800/80">
            <span className="text-slate-300 font-bold">(+) Receita Operacional Bruta:</span>
            <span className="text-emerald-400 font-extrabold">
              R$ {(dre?.receita_bruta || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </div>

          <div className="flex justify-between p-3 bg-slate-950/60 rounded-xl border border-slate-800/80">
            <span className="text-slate-400">(-) CMV (Custo das Mercadorias Vendidas):</span>
            <span className="text-red-400 font-bold">
              - R$ {(dre?.cmv || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </div>

          <div className="flex justify-between p-3 bg-emerald-950/40 rounded-xl border border-emerald-500/30">
            <span className="text-emerald-300 font-extrabold">(=) LUCRO BRUTO OPERACIONAL:</span>
            <span className="text-emerald-300 font-black text-sm">
              R$ {(dre?.lucro_bruto || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })} ({dre?.margem_bruta_percent || 0}%)
            </span>
          </div>

          <div className="flex justify-between p-3 bg-slate-950/60 rounded-xl border border-slate-800/80">
            <span className="text-slate-400">(-) Perdas, Não Envios & Avarias:</span>
            <span className="text-red-400 font-bold">
              - R$ {(dre?.total_perdas || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </div>

          <div className="flex justify-between p-3 bg-slate-950/60 rounded-xl border border-slate-800/80">
            <span className="text-slate-300 font-bold">(=) Potencial de Venda do Estoque Atual (Varejo B2C):</span>
            <span className="text-blue-400 font-extrabold">
              R$ {(dre?.estoque_valor_venda || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </div>

          <div className="flex justify-between p-3 bg-slate-950/60 rounded-xl border border-slate-800/80">
            <span className="text-slate-400">Total Investido em Compras de Insumos:</span>
            <span className="text-slate-300 font-bold">
              R$ {(dre?.total_compras_investido || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
