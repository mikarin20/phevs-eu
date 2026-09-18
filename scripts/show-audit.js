const fs = require('fs');
const r = JSON.parse(fs.readFileSync('detailed_audit_report.json', 'utf8'));
console.log('=== DETAILED SPEC AUDIT FINDINGS (' + r.length + ' items) ===\n');
r.forEach((item, idx) => {
  console.log((idx + 1) + '. [' + item.severity + '] ' + item.brand + ' ' + item.model + ' (' + item.year + '):');
  console.log('   -> ' + item.finding + '\n');
});
