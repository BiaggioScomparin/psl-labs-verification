import { useLanguage } from '../context/LanguageContext';
import { Shield, MapPin, Award, CheckCircle2 } from 'lucide-react';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-slate-100 dark:bg-slate-950 text-slate-600 dark:text-slate-400 border-t border-slate-200 dark:border-slate-800 pt-16 pb-12 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <svg width="28" height="28" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="32" cy="32" r="30" stroke="#38bdf8" strokeWidth="2.2" />
                <circle cx="32" cy="32" r="26" stroke="#38bdf8" strokeWidth="1" strokeDasharray="1.5 2" />
                <polygon points="32,13 36.5,24 48,24.8 39.2,32.2 42,43.5 32,37.5 22,43.5 24.8,32.2 16,24.8 27.5,24" 
                         fill="#10b981" stroke="#0a0f18" strokeWidth="1.2" strokeLinejoin="round" />
                <circle cx="32" cy="32" r="3" fill="#ffffff" />
              </svg>
              <span className="font-extrabold text-2xl tracking-wider text-slate-900 dark:text-white">
                PSL <span className="text-emerald-500 dark:text-emerald-400">LABS</span>
              </span>
              <span className="bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300 border border-red-300 dark:border-red-700/60 text-[10px] font-bold px-2 py-0.5 rounded-full">
                🇵🇾 PY
              </span>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md leading-relaxed mb-4">
              {t.footer.disclaimer}
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <MapPin className="w-4 h-4 text-emerald-500 dark:text-emerald-400 shrink-0" />
              <span>{t.footer.address}</span>
            </div>
          </div>

          <div>
            <h4 className="text-slate-900 dark:text-white font-semibold text-sm mb-4 uppercase tracking-wider">
              Qualidade & Normas
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>HPLC Certified &gt; 99% Pure</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Liofilização Estéril</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Rastreabilidade Criptográfica</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>ISO &amp; GMP Paraguay Standard</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-slate-900 dark:text-white font-semibold text-sm mb-4 uppercase tracking-wider">
              Segurança do Consumidor
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-3">
              Nunca consuma produtos cujo código QR já apresente múltiplas consultas ou lacre violado.
            </p>
            <div className="inline-flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800/60 px-3 py-1.5 rounded-lg">
              <Shield className="w-4 h-4" />
              <span>Canal Anti-Fraude Ativo</span>
            </div>
          </div>

        </div>

        <div className="border-t border-slate-200 dark:border-slate-800/80 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} PSL LABS S.A. {t.footer.rights}</p>
          <p>Asunción - Ciudad del Este | República del Paraguay</p>
        </div>
      </div>
    </footer>
  );
}
