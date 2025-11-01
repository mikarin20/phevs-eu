const fs = require('fs');
const path = require('path');

// Ana cars.json dosyasını oku
const carsData = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/cars.json'), 'utf8'));

console.log(`Toplam araç sayısı: ${carsData.length}\n`);

// AC güç bilgisi eksik araçları bul
const missingACPower = carsData.filter(car => 
  !car.charging_capabilities || 
  !car.charging_capabilities.ac_power
);

console.log(`AC güç bilgisi eksik araç sayısı: ${missingACPower.length}\n`);

// Markaya göre grupla
const byBrand = {};
missingACPower.forEach(car => {
  if (!byBrand[car.brand]) {
    byBrand[car.brand] = [];
  }
  byBrand[car.brand].push({
    model: car.model,
    year: car.year,
    slug: car.slug || `${car.brand.toLowerCase().replace(/\s+/g, '-')}-${car.model.toLowerCase().replace(/\s+/g, '-')}-${car.year}`
  });
});

// Markaya göre listele
console.log('=== MARKA BAZINDA EKSİK AC GÜÇ BİLGİLERİ ===\n');
Object.keys(byBrand)
  .sort()
  .forEach(brand => {
    console.log(`${brand} (${byBrand[brand].length} araç):`);
    byBrand[brand].forEach(car => {
      console.log(`  - ${car.model} (${car.year}) - slug: ${car.slug}`);
    });
    console.log('');
  });

// AC güç bilgisi olan araçları da göster
const withACPower = carsData.filter(car => 
  car.charging_capabilities && 
  car.charging_capabilities.ac_power
);

console.log(`\n=== AC GÜÇ BİLGİSİ OLAN ARAÇLAR ===`);
const byBrandWith = {};
withACPower.forEach(car => {
  if (!byBrandWith[car.brand]) {
    byBrandWith[car.brand] = [];
  }
  byBrandWith[car.brand].push({
    model: car.model,
    year: car.year,
    ac_power: car.charging_capabilities.ac_power
  });
});

Object.keys(byBrandWith)
  .sort()
  .forEach(brand => {
    console.log(`\n${brand}:`);
    byBrandWith[brand].forEach(car => {
      console.log(`  - ${car.model} (${car.year}): ${car.ac_power} kW`);
    });
  });

// Özet
console.log(`\n\n=== ÖZET ===`);
console.log(`Toplam araç: ${carsData.length}`);
console.log(`AC güç bilgisi olan: ${withACPower.length}`);
console.log(`AC güç bilgisi eksik: ${missingACPower.length}`);
console.log(`Tamamlanma oranı: ${((withACPower.length / carsData.length) * 100).toFixed(2)}%`);

