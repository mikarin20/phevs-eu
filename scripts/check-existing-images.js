const fs = require('fs');
const path = require('path');

// cars.json dosyasını oku
const carsData = JSON.parse(fs.readFileSync('data/cars.json', 'utf8'));

// Her araç için mevcut resim dosyalarını kontrol et
const imageReport = {};

carsData.forEach(car => {
  const urlParts = car.image_url.split('/');
  const brandFromUrl = urlParts[4];
  const modelFromUrl = urlParts[5];
  
  if (!brandFromUrl || !modelFromUrl) {
    imageReport[car.id] = {
      brand: car.brand,
      model: car.model,
      slug: car.slug,
      mainImage: car.image_url,
      availableImages: [],
      missingImages: [],
      error: 'Invalid image URL structure'
    };
    return;
  }
  
  const imageDir = path.join('public', 'images', 'cars', 'brands', brandFromUrl, modelFromUrl);
  
  if (!fs.existsSync(imageDir)) {
    imageReport[car.id] = {
      brand: car.brand,
      model: car.model,
      slug: car.slug,
      mainImage: car.image_url,
      availableImages: [],
      missingImages: [],
      error: 'Image directory does not exist'
    };
    return;
  }
  
  // Mevcut dosyaları listele
  const existingFiles = fs.readdirSync(imageDir);
  
  // Ana resim dosyasını kontrol et
  const mainImageFile = path.basename(car.image_url);
  const mainImageExists = existingFiles.includes(mainImageFile);
  
  // Genel resim dosyalarını kontrol et
  const commonImageFiles = [
    '002.jpg', '003.jpg', '004.jpg', '005.jpg', '006.jpg', '007.jpg', 
    '008.jpg', '009.jpg', '010.jpg', '011.jpg', '012.jpg', '013.jpg', 
    '014.jpg', '015.jpg', '016.jpg', '017.jpg', '018.jpg', '019.jpg', 
    '020.jpg', '021.jpg', '1.jpg', 'main.jpg'
  ];
  
  const availableImages = [];
  const missingImages = [];
  
  // Ana resim dosyasını ekle
  if (mainImageExists) {
    availableImages.push(mainImageFile);
  } else {
    missingImages.push(mainImageFile);
  }
  
  // Diğer resim dosyalarını kontrol et
  commonImageFiles.forEach(file => {
    if (file !== mainImageFile) { // Ana resim dosyasını tekrar ekleme
      if (existingFiles.includes(file)) {
        availableImages.push(file);
      } else {
        missingImages.push(file);
      }
    }
  });
  
  imageReport[car.id] = {
    brand: car.brand,
    model: car.model,
    slug: car.slug,
    mainImage: car.image_url,
    availableImages,
    missingImages,
    totalAvailable: availableImages.length,
    totalMissing: missingImages.length
  };
});

// Raporu dosyaya yaz
fs.writeFileSync('outputs/image-report.json', JSON.stringify(imageReport, null, 2));

// Özet raporu konsola yazdır
console.log('=== RESİM DOSYASI RAPORU ===\n');

let totalCars = 0;
let carsWithImages = 0;
let carsWithoutImages = 0;
let totalAvailableImages = 0;
let totalMissingImages = 0;

Object.values(imageReport).forEach(report => {
  totalCars++;
  if (report.error) {
    carsWithoutImages++;
    console.log(`❌ ${report.brand} ${report.model} - ${report.error}`);
  } else if (report.totalAvailable > 0) {
    carsWithImages++;
    totalAvailableImages += report.totalAvailable;
    totalMissingImages += report.totalMissing;
    console.log(`✅ ${report.brand} ${report.model} - ${report.totalAvailable} resim mevcut, ${report.totalMissing} eksik`);
  } else {
    carsWithoutImages++;
    console.log(`❌ ${report.brand} ${report.model} - Hiç resim yok`);
  }
});

console.log(`\n=== ÖZET ===`);
console.log(`Toplam araç: ${totalCars}`);
console.log(`Resimli araç: ${carsWithImages}`);
console.log(`Resimsiz araç: ${carsWithoutImages}`);
console.log(`Toplam mevcut resim: ${totalAvailableImages}`);
console.log(`Toplam eksik resim: ${totalMissingImages}`);

// En çok eksik resmi olan araçları listele
console.log(`\n=== EN ÇOK EKSİK RESİMİ OLAN ARAÇLAR ===`);
const sortedByMissing = Object.values(imageReport)
  .filter(report => !report.error)
  .sort((a, b) => b.totalMissing - a.totalMissing)
  .slice(0, 10);

sortedByMissing.forEach(report => {
  console.log(`${report.brand} ${report.model}: ${report.totalMissing} eksik resim`);
});

console.log('\nDetaylı rapor: outputs/image-report.json');
