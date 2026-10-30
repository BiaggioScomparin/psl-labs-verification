import { useLanguage } from '../context/LanguageContext';
import { Shield, MapPin, Award, CheckCircle2 } from 'lucide-react';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <span className="font-extrabold text-2xl tracking-wider text-white">
                PSL <span className="text-emerald-400">LABS</span>
              </span>
              <span className="bg-red-950 text-red-300 border border-red-700/60 text-[10px] font-bold px-2 py-0.5 rounded-full">
                🇵🇾 PY
              </span>
            </div>
            <p className="text-sm text-slate-400 max-w-md leading-relaxed mb-4">
              {t.footer.disclaimer}
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{t.footer.address}</span>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">
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
            <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">
              Segurança do Consumidor
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">
              Nunca consuma produtos cujo código QR já apresente múltiplas consultas ou lacre violado.
            </p>
            <div className="inline-flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/50 border border-emerald-800/60 px-3 py-1.5 rounded-lg">
              <Shield className="w-4 h-4" />
              <span>Canal Anti-Fraude Ativo</span>
            </div>
          </div>

        </div>

        <div className="border-t border-slate-900 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} PSL LABS S.A. {t.footer.rights}</p>
          <p>Asunción - Ciudad del Este | República del Paraguay</p>
        </div>
      </div>
    </footer>
  );
}
