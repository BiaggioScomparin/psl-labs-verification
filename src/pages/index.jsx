import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import QRCameraScanner from '../components/QRCameraScanner';
import { useLanguage } from '../context/LanguageContext';
import { 
  ShieldCheck, 
  QrCode, 
  Search, 
  Camera,
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
  const [isCameraOpen, setIsCameraOpen] = useState(false);
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
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-emerald-500 selection:text-white transition-colors duration-200">
      <Navbar />

      <main className="flex-grow">
        {/* HERO SECTION */}
        <section id="verify" className="relative overflow-hidden pt-16 pb-24 border-b border-slate-200 dark:border-slate-800">
          {/* Subtle background glow */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-sky-400/10 via-emerald-400/10 to-transparent dark:from-blue-600/15 dark:via-emerald-500/15 blur-3xl pointer-events-none" />

          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            
            {/* Top pill badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-6 animate-pulse">
              <ShieldCheck className="w-4 h-4" />
              <span>{t.hero.badge}</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-6">
              {t.hero.title}
            </h1>

            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed">
              {t.hero.subtitle}
            </p>

            {/* Verification Form Card */}
            <div className="max-w-2xl mx-auto bg-white/95 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-700/80 rounded-2xl p-6 sm:p-8 shadow-2xl shadow-slate-200/70 dark:shadow-black/80 backdrop-blur">
              <form onSubmit={handleVerify} className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-grow">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <QrCode className="h-5 w-5 text-emerald-500 dark:text-emerald-400" />
                  </div>
                  <input
                    type="text"
                    value={inputCode}
                    onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                    placeholder={t.hero.inputPlaceholder}
                    className="w-full pl-11 pr-4 py-4 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 font-mono text-sm tracking-wider focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                  />
                </div>
                <button
                  type="submit"
                  disabled={!inputCode.trim()}
                  className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold px-8 py-4 rounded-xl shadow-lg shadow-emerald-900/30 flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  <Search className="w-5 h-5" />
                  <span>{t.hero.verifyBtn}</span>
                </button>
              </form>

              {/* Instant Camera Scanner Button */}
              <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800/80">
                <button
                  type="button"
                  onClick={() => setIsCameraOpen(true)}
                  className="w-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/90 dark:hover:bg-slate-750 border border-slate-300 dark:border-emerald-500/40 hover:border-emerald-500 text-slate-800 dark:text-white font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2.5 transition group cursor-pointer shadow-sm shadow-emerald-950/10"
                >
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Camera className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-semibold tracking-wide">
                    {lang === 'py' ? 'Abrir Cámara para Escanear QR' : 'Abrir Câmera para Ler QR Code'}
                  </span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800 px-2 py-0.5 rounded-full font-bold ml-1">
                    CÂMERA
                  </span>
                </button>
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between text-xs text-slate-500 dark:text-slate-400 gap-2">
                <span>{t.hero.helperText}</span>
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">{lang === 'py' ? 'Ejemplos rápidos:' : 'Exemplos rápidos:'}</span>
                  <button
                    onClick={() => router.push('/v/PSL-TEST-ORIGINAL')}
                    className="text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer font-medium"
                  >
                    1ª Consulta (OK)
                  </button>
                  <span className="text-slate-300 dark:text-slate-600">|</span>
                  <button
                    onClick={() => router.push('/v/PSL-TEST-CLONED')}
                    className="text-amber-600 dark:text-amber-400 hover:underline cursor-pointer font-medium"
                  >
                    {lang === 'py' ? 'Alerta de Clonación' : 'Alerta de Clonagem'}
                  </button>
                </div>
              </div>
            </div>

            {/* QR Camera Scanner Modal */}
            <QRCameraScanner
              isOpen={isCameraOpen}
              onClose={() => setIsCameraOpen(false)}
            />

            {/* Trust Seals */}
            <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 text-left">
              <div className="p-4 rounded-xl bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="text-emerald-600 dark:text-emerald-400 font-extrabold text-xl mb-1">&gt; 99%</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">{lang === 'py' ? 'Pureza HPLC Certificada' : 'Pureza HPLC Certificada'}</div>
              </div>
              <div className="p-4 rounded-xl bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="text-emerald-600 dark:text-emerald-400 font-extrabold text-xl mb-1">Unitário</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">{lang === 'py' ? 'QR Code Único por Frasco' : 'QR Code Único por Frasco'}</div>
              </div>
              <div className="p-4 rounded-xl bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="text-emerald-600 dark:text-emerald-400 font-extrabold text-xl mb-1">Padrão 40x20</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">{lang === 'py' ? 'Vial Farmacéutico' : 'Vial Farmacêutico'}</div>
              </div>
              <div className="p-4 rounded-xl bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="text-emerald-600 dark:text-emerald-400 font-extrabold text-xl mb-1">🇵🇾 PY</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">Asunción &amp; Ciudad del Este</div>
              </div>
            </div>

          </div>
        </section>

        {/* PRODUCTS SECTION */}
        <section id="products" className="py-20 bg-slate-100/70 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800 transition-colors duration-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-600 dark:text-blue-400 text-xs font-semibold uppercase tracking-wider mb-3">
                <FlaskConical className="w-3.5 h-3.5" />
                <span>{lang === 'py' ? 'Portafolio Farmacéutico' : 'Portfólio Farmacêutico'}</span>
              </div>
              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-4">
                {t.products.title}
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
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
                        ? 'bg-white dark:bg-slate-900 border-emerald-500/70 shadow-xl shadow-emerald-500/10 dark:shadow-emerald-950/30 ring-1 ring-emerald-500/30'
                        : 'bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-sm hover:shadow-md'
                    }`}
                  >
                    <div>
                      {/* Image / Header banner */}
                      <div className="relative h-48 overflow-hidden bg-slate-100 dark:bg-slate-950">
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-full h-full object-cover opacity-90 dark:opacity-80 hover:scale-105 transition duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-slate-900 via-transparent to-transparent" />
                        
                        {isMainGHK && (
                          <div className="absolute top-3 left-3 bg-emerald-600 text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow">
                            {lang === 'py' ? '⭐ Producto Destacado' : '⭐ Produto Destaque'}
                          </div>
                        )}
                        <div className="absolute top-3 right-3 bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-mono px-2.5 py-1 rounded-lg shadow-sm">
                          {p.concentration}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6">
                        <div className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mb-1 uppercase tracking-wider">
                          {p.category}
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                          {p.name}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 font-mono">
                          {p.chemicalName}
                        </p>
                        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6 line-clamp-3">
                          {desc}
                        </p>

                        <div className="space-y-2 border-t border-slate-200 dark:border-slate-800 pt-4 text-xs text-slate-500 dark:text-slate-400">
                          <div className="flex justify-between">
                            <span>{lang === 'py' ? 'Pureza:' : 'Pureza:'}</span>
                            <span className="text-emerald-600 dark:text-emerald-400 font-bold">{p.purity}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>{lang === 'py' ? 'Presentación:' : 'Apresentação:'}</span>
                            <span className="text-slate-800 dark:text-slate-200 font-medium">{p.presentation}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>{lang === 'py' ? 'Anti-Clonación:' : 'Anti-Clonagem:'}</span>
                            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">QR Code Criptográfico</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-6 pt-0 space-y-2">
                      <Link
                        href={`/product/${p.id}`}
                        className="w-full py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition cursor-pointer bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700"
                      >
                        <span>{lang === 'py' ? 'Ficha Técnica' : 'Ficha Técnica'}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                      </Link>
                      <button
                        onClick={() => {
                          setInputCode(isMainGHK ? 'GHK50-EO0HH' : 'PSL-TEST-ORIGINAL');
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className={`w-full py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition cursor-pointer ${
                          isMainGHK
                            ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/30'
                            : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                        }`}
                      >
                        <span>{t.products.viewProduct}</span>
                        <ShieldCheck className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        </section>

        {/* QUALITY STANDARDS SECTION */}
        <section id="quality" className="py-20 bg-slate-50 dark:bg-slate-950 transition-colors duration-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-4">
                {t.quality.title}
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
                {t.quality.subtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-start">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-6">
                  <FileCheck2 className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                  {t.quality.item1Title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {t.quality.item1Desc}
                </p>
              </div>

              <div className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-start">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-6">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                  {t.quality.item2Title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {t.quality.item2Desc}
                </p>
              </div>

              <div className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-start">
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-600 dark:text-purple-400 mb-6">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                  {t.quality.item3Title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
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
