const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// アイコンを生成する関数
async function generateIcons() {
  const sourcePath = path.join(process.cwd(), 'public', 'icons', 'icon-512x512.png');
  
  // 生成するサイズの配列
  const sizes = [72, 96, 128, 152, 384, 512];
  
  // 出力先ディレクトリ
  const outputDir = path.join(process.cwd(), 'public', 'icons');
  
  // ディレクトリが存在することを確認
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  try {
    // 各サイズのアイコンを生成
    for (const size of sizes) {
      const outputPath = path.join(outputDir, `icon-${size}x${size}.png`);
      
      await sharp(sourcePath)
        .resize(size, size)
        .toFile(outputPath);
      
      console.log(`Generated: ${outputPath}`);
    }
    
    // Apple Touch Icon (180x180)
    await sharp(sourcePath)
      .resize(180, 180)
      .toFile(path.join(outputDir, 'apple-touch-icon.png'));
    
    console.log('All icons generated successfully!');
  } catch (error) {
    console.error('Error generating icons:', error);
  }
}

// スクリプトが直接実行された場合にのみ実行
if (require.main === module) {
  console.log('Starting icon generation...');
  generateIcons();
}

module.exports = { generateIcons };
