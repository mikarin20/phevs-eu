const fs = require('fs');
const d = JSON.parse(fs.readFileSync('discrepancies.json', 'utf8'));
console.log('=== POTENTIAL ANOMALIES (' + d.length + ' vehicles) ===\n');
d.forEach((item, i) => {
  console.log((i + 1) + '. ' + item.brand + ' ' + item.model + ' (' + item.year + ') [id: ' + item.id + ']');
  console.log('   Data: Batt: ' + item.battery_kwh + ' kWh | EV: ' + item.ev_range_km + ' km | Fuel: ' + item.fuel + ' L/100km | CO2: ' + item.co2 + ' g/km | Disp: ' + item.disp + 'L | Power: ' + item.power + ' hp');
  console.log('   Issues: ' + item.issues.join(' | ') + '\n');
});
