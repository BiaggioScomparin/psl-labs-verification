import { useLanguage } from '../context/LanguageContext';
import { Shield, MapPin, Award, CheckCircle2 } from 'lucide-react';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-[#090D14] text-slate-300 border-t border-slate-800 pt-16 pb-12 transition-colors duration-200 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <img 
                src="/brand/psl-labs-premium-synthesis-line.png" 
                alt="PSL LABS" 
                className="h-10 w-auto object-contain brightness-0 invert opacity-95"
              />
            </div>
            <p className="text-sm text-slate-400 max-w-md leading-relaxed mb-4">
              {t.footer.disclaimer}
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
              <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{t.footer.address}</span>
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold text-xs mb-4 uppercase tracking-widest font-mono">
              Qualidade &amp; Normas
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400 font-mono">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>HPLC Certified &gt; 99% Pure</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Liofilização Criogênica em Vácuo</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Rastreabilidade Criptográfica SHA-256</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Padrão ISO/IEC 17025 Acreditado</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold text-xs mb-4 uppercase tracking-widest font-mono">
              Segurança do Consumidor
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">
              Nunca consuma produtos cujo código QR já apresente alerta de duplicidade ou selo de segurança com violação de abertura prévia.
            </p>
            <div className="inline-flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/60 border border-emerald-800/80 px-3 py-1.5 rounded-lg font-mono">
              <Shield className="w-4 h-4" />
              <span>Canal Anti-Fraude Ativo</span>
            </div>
          </div>

        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4 font-mono">
          <p>© {new Date().getFullYear()} PSL LABS S.A. {t.footer.rights}</p>
          <p>Asunción - Ciudad del Este | República del Paraguay</p>
        </div>
      </div>
    </footer>
  );
}
