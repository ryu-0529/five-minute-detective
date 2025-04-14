import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// オフライン検出コンポーネント
const OfflineDetector: React.FC = () => {
  // オンライン状態を追跡
  const [isOnline, setIsOnline] = useState<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  
  // オフライン通知の表示状態
  const [showNotification, setShowNotification] = useState<boolean>(false);

  // オンライン状態の変更を監視
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      // オンラインに戻った通知を一時的に表示
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowNotification(true);
    };

    // イベントリスナーを登録
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // クリーンアップ
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <AnimatePresence>
      {showNotification && (
        <motion.div
          className={`fixed bottom-4 left-0 right-0 mx-auto w-max z-50 py-2 px-4 rounded-lg shadow-lg ${
            isOnline 
              ? 'bg-green-500 text-white' 
              : 'bg-red-500 text-white'
          }`}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center space-x-2">
            <span className={`h-2 w-2 rounded-full ${isOnline ? 'bg-green-200' : 'bg-red-200'}`}></span>
            <p>
              {isOnline 
                ? '再接続されました。すべての機能が利用可能です。' 
                : 'オフラインになりました。一部の機能が制限されます。'
              }
            </p>
            <button 
              onClick={() => setShowNotification(false)}
              className="ml-2 text-white hover:text-gray-200"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default OfflineDetector;