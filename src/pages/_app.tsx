import { useEffect, useState } from 'react';
import Head from 'next/head';
import { GameProvider } from '../context/GameContext';
import '../styles/globals.css';
import type { AppProps } from 'next/app';

// レイアウトコンポーネント
import Layout from '../components/layout/Layout';
import OfflineDetector from '../components/utility/OfflineDetector';

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  // Service Workerの登録 - メッセージチャネルの問題を修正
  useEffect(() => {
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      window.addEventListener('load', () => {
        // 登録時にメッセージチャネルがクローズする前に処理を完了するよう修正
        navigator.serviceWorker.register('/sw.js', { scope: '/' })
          .then(registration => {
            console.log('Service Worker registered: ', registration);
            
            // 既存の古いServiceWorkerを即座に更新
            if (registration.waiting) {
              registration.waiting.postMessage({ type: 'SKIP_WAITING' });
            }
          })
          .catch(error => {
            console.log('Service Worker registration failed: ', error);
          });
      });
    }
  }, []);

  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <meta name="description" content="科学の力で陰謀論に立ち向かうミステリーゲーム - 科学の眼（メ）で真実を見極めよう！" />
        <meta name="theme-color" content="#1E40AF" />
        
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
        
        <title>謎解き探偵：科学の眼（メ）</title>
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
