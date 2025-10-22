const fs = require('fs');
const path = require('path');

// Ana cars.json dosyasını oku
const carsData = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/cars.json'), 'utf8'));

console.log(`Toplam araç sayısı: ${carsData.length}`);

// BMW için çoklu yıl sorununu çöz
function resolveMultipleYears(cars) {
  const brandModelMap = new Map();
  const resolved = [];
  
  cars.forEach(car => {
    const key = `${car.brand}-${car.model}`;
    
    if (!brandModelMap.has(key)) {
      brandModelMap.set(key, []);
    }
    brandModelMap.get(key).push(car);
  });
  
  // Her marka-model kombinasyonu için en iyi versiyonu seç
  brandModelMap.forEach((models, key) => {
    if (models.length === 1) {
      resolved.push(models[0]);
    } else {
      // Çoklu versiyon varsa, en yeni yılı seç
      const sortedModels = models.sort((a, b) => b.year - a.year);
      const latestModel = sortedModels[0];
      
      console.log(`Çoklu versiyon çözüldü: ${latestModel.brand} ${latestModel.model} (${latestModel.year} seçildi, ${models.length - 1} versiyon kaldırıldı)`);
      resolved.push(latestModel);
    }
  });
  
  return resolved;
}

// Temizleme işlemi
console.log('\n=== Çoklu yıl sorunları çözülüyor ===');
const cleanedCars = resolveMultipleYears(carsData);

console.log(`\nTemizleme sonrası araç sayısı: ${cleanedCars.length}`);

// Marka bazında analiz
const brandStats = {};
cleanedCars.forEach(car => {
  if (!brandStats[car.brand]) {
    brandStats[car.brand] = { count: 0, models: new Set() };
  }
  brandStats[car.brand].count++;
  brandStats[car.brand].models.add(car.model);
});

console.log('\n=== MARKA BAZINDA ÖZET ===');
Object.keys(brandStats).forEach(brand => {
  const stats = brandStats[brand];
  console.log(`${brand}: ${stats.count} araç, ${stats.models.size} model`);
});

// BMW özel analizi
console.log('\n=== BMW DETAY ANALİZİ ===');
const bmwCars = cleanedCars.filter(car => car.brand === 'BMW');
console.log(`BMW toplam araç: ${bmwCars.length}`);

bmwCars.forEach(car => {
  console.log(`  - ${car.model} (${car.year})`);
});

// Temizlenmiş veriyi kaydet
const outputPath = path.join(__dirname, '../data/cars-final.json');
fs.writeFileSync(outputPath, JSON.stringify(cleanedCars, null, 2));
console.log(`\nFinal temizlenmiş veri kaydedildi: ${outputPath}`);

// Ana dosyayı güncelle
fs.copyFileSync(outputPath, path.join(__dirname, '../data/cars.json'));
console.log('Ana dosya güncellendi');

// Yedek oluştur
const backupPath = path.join(__dirname, '../data/cars-final-backup.json');
fs.copyFileSync(path.join(__dirname, '../data/cars.json.backup'), backupPath);
console.log(`Final yedek oluşturuldu: ${backupPath}`);
