import React, { ReactNode } from 'react';
import { useRouter } from 'next/router';
import Header from './Header';
import Footer from './Footer';
import { useGame } from '../../context/GameContext';

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
      <div className="min-h-screen flex items-center justify-center bg-detective-light">
        <div className="text-center">
          <div className="inline-block w-16 h-16 border-4 border-detective-secondary border-t-detective-primary rounded-full animate-spin"></div>
          <p className="mt-4 text-detective-dark font-detective">読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">{children}</main>
      {!hideFooter && <Footer />}
    </div>
  );
};

export default Layout;
