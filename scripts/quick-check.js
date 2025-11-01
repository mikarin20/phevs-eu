const fs = require('fs');
const data = JSON.parse(fs.readFileSync('data/cars.json', 'utf8'));
const missing = data.filter(c => !c.charging_capabilities?.ac_power);
console.log(`Toplam: ${data.length}, Eksik: ${missing.length}, Tamamlanma: ${((data.length - missing.length) / data.length * 100).toFixed(1)}%`);
if (missing.length > 0) {
  console.log('\nEksik modeller:');
  missing.forEach(c => console.log(`  - ${c.brand} ${c.model} (${c.slug})`));
}

