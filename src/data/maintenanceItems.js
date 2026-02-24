// Predefined maintenance items with their intervals
const maintenanceItems = [
  { id: 'engine-oil-filter', name: 'Engine oil filter', category: 'Filters & Plugs', intervalKm: 10000, intervalMonths: 12, isCustom: false },
  { id: 'oil-plug', name: 'Oil plug', category: 'Filters & Plugs', intervalKm: 10000, intervalMonths: 12, isCustom: false },
  { id: 'air-filter', name: 'Air filter', category: 'Filters & Plugs', intervalKm: 30000, intervalMonths: 24, isCustom: false },
  { id: 'spark-plugs', name: 'Spark plugs (4)', category: 'Ignition', intervalKm: 30000, intervalMonths: 24, isCustom: false },
  { id: 'ac-filter', name: 'A/C filter', category: 'Filters & Plugs', intervalKm: 20000, intervalMonths: null, isCustom: false },
  { id: 'accessory-belt', name: 'Accessory belt', category: 'Belts & Pulleys', intervalKm: 60000, intervalMonths: null, isCustom: false },
  { id: 'pulley-accessory-belt', name: 'Pulley for accessory belt', category: 'Belts & Pulleys', intervalKm: 60000, intervalMonths: null, isCustom: false },
  { id: 'coolant-pump-belt', name: 'Coolant pump belt', category: 'Belts & Pulleys', intervalKm: 100000, intervalMonths: null, isCustom: false },
  { id: 'atf-filter', name: 'ATF Filter', category: 'Transmission', intervalKm: 60000, intervalMonths: null, isCustom: false },
  { id: 'atf-filter-seal', name: 'ATF Filter seal', category: 'Transmission', intervalKm: 60000, intervalMonths: null, isCustom: false },
  { id: 'atf-plug-washer', name: 'ATF Plug washer', category: 'Transmission', intervalKm: 60000, intervalMonths: null, isCustom: false },
  { id: 'coolant-pump-seal', name: 'Coolant pump seal', category: 'Seals', intervalKm: 100000, intervalMonths: null, isCustom: false },
  { id: 'engine-oil-6l', name: 'Engine Oil 6L', category: 'Fluids', intervalKm: 10000, intervalMonths: 12, isCustom: false },
  { id: 'atf-6l', name: 'ATF 6L', category: 'Fluids', intervalKm: 50000, intervalMonths: null, isCustom: false },
  { id: 'brake-fluid-1l', name: 'Brake fluid 1L', category: 'Fluids', intervalKm: 50000, intervalMonths: 24, isCustom: false },
  { id: 'gear-oil', name: 'High Performance Gear Oil', category: 'Fluids', intervalKm: 50000, intervalMonths: null, isCustom: false },
  { id: 'coolant-fluid', name: 'Coolant fluid', category: 'Fluids', intervalKm: 50000, intervalMonths: null, isCustom: false },
];

export default maintenanceItems;
