const fs = require('fs');
const path = require('path');

// cars.json dosyasını oku
const carsData = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../data/cars.json'), 'utf8')
);

// Hesaplanan AC güç değerlerini temizle
// Sadece resmi kaynaklardan eklenmiş değerleri tutacağız
// Şu anki verilerin çoğu hesaplanmış - bunları temizleyelim

let removedCount = 0;
let keptCount = 0;

const carsDataCleaned = carsData.map(car => {
  // Sadece gerçekten resmi siteden doğrulanmış verileri tutacağız
  // Şimdilik sadece Alfa Romeo Tonale (7.4 kW) ve bazı Audi modelleri (A3, A5, Q5) doğrulanmış
  const verifiedACPower = {
    // Alfa Romeo - resmi siteden doğrulanmış
    'alfa-romeo-tonale-phev': 7.4,
    // Audi - resmi siteden doğrulanmış
    'audi-a3-sportback-phev': 2.9,
    'audi-a5-limousine-phev': 11,
    'audi-q5-phev': 11,
  };
  
  const slug = car.slug || `${car.brand.toLowerCase().replace(/\s+/g, '-')}-${car.model.toLowerCase().replace(/\s+/g, '-')}-${car.year}`;
  
  // Eğer charging_capabilities varsa
  if (car.charging_capabilities && car.charging_capabilities.ac_power) {
    // Doğrulanmış veri mi kontrol et
    if (verifiedACPower[slug] === car.charging_capabilities.ac_power) {
      keptCount++;
      return car; // Doğrulanmış veri, tut
    } else {
      // Hesaplanmış veya tahmin veri, temizle
      removedCount++;
      const cleanedCar = { ...car };
      if (cleanedCar.charging_capabilities) {
        delete cleanedCar.charging_capabilities.ac_power;
        // Eğer ac_power dışında başka bir şey yoksa, charging_capabilities'ı tamamen kaldır
        if (Object.keys(cleanedCar.charging_capabilities).length === 0) {
          delete cleanedCar.charging_capabilities;
        }
      }
      return cleanedCar;
    }
  }
  
  return car;
});

// Temizlenmiş veriyi kaydet
fs.writeFileSync(
  path.join(__dirname, '../data/cars.json'),
  JSON.stringify(carsDataCleaned, null, 2),
  'utf8'
);

console.log(`✅ Hesaplanan AC güç değerleri temizlendi`);
console.log(`📊 Tutulan (doğrulanmış) veri: ${keptCount}`);
console.log(`🗑️  Temizlenen (hesaplanmış) veri: ${removedCount}`);
console.log(`\n📝 Şimdi resmi sitelerden veri çekme işlemi başlatılabilir.`);

