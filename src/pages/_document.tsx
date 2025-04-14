import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="ja">
      <Head>
        {/* Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&family=Indie+Flower&display=swap" 
          rel="stylesheet" 
        />
        
        {/* Safari と iOS 用のメタタグ */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="5分探偵" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
