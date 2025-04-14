// Service Worker for the 5-Minute Detective App

const CACHE_NAME = 'five-minute-detective-v1';
const STATIC_CACHE_NAME = 'five-minute-detective-static-v1';
const DYNAMIC_CACHE_NAME = 'five-minute-detective-dynamic-v1';
const OFFLINE_PAGE = '/offline.html';

// キャッシュするべき静的アセット
const staticAssets = [
  '/',
  '/index.html',
  '/offline.html',
  '/manifest.json',
  '/favicon.ico',
  '/favicon.svg',
  '/icons/apple-touch-icon.png',
  '/icons/icon-72x72.png',
  '/icons/icon-96x96.png',
  '/icons/icon-128x128.png',
  '/icons/icon-144x144.png',
  '/icons/icon-152x152.png',
  '/icons/icon-192x192.png',
  '/icons/icon-384x384.png',
  '/icons/icon-512x512.png',
  '/episodes',
  '/science-notes',
  '/evidence',
  '/login',
  '/register',
  '/about'
];

// バックグラウンド同期のためのキュー
let bgSyncQueue = [];

// インストール時にキャッシュを設定
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing Service Worker...');
  
  event.waitUntil(
    Promise.all([
      // 静的アセットのキャッシュ
      caches.open(STATIC_CACHE_NAME)
        .then((cache) => {
          console.log('[Service Worker] Caching static assets');
          return cache.addAll(staticAssets);
        }),
      
      // オフラインページの準備
      caches.open(CACHE_NAME)
        .then((cache) => {
          console.log('[Service Worker] Caching offline page');
          return cache.add(OFFLINE_PAGE);
        })
    ])
  );
  
  // 待機中のService Workerを即座にアクティブにする
  self.skipWaiting();
});

// ストラテジー1: キャッシュファースト (静的アセット用)
const cacheFirstStrategy = async (request) => {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    
    // 成功した場合のみキャッシュに保存
    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('[Service Worker] Network request failed and no cache available', error);
    
    // オフラインページを返す (HTMLリクエストの場合)
    if (request.headers.get('Accept').includes('text/html')) {
      return caches.match(OFFLINE_PAGE);
    }
    
    // その他のリクエストの場合はエラーをスロー
    throw error;
  }
};

// ストラテジー2: ネットワークファースト (API/動的コンテンツ用)
const networkFirstStrategy = async (request) => {
  try {
    const networkResponse = await fetch(request);
    
    // レスポンスをクローンしてキャッシュに保存
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('[Service Worker] Network request failed, falling back to cache', error);
    
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // オフラインページを返す (HTMLリクエストの場合)
    if (request.headers.get('Accept').includes('text/html')) {
      return caches.match(OFFLINE_PAGE);
    }
    
    // その他のリクエストの場合はエラーをスロー
    throw error;
  }
};

// フェッチリクエストの処理
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // 静的アセットへのリクエストかどうかをチェック
  const isStaticAsset = staticAssets.some(asset => 
    url.pathname === asset || 
    url.pathname.startsWith('/icons/') || 
    url.pathname.endsWith('.jpg') || 
    url.pathname.endsWith('.png') || 
    url.pathname.endsWith('.svg') || 
    url.pathname.endsWith('.css') || 
    url.pathname.endsWith('.js')
  );
  
  // APIリクエストかどうかをチェック
  const isApiRequest = url.pathname.startsWith('/api/') || 
                       url.pathname.includes('firebase') || 
                       url.origin !== location.origin;
  
  // POST/PUT/DELETEリクエストの場合はバックグラウンド同期を試みる
  if (event.request.method !== 'GET') {
    if (navigator.onLine) {
      event.respondWith(fetch(event.request));
    } else {
      // オフライン時はキューに追加
      event.respondWith(new Response(JSON.stringify({ 
        offline: true, 
        message: 'This operation has been queued for background sync' 
      }), {
        headers: { 'Content-Type': 'application/json' }
      }));
      
      bgSyncQueue.push(event.request.clone());
    }
    return;
  }
  
  // 適切なキャッシュ戦略を適用
  if (isStaticAsset) {
    event.respondWith(cacheFirstStrategy(event.request));
  } else if (isApiRequest) {
    event.respondWith(networkFirstStrategy(event.request));
  } else {
    // その他のリクエスト (動的HTML等)
    event.respondWith(networkFirstStrategy(event.request));
  }
});

// アクティベート時に古いキャッシュを削除
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating Service Worker...');
  
  event.waitUntil(
    Promise.all([
      // 古いキャッシュの削除
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter(cacheName => {
              return cacheName.startsWith('five-minute-detective-') && 
                    cacheName !== STATIC_CACHE_NAME && 
                    cacheName !== DYNAMIC_CACHE_NAME && 
                    cacheName !== CACHE_NAME;
            })
            .map(cacheName => {
              console.log('[Service Worker] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            })
        );
      }),
      
      // クライアントコントロールを即座に取得
      self.clients.claim()
    ])
  );
});

// オンライン復帰時にキューに入れられたリクエストを処理
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-game-data') {
    console.log('[Service Worker] Syncing game data...');
    
    event.waitUntil(
      Promise.all(
        bgSyncQueue.map(async (request) => {
          try {
            await fetch(request);
            console.log('[Service Worker] Background sync successful for:', request.url);
          } catch (error) {
            console.error('[Service Worker] Background sync failed:', error);
          }
        })
      ).then(() => {
        // 成功したらキューをクリア
        bgSyncQueue = [];
      })
    );
  }
});

// プッシュ通知の受信処理
self.addEventListener('push', (event) => {
  console.log('[Service Worker] Push notification received:', event);
  
  let notificationData = {};
  
  if (event.data) {
    notificationData = event.data.json();
  }
  
  const options = {
    body: notificationData.body || '5分探偵からの新しい通知です',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-96x96.png',
    vibrate: [100, 50, 100],
    data: {
      url: notificationData.url || '/'
    }
  };
  
  event.waitUntil(
    self.registration.showNotification(
      notificationData.title || '5分探偵：知恵の糸',
      options
    )
  );
});

// 通知クリック時の処理
self.addEventListener('notificationclick', (event) => {
  const notification = event.notification;
  const action = event.action;
  const url = notification.data.url;
  
  notification.close();
  
  // ユーザーを特定のURLに移動
  event.waitUntil(
    clients.matchAll({ type: 'window' })
      .then((clientList) => {
        // 既存のウィンドウがあればそれを使用
        for (const client of clientList) {
          if (client.url === url && 'focus' in client) {
            return client.focus();
          }
        }
        
        // 新しいウィンドウを開く
        if (clients.openWindow) {
          return clients.openWindow(url);
        }
      })
  );
});
