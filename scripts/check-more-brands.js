const fs = require('fs');
const cars = JSON.parse(fs.readFileSync('data/cars.json', 'utf8'));

// Check other popular brands
const checks = [
  'CUPRA', 'Hyundai', 'Jeep', 'Land Rover', 'Lexus', 'Mazda', 'Peugeot', 'Renault', 'Citroen', 'DS'
];

checks.forEach(b => {
  const list = cars.filter(c => c.brand && c.brand.toLowerCase() === b.toLowerCase());
  console.log(`\n=== ${b} (${list.length} cars) ===`);
  list.forEach(c => {
    console.log(`- ${c.model} (${c.year}): Batt: ${c.battery_kwh} kWh | Range: ${c.ev_range_km} km | Power: ${c.power_hp} hp | Fuel: ${c.fuel_consumption} L | Engine: ${c.engine_displacement}L`);
  });
});
