import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../../context/GameContext';
import { auth } from '../../services/firebase';
import { signOut } from 'firebase/auth';

const Header: React.FC = () => {
  const { player } = useGame();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [scrolled, setScrolled] = useState<boolean>(false);
  const [scienceMenuOpen, setScienceMenuOpen] = useState<boolean>(false);

  // スクロール検出
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSignOut = async (): Promise<void> => {
    try {
      await signOut(auth);
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
        ? 'bg-detective-dark/95 backdrop-blur-sm shadow-lg py-2' 
        : 'bg-detective-dark py-3'
      }`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* ロゴとタイトル */}
        <Link href="/" className="flex items-center space-x-2 group">
          <div className="relative w-8 h-8 overflow-hidden">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="transform transition-transform group-hover:scale-110">
              <circle cx="16" cy="16" r="16" fill="#1E3A8A"/>
              <path d="M16 8C13.8 8 12 9.8 12 12C12 14.2 13.8 16 16 16C18.2 16 20 14.2 20 12C20 9.8 18.2 8 16 8Z" fill="#38BDF8"/>
              <path d="M22 21.6C22 19.6 20.4 18 18.4 18H13.6C11.6 18 10 19.6 10 21.6V24H22V21.6Z" fill="#38BDF8"/>
              <path d="M13 12L15 15L19 11" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="font-detective font-bold text-base text-detective-light group-hover:text-detective-secondary transition-colors">
              謎解き探偵：科学の眼
            </span>
            <span className="text-2xs text-detective-secondary font-handwritten -mt-1">
              陰謀論ミステリー編
            </span>
          </div>
        </Link>

        {/* メニュー（モバイル用のハンバーガーアイコンとドロップダウン） */}
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 focus:outline-none text-detective-light hover:text-detective-secondary transition-colors"
            aria-label="メニュー"
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
            <Link 
              href="/episodes" 
              className={`text-detective-light hover:text-detective-secondary transition-colors relative group ${
                router.pathname.includes('/episodes') ? 'text-detective-secondary font-semibold' : ''
              }`}
            >
              エピソード
              <span className={`absolute -bottom-1 left-0 h-0.5 bg-detective-secondary transition-all duration-300 ${
                router.pathname.includes('/episodes') ? 'w-full' : 'w-0 group-hover:w-full'
              }`}></span>
            </Link>
            
            <Link 
              href="/science-notes" 
              className={`text-detective-light hover:text-detective-secondary transition-colors relative group ${
                router.pathname === '/science-notes' ? 'text-detective-secondary font-semibold' : ''
              }`}
            >
              科学ノート
              <span className={`absolute -bottom-1 left-0 h-0.5 bg-detective-secondary transition-all duration-300 ${
                router.pathname === '/science-notes' ? 'w-full' : 'w-0 group-hover:w-full'
              }`}></span>
            </Link>
            

            
            <Link 
              href="/about"
              className={`text-detective-light hover:text-detective-secondary transition-colors relative group ${
                router.pathname === '/about' ? 'text-detective-secondary font-semibold' : ''
              }`}
            >
              ゲームについて
              <span className={`absolute -bottom-1 left-0 h-0.5 bg-detective-secondary transition-all duration-300 ${
                router.pathname === '/about' ? 'w-full' : 'w-0 group-hover:w-full'
              }`}></span>
            </Link>
            
            {player ? (
              <div className="flex items-center ml-2">
                <div className="relative group">
                  <button className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-detective-primary hover:bg-detective-secondary transition-colors focus:outline-none">
                    <span className="text-detective-light font-medium">
                      {player.displayName || 'ユーザー'}
                    </span>
                    <div className="bg-detective-accent text-detective-dark rounded-full px-2 py-0.5 text-xs font-bold">
                      {player.score || 0}
                    </div>
                    <svg className="w-4 h-4 text-detective-light" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {/* プロフィールドロップダウン */}
                  <div className="absolute right-0 mt-2 w-48 py-2 bg-detective-dark/95 backdrop-blur-sm border border-detective-primary rounded-md shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                    <Link href="/profile" className="block px-4 py-2 text-detective-light hover:bg-detective-primary transition-colors">
                      プロフィール
                    </Link>
                    <Link href="/settings" className="block px-4 py-2 text-detective-light hover:bg-detective-primary transition-colors">
                      設定
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="w-full text-left px-4 py-2 text-detective-light hover:bg-detective-primary transition-colors"
                    >
                      ログアウト
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link
                href="/login"
                className="bg-detective-secondary hover:bg-detective-primary text-white px-4 py-2 rounded-md transition-colors shadow-md hover:shadow-lg"
              >
                ログイン
              </Link>
            )}
          </nav>

          {/* モバイル用ドロップダウンメニュー */}
          <AnimatePresence>
            {menuOpen && (
              <motion.div 
                className="absolute right-0 mt-2 w-60 py-2 bg-detective-dark/95 backdrop-blur-sm border border-detective-primary rounded-md shadow-lg md:hidden"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <div className="px-4 py-2 border-b border-detective-primary/50 mb-2">
                  <span className="text-detective-secondary font-detective text-sm">メニュー</span>
                </div>
                
                <Link
                  href="/episodes"
                  className={`block px-4 py-3 hover:bg-detective-primary transition-colors ${
                    router.pathname.includes('/episodes') ? 'bg-detective-primary/50 text-detective-secondary' : 'text-detective-light'
                  }`}
                  onClick={() => setMenuOpen(false)}
                >
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    エピソード
                  </div>
                </Link>
                
                <Link
                  href="/science-notes"
                  className={`block px-4 py-3 hover:bg-detective-primary transition-colors ${
                    router.pathname === '/science-notes' ? 'bg-detective-primary/50 text-detective-secondary' : 'text-detective-light'
                  }`}
                  onClick={() => setMenuOpen(false)}
                >
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    科学ノート
                  </div>
                </Link>
                

                
                <Link
                  href="/about"
                  className={`block px-4 py-3 hover:bg-detective-primary transition-colors ${
                    router.pathname === '/about' ? 'bg-detective-primary/50 text-detective-secondary' : 'text-detective-light'
                  }`}
                  onClick={() => setMenuOpen(false)}
                >
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    ゲームについて
                  </div>
                </Link>
                
                <div className="border-t border-detective-primary/50 mt-2 pt-2">
                  {player ? (
                    <>
                      <div className="px-4 py-2 flex items-center justify-between">
                        <span className="text-detective-light">{player.displayName}</span>
                        <span className="bg-detective-accent text-detective-dark rounded-full px-2 py-0.5 text-xs font-bold">
                          {player.score || 0}
                        </span>
                      </div>
                      
                      <Link
                        href="/profile"
                        className="block px-4 py-2 text-detective-light hover:bg-detective-primary transition-colors"
                        onClick={() => setMenuOpen(false)}
                      >
                        <div className="flex items-center">
                          <svg className="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          プロフィール
                        </div>
                      </Link>
                      
                      <Link
                        href="/settings"
                        className="block px-4 py-2 text-detective-light hover:bg-detective-primary transition-colors"
                        onClick={() => setMenuOpen(false)}
                      >
                        <div className="flex items-center">
                          <svg className="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          設定
                        </div>
                      </Link>
                      
                      <button
                        onClick={() => {
                          handleSignOut();
                          setMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-detective-light hover:bg-detective-primary transition-colors"
                      >
                        <div className="flex items-center">
                          <svg className="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          ログアウト
                        </div>
                      </button>
                    </>
                  ) : (
                    <Link
                      href="/login"
                      className="block px-4 py-2 text-detective-light hover:bg-detective-primary transition-colors"
                      onClick={() => setMenuOpen(false)}
                    >
                      <div className="flex items-center justify-center bg-detective-secondary hover:bg-detective-primary text-white py-2 rounded-md transition-colors">
                        <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                        </svg>
                        ログイン
                      </div>
                    </Link>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};

export default Header;
