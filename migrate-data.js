// Migration script to convert old data format to new format
const fs = require('fs');
const path = require('path');

// Read the original mindthief data
const mindthiefPath = path.join(__dirname, 'mindthief.json');
const mindthiefData = JSON.parse(fs.readFileSync(mindthiefPath, 'utf8'));

// Function to migrate enhancement spot
function migrateEnhancementSpot(spot) {
  const newSpot = {
    id: spot.id,
    type: spot.type,
    description: spot.description,
    region: spot.region,
    isSummon: spot.isSummon,
    targets: spot.targets,
    hasLostIcon: spot.hasLostIcon,
    abilities: [...(spot.abilityTypes || []), ...(spot.abilityProperties || [])]
  };

  // Keep summon-specific properties
  if (spot.allowedSummonEnhancements) {
    newSpot.allowedSummonEnhancements = spot.allowedSummonEnhancements;
  }

  return newSpot;
}

// Migrate all cards
for (const cardKey in mindthiefData.cards) {
  const card = mindthiefData.cards[cardKey];
  if (card.enhancementSpots) {
    card.enhancementSpots = card.enhancementSpots.map(migrateEnhancementSpot);
  }
}

// Write the migrated data back
fs.writeFileSync(mindthiefPath, JSON.stringify(mindthiefData, null, 2));

console.log('Migration completed!');
