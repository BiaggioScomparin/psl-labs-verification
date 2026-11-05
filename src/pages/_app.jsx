import '../styles/globals.css';
import { LanguageProvider } from '../context/LanguageContext';
import { ThemeProvider } from '../context/ThemeContext';
import Head from 'next/head';

export default function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <Head>
          <title>PSL LABS | Paraguay Scientific Laboratories - Sistema Anti-Clonagem</title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/brand/psl-labs-symbol.svg" />
        </Head>
        <Component {...pageProps} />
      </LanguageProvider>
    </ThemeProvider>
  );
}
