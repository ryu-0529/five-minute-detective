const fs = require('fs');
const path = require('path');
const { createCanvas } = require('canvas');

// スクリーンショットを生成する関数
async function generateScreenshots() {
  const outputDir = path.join(process.cwd(), 'public', 'screenshots');
  
  // ディレクトリが存在することを確認
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // iPhone 12 Pro の解像度 (1170 x 2532)をスケールダウンしたサイズ
  const width = 1125;
  const height = 2436;
  
  // スクリーンショット1: ホーム画面
  createScreenshot(
    outputDir,
    'screen1.png',
    width,
    height,
    '#F8FAFC',
    (context) => {
      // ヘッダー
      context.fillStyle = '#1E3A8A';
      context.fillRect(0, 0, width, 180);
      
      // タイトル
      context.fillStyle = 'white';
      context.font = 'bold 48px Arial';
      context.textAlign = 'center';
      context.fillText('5分探偵：知恵の糸', width / 2, 100);
      
      // コンテンツ領域
      for (let i = 0; i < 3; i++) {
        // カード
        const cardY = 250 + i * 320;
        context.fillStyle = 'white';
        context.fillRect(100, cardY, width - 200, 280);
        
        // ボーダー
        context.strokeStyle = '#1E3A8A';
        context.lineWidth = 2;
        context.strokeRect(100, cardY, width - 200, 280);
        
        // エピソードタイトル
        context.fillStyle = '#1E3A8A';
        context.font = 'bold 36px Arial';
        context.textAlign = 'left';
        context.fillText(`エピソード ${i + 1}`, 130, cardY + 60);
        
        // 説明テキスト
        context.fillStyle = '#333';
        context.font = '24px Arial';
        const titles = ['消えた展示物', '謎の病気', '暗号化された脅迫'];
        context.fillText(titles[i], 130, cardY + 110);
        
        // 難易度バッジ
        const difficulties = ['初級', '中級', '上級'];
        const colors = ['#10B981', '#3B82F6', '#EF4444'];
        context.fillStyle = colors[i];
        context.fillRect(width - 250, cardY + 40, 120, 40);
        context.fillStyle = 'white';
        context.font = 'bold 24px Arial';
        context.textAlign = 'center';
        context.fillText(difficulties[i], width - 190, cardY + 65);
      }
    }
  );
  
  // スクリーンショット2: エピソード画面
  createScreenshot(
    outputDir,
    'screen2.png',
    width,
    height,
    '#F8FAFC',
    (context) => {
      // ヘッダー
      context.fillStyle = '#1E3A8A';
      context.fillRect(0, 0, width, 180);
      
      // エピソードタイトル
      context.fillStyle = 'white';
      context.font = 'bold 40px Arial';
      context.textAlign = 'center';
      context.fillText('消えた展示物', width / 2, 100);
      
      // タイマー
      context.fillStyle = '#FCD34D';
      context.fillRect(width - 200, 60, 150, 60);
      context.fillStyle = '#1E3A8A';
      context.font = 'bold 36px Arial';
      context.textAlign = 'center';
      context.fillText('04:32', width - 125, 100);
      
      // 場所情報
      context.fillStyle = 'white';
      context.font = '28px Arial';
      context.textAlign = 'left';
      context.fillText('科学博物館', 50, 100);
      
      // 証拠エリア
      context.fillStyle = 'white';
      context.fillRect(50, 200, width - 100, 400);
      context.strokeStyle = '#1E3A8A';
      context.lineWidth = 2;
      context.strokeRect(50, 200, width - 100, 400);
      
      // 証拠タイトル
      context.fillStyle = '#1E3A8A';
      context.font = 'bold 32px Arial';
      context.textAlign = 'left';
      context.fillText('証拠品', 80, 250);
      
      // 証拠アイテム
      for (let i = 0; i < 3; i++) {
        const itemX = 80 + i * 320;
        context.fillStyle = '#E2E8F0';
        context.fillRect(itemX, 280, 280, 280);
        
        // アイコン枠
        context.fillStyle = '#1E3A8A';
        context.fillRect(itemX + 100, 320, 80, 80);
        
        // アイテム名
        const items = ['特殊反射材', '改造カメラ', '研究ノート'];
        context.fillStyle = '#1E293B';
        context.font = 'bold 24px Arial';
        context.textAlign = 'center';
        context.fillText(items[i], itemX + 140, 450);
      }
      
      // 科学パズルエリア
      context.fillStyle = 'white';
      context.fillRect(50, 650, width - 100, 400);
      context.strokeStyle = '#3B82F6';
      context.lineWidth = 2;
      context.strokeRect(50, 650, width - 100, 400);
      
      // パズルタイトル
      context.fillStyle = '#3B82F6';
      context.font = 'bold 32px Arial';
      context.textAlign = 'left';
      context.fillText('光学パズル', 80, 700);
      
      // パズル要素
      context.fillStyle = '#E2E8F0';
      context.fillRect(80, 730, width - 160, 280);
      
      // 鏡や光線などのパズル要素
      context.strokeStyle = '#3B82F6';
      context.lineWidth = 3;
      context.beginPath();
      context.moveTo(150, 800);
      context.lineTo(350, 800);
      context.stroke();
      
      context.fillStyle = '#FCD34D';
      context.beginPath();
      context.arc(150, 800, 20, 0, Math.PI * 2);
      context.fill();
      
      context.fillStyle = '#9CA3AF';
      context.fillRect(400, 750, 30, 100);
      
      context.fillStyle = '#9CA3AF';
      context.fillRect(600, 850, 100, 30);
    }
  );
  
  console.log('All screenshots generated successfully!');
}

// スクリーンショットを生成するヘルパー関数
function createScreenshot(outputDir, filename, width, height, bgColor, drawFunc) {
  const canvas = createCanvas(width, height);
  const context = canvas.getContext('2d');
  
  // 背景色
  context.fillStyle = bgColor;
  context.fillRect(0, 0, width, height);
  
  // コンテンツを描画
  drawFunc(context);
  
  // ファイルに保存
  const outputPath = path.join(outputDir, filename);
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(outputPath, buffer);
  
  console.log(`Generated: ${outputPath}`);
}

// スクリプトが直接実行された場合にのみ実行
if (require.main === module) {
  console.log('Starting screenshot generation...');
  generateScreenshots();
}

module.exports = { generateScreenshots };
