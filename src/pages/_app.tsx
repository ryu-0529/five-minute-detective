import { useEffect, useState } from 'react';
import Head from 'next/head';
import { GameProvider } from '../context/GameContext';
import '../styles/globals.css';
import type { AppProps } from 'next/app';

// レイアウトコンポーネント
import Layout from '../components/layout/Layout';
import OfflineDetector from '../components/utility/OfflineDetector';

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  const [isInstallable, setIsInstallable] = useState<boolean>(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  
  // PWA関連の設定
  useEffect(() => {
    // Service Workerの登録
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      window.addEventListener('load', function () {
        navigator.serviceWorker.register('/sw.js').then(
          function (registration) {
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
            
            // プッシュ通知の購読設定
            if ('PushManager' in window) {
              const subscribeOptions = {
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(
                  'YOUR_PUBLIC_VAPID_KEY_HERE' // 実際のプロジェクトでは実際のキーを使用
                )
              };
              
              registration.pushManager.subscribe(subscribeOptions)
                .then(subscription => {
                  console.log('Push notification subscription successful');
                })
                .catch(error => {
                  console.log('Push notification subscription failed: ', error);
                });
            }
            
            // バックグラウンド同期の登録
            if ('sync' in registration) {
              navigator.serviceWorker.ready
                .then(registration => {
                  return registration.sync.register('sync-game-data');
                })
                .then(() => {
                  console.log('Background sync registered');
                })
                .catch(error => {
                  console.log('Background sync registration failed: ', error);
                });
            }
          },
          function (err) {
            console.log('ServiceWorker registration failed: ', err);
          }
        );
      });
    }
    
    // インストール可能イベントのリスナー
    const handleBeforeInstallPrompt = (e: any) => {
      // インストールプロンプトをすぐに表示しないようにする
      e.preventDefault();
      // 後でプロンプトを表示できるようにイベントを保存
      setDeferredPrompt(e);
      // インストールボタンを表示する
      setIsInstallable(true);
    };
    
    // インストール完了後の処理
    const handleAppInstalled = () => {
      // インストールボタンを非表示にする
      setIsInstallable(false);
      // イベントを削除
      setDeferredPrompt(null);
      console.log('Application installed');
    };
    
    // イベントリスナーの登録
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    
    // クリーンアップ
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);
  
  // Base64のVAPIDキーをUint8Array形式に変換
  const urlBase64ToUint8Array = (base64String: string): Uint8Array => {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');
  
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
  
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  };
  
  // アプリのインストールを促す
  const installApp = async () => {
    if (!deferredPrompt) return;
    
    // インストールプロンプトを表示
    deferredPrompt.prompt();
    
    // ユーザーの選択を待機
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User ${outcome === 'accepted' ? 'accepted' : 'declined'} the install prompt`);
    
    // プロンプトは一度しか使えないので削除
    setDeferredPrompt(null);
    setIsInstallable(false);
  };

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
        
        {/* Fonts are loaded via _document.tsx instead */}
        <title>5分探偵：知恵の糸</title>
      </Head>

      <GameProvider>
        <Layout>
          <Component {...pageProps} />
          
          {/* オフライン状態の検出と通知 */}
          <OfflineDetector />
          
          {/* インストールバナー (必要に応じて表示) */}
          {isInstallable && (
            <div className="fixed bottom-0 left-0 right-0 bg-detective-primary text-white p-4 flex justify-between items-center">
              <div>
                <p className="font-bold">5分探偵アプリをインストール</p>
                <p className="text-sm">ホーム画面に追加してオフラインでも使用できます</p>
              </div>
              <button 
                onClick={installApp}
                className="bg-detective-accent px-4 py-2 rounded-lg font-bold hover:bg-yellow-500 transition-colors"
              >
                インストール
              </button>
            </div>
          )}
        </Layout>
      </GameProvider>
    </>
  );
}

export default MyApp;
