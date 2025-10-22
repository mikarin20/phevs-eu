const fs = require('fs');
const path = require('path');

// Ana cars.json dosyasını oku
const carsData = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/cars.json'), 'utf8'));

console.log(`Toplam araç sayısı: ${carsData.length}`);

// Tüm markalarda genel modelleri kaldır
function removeAllGeneralModels(cars) {
  const modelsToRemove = [
    // BMW
    { brand: 'BMW', model: 'M5' }, // Çünkü "M5 Touring" var
    
    // Mercedes-Benz
    { brand: 'Mercedes-Benz', model: 'GLC' }, // Çünkü "GLC Coupé" var
    { brand: 'Mercedes-Benz', model: 'GLE' }, // Çünkü "GLE Coupé" var
    
    // MG
    { brand: 'MG', model: 'HS' }, // Çünkü "HS II 1.5T", "HS I" gibi detaylı versiyonları var
    { brand: 'MG', model: 'HS I' }, // Çünkü "HS I EHS 1.5 T-GDI" var
  ];
  
  const filteredCars = cars.filter(car => {
    const shouldRemove = modelsToRemove.some(removeModel => 
      car.brand === removeModel.brand && car.model === removeModel.model
    );
    
    if (shouldRemove) {
      console.log(`Genel model kaldırıldı: ${car.brand} ${car.model} (${car.year})`);
      return false;
    }
    
    return true;
  });
  
  return filteredCars;
}

// Temizleme işlemi
console.log('\n=== Tüm markalarda genel modeller kaldırılıyor ===');
const cleanedCars = removeAllGeneralModels(carsData);

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

// Temizlenmiş veriyi kaydet
const outputPath = path.join(__dirname, '../data/cars-final-clean.json');
fs.writeFileSync(outputPath, JSON.stringify(cleanedCars, null, 2));
console.log(`\nFinal temizlenmiş veri kaydedildi: ${outputPath}`);

// Ana dosyayı güncelle
fs.copyFileSync(outputPath, path.join(__dirname, '../data/cars.json'));
console.log('Ana dosya güncellendi');

// Yedek oluştur
const backupPath = path.join(__dirname, '../data/cars-final-clean-backup.json');
fs.copyFileSync(path.join(__dirname, '../data/cars-no-general-backup.json'), backupPath);
console.log(`Final yedek oluşturuldu: ${backupPath}`);
