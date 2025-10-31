#!/usr/bin/env node

/**
 * Blog Görsellerini Otomatik Güncelleme Script'i
 * 
 * Bu script, public/images/blog/ klasöründeki görselleri tarar ve
 * data/blog.json dosyasındaki featured_image path'lerini otomatik günceller.
 * 
 * Kullanım:
 *   node scripts/update-blog-images.js          # Tek seferlik güncelleme
 *   node scripts/update-blog-images.js --watch  # Watch mode (dosya değişikliklerini izler)
 */

const fs = require('fs');
const path = require('path');

const BLOG_IMAGES_DIR = path.join(__dirname, '../public/images/blog');
const BLOG_JSON_PATH = path.join(__dirname, '../data/blog.json');

// Desteklenen görsel formatları
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'];
const FEATURED_NAMES = ['featured'];

/**
 * Blog klasörlerindeki featured görselleri bulur
 */
function findFeaturedImages() {
  const images = {};
  
  if (!fs.existsSync(BLOG_IMAGES_DIR)) {
    console.warn(`⚠️  Blog görselleri klasörü bulunamadı: ${BLOG_IMAGES_DIR}`);
    return images;
  }

  const folders = fs.readdirSync(BLOG_IMAGES_DIR, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

  for (const folder of folders) {
    const folderPath = path.join(BLOG_IMAGES_DIR, folder);
    
    // Önce direkt klasörde featured görseli ara
    for (const ext of IMAGE_EXTENSIONS) {
      for (const name of FEATURED_NAMES) {
        const fileName = `${name}${ext}`;
        const filePath = path.join(folderPath, fileName);
        
        if (fs.existsSync(filePath)) {
          const relativePath = `/images/blog/${folder}/${fileName}`;
          images[folder] = relativePath;
          console.log(`✅ Bulundu: ${folder} -> ${relativePath}`);
          break;
        }
      }
      if (images[folder]) break;
    }
    
    // Eğer bulunamadıysa, klasördeki ilk görseli al (fallback)
    if (!images[folder]) {
      const files = fs.readdirSync(folderPath);
      const imageFile = files.find(file => 
        IMAGE_EXTENSIONS.some(ext => file.toLowerCase().endsWith(ext))
      );
      
      if (imageFile) {
        const relativePath = `/images/blog/${folder}/${imageFile}`;
        images[folder] = relativePath;
        console.log(`⚠️  Featured bulunamadı, ilk görsel kullanıldı: ${folder} -> ${relativePath}`);
      }
    }
  }

  return images;
}

/**
 * blog.json dosyasını günceller
 */
function updateBlogJson(foundImages) {
  if (!fs.existsSync(BLOG_JSON_PATH)) {
    console.error(`❌ blog.json dosyası bulunamadı: ${BLOG_JSON_PATH}`);
    return false;
  }

  let updated = false;
  const blogData = JSON.parse(fs.readFileSync(BLOG_JSON_PATH, 'utf8'));

  for (const post of blogData) {
    const slug = post.slug;
    
    if (foundImages[slug]) {
      const newPath = foundImages[slug];
      
      // Sadece path değiştiyse güncelle
      if (post.featured_image !== newPath) {
        console.log(`📝 Güncelleniyor: ${post.title || post.title_en || slug}`);
        console.log(`   Eski: ${post.featured_image}`);
        console.log(`   Yeni: ${newPath}`);
        post.featured_image = newPath;
        updated = true;
      }
    } else {
      // Eğer görsel bulunamadıysa uyarı ver
      if (!post.featured_image || !post.featured_image.includes('/images/blog/')) {
        console.warn(`⚠️  Görsel bulunamadı: ${slug} (${post.title || post.title_en || 'Bilinmeyen'})`);
      }
    }
  }

  if (updated) {
    // JSON'ı güzel formatla kaydet
    fs.writeFileSync(
      BLOG_JSON_PATH,
      JSON.stringify(blogData, null, 2) + '\n',
      'utf8'
    );
    console.log(`\n✅ blog.json güncellendi!`);
    return true;
  } else {
    console.log(`\nℹ️  Güncellenecek değişiklik yok.`);
    return false;
  }
}

/**
 * Ana fonksiyon
 */
function main() {
  const isWatchMode = process.argv.includes('--watch');
  
  console.log('🔍 Blog görselleri taranıyor...\n');
  
  function update() {
    const foundImages = findFeaturedImages();
    console.log(`\n📊 Toplam ${Object.keys(foundImages).length} görsel bulundu.\n`);
    updateBlogJson(foundImages);
  }
  
  if (isWatchMode) {
    console.log('👀 Watch mode aktif - dosya değişiklikleri izleniyor...\n');
    console.log('Çıkmak için Ctrl+C basın.\n');
    
    // chokidar kullanarak watch mode (eğer yoksa basit polling)
    let timeout;
    const watchInterval = setInterval(() => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        console.log('\n🔄 Değişiklikler kontrol ediliyor...\n');
        update();
        console.log('\n⏳ Bekleniyor... (Ctrl+C ile çıkış)\n');
      }, 1000); // 1 saniye debounce
    }, 2000); // Her 2 saniyede bir kontrol et
    
    // İlk çalıştırma
    update();
    
    // Graceful shutdown
    process.on('SIGINT', () => {
      console.log('\n\n👋 Watch mode durduruluyor...');
      clearInterval(watchInterval);
      process.exit(0);
    });
  } else {
    update();
  }
}

// Script çalıştır
if (require.main === module) {
  main();
}

module.exports = { findFeaturedImages, updateBlogJson };

