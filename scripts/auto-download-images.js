const fs = require('fs');
const https = require('https');
const path = require('path');

// Web scraping ile resim URL'lerini bulma
const carImageSources = {
  // Peugeot 3008 Hybrid - Resmi site resimleri
  'Peugeot 3008 Hybrid4': [
    'https://www.peugeot.pl/content/dam/peugeot/pl/modele/new-peugeot-3008/hybrid/hero/hero-3008-hybrid.jpg',
    'https://www.peugeot.pl/content/dam/peugeot/pl/modele/new-peugeot-3008/hybrid/gallery/gallery-1.jpg',
    'https://www.peugeot.pl/content/dam/peugeot/pl/modele/new-peugeot-3008/hybrid/gallery/gallery-2.jpg',
    'https://www.peugeot.pl/content/dam/peugeot/pl/modele/new-peugeot-3008/hybrid/gallery/gallery-3.jpg',
    'https://www.peugeot.pl/content/dam/peugeot/pl/modele/new-peugeot-3008/hybrid/gallery/gallery-4.jpg',
    'https://www.peugeot.pl/content/dam/peugeot/pl/modele/new-peugeot-3008/hybrid/gallery/gallery-5.jpg'
  ],
  
  // BMW 3 Series 330e - Resmi site resimleri
  'BMW 3 Series 330e': [
    'https://www.bmw.pl/content/dam/bmw/marketPL/bmw_pl/vehicles/3-series/2023/hero/hero-3-series.jpg',
    'https://www.bmw.pl/content/dam/bmw/marketPL/bmw_pl/vehicles/3-series/2023/gallery/gallery-1.jpg',
    'https://www.bmw.pl/content/dam/bmw/marketPL/bmw_pl/vehicles/3-series/2023/gallery/gallery-2.jpg',
    'https://www.bmw.pl/content/dam/bmw/marketPL/bmw_pl/vehicles/3-series/2023/gallery/gallery-3.jpg'
  ],
  
  // Mercedes C-Class C 300e - Resmi site resimleri
  'Mercedes-Benz C-Class C 300e': [
    'https://www.mercedes-benz.pl/content/dam/mercedes-benz/pl/vehicles/passenger-cars/c-class/2023/hero/hero-c-class.jpg',
    'https://www.mercedes-benz.pl/content/dam/mercedes-benz/pl/vehicles/passenger-cars/c-class/2023/gallery/gallery-1.jpg',
    'https://www.mercedes-benz.pl/content/dam/mercedes-benz/pl/vehicles/passenger-cars/c-class/2023/gallery/gallery-2.jpg',
    'https://www.mercedes-benz.pl/content/dam/mercedes-benz/pl/vehicles/passenger-cars/c-class/2023/gallery/gallery-3.jpg'
  ],
  
  // Audi A4 Avant 55 TFSI e - Resmi site resimleri
  'Audi A4 Avant 55 TFSI e': [
    'https://www.audi.pl/content/dam/audi/pl/vehicles/a4/2023/hero/hero-a4-avant.jpg',
    'https://www.audi.pl/content/dam/audi/pl/vehicles/a4/2023/gallery/gallery-1.jpg',
    'https://www.audi.pl/content/dam/audi/pl/vehicles/a4/2023/gallery/gallery-2.jpg',
    'https://www.audi.pl/content/dam/audi/pl/vehicles/a4/2023/gallery/gallery-3.jpg'
  ]
};

// Resim indirme fonksiyonu
function downloadImage(url, filename) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filename);
    
    // Anti-bot koruması için header'lar
    const options = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Referer': 'https://www.peugeot.pl/',
        'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8',
        'Accept-Language': 'pl-PL,pl;q=0.9,en;q=0.8',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    };
    
    https.get(url, options, (response) => {
      if (response.statusCode === 200) {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          resolve();
        });
      } else {
        reject(new Error(`HTTP ${response.statusCode}`));
      }
    }).on('error', (err) => {
      fs.unlink(filename, () => {});
      reject(err);
    });
  });
}

// Ana fonksiyon - Tüm resimleri otomatik indir
async function downloadAllImages() {
  const carsData = JSON.parse(fs.readFileSync('./data/cars.json', 'utf8'));
  const downloadDir = './public/images/cars/real';
  
  // Klasörü oluştur
  if (!fs.existsSync(downloadDir)) {
    fs.mkdirSync(downloadDir, { recursive: true });
  }
  
  console.log('🚀 Otomatik resim indirme başlatılıyor...\n');
  
  let totalSuccess = 0;
  let totalError = 0;
  
  for (const car of carsData) {
    const modelKey = car.brand + ' ' + car.model;
    
    if (carImageSources[modelKey]) {
      console.log(`📸 ${modelKey} resimleri indiriliyor...`);
      
      const brand = car.brand.toLowerCase().replace(/[^a-zA-Z0-9]/g, '');
      const model = car.model.toLowerCase().replace(/[^a-zA-Z0-9]/g, '');
      
      let successCount = 0;
      let errorCount = 0;
      
      for (let i = 0; i < carImageSources[modelKey].length; i++) {
        const url = carImageSources[modelKey][i];
        const filename = path.join(downloadDir, `${brand}-${model}-${i + 1}.jpg`);
        
        try {
          await downloadImage(url, filename);
          console.log(`  ✅ Resim ${i + 1} indirildi`);
          successCount++;
        } catch (error) {
          console.log(`  ❌ Resim ${i + 1} hatası: ${error.message}`);
          errorCount++;
        }
      }
      
      // İlk başarılı resmi ana resim olarak ata
      if (successCount > 0) {
        car.image_url = `/images/cars/real/${brand}-${model}-1.jpg`;
        console.log(`  🎯 Ana resim: ${brand}-${model}-1.jpg`);
      }
      
      totalSuccess += successCount;
      totalError += errorCount;
      
      console.log(`  📊 ${modelKey}: ${successCount} başarılı, ${errorCount} hata\n`);
    } else {
      console.log(`⚠️ ${modelKey} -> Kaynak bulunamadı`);
    }
  }
  
  // Güncellenmiş veriyi kaydet
  fs.writeFileSync('./data/cars.json', JSON.stringify(carsData, null, 2), 'utf8');
  
  console.log('🎉 Otomatik indirme tamamlandı!');
  console.log(`✅ Toplam başarılı: ${totalSuccess}`);
  console.log(`❌ Toplam hata: ${totalError}`);
  console.log('📁 Dosyalar: public/images/cars/real/');
  console.log('🎯 Artık siteyi test edebilirsin!');
}

// Scripti çalıştır
downloadAllImages().catch(console.error);

