const fs = require('fs');
const data = JSON.parse(fs.readFileSync('data/cars.json', 'utf8'));

// Resmi kaynakları olan modeller
const officialSources = {
  'volkswagen-golf-phev': 'Volkswagen.de resmi site',
  'volkswagen-tiguan-phev': 'Volkswagen.de resmi site',
  'peugeot-3008-phev': 'Stellantis resmi basın açıklaması',
  'ds-7-crossback-phev': 'Stellantis resmi basın açıklaması',
  'bmw-x3-30e-2024': 'BMW.pl resmi site'
};

const estimated = [];
const official = [];

data.forEach(car => {
  if (car.charging_capabilities?.ac_power) {
    const slug = car.slug;
    if (officialSources[slug]) {
      official.push(`${car.brand} ${car.model} (${car.year}) - ${car.charging_capabilities.ac_power} kW [RESMİ]`);
    } else {
      // Platform/mantık bazlı eklenen modeller (resmi kaynak yok)
      const isEstimated = (
        (car.brand === 'Volkswagen' && !['golf', 'tiguan'].some(m => slug.includes(m))) ||
        (car.brand === 'Škoda') ||
        (car.brand === 'SEAT' || car.brand === 'CUPRA') ||
        (car.brand === 'Audi' && ['q3', 'q7', 'q8'].some(m => slug.includes(m))) ||
        (car.brand === 'Peugeot' && !slug.includes('3008')) ||
        (car.brand === 'Citroen') ||
        (car.brand === 'DS' && !slug.includes('7-crossback')) ||
        (car.brand === 'Opel')
      );
      
      if (isEstimated) {
        estimated.push(`${car.brand} ${car.model} (${car.year}) - ${car.charging_capabilities.ac_power} kW`);
      }
    }
  }
});

console.log('=== RESMİ KAYNAK OLMADAN EKLENEN MODELLER (Platform/Mantık Bazlı) ===\n');
estimated.forEach(m => console.log(m));
console.log(`\nToplam tahmin edilen: ${estimated.length} model\n`);

console.log('=== RESMİ KAYNAKLI MODELLER ===\n');
official.forEach(m => console.log(m));
console.log(`\nToplam resmi: ${official.length} model`);

