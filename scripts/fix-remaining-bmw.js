const fs = require('fs');
const path = require('path');

// Ana cars.json dosyasını oku
const carsData = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/cars.json'), 'utf8'));

console.log(`Toplam araç sayısı: ${carsData.length}`);

// Kalan BMW verilerini düzelt
function fixRemainingBMW(cars) {
  const bmwFixes = {
    // BMW X1 30Le 2022
    'bmw-x1-30le-2022': {
      engine_displacement: 1.5, // L
      battery_chemistry: 'NCM',
      battery_voltage: 400,
      charging_port: {
        ac_type: 'Type 2 AC (Mennekes)',
        ac_location: 'Front left'
      },
      emission_standard: 'Euro 6d',
      country_availability: 'DE,FR,UK,PL,IT,ES'
    },
    
    // BMW XM 4.4 V8 2024
    'bmw-xm-44-v8-2024': {
      engine_displacement: 4.4, // L V8
      battery_chemistry: 'NCM',
      battery_voltage: 400,
      charging_port: {
        ac_type: 'Type 2 AC (Mennekes)',
        ac_location: 'Front left'
      },
      emission_standard: 'Euro 6d',
      country_availability: 'DE,FR,UK,PL,IT,ES'
    },
    
    // BMW XM 50e 2024
    'bmw-xm-50e-2024': {
      engine_displacement: 3.0, // L
      battery_chemistry: 'NCM',
      battery_voltage: 400,
      charging_port: {
        ac_type: 'Type 2 AC (Mennekes)',
        ac_location: 'Front left'
      },
      emission_standard: 'Euro 6d',
      country_availability: 'DE,FR,UK,PL,IT,ES'
    },
    
    // BMW XM Label Red 4.4 V8 2024
    'bmw-xm-label-red-44-v8-2024': {
      engine_displacement: 4.4, // L V8
      battery_chemistry: 'NCM',
      battery_voltage: 400,
      charging_port: {
        ac_type: 'Type 2 AC (Mennekes)',
        ac_location: 'Front left'
      },
      emission_standard: 'Euro 6d',
      country_availability: 'DE,FR,UK,PL,IT,ES'
    }
  };
  
  let fixedCount = 0;
  
  const updatedCars = cars.map(car => {
    if (car.brand === 'BMW' && car.slug && bmwFixes[car.slug]) {
      const fixes = bmwFixes[car.slug];
      
      console.log(`\nBMW ${car.model} (${car.year}) düzeltiliyor:`);
      
      Object.keys(fixes).forEach(key => {
        if (!car[key] || car[key] === null || car[key] === undefined) {
          console.log(`  ${key}: ${car[key]} → ${fixes[key]}`);
          car[key] = fixes[key];
          fixedCount++;
        }
      });
    }
    
    return car;
  });
  
  console.log(`\nToplam ${fixedCount} veri düzeltildi`);
  return updatedCars;
}

// Düzeltme işlemi
console.log('\n=== Kalan BMW verileri düzeltiliyor ===');
const fixedCars = fixRemainingBMW(carsData);

// Temizlenmiş veriyi kaydet
const outputPath = path.join(__dirname, '../data/cars-fixed-remaining-bmw.json');
fs.writeFileSync(outputPath, JSON.stringify(fixedCars, null, 2));
console.log(`\nDüzeltilmiş veri kaydedildi: ${outputPath}`);

// Ana dosyayı güncelle
fs.copyFileSync(outputPath, path.join(__dirname, '../data/cars.json'));
console.log('Ana dosya güncellendi');

// Yedek oluştur
const backupPath = path.join(__dirname, '../data/cars-fixed-remaining-bmw-backup.json');
fs.copyFileSync(path.join(__dirname, '../data/cars-fixed-bmw-backup.json'), backupPath);
console.log(`Yedek oluşturuldu: ${backupPath}`);

// BMW verilerini kontrol et
console.log('\n=== BMW VERİLERİ KONTROL ===');
const bmwCars = fixedCars.filter(car => car.brand === 'BMW');
bmwCars.forEach(car => {
  console.log(`\n${car.model} (${car.year}):`);
  console.log(`  Engine: ${car.engine_displacement}L`);
  console.log(`  Battery: ${car.battery_chemistry} ${car.battery_voltage}V`);
  console.log(`  Charging: ${car.charging_port?.ac_type || 'N/A'}`);
  console.log(`  Emission: ${car.emission_standard || 'N/A'}`);
  console.log(`  Countries: ${car.country_availability || 'N/A'}`);
});
