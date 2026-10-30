import '../styles/globals.css';
import { LanguageProvider } from '../context/LanguageContext';
import Head from 'next/head';

export default function MyApp({ Component, pageProps }) {
  return (
    <LanguageProvider>
      <Head>
        <title>PSL LABS | Laboratorios Científicos del Paraguay - Sistema Anti-Clonagem</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🧪</text></svg>" />
      </Head>
      <Component {...pageProps} />
    </LanguageProvider>
  );
}
