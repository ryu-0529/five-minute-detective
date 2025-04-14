import React, { ReactNode } from 'react';
import { useRouter } from 'next/router';
import Header from './Header';
import Footer from './Footer';
import { useGame } from '../../context/GameContext';
import { motion } from 'framer-motion';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { loading } = useGame();
  const router = useRouter();

  // フッターを表示しないページリスト
  const noFooterPages = [
    '/episodes/[id]', // エピソード詳細ページでプレイ中はフッターを非表示
  ];

  // 現在のルートがフッターを表示しないページかチェック
  const hideFooter = noFooterPages.includes(router.pathname);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-detective-dark text-detective-light">
        <div className="text-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-block w-20 h-20 relative"
          >
            <div className="absolute inset-0 border-4 border-t-detective-secondary border-detective-primary rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-detective font-bold text-xl">5</span>
            </div>
          </motion.div>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-4 font-detective"
          >
            調査準備中...
          </motion.p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-detective-light">
      <Header />
      <main className="flex-grow pt-20 mt-2">{children}</main>
      {!hideFooter && <Footer />}
    </div>
  );
};

export default Layout;
