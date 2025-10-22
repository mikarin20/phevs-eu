const fs = require('fs');
const path = require('path');

// Ana cars.json dosyasını oku
const carsData = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/cars.json'), 'utf8'));

console.log(`Toplam araç sayısı: ${carsData.length}`);

// Genel modelleri kaldır (detaylı versiyonları varsa)
function removeGeneralModels(cars) {
  const modelsToRemove = [];
  const detailedModels = new Set();
  
  // Önce detaylı modelleri tespit et
  cars.forEach(car => {
    if (car.brand === 'BMW') {
      // Detaylı modelleri tespit et
      if (car.model.includes('Sedan') || car.model.includes('Touring') || 
          car.model.includes('Active Tourer') || car.model.includes('M5') ||
          car.model.match(/\d+e$/) || car.model.includes('XM')) {
        detailedModels.add(car.model);
      }
    }
  });
  
  console.log('\nDetaylı BMW modelleri:');
  detailedModels.forEach(model => console.log(`  - ${model}`));
  
  // Genel modelleri tespit et ve kaldır
  const filteredCars = cars.filter(car => {
    if (car.brand === 'BMW') {
      // Genel modelleri tespit et
      const generalModels = [
        '5 Series',  // Çünkü "5 Series Sedan" ve "5 Series Touring" var
        '7 Series',  // Çünkü detaylı versiyonları olabilir
        '3 Series',  // Çünkü "3 Series Sedan" ve "3 Series Touring" var
        'X1',        // Çünkü "X1 25e", "X1 30e" gibi detaylı versiyonları var
        'X3',        // Çünkü "X3 30e" gibi detaylı versiyonları var
        'X5',        // Çünkü "X5 50e" gibi detaylı versiyonları var
        'Xm'         // Çünkü "XM 4.4 V8", "XM 50e" gibi detaylı versiyonları var
      ];
      
      if (generalModels.includes(car.model)) {
        console.log(`Genel model kaldırıldı: ${car.brand} ${car.model} (${car.year})`);
        return false;
      }
    }
    return true;
  });
  
  return filteredCars;
}

// Temizleme işlemi
console.log('\n=== Genel modeller kaldırılıyor ===');
const cleanedCars = removeGeneralModels(carsData);

console.log(`\nTemizleme sonrası araç sayısı: ${cleanedCars.length}`);

// BMW analizi
const bmwCars = cleanedCars.filter(car => car.brand === 'BMW');
console.log(`\nBMW araç sayısı: ${bmwCars.length}`);

console.log('\n=== BMW MODELLERİ ===');
bmwCars.forEach(car => {
  console.log(`  - ${car.model} (${car.year})`);
});

// Temizlenmiş veriyi kaydet
const outputPath = path.join(__dirname, '../data/cars-no-general.json');
fs.writeFileSync(outputPath, JSON.stringify(cleanedCars, null, 2));
console.log(`\nTemizlenmiş veri kaydedildi: ${outputPath}`);

// Ana dosyayı güncelle
fs.copyFileSync(outputPath, path.join(__dirname, '../data/cars.json'));
console.log('Ana dosya güncellendi');

// Yedek oluştur
const backupPath = path.join(__dirname, '../data/cars-no-general-backup.json');
fs.copyFileSync(path.join(__dirname, '../data/cars-final-backup.json'), backupPath);
console.log(`Yedek oluşturuldu: ${backupPath}`);
