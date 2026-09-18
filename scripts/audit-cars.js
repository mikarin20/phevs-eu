const fs = require('fs');
const cars = JSON.parse(fs.readFileSync('data/cars.json', 'utf8'));

const brands = {};
cars.forEach(c => {
  const b = c.brand || 'Unknown';
  if (!brands[b]) brands[b] = [];
  brands[b].push(c);
});

console.log('Total vehicles:', cars.length);
console.log('Total brands:', Object.keys(brands).length);

const summary = [];

Object.keys(brands).sort().forEach(b => {
  console.log(`\n================== ${b.toUpperCase()} (${brands[b].length} models) ==================`);
  brands[b].forEach(c => {
    const acPower = c.charging_capabilities && c.charging_capabilities.ac_power ? c.charging_capabilities.ac_power + 'kW' : 'time:' + c.charge_time_ac + 'h';
    const dcPower = c.charging_capabilities && c.charging_capabilities.dc_power ? c.charging_capabilities.dc_power + 'kW' : (c.dc_max_power_kw ? c.dc_max_power_kw + 'kW' : 'None');
    console.log(`[${c.id || 'NO-ID'}] ${c.brand} ${c.model} (${c.year})`);
    console.log(`   Battery: ${c.battery_kwh} kWh | EV Range: ${c.ev_range_km} km | Fuel: ${c.fuel_consumption} L/100km | CO2: ${c.co2_emission} g/km`);
    console.log(`   Power: ${c.power_hp} hp | Engine: ${c.engine_displacement} L | Electric Motor: ${c.electric_motor_power_hp || 'N/A'} hp | AC: ${acPower} | DC: ${dcPower}`);
    console.log(`   Dimensions (LxWxH): ${c.length_mm || '-'}x${c.width_mm || '-'}x${c.height_mm || '-'} mm | Trunk: ${c.trunk_volume || '-'} L | Weight: ${c.weight_kg || '-'} kg`);
  });
});
