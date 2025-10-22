const fs = require('fs');
const path = require('path');

// Ana cars.json dosyasını oku
const carsData = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/cars.json'), 'utf8'));

console.log(`Toplam araç sayısı: ${carsData.length}`);

// BMW verilerini düzelt
function fixBMWData(cars) {
  const bmwFixes = {
    // BMW 3 Series Touring 2024
    'bmw-3-series-touring-2024': {
      fuel_consumption: 1.1, // L/100km (WLTP)
      price_eur: 54900, // Tahmini fiyat
      co2_emission: 25, // g/km
      charge_time_ac: 3.5, // saat
      trunk_volume: 500, // L
      weight_kg: 1850, // kg
      length_mm: 4709, // mm
      width_mm: 1827, // mm
      height_mm: 1440, // mm
      engine_displacement: 2.0, // L
      battery_chemistry: 'NCM',
      battery_voltage: 400,
      charging_port: {
        ac_type: 'Type 2 AC (Mennekes)',
        ac_location: 'Front left'
      },
      emission_standard: 'Euro 6d',
      country_availability: 'DE,FR,UK,PL,IT,ES'
    },
    
    // BMW 5 Series Sedan 2024
    'bmw-5-series-sedan-2024': {
      fuel_consumption: 0.8, // L/100km
      price_eur: 64900,
      co2_emission: 18,
      charge_time_ac: 3.5,
      trunk_volume: 480,
      weight_kg: 1950,
      length_mm: 4963,
      width_mm: 1868,
      height_mm: 1479,
      engine_displacement: 2.0,
      battery_chemistry: 'NCM',
      battery_voltage: 400,
      charging_port: {
        ac_type: 'Type 2 AC (Mennekes)',
        ac_location: 'Front left'
      },
      emission_standard: 'Euro 6d',
      country_availability: 'DE,FR,UK,PL,IT,ES'
    },
    
    // BMW 5 Series Touring 2024
    'bmw-5-series-touring-2024': {
      fuel_consumption: 0.8,
      price_eur: 66900,
      co2_emission: 18,
      charge_time_ac: 3.5,
      trunk_volume: 520,
      weight_kg: 1980,
      length_mm: 4963,
      width_mm: 1868,
      height_mm: 1479,
      engine_displacement: 2.0,
      battery_chemistry: 'NCM',
      battery_voltage: 400,
      charging_port: {
        ac_type: 'Type 2 AC (Mennekes)',
        ac_location: 'Front left'
      },
      emission_standard: 'Euro 6d',
      country_availability: 'DE,FR,UK,PL,IT,ES'
    },
    
    // BMW X1 25e 2024
    'bmw-x1-25e-2024': {
      fuel_consumption: 0.9,
      price_eur: 49900,
      co2_emission: 20,
      charge_time_ac: 3.2,
      trunk_volume: 450,
      weight_kg: 1750,
      length_mm: 4500,
      width_mm: 1845,
      height_mm: 1642,
      engine_displacement: 1.5,
      battery_chemistry: 'NCM',
      battery_voltage: 400,
      charging_port: {
        ac_type: 'Type 2 AC (Mennekes)',
        ac_location: 'Front left'
      },
      emission_standard: 'Euro 6d',
      country_availability: 'DE,FR,UK,PL,IT,ES'
    },
    
    // BMW X1 30e 2024
    'bmw-x1-30e-2024': {
      fuel_consumption: 0.9,
      price_eur: 52900,
      co2_emission: 20,
      charge_time_ac: 3.2,
      trunk_volume: 450,
      weight_kg: 1780,
      length_mm: 4500,
      width_mm: 1845,
      height_mm: 1642,
      engine_displacement: 1.5,
      battery_chemistry: 'NCM',
      battery_voltage: 400,
      charging_port: {
        ac_type: 'Type 2 AC (Mennekes)',
        ac_location: 'Front left'
      },
      emission_standard: 'Euro 6d',
      country_availability: 'DE,FR,UK,PL,IT,ES'
    },
    
    // BMW X3 30e 2024
    'bmw-x3-30e-2024': {
      fuel_consumption: 1.0,
      price_eur: 59900,
      co2_emission: 23,
      charge_time_ac: 3.5,
      trunk_volume: 550,
      weight_kg: 2050,
      length_mm: 4708,
      width_mm: 1891,
      height_mm: 1676,
      engine_displacement: 2.0,
      battery_chemistry: 'NCM',
      battery_voltage: 400,
      charging_port: {
        ac_type: 'Type 2 AC (Mennekes)',
        ac_location: 'Front left'
      },
      emission_standard: 'Euro 6d',
      country_availability: 'DE,FR,UK,PL,IT,ES'
    },
    
    // BMW X5 50e 2024
    'bmw-x5-50e-2024': {
      fuel_consumption: 2.1,
      price_eur: 89900,
      co2_emission: 47,
      charge_time_ac: 4.5,
      trunk_volume: 650,
      weight_kg: 2475,
      length_mm: 4935,
      width_mm: 2004,
      height_mm: 1776,
      engine_displacement: 3.0,
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
        if (car[key] === 0 || car[key] === null || car[key] === undefined) {
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
console.log('\n=== BMW verileri düzeltiliyor ===');
const fixedCars = fixBMWData(carsData);

// Temizlenmiş veriyi kaydet
const outputPath = path.join(__dirname, '../data/cars-fixed-bmw.json');
fs.writeFileSync(outputPath, JSON.stringify(fixedCars, null, 2));
console.log(`\nDüzeltilmiş veri kaydedildi: ${outputPath}`);

// Ana dosyayı güncelle
fs.copyFileSync(outputPath, path.join(__dirname, '../data/cars.json'));
console.log('Ana dosya güncellendi');

// Yedek oluştur
const backupPath = path.join(__dirname, '../data/cars-fixed-bmw-backup.json');
fs.copyFileSync(path.join(__dirname, '../data/cars-with-slugs-backup.json'), backupPath);
console.log(`Yedek oluşturuldu: ${backupPath}`);

// BMW verilerini kontrol et
console.log('\n=== BMW VERİLERİ KONTROL ===');
const bmwCars = fixedCars.filter(car => car.brand === 'BMW');
bmwCars.forEach(car => {
  console.log(`\n${car.model} (${car.year}):`);
  console.log(`  Fuel Consumption: ${car.fuel_consumption} L/100km`);
  console.log(`  Charge Time AC: ${car.charge_time_ac}h`);
  console.log(`  Engine: ${car.engine_displacement}L`);
  console.log(`  Price: €${car.price_eur.toLocaleString()}`);
});
