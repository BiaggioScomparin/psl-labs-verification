import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { getProductById, getProducts } from '../../lib/db';
import { useLanguage } from '../../context/LanguageContext';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { ShieldCheck, CheckCircle2, FlaskConical, Thermometer, Award, ArrowLeft, ExternalLink, QrCode } from 'lucide-react';

export default function ProductDetailPage({ product }) {
  const router = useRouter();
  const { lang, t } = useLanguage();

  if (router.isFallback) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center p-6 text-center">
          <div className="max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8">
            <h1 className="text-xl font-bold text-white mb-2">Producto no encontrado</h1>
            <p className="text-xs text-slate-400 mb-6">El identificador no corresponde a un producto registrado en PSL LABS.</p>
            <Link href="/" className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition">
              <ArrowLeft className="w-4 h-4" />
              <span>Volver al Inicio</span>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const desc = lang === 'py' ? product.description_py : product.description_pt;
  const storage = lang === 'py' ? product.storage_py : product.storage_pt;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      <Head>
        <title>{product.name} | Monografía Oficial | PSL LABS</title>
        <meta name="description" content={`Ficha técnica y especificaciones oficiales de ${product.name} - PSL LABS S.A. Paraguay`} />
      </Head>

      <Navbar />

      <main className="flex-grow max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        {/* Navigation Breadcrumb */}
        <div className="mb-6">
          <Link href="/#products" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400 transition">
            <ArrowLeft className="w-4 h-4" />
            <span>{lang === 'py' ? 'Volver al catálogo' : 'Voltar ao catálogo'}</span>
          </Link>
        </div>

        {/* Product Card */}
        <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-xl backdrop-blur">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            
            {/* Product Image */}
            <div className="relative rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-center p-4 min-h-[340px]">
              <img
                src={product.image || "/images/ghk-cu-50mg.jpg"}
                alt={product.name}
                className="max-h-[320px] object-contain rounded-xl drop-shadow-2xl"
              />
              <div className="absolute top-4 left-4 bg-emerald-500/20 border border-emerald-500/40 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase px-2.5 py-1 rounded-full flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Original PSL LABS</span>
              </div>
            </div>

            {/* Product Meta & Description */}
            <div className="space-y-4">
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-widest text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800/40 px-3 py-1 rounded-full">
                  {product.category}
                </span>
                <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white mt-3 tracking-tight">
                  {product.name}
                </h1>
                <p className="text-xs sm:text-sm text-sky-600 dark:text-sky-400 font-mono font-semibold mt-1">
                  {product.chemicalName}
                </p>
              </div>

              {/* Specs Pills */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="bg-slate-100 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-xl p-3">
                  <div className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">Concentración</div>
                  <div className="text-base font-black text-slate-900 dark:text-white mt-0.5">{product.concentration}</div>
                </div>
                <div className="bg-slate-100 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-xl p-3">
                  <div className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">Pureza HPLC</div>
                  <div className="text-base font-black text-emerald-600 dark:text-emerald-400 mt-0.5">{product.purity}</div>
                </div>
              </div>

              {/* Description */}
              <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed pt-2">
                {desc}
              </div>

              {/* Storage */}
              <div className="bg-slate-100/70 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 flex items-start gap-3">
                <Thermometer className="w-5 h-5 text-sky-600 dark:text-sky-400 shrink-0 mt-0.5" />
                <div className="text-xs text-slate-700 dark:text-slate-300">
                  <strong className="text-slate-900 dark:text-white block mb-0.5">{lang === 'py' ? 'Almacenamiento y Conservación:' : 'Armazenamento e Conservação:'}</strong>
                  {storage}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex flex-wrap gap-3">
                <Link
                  href="/#verify"
                  className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg transition"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>{lang === 'py' ? 'Verificar Autenticidad' : 'Verificar Autenticidade'}</span>
                </Link>
                <Link
                  href="/caixa_tirzepatida_4ampolas_clara_a4.pdf"
                  target="_blank"
                  className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-1.5 transition border border-slate-200 dark:border-slate-700"
                >
                  <Award className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                  <span>{lang === 'py' ? 'Ficha Técnica' : 'Ficha Técnica'}</span>
                </Link>
              </div>

            </div>

          </div>
        </div>

        {/* Quality Certifications Section */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex items-center gap-3 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-600 dark:text-sky-400 font-black">
              HPLC
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">Cromatografía Certificada</div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400">Pureza analítica &gt; 99%</div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex items-center gap-3 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-black">
              GMP
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">Buenas Prácticas</div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400">Liofilización estéril de grado A</div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex items-center gap-3 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400 font-black">
              🇵🇾
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">PSL LABS S.A.</div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400">Asunción · República del Paraguay</div>
            </div>
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}

export async function getStaticPaths() {
  const products = getProducts();
  const paths = products.map((p) => ({
    params: { id: p.id },
  }));

  return {
    paths,
    fallback: true,
  };
}

export async function getStaticProps({ params }) {
  const product = getProductById(params.id);

  return {
    props: {
      product: product ? JSON.parse(JSON.stringify(product)) : null,
    },
    revalidate: 60,
  };
}
