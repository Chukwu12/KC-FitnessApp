// backend/scripts/updateExerciseGifs.ts
require("dotenv/config");
const sanity = require("../../src/lib/sanity"); // CommonJS export from sanity.js

const RAPID_API_KEY = process.env.RAPID_API_KEY || "";
const RESOLUTION = 180;

function getExerciseGifUrl(exerciseId) {
  return `https://exercisedb.p.rapidapi.com/image?exerciseId=${exerciseId}&resolution=${RESOLUTION}&rapidapi-key=${RAPID_API_KEY}`;
}

async function updateMissingGifs() {
  console.log("🚀 Starting GIF update...");

  try {
    // Fetch all exercises from Sanity
    const exercises = await sanity.fetch(
      `*[_type == "exercise"]{_id, exerciseId, gifUrl}`
    );

    let updatedCount = 0;
    let skippedCount = 0;

    for (const ex of exercises) {
      // Skip if GIF already exists or exerciseId is missing
      if (ex.gifUrl || !ex.exerciseId) {
        skippedCount++;
        if (!ex.exerciseId) {
          console.warn(`⚠️ Skipping exercise with missing ID (_id: ${ex._id})`);
        }
        continue;
      }

      const gifUrl = getExerciseGifUrl(ex.exerciseId);

      try {
        await sanity
          .patch(ex._id)
          .set({ gifUrl })
          .commit({ autoGenerateArrayKeys: true });

        console.log(`✅ Updated GIF for exerciseId: ${ex.exerciseId}`);
        updatedCount++;
      } catch (err) {
        console.error(`❌ Error updating ${ex.exerciseId}:`, err);
      }
    }

    console.log("🎉 GIF update complete!");
    console.log(`Updated: ${updatedCount}`);
    console.log(`Skipped: ${skippedCount}`);
  } catch (err) {
    console.error("❌ Error fetching exercises:", err);
  }
}

updateMissingGifs();
