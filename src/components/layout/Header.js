import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useGame } from '../../context/GameContext';
import { auth } from '../../services/firebase';
import { signOut } from 'firebase/auth';

const Header = () => {
  const { player } = useGame();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <header className="bg-detective-dark text-detective-light shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* ロゴとタイトル */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="relative w-10 h-10">
            <Image
              src="/images/logo.png"
              alt="5分探偵 ロゴ"
              layout="fill"
              objectFit="contain"
              priority
            />
          </div>
          <span className="font-detective font-bold text-xl">5分探偵</span>
        </Link>

        {/* メニュー（モバイル用のハンバーガーアイコンとドロップダウン） */}
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 focus:outline-none"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
              />
            </svg>
          </button>

          {/* デスクトップ用メニュー */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/episodes" className="hover:text-detective-secondary transition-colors">
              エピソード
            </Link>
            <Link href="/science-notes" className="hover:text-detective-secondary transition-colors">
              科学ノート
            </Link>
            <Link href="/evidence" className="hover:text-detective-secondary transition-colors">
              証拠品
            </Link>
            
            {player ? (
              <div className="flex items-center space-x-3">
                <span className="text-detective-accent">
                  Score: {player.score}
                </span>
                <div className="relative group">
                  <button className="flex items-center space-x-1 focus:outline-none">
                    <span>{player.displayName}</span>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {/* プロフィールドロップダウン */}
                  <div className="absolute right-0 w-48 mt-2 py-2 bg-detective-dark border border-detective-primary rounded-md shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                    <Link href="/profile" className="block px-4 py-2 hover:bg-detective-primary transition-colors">
                      プロフィール
                    </Link>
                    <Link href="/settings" className="block px-4 py-2 hover:bg-detective-primary transition-colors">
                      設定
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="w-full text-left px-4 py-2 hover:bg-detective-primary transition-colors"
                    >
                      ログアウト
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link
                href="/login"
                className="bg-detective-primary hover:bg-detective-secondary text-white px-4 py-2 rounded-md transition-colors"
              >
                ログイン
              </Link>
            )}
          </nav>

          {/* モバイル用ドロップダウンメニュー */}
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-48 py-2 bg-detective-dark border border-detective-primary rounded-md shadow-lg md:hidden">
              <Link
                href="/episodes"
                className="block px-4 py-2 hover:bg-detective-primary transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                エピソード
              </Link>
              <Link
                href="/science-notes"
                className="block px-4 py-2 hover:bg-detective-primary transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                科学ノート
              </Link>
              <Link
                href="/evidence"
                className="block px-4 py-2 hover:bg-detective-primary transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                証拠品
              </Link>
              
              {player ? (
                <>
                  <div className="px-4 py-2 text-detective-accent border-t border-detective-primary">
                    Score: {player.score}
                  </div>
                  <Link
                    href="/profile"
                    className="block px-4 py-2 hover:bg-detective-primary transition-colors"
                    onClick={() => setMenuOpen(false)}
                  >
                    プロフィール
                  </Link>
                  <Link
                    href="/settings"
                    className="block px-4 py-2 hover:bg-detective-primary transition-colors"
                    onClick={() => setMenuOpen(false)}
                  >
                    設定
                  </Link>
                  <button
                    onClick={() => {
                      handleSignOut();
                      setMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-detective-primary transition-colors"
                  >
                    ログアウト
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  className="block px-4 py-2 hover:bg-detective-primary transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  ログイン
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
