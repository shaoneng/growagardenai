// scripts/build-data.js
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

console.log('Starting data processing...');

const results = [];
const sourceCsvPath = path.resolve(__dirname, '../', 'grow_a_garden_all_tables.csv');
const outputPath = path.resolve(__dirname, '../public/data', 'items.json');

fs.createReadStream(sourceCsvPath)
  .pipe(csv())
  .on('data', (row) => {
    // FIX: Use 'Crop' as the primary display name, fallback to 'Name' if needed.
    const displayName = row.Crop || row.Name;

    if (!displayName) {
      console.log('Skipping row with empty name:', row);
      return;
    }

    const name = displayName.toLowerCase().replace(/ /g, '_');
    const multiHarvest = String(row['Multi-Harvest']).toUpperCase() === 'TRUE';

    results.push({
      // We will generate a unique ID later
      name: name,
      display_name: displayName,
      tier: row.Tier,
      source: row['来源表格'],
      multi_harvest: multiHarvest,
      // Add other relevant fields if necessary
    });
  })
  .on('end', () => {
    // Add a unique ID to each item
    const finalData = results.map((item, index) => ({
      id: index,
      ...item,
    }));

    // Ensure the output directory exists
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    fs.writeFileSync(outputPath, JSON.stringify(finalData, null, 2));
    console.log('✅ Data processing complete!');
    console.log(`${finalData.length} items have been processed.`);
    console.log(`JSON file successfully created at: ${outputPath}`);
  });