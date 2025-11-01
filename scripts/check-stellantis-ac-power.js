const fs = require('fs');
const data = JSON.parse(fs.readFileSync('data/cars.json', 'utf8'));

const stellantis = data.filter(c => 
  ['Citroen', 'DS', 'Opel'].includes(c.brand) && 
  c.charging_capabilities?.ac_power
);

console.log('=== MEVCUT STELLANTIS MODELLERİ (Citroen, DS, Opel) ===\n');
stellantis.forEach(c => {
  const ac = c.charging_capabilities.ac_power;
  const max = c.charging_capabilities.ac_power_max;
  const note = c.charging_capabilities.ac_power_note;
  console.log(`${c.brand} ${c.model} (${c.year}): ${ac} kW${max ? ` (max: ${max} kW)` : ''}${note ? ` - ${note}` : ''}`);
});

console.log(`\nToplam: ${stellantis.length} model`);

