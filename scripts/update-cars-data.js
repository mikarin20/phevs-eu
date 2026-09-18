const fs = require('fs');
const path = require('path');

const dataFiles = [
  path.join(__dirname, '..', 'data', 'cars.json'),
  path.join(__dirname, '..', 'public', 'data', 'cars.json')
];

dataFiles.forEach(filePath => {
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${filePath}`);
    return;
  }

  const cars = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  console.log(`Processing ${filePath}, total vehicles: ${cars.length}`);

  let removedPriceCount = 0;
  let bmwUpdated = false;
  let outlanderUpdatedCount = 0;
  let audiUpdatedCount = 0;

  cars.forEach(car => {
    // 1. Remove price_eur from every vehicle
    if ('price_eur' in car) {
      delete car.price_eur;
      removedPriceCount++;
    }

    // 2. BMW 3 Series Touring: remove engine_displacement_l, keep engine_displacement: 2
    if (car.brand && car.brand.toLowerCase() === 'bmw' && car.model && car.model.includes('3 Series Touring')) {
      if ('engine_displacement_l' in car) {
        delete car.engine_displacement_l;
      }
      car.engine_displacement = 2;
      bmwUpdated = true;
    }

    // 3. Mitsubishi Outlander PHEV: fix fuel 6 L/100km and CO2 136 g/km to official MY25 values
    if (car.brand && car.brand.toLowerCase().includes('mitsubishi') && car.model && car.model.includes('Outlander')) {
      if (car.fuel_consumption === 6 || car.co2_emission === 136 || car.id === 'mitsubishi-3') {
        car.fuel_consumption = 0.8;
        car.co2_emission = 18;
        car.ev_range_km = 103;
        car.battery_kwh = 20;
        outlanderUpdatedCount++;
      }
    }

    // 4. Audi models WLTP synchronization
    if (car.brand && car.brand.toLowerCase() === 'audi') {
      if (car.id === 'audi-2' || car.model === 'Q3') {
        // Audi Q3 e-hybrid (MY25/MY26)
        car.ev_range_km = 119;
        car.battery_kwh = 25.7;
        car.fuel_consumption = 1.7;
        car.co2_emission = 39;
        car.engine_displacement = 1.5;
        if (!car.charging_capabilities) car.charging_capabilities = {};
        car.charging_capabilities.ac_power = 11;
        car.charging_capabilities.dc_power = 50;
        audiUpdatedCount++;
      } else if (car.id === 'new-4' || car.model === 'A5 Limousine') {
        // Audi A5 Limousine e-hybrid
        car.ev_range_km = 108;
        car.battery_kwh = 25.9;
        car.fuel_consumption = 1.9;
        car.co2_emission = 43;
        audiUpdatedCount++;
      } else if (car.id === 'audi-5' || car.model === 'A6 Limousine') {
        // Audi A6 Limousine e-hybrid
        car.ev_range_km = 106;
        car.battery_kwh = 25.9;
        car.fuel_consumption = 2.2;
        car.co2_emission = 50;
        audiUpdatedCount++;
      } else if (car.id === 'new-6' || car.model === 'A7 Sportback') {
        // Audi A7 Sportback TFSI e
        car.ev_range_km = 66;
        car.battery_kwh = 17.9;
        car.fuel_consumption = 1.6;
        car.co2_emission = 36;
        audiUpdatedCount++;
      } else if (car.id === 'audi-4' || car.model === 'Q5') {
        // Audi Q5 e-hybrid
        car.ev_range_km = 107;
        car.battery_kwh = 25.9;
        car.fuel_consumption = 2.6;
        car.co2_emission = 61;
        audiUpdatedCount++;
      } else if (car.id === 'audi-6' || car.model === 'Q7') {
        // Audi Q7 TFSI e
        car.ev_range_km = 84;
        car.battery_kwh = 25.9;
        car.fuel_consumption = 3.8;
        car.co2_emission = 57;
        audiUpdatedCount++;
      } else if (car.id === 'audi-8' || car.model === 'Q8') {
        // Audi Q8 TFSI e
        car.ev_range_km = 80;
        car.battery_kwh = 25.9;
        car.fuel_consumption = 3.9;
        car.co2_emission = 61;
        audiUpdatedCount++;
      }
    }
  });

  fs.writeFileSync(filePath, JSON.stringify(cars, null, 2), 'utf8');
  console.log(`Updated ${filePath}:`);
  console.log(`- Removed price_eur from ${removedPriceCount} cars`);
  console.log(`- BMW 3 Series Touring updated: ${bmwUpdated}`);
  console.log(`- Mitsubishi Outlander updated: ${outlanderUpdatedCount} cars`);
  console.log(`- Audi models updated: ${audiUpdatedCount} cars`);
});
