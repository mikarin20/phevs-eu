const fs = require('fs');
const cars = JSON.parse(fs.readFileSync('data/cars.json', 'utf8'));

// Group cars by brand
const brands = {};
cars.forEach(c => {
  const b = c.brand || 'Unknown';
  if (!brands[b]) brands[b] = [];
  brands[b].push(c);
});

console.log('Total vehicles:', cars.length);
console.log('Brands list:', Object.keys(brands).sort().join(', '));

// Let's create an analysis for potential discrepancies across all brands
const discrepancies = [];

cars.forEach(c => {
  const issues = [];

  // Check 1: EV Range vs Battery Capacity
  // Typical PHEV efficiency: 4 - 6 km per kWh. If EV range > battery * 8 or EV range < battery * 1.5, suspicious!
  if (c.battery_kwh && c.ev_range_km) {
    const ratio = c.ev_range_km / c.battery_kwh;
    if (ratio > 7.5) {
      issues.push(`Suspiciously high EV range (${c.ev_range_km} km) for battery (${c.battery_kwh} kWh) - ratio ${ratio.toFixed(1)} km/kWh`);
    } else if (ratio < 2.2) {
      issues.push(`Suspiciously low EV range (${c.ev_range_km} km) for battery (${c.battery_kwh} kWh) - ratio ${ratio.toFixed(1)} km/kWh`);
    }
  }

  // Check 2: Fuel consumption > 4.0 L/100km for a PHEV WLTP is usually non-WLTP or battery empty
  if (c.fuel_consumption > 3.5) {
    issues.push(`High WLTP fuel consumption (${c.fuel_consumption} L/100km) - likely battery-depleted/old NEDC or non-WLTP rating`);
  }

  // Check 3: CO2 emissions > 70 g/km for a PHEV
  if (c.co2_emission > 70) {
    issues.push(`High WLTP CO2 emission (${c.co2_emission} g/km)`);
  }

  // Check 4: Missing or suspicious engine displacement
  if (!c.engine_displacement || c.engine_displacement === 0) {
    issues.push(`Missing engine displacement`);
  }

  // Check 5: Total power vs engine power + electric motor
  // System power is typically less than or equal to ICE + Electric, but not smaller than ICE alone
  if (c.power_hp && c.electric_motor_power_hp) {
    // If electric motor power is 0 or missing
  }

  // Check 6: AC charge power
  const acPower = c.charging_capabilities ? c.charging_capabilities.ac_power : null;
  if (!acPower && (!c.charge_time_ac || c.charge_time_ac === 0)) {
    issues.push(`Missing AC charging time or power`);
  }

  // Check 7: Dimensions / weight / trunk
  if (!c.trunk_volume || c.trunk_volume === 0) {
    issues.push(`Missing trunk volume`);
  }
  if (!c.weight_kg || c.weight_kg === 0) {
    issues.push(`Missing curb weight`);
  }

  if (issues.length > 0) {
    discrepancies.push({
      id: c.id,
      brand: c.brand,
      model: c.model,
      year: c.year,
      battery_kwh: c.battery_kwh,
      ev_range_km: c.ev_range_km,
      fuel: c.fuel_consumption,
      co2: c.co2_emission,
      power: c.power_hp,
      disp: c.engine_displacement,
      issues
    });
  }
});

console.log(`\nFound ${discrepancies.length} vehicles with potential data issues/anomalies to review.`);
fs.writeFileSync('discrepancies.json', JSON.stringify(discrepancies, null, 2));
