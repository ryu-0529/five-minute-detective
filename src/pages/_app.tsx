import { useEffect, useState } from 'react';
import Head from 'next/head';
import { GameProvider } from '../context/GameContext';
import '../styles/globals.css';
import type { AppProps } from 'next/app';

// レイアウトコンポーネント
import Layout from '../components/layout/Layout';
import OfflineDetector from '../components/utility/OfflineDetector';

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  // Service Workerの登録
  useEffect(() => {
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then(
          registration => {
            console.log('Service Worker registered: ', registration);
          },
          error => {
            console.log('Service Worker registration failed: ', error);
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
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
        
        <title>5分探偵：知恵の糸</title>
      </Head>

      <GameProvider>
        <Layout>
          <Component {...pageProps} />
          
          {/* オフライン状態の検出と通知 */}
          <OfflineDetector />
        </Layout>
      </GameProvider>
    </>
  );
}

export default MyApp;
