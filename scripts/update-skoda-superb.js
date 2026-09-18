const fs = require('fs');
const path = require('path');

const dataFiles = [
  path.join(__dirname, '..', 'data', 'cars.json'),
  path.join(__dirname, '..', 'public', 'data', 'cars.json')
];

dataFiles.forEach(filePath => {
  if (!fs.existsSync(filePath)) return;
  const cars = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  cars.forEach(car => {
    // 1. Skoda Superb Sedan / Liftback (Matches screenshot 100%)
    if (car.id === 'skoda-superb-sedan') {
      car.model = 'Superb 1.5 TSI PHEV';
      car.year = 2025;
      car.segment = 'Sedan';
      car.power_hp = 272; // 200 kW
      car.engine_displacement = 1.5; // 1498 cm3
      car.electric_motor_power_hp = 116; // 85 kW
      car.fuel_consumption = 1.4; // 1.4 - 1.5 l/100km
      car.co2_emission = 32; // 32 - 34 g/km
      car.ev_range_km = 120; // up to 133 km WLTP
      car.battery_kwh = 25.7; // 25.7 kWh gross / 19.7 kWh net
      car.charge_time_ac = 2.5; // 2:30 h at 11 kW AC
      car.charge_time_dc = 0.43; // 26 min at 40 kW DC (10-80%)
      car.dc_charging_supported = true;
      car.dc_max_power_kw = 40; // 40 kW DC
      car.length_mm = 4912;
      car.width_mm = 1849;
      car.height_mm = 1511;
      car.wheelbase_mm = 2839;
      car.trunk_volume = 486;
      car.max_trunk_volume = 1635;
      car.acceleration_0_100 = 7.1;
      car.country_availability = 'EU';
      if (!car.charging_capabilities) car.charging_capabilities = {};
      car.charging_capabilities.ac_power = 11;
      car.charging_capabilities.dc_power = 40;
      if (!car.charging_port) {
        car.charging_port = {
          ac_type: 'Type 2 AC (Mennekes)',
          ac_location: 'Front left',
          dc_type: 'CCS Combo 2',
          dc_location: 'Front left'
        };
      } else {
        car.charging_port.dc_type = 'CCS Combo 2';
        car.charging_port.dc_location = 'Front left';
      }
      car.last_updated = '2026-09-18';
      delete car.price_eur;
    }

    // 2. Skoda Superb Combi
    if (car.id === 'skoda-superb-combi') {
      car.model = 'Superb Combi 1.5 TSI PHEV';
      car.year = 2025;
      car.segment = 'Estate';
      car.power_hp = 272; // 200 kW
      car.engine_displacement = 1.5; // 1498 cm3
      car.electric_motor_power_hp = 116; // 85 kW
      car.fuel_consumption = 1.4; // 1.4 - 1.5 l/100km
      car.co2_emission = 32; // 32 - 34 g/km
      car.ev_range_km = 120; // up to 130 km WLTP
      car.battery_kwh = 25.7; // 25.7 kWh gross / 19.7 kWh net
      car.charge_time_ac = 2.5; // 2:30 h at 11 kW AC
      car.charge_time_dc = 0.43; // 26 min at 40 kW DC (10-80%)
      car.dc_charging_supported = true;
      car.dc_max_power_kw = 40; // 40 kW DC
      car.length_mm = 4902;
      car.width_mm = 1849;
      car.height_mm = 1482;
      car.wheelbase_mm = 2839;
      car.trunk_volume = 510;
      car.max_trunk_volume = 1770;
      car.acceleration_0_100 = 7.3;
      car.country_availability = 'EU';
      if (!car.charging_capabilities) car.charging_capabilities = {};
      car.charging_capabilities.ac_power = 11;
      car.charging_capabilities.dc_power = 40;
      if (!car.charging_port) {
        car.charging_port = {
          ac_type: 'Type 2 AC (Mennekes)',
          ac_location: 'Front left',
          dc_type: 'CCS Combo 2',
          dc_location: 'Front left'
        };
      } else {
        car.charging_port.dc_type = 'CCS Combo 2';
        car.charging_port.dc_location = 'Front left';
      }
      car.last_updated = '2026-09-18';
      delete car.price_eur;
    }
  });

  fs.writeFileSync(filePath, JSON.stringify(cars, null, 2), 'utf8');
  console.log(`Updated Skoda Superb details in ${filePath}`);
});
