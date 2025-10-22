const fs = require('fs');
const path = require('path');

// Ana cars.json dosyasını oku
const carsData = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/cars.json'), 'utf8'));

console.log(`Toplam araç sayısı: ${carsData.length}`);

// Eksik NCAP raporlarını tespit et
function checkMissingNCAP(cars) {
  const missingNCAP = [];
  const hasNCAP = [];
  
  cars.forEach(car => {
    if (!car.euroncap_rating) {
      missingNCAP.push({
        brand: car.brand,
        model: car.model,
        year: car.year,
        slug: car.slug
      });
    } else {
      hasNCAP.push({
        brand: car.brand,
        model: car.model,
        year: car.year,
        stars: car.euroncap_rating.stars
      });
    }
  });
  
  return { missingNCAP, hasNCAP };
}

// Analiz yap
const { missingNCAP, hasNCAP } = checkMissingNCAP(carsData);

console.log('\n=== EURO NCAP DURUMU ===');
console.log(`NCAP raporu olan: ${hasNCAP.length} araç`);
console.log(`NCAP raporu eksik: ${missingNCAP.length} araç`);

// Marka bazında eksik NCAP raporları
console.log('\n=== EKSİK NCAP RAPORLARI ===');
const missingByBrand = {};
missingNCAP.forEach(car => {
  if (!missingByBrand[car.brand]) {
    missingByBrand[car.brand] = [];
  }
  missingByBrand[car.brand].push(car);
});

Object.keys(missingByBrand).forEach(brand => {
  console.log(`\n${brand} (${missingByBrand[brand].length} araç):`);
  missingByBrand[brand].forEach(car => {
    console.log(`  - ${car.model} (${car.year})`);
  });
});

// Mevcut NCAP raporları
console.log('\n=== MEVCUT NCAP RAPORLARI ===');
const existingByBrand = {};
hasNCAP.forEach(car => {
  if (!existingByBrand[car.brand]) {
    existingByBrand[car.brand] = [];
  }
  existingByBrand[car.brand].push(car);
});

Object.keys(existingByBrand).forEach(brand => {
  console.log(`\n${brand} (${existingByBrand[brand].length} araç):`);
  existingByBrand[brand].forEach(car => {
    console.log(`  - ${car.model} (${car.year}): ${car.stars} yıldız`);
  });
});

// Öncelikli modeller (popüler markalar)
console.log('\n=== ÖNCELİKLİ MODELLER (NCAP ÇEKİLECEK) ===');
const priorityBrands = ['BMW', 'Mercedes-Benz', 'Audi', 'Volkswagen', 'Toyota', 'Volvo'];
const priorityMissing = missingNCAP.filter(car => priorityBrands.includes(car.brand));

priorityMissing.forEach(car => {
  console.log(`${car.brand} ${car.model} (${car.year})`);
});

console.log(`\nToplam ${priorityMissing.length} öncelikli model için NCAP raporu çekilecek.`);

// CSV formatında çıktı
const csvContent = [
  'Brand,Model,Year,Slug,Priority',
  ...priorityMissing.map(car => `${car.brand},${car.model},${car.year},${car.slug},High`),
  ...missingNCAP.filter(car => !priorityBrands.includes(car.brand)).map(car => `${car.brand},${car.model},${car.year},${car.slug},Low`)
].join('\n');

const outputPath = path.join(__dirname, '../outputs/missing-ncap-reports.csv');
fs.writeFileSync(outputPath, csvContent);
console.log(`\nEksik NCAP raporları CSV'ye kaydedildi: ${outputPath}`);
