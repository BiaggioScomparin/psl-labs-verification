import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useLanguage } from '../context/LanguageContext';
import { 
  ShieldCheck, 
  QrCode, 
  Search, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  FlaskConical, 
  FileCheck2, 
  Layers,
  ArrowRight
} from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const { lang, t } = useLanguage();
  const [inputCode, setInputCode] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('/api/admin/products')
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error(err));
  }, []);

  const handleVerify = (e) => {
    e.preventDefault();
    const clean = inputCode.trim();
    if (!clean) return;
    router.push(`/v/${encodeURIComponent(clean)}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-emerald-500 selection:text-white">
      <Navbar />

      <main className="flex-grow">
        {/* HERO SECTION */}
        <section id="verify" className="relative overflow-hidden pt-16 pb-24 border-b border-slate-800">
          {/* Subtle background glow */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-blue-600/15 via-emerald-500/15 to-transparent blur-3xl pointer-events-none" />

          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            
            {/* Top pill badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-6 animate-pulse">
              <ShieldCheck className="w-4 h-4" />
              <span>{t.hero.badge}</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight mb-6">
              {t.hero.title}
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed">
              {t.hero.subtitle}
            </p>

            {/* Verification Form Card */}
            <div className="max-w-2xl mx-auto bg-slate-900/90 border border-slate-700/80 rounded-2xl p-6 sm:p-8 shadow-2xl shadow-black/80 backdrop-blur">
              <form onSubmit={handleVerify} className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-grow">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <QrCode className="h-5 w-5 text-emerald-400" />
                  </div>
                  <input
                    type="text"
                    value={inputCode}
                    onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                    placeholder={t.hero.inputPlaceholder}
                    className="w-full pl-11 pr-4 py-4 bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 font-mono text-sm tracking-wider focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                  />
                </div>
                <button
                  type="submit"
                  disabled={!inputCode.trim()}
                  className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold px-8 py-4 rounded-xl shadow-lg shadow-emerald-900/40 flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  <Search className="w-5 h-5" />
                  <span>{t.hero.verifyBtn}</span>
                </button>
              </form>

              <div className="mt-4 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-2">
                <span>{t.hero.helperText}</span>
                <div className="flex items-center gap-2">
                  <span className="text-slate-500">Exemplos rápidos:</span>
                  <button
                    onClick={() => router.push('/v/PSL-TEST-ORIGINAL')}
                    className="text-emerald-400 hover:underline cursor-pointer"
                  >
                    1ª Consulta (OK)
                  </button>
                  <span className="text-slate-600">|</span>
                  <button
                    onClick={() => router.push('/v/PSL-TEST-CLONED')}
                    className="text-amber-400 hover:underline cursor-pointer"
                  >
                    Alerta de Clonagem
                  </button>
                </div>
              </div>
            </div>

            {/* Trust Seals */}
            <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 text-left">
              <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800">
                <div className="text-emerald-400 font-extrabold text-xl mb-1">&gt; 99%</div>
                <div className="text-xs text-slate-400">Pureza HPLC Certificada</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800">
                <div className="text-emerald-400 font-extrabold text-xl mb-1">Unitário</div>
                <div className="text-xs text-slate-400">QR Code Único por Frasco</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800">
                <div className="text-emerald-400 font-extrabold text-xl mb-1">A4351</div>
                <div className="text-xs text-slate-400">Padrão Spiral 65 Etiquetas</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800">
                <div className="text-emerald-400 font-extrabold text-xl mb-1">🇵🇾 PY</div>
                <div className="text-xs text-slate-400">Asunción & Ciudad del Este</div>
              </div>
            </div>

          </div>
        </section>

        {/* PRODUCTS SECTION (Scalable for multiple products) */}
        <section id="products" className="py-20 bg-slate-900/60 border-b border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-3">
                <FlaskConical className="w-3.5 h-3.5" />
                <span>Portfólio Farmacêutico</span>
              </div>
              <h2 className="text-3xl font-extrabold text-white mb-4">
                {t.products.title}
              </h2>
              <p className="text-slate-400 text-sm sm:text-base">
                {t.products.subtitle}
              </p>
            </div>

            {/* Product Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {products.map((p) => {
                const isMainGHK = p.id === 'ghk-cu-50mg';
                const desc = lang === 'py' ? p.description_py : p.description_pt;
                return (
                  <div
                    key={p.id}
                    className={`rounded-2xl border transition-all duration-300 overflow-hidden flex flex-col justify-between ${
                      isMainGHK
                        ? 'bg-slate-900 border-emerald-500/60 shadow-xl shadow-emerald-950/30 ring-1 ring-emerald-500/30'
                        : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      {/* Image / Header banner */}
                      <div className="relative h-48 overflow-hidden bg-slate-950">
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-full h-full object-cover opacity-80 hover:scale-105 transition duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
                        
                        {isMainGHK && (
                          <div className="absolute top-3 left-3 bg-emerald-600 text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow">
                            ⭐ Produto Destaque
                          </div>
                        )}
                        <div className="absolute top-3 right-3 bg-slate-900/90 border border-slate-700 text-slate-200 text-xs font-mono px-2.5 py-1 rounded-lg">
                          {p.concentration}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6">
                        <div className="text-xs text-emerald-400 font-semibold mb-1 uppercase tracking-wider">
                          {p.category}
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">
                          {p.name}
                        </h3>
                        <p className="text-xs text-slate-400 mb-4 font-mono">
                          {p.chemicalName}
                        </p>
                        <p className="text-sm text-slate-300 leading-relaxed mb-6 line-clamp-3">
                          {desc}
                        </p>

                        <div className="space-y-2 border-t border-slate-800 pt-4 text-xs text-slate-400">
                          <div className="flex justify-between">
                            <span>Pureza:</span>
                            <span className="text-emerald-400 font-bold">{p.purity}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Apresentação:</span>
                            <span className="text-slate-200">{p.presentation}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Anti-Clonagem:</span>
                            <span className="text-emerald-400">QR Code Criptográfico</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-6 pt-0">
                      <button
                        onClick={() => {
                          setInputCode(isMainGHK ? 'PSL-8F92K1' : 'PSL-TEST-ORIGINAL');
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className={`w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition cursor-pointer ${
                          isMainGHK
                            ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-950/40'
                            : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                        }`}
                      >
                        <span>{t.products.viewProduct}</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        </section>

        {/* QUALITY STANDARDS SECTION */}
        <section id="quality" className="py-20 bg-slate-950">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl font-extrabold text-white mb-4">
                {t.quality.title}
              </h2>
              <p className="text-slate-400 text-sm sm:text-base">
                {t.quality.subtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col items-start">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-6">
                  <FileCheck2 className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">
                  {t.quality.item1Title}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {t.quality.item1Desc}
                </p>
              </div>

              <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col items-start">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-6">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">
                  {t.quality.item2Title}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {t.quality.item2Desc}
                </p>
              </div>

              <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col items-start">
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-6">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">
                  {t.quality.item3Title}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {t.quality.item3Desc}
                </p>
              </div>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
