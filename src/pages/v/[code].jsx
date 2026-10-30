import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { useLanguage } from '../../context/LanguageContext';
import { 
  ShieldCheck, 
  AlertTriangle, 
  XCircle, 
  Calendar, 
  Hash, 
  FlaskConical, 
  CheckCircle2, 
  FileText, 
  MapPin, 
  ArrowLeft,
  RefreshCw,
  Clock,
  Sparkles
} from 'lucide-react';

export default function VerificationPage() {
  const router = useRouter();
  const { code } = router.query;
  const { lang, t } = useLanguage();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!code) return;

    setLoading(true);
    fetch(`/api/verify?code=${encodeURIComponent(code)}`)
      .then(async (res) => {
        if (!res.ok) {
          setError(true);
          setLoading(false);
          return null;
        }
        return res.json();
      })
      .then((json) => {
        if (json) {
          setData(json);
          setError(false);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(true);
        setLoading(false);
      });
  }, [code]);

  const formatDate = (isoString) => {
    if (!isoString) return '--';
    try {
      const d = new Date(isoString);
      return d.toLocaleString(lang === 'py' ? 'es-PY' : 'pt-BR', {
        dateStyle: 'medium',
        timeStyle: 'short'
      });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Head>
        <title>
          {data?.product?.name ? `${data.product.name} | Verificação PSL LABS` : 'Verificação de Autenticidade | PSL LABS'}
        </title>
      </Head>

      <Navbar />

      <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
        
        {/* Back Link */}
        <button
          onClick={() => router.push('/')}
          className="inline-flex items-center gap-2 text-xs text-slate-400 hover:text-emerald-400 mb-8 transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar ao Início</span>
        </button>

        {loading ? (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center shadow-2xl">
            <RefreshCw className="w-10 h-10 text-emerald-400 animate-spin mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">Consultando Banco Criptográfico...</h2>
            <p className="text-sm text-slate-400">Verificando chaves de segurança da PSL LABS Paraguai</p>
          </div>
        ) : error || !data?.found ? (
          /* INVALID CODE CARD */
          <div className="bg-slate-900 border border-red-500/50 rounded-3xl p-8 sm:p-12 text-center shadow-2xl shadow-red-950/40 relative overflow-hidden">
            <div className="w-20 h-20 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 mx-auto mb-6">
              <XCircle className="w-10 h-10" />
            </div>

            <span className="bg-red-950 text-red-300 border border-red-700/60 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider inline-block mb-3">
              Alerta de Segurança
            </span>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
              {t.status.invalidTitle}
            </h1>
            <p className="text-slate-300 max-w-lg mx-auto mb-6 text-sm sm:text-base">
              {t.status.invalidSub}
            </p>

            <div className="bg-red-950/40 border border-red-800/60 rounded-2xl p-5 max-w-lg mx-auto text-xs text-red-300 leading-relaxed mb-8">
              {t.status.invalidAlert}
            </div>

            <div className="text-xs text-slate-400 font-mono mb-6">
              Código consultado: <span className="text-red-400 font-bold">{code}</span>
            </div>

            <button
              onClick={() => router.push('/')}
              className="bg-slate-800 hover:bg-slate-700 text-white font-bold px-6 py-3 rounded-xl text-xs uppercase tracking-wider transition cursor-pointer"
            >
              Tentar Outro Código
            </button>
          </div>
        ) : (
          /* VALID CODE RESULT */
          <div className="space-y-6">
            
            {/* Main Status Header Card */}
            {data.scanCount === 1 ? (
              /* ORIGINAL FIRST SCAN */
              <div className="bg-gradient-to-br from-emerald-950/90 via-slate-900 to-slate-900 border border-emerald-500/60 rounded-3xl p-8 sm:p-10 shadow-2xl shadow-emerald-950/50 relative overflow-hidden">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
                  <div className="w-20 h-20 rounded-2xl bg-emerald-500/20 border border-emerald-400/50 flex items-center justify-center text-emerald-400 shrink-0 shadow-lg shadow-emerald-500/20">
                    <ShieldCheck className="w-12 h-12" />
                  </div>
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-2">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{t.status.firstScanNotice}</span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
                      {t.status.authenticTitle}
                    </h1>
                    <p className="text-sm text-slate-300 leading-relaxed mb-4">
                      {t.status.authenticSub}
                    </p>
                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 border-t border-slate-800/80 pt-4">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-emerald-400" />
                        <span>{t.status.firstScanAt}: <strong className="text-white">{formatDate(data.firstScannedAt)}</strong></span>
                      </div>
                      <div className="flex items-center gap-1.5 bg-emerald-900/40 border border-emerald-700/60 text-emerald-300 px-2.5 py-0.5 rounded-full font-bold">
                        <span>Total de consultas: 1</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* WARNING: SCANNED MULTIPLE TIMES */
              <div className="bg-gradient-to-br from-amber-950/90 via-slate-900 to-slate-900 border border-amber-500/60 rounded-3xl p-8 sm:p-10 shadow-2xl shadow-amber-950/50 relative overflow-hidden">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
                  <div className="w-20 h-20 rounded-2xl bg-amber-500/20 border border-amber-400/50 flex items-center justify-center text-amber-400 shrink-0 shadow-lg shadow-amber-500/20 animate-pulse">
                    <AlertTriangle className="w-12 h-12" />
                  </div>
                  <div className="flex-grow">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-bold uppercase tracking-wider mb-2">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>Alerta de Consultas Múltiplas ({data.scanCount}x)</span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
                      {t.status.warningTitle}
                    </h1>
                    <p className="text-sm text-slate-300 leading-relaxed mb-4">
                      {t.status.warningSub}
                    </p>
                    
                    <div className="bg-amber-950/50 border border-amber-800/70 rounded-xl p-4 text-xs text-amber-200 leading-relaxed mb-4">
                      {t.status.warningAlert}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-400 border-t border-slate-800 pt-4">
                      <div>
                        {t.status.firstScanAt}: <br />
                        <strong className="text-slate-200 font-mono">{formatDate(data.firstScannedAt)}</strong>
                      </div>
                      <div>
                        {t.status.lastScanAt}: <br />
                        <strong className="text-amber-400 font-mono">{formatDate(data.lastScannedAt)}</strong>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Product Details Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
              <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start mb-8">
                <img
                  src={data.product?.image || "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&q=80"}
                  alt={data.product?.name}
                  className="w-28 h-28 object-cover rounded-2xl border border-slate-700 bg-slate-950 shrink-0"
                />
                <div className="text-center sm:text-left">
                  <div className="text-xs text-emerald-400 font-bold uppercase tracking-wider mb-1">
                    {data.product?.category || "Peptídeo Bioativo"}
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-1">
                    {data.product?.name || "GHK CU 50 MG"}
                  </h2>
                  <p className="text-xs text-slate-400 font-mono mb-3">
                    {data.product?.chemicalName}
                  </p>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
                    {lang === 'py' ? data.product?.description_py : data.product?.description_pt}
                  </p>
                </div>
              </div>

              {/* Technical Specifications Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 border-t border-slate-800 pt-6">
                
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80">
                  <div className="text-[11px] text-slate-500 uppercase tracking-wider mb-1">
                    {t.status.codeLabel}
                  </div>
                  <div className="text-sm font-mono font-bold text-emerald-400">
                    {data.code}
                  </div>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80">
                  <div className="text-[11px] text-slate-500 uppercase tracking-wider mb-1">
                    {t.status.batchLabel}
                  </div>
                  <div className="text-sm font-mono font-bold text-white">
                    {data.batchNumber}
                  </div>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80">
                  <div className="text-[11px] text-slate-500 uppercase tracking-wider mb-1">
                    {t.status.purityLabel}
                  </div>
                  <div className="text-sm font-bold text-emerald-400">
                    {data.product?.purity || '99.4% (HPLC)'}
                  </div>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80">
                  <div className="text-[11px] text-slate-500 uppercase tracking-wider mb-1">
                    {t.status.mfgLabel}
                  </div>
                  <div className="text-sm font-bold text-slate-200">
                    {data.mfgDate}
                  </div>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80">
                  <div className="text-[11px] text-slate-500 uppercase tracking-wider mb-1">
                    {t.status.expLabel}
                  </div>
                  <div className="text-sm font-bold text-slate-200">
                    {data.expDate}
                  </div>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80">
                  <div className="text-[11px] text-slate-500 uppercase tracking-wider mb-1">
                    {t.status.originLabel}
                  </div>
                  <div className="text-sm font-bold text-white flex items-center gap-1.5">
                    <span>🇵🇾</span>
                    <span>{t.status.originVal}</span>
                  </div>
                </div>

              </div>

              {/* Storage Instructions */}
              <div className="mt-6 p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex items-start gap-3 text-xs text-slate-400">
                <FlaskConical className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-200 block mb-0.5">{t.status.storageLabel}:</strong>
                  <span>{lang === 'py' ? data.product?.storage_py : data.product?.storage_pt}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 pt-6 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
                <a
                  href="#coa"
                  onClick={(e) => {
                    e.preventDefault();
                    alert("Certificado de Análise Laboratorial (COA) autenticado com grau farmacêutico 99.4% HPLC.");
                  }}
                  className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition"
                >
                  <FileText className="w-4 h-4" />
                  <span>{t.status.viewCOA}</span>
                </a>

                <div className="text-xs text-slate-500">
                  Fabricante: <strong>PSL LABS Paraguay S.A.</strong>
                </div>
              </div>

            </div>

          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}
