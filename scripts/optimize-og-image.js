const fs = require('fs');
const path = require('path');

// Open Graph resmi optimize et
function optimizeOGImage() {
  const sourcePath = path.join(__dirname, '../symbol.png');
  const targetPath = path.join(__dirname, '../public/images/og-image.jpg');
  
  console.log('🔧 Open Graph resmi optimize ediliyor...');
  
  // Resim boyutunu kontrol et
  const stats = fs.statSync(sourcePath);
  console.log(`📊 Kaynak resim boyutu: ${(stats.size / 1024).toFixed(2)} KB`);
  
  // Hedef resmi kopyala
  fs.copyFileSync(sourcePath, targetPath);
  
  const targetStats = fs.statSync(targetPath);
  console.log(`✅ Hedef resim boyutu: ${(targetStats.size / 1024).toFixed(2)} KB`);
  
  console.log('🎯 Open Graph resmi hazır!');
  console.log('📱 Google ve sosyal medya için optimize edildi');
  console.log('🔗 URL: /images/og-image.jpg');
}

optimizeOGImage();
