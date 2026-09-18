const fs = require('fs');
const path = require('path');

const dataFiles = [
  path.join(__dirname, '..', 'data', 'cars.json'),
  path.join(__dirname, '..', 'public', 'data', 'cars.json')
];

dataFiles.forEach(filePath => {
  if (!fs.existsSync(filePath)) return;

  let cars = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  console.log(`Processing ${filePath}, initial count: ${cars.length}`);

  // 1. Remove fictitious / corrupted models
  // - lexus-es-300h-phev (fictitious PHEV, actually HEV)
  // - lexus-ux-300e-phev (fictitious PHEV, actually BEV)
  // - orphaned corrupt object (seat-tarraco-1-4-tsi with missing brand/model)
  cars = cars.filter(c => {
    if (c.id === 'lexus-es-300h-phev' || c.slug === 'lexus-es-300h-phev') return false;
    if (c.id === 'lexus-ux-300e-phev' || c.slug === 'lexus-ux-300e-phev') return false;
    if (!c.brand || !c.model) return false;
    return true;
  });

  console.log(`After filtering corrupt/fictitious cars: ${cars.length}`);

  cars.forEach(car => {
    // 2. BMW fixes: assign missing id and correct specs
    if (car.brand === 'BMW') {
      if (!car.id && car.slug) {
        car.id = car.slug;
      }

      if (car.model && car.model.includes('XM')) {
        car.ev_range_km = 85;
        car.fuel_consumption = 1.6;
        car.co2_emission = 36;
        if (!car.charging_capabilities) car.charging_capabilities = {};
        car.charging_capabilities.ac_power = 7.4;
      } else if (car.model && car.model.includes('X5 50e')) {
        car.ev_range_km = 100;
        if (!car.charging_capabilities) car.charging_capabilities = {};
        car.charging_capabilities.ac_power = 7.4;
      } else if (car.model && (car.model.includes('X1 25e') || car.model.includes('X1 30e'))) {
        if (!car.charging_capabilities) car.charging_capabilities = {};
        car.charging_capabilities.ac_power = 7.4;
      } else if (car.model && car.model.includes('X3 30e')) {
        if (!car.charging_capabilities) car.charging_capabilities = {};
        car.charging_capabilities.ac_power = 11;
      }
    }

    // 3. Kia fixes: populate missing engine_displacement
    if (car.brand === 'Kia') {
      if (!car.engine_displacement || car.engine_displacement === 0) {
        if (car.model && car.model.includes('Optima')) {
          car.engine_displacement = 2.0;
        } else {
          // Niro, XCeed, Ceed, K3 use 1.6 GDI
          car.engine_displacement = 1.6;
        }
      }
    }

    // 4. Volvo fixes: correct power, range, and add weight
    if (car.brand === 'Volvo') {
      if (car.id === 'volvo-3' || (car.model && car.model.includes('XC90'))) {
        car.power_hp = 455; // Correct T8 Recharge system power
        car.ev_range_km = 71;
        car.weight_kg = 2297;
      } else if (car.id === 'volvo-5' || (car.model && car.model.includes('V60'))) {
        car.ev_range_km = 88;
        car.weight_kg = 2060;
      } else if (car.id === 'volvo-7' || (car.model && car.model.includes('V90'))) {
        car.ev_range_km = 84;
        car.weight_kg = 2100;
      } else if (car.id === 'volvo-2' || (car.model && car.model.includes('XC60'))) {
        car.ev_range_km = 80;
        car.weight_kg = 2150;
      }
    }

    // 5. Toyota C-HR fix: correct battery to 13.6 kWh
    if (car.brand === 'Toyota' && car.model && car.model.includes('C-HR')) {
      car.battery_kwh = 13.6;
      car.ev_range_km = 66;
    }

    // 6. Mercedes-Benz GLC & GLE Coupé fixes: correct battery to 31.2 kWh
    if (car.brand && car.brand.includes('Mercedes')) {
      if (car.model && car.model.includes('GLC')) {
        car.battery_kwh = 31.2;
        car.ev_range_km = 125;
        car.weight_kg = 2360;
        car.dc_charging_supported = true;
        car.dc_max_power_kw = 60;
        if (!car.charging_capabilities) car.charging_capabilities = {};
        car.charging_capabilities.ac_power = 11;
        car.charging_capabilities.dc_power = 60;
      } else if (car.model && car.model.includes('GLE')) {
        car.battery_kwh = 31.2;
        car.ev_range_km = 105;
        car.weight_kg = 2690;
        car.dc_charging_supported = true;
        car.dc_max_power_kw = 60;
        if (!car.charging_capabilities) car.charging_capabilities = {};
        car.charging_capabilities.ac_power = 11;
        car.charging_capabilities.dc_power = 60;
      }
    }

    // 7. Porsche Panamera 4 E-Hybrid fix: 25.9 kWh battery & 470 hp
    if (car.brand === 'Porsche' && car.model && car.model.includes('Panamera')) {
      car.battery_kwh = 25.9;
      car.ev_range_km = 91;
      car.power_hp = 470;
      car.weight_kg = 2235;
      if (!car.charging_capabilities) car.charging_capabilities = {};
      car.charging_capabilities.ac_power = 11;
    }

    // 8. Volkswagen MQB evo platform updates (25.7 kWh battery, 1.5 TSI evo2, 50 kW DC)
    if (car.brand === 'Volkswagen') {
      if (car.id === 'vw-1' || car.model === 'Golf') {
        car.engine_displacement = 1.5;
        car.battery_kwh = 25.7;
        car.ev_range_km = 143;
        car.fuel_consumption = 0.3;
        car.co2_emission = 6;
        car.dc_charging_supported = true;
        car.dc_max_power_kw = 50;
        if (!car.charging_capabilities) car.charging_capabilities = {};
        car.charging_capabilities.ac_power = 11;
        car.charging_capabilities.dc_power = 50;
      } else if (car.id === 'vw-2' || car.model === 'Passat') {
        car.engine_displacement = 1.5;
        car.battery_kwh = 25.7;
        car.ev_range_km = 133;
        car.power_hp = 204;
        car.fuel_consumption = 0.4;
        car.co2_emission = 9;
        car.dc_charging_supported = true;
        car.dc_max_power_kw = 50;
        if (!car.charging_capabilities) car.charging_capabilities = {};
        car.charging_capabilities.ac_power = 11;
        car.charging_capabilities.dc_power = 50;
      } else if (car.id === 'vw-3' || car.model === 'Tiguan') {
        car.engine_displacement = 1.5;
        car.battery_kwh = 25.7;
        car.ev_range_km = 125;
        car.fuel_consumption = 0.5;
        car.co2_emission = 10;
        car.dc_charging_supported = true;
        car.dc_max_power_kw = 50;
        if (!car.charging_capabilities) car.charging_capabilities = {};
        car.charging_capabilities.ac_power = 11;
        car.charging_capabilities.dc_power = 50;
      } else if (car.id === 'new-81' || car.model === 'Tayron') {
        car.engine_displacement = 1.5;
        car.battery_kwh = 25.7;
        car.ev_range_km = 116;
        car.dc_charging_supported = true;
        car.dc_max_power_kw = 50;
        if (!car.charging_capabilities) car.charging_capabilities = {};
        car.charging_capabilities.ac_power = 11;
        car.charging_capabilities.dc_power = 50;
      } else if (car.id === 'vw-multivan-phev' || car.model === 'Multivan') {
        car.engine_displacement = 1.5;
        car.battery_kwh = 25.7;
        car.ev_range_km = 95;
        car.power_hp = 245;
        car.dc_charging_supported = true;
        car.dc_max_power_kw = 50;
        if (!car.charging_capabilities) car.charging_capabilities = {};
        car.charging_capabilities.ac_power = 11;
        car.charging_capabilities.dc_power = 50;
      }
    }

    // 9. Renault Rafale E-Tech 4x4: range up to 100 km
    if (car.brand === 'Renault' && car.model && car.model.includes('Rafale')) {
      car.ev_range_km = 100;
    }

    // 10. Ensure no price_eur remains anywhere
    if ('price_eur' in car) {
      delete car.price_eur;
    }
  });

  fs.writeFileSync(filePath, JSON.stringify(cars, null, 2), 'utf8');
  console.log(`Saved updated data to ${filePath}, final car count: ${cars.length}`);
});
