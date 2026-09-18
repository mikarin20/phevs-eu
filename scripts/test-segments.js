const fs = require('fs');
const cars = JSON.parse(fs.readFileSync('data/cars.json', 'utf8'));

const longestRange = cars.filter(c => c.ev_range_km >= 100);
console.log('=== Longest Range (>= 100 km): ' + longestRange.length + ' cars ===');
longestRange.forEach(c => console.log(' - ' + c.brand + ' ' + c.model + ' (' + c.ev_range_km + ' km)'));

const dcCharging = cars.filter(c => c.dc_charging_supported || (c.charging_capabilities && c.charging_capabilities.dc_power > 0) || (c.charging_port && c.charging_port.dc_type));
console.log('\n=== DC Fast Charging: ' + dcCharging.length + ' cars ===');
dcCharging.forEach(c => {
  const dcP = (c.charging_capabilities && c.charging_capabilities.dc_power) || c.dc_max_power_kw || 'Yes';
  console.log(' - ' + c.brand + ' ' + c.model + ' (' + dcP + ' kW DC)');
});

const sevenSeaters = cars.filter(c => c.seats >= 7);
console.log('\n=== 7+ Seaters: ' + sevenSeaters.length + ' cars ===');
sevenSeaters.forEach(c => console.log(' - ' + c.brand + ' ' + c.model + ' (' + c.seats + ' seats)'));
