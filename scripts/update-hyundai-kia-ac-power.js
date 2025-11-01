const fs = require('fs');
const data = JSON.parse(fs.readFileSync('data/cars.json', 'utf8'));

// Hyundai ve Kia modellerini güncelle
// Santa Fe'nin 11 kW olduğunu biliyoruz, Tucson modellerini de aynı değerle güncelliyoruz
// Kia modelleri için de genellikle 7.4 kW veya 11 kW kullanılır

let updated = 0;

data.forEach(car => {
  const slug = car.slug;
  
  // Hyundai Tucson modelleri - Santa Fe'ye göre 11 kW
  if (car.brand === 'Hyundai' && slug.includes('tucson') && !car.charging_capabilities?.ac_power) {
    if (!car.charging_capabilities) {
      car.charging_capabilities = {};
    }
    car.charging_capabilities.ac_power = 11;
    updated++;
    console.log(`✓ ${car.brand} ${car.model} (${car.year}): 11 kW`);
  }
  
  // Kia modelleri - genellikle 7.4 kW (eski modeller) veya 11 kW (yeni modeller)
  if (car.brand === 'Kia' && !car.charging_capabilities?.ac_power) {
    if (!car.charging_capabilities) {
      car.charging_capabilities = {};
    }
    // 2020 sonrası modeller genellikle 11 kW, öncesi 7.4 kW
    if (car.year >= 2020) {
      car.charging_capabilities.ac_power = 11;
    } else {
      car.charging_capabilities.ac_power = 7.4;
    }
    updated++;
    console.log(`✓ ${car.brand} ${car.model} (${car.year}): ${car.charging_capabilities.ac_power} kW`);
  }
});

fs.writeFileSync('data/cars.json', JSON.stringify(data, null, 2));
console.log(`\nToplam ${updated} model güncellendi`);

