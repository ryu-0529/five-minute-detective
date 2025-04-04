import { useEffect } from 'react';
import Head from 'next/head';
import { GameProvider } from '../context/GameContext';
import '../styles/globals.css';

// レイアウトコンポーネント
import Layout from '../components/layout/Layout';

function MyApp({ Component, pageProps }) {
  // PWA用のイベントリスナー設定
  useEffect(() => {
    // Service Workerの登録
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', function () {
        navigator.serviceWorker.register('/sw.js').then(
          function (registration) {
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
          },
          function (err) {
            console.log('ServiceWorker registration failed: ', err);
          }
        );
      });
    }
  }, []);

  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <meta name="description" content="科学の力で謎を解く5分間のミステリーゲーム" />
        <meta name="theme-color" content="#1E3A8A" />
        
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        
        {/* Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&family=Indie+Flower&display=swap" rel="stylesheet" />
        
        <title>5分探偵：知恵の糸</title>
      </Head>

      <GameProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </GameProvider>
    </>
  );
}

export default MyApp;
