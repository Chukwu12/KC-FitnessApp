require("dotenv/config");
import axios from "axios";
const sanity = require("../../src/lib/sanity"); // CommonJS import

const RAPID_API_KEY = process.env.RAPID_API_KEY || "";
const RESOLUTION = 180;

// Helper: build GIF URL
function getExerciseGifUrl(exerciseId: string) {
  return `https://exercisedb.p.rapidapi.com/image?exerciseId=${exerciseId}&resolution=${RESOLUTION}&rapidapi-key=${RAPID_API_KEY}`;
}

// Fuzzy match function to handle minor name differences
function fuzzyMatchName(name: string, rapidName: string) {
  const normalize = (str: string) =>
    str.toLowerCase().replace(/[^a-z0-9]/g, "");
  const n1 = normalize(name);
  const n2 = normalize(rapidName);

  if (n1 === n2) return true;

  const firstWord = n1.split(/[^a-z0-9]/)[0];
  if (n2.startsWith(firstWord)) return true;

  return false;
}

// Fetch all exercises from RapidAPI
async function fetchRapidExercises() {
  try {
    const response = await axios.get(
      "https://exercisedb.p.rapidapi.com/exercises",
      {
        headers: {
          "X-RapidAPI-Key": RAPID_API_KEY,
          "X-RapidAPI-Host": "exercisedb.p.rapidapi.com",
        },
      }
    );
    return response.data;
  } catch (err) {
    console.error("Error fetching RapidAPI exercises:", err);
    return [];
  }
}

async function updateExerciseIdsAndGifs() {
  console.log("🚀 Starting update of exerciseIds and GIFs...");

  const localExercises: {
    _id: string;
    name: string;
    exerciseId?: string;
    gifUrl?: string;
  }[] = await sanity.fetch(
    `*[_type == "exercise"]{_id, name, exerciseId, gifUrl}`
  );

  const rapidExercises = await fetchRapidExercises();

  let updatedIds = 0;
  let updatedGifs = 0;
  let skipped = 0;

  for (const ex of localExercises) {
    // Skip if exercise already has GIF and ID
    if (ex.gifUrl && ex.exerciseId) {
      skipped++;
      continue;
    }

    // Try to find RapidAPI match
    const match = rapidExercises.find((r: any) =>
      fuzzyMatchName(ex.name, r.name)
    );

    if (!match) {
      console.warn(`⚠️ No RapidAPI match found for "${ex.name}"`);
      skipped++;
      continue;
    }

    const gifUrl = getExerciseGifUrl(match.id);

    try {
      await sanity
        .patch(ex._id)
        .set({
          exerciseId: match.id,
          gifUrl: gifUrl,
        })
        .commit({ autoGenerateArrayKeys: true });

      console.log(`✅ Updated "${ex.name}" with ID: ${match.id}`);
      updatedIds++;
      updatedGifs++;
    } catch (err) {
      console.error(`❌ Error updating "${ex.name}":`, err);
    }
  }

  console.log("🎉 Update complete!");
  console.log(`ExerciseIds auto-filled: ${updatedIds}`);
  console.log(`GIFs updated: ${updatedGifs}`);
  console.log(`Skipped: ${skipped}`);
}

updateExerciseIdsAndGifs();
