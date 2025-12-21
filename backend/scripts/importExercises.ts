import 'dotenv/config';
import axios from 'axios';
import { createClient } from '@sanity/client';

const sanity = createClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET || 'production',
  token: process.env.SANITY_API_TOKEN,
  apiVersion: '2024-01-01',
  useCdn: false,
});

const RAPID_API_KEY = process.env.RAPID_API_KEY || 'YOUR_RAPIDAPI_KEY';
const RESOLUTION = 180; // GIF resolution

interface Exercise {
  id: string;
  name: string;
  bodyPart: string;
  target: string;
  equipment: string;
  difficulty: string;
  instructions: string[];
  tags: string[];
}

async function fetchExercisesFromRapidAPI(limit = 10): Promise<Exercise[]> {
  try {
    const response = await axios.get(
      `https://exercisedb.p.rapidapi.com/exercises`,
      {
        headers: {
          'X-RapidAPI-Key': RAPID_API_KEY,
          'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com',
        },
        params: { limit },
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error fetching exercises from RapidAPI:', error);
    return [];
  }
}

function getExerciseGifUrl(exerciseId: string) {
  return `https://exercisedb.p.rapidapi.com/image?exerciseId=${exerciseId}&resolution=${RESOLUTION}&rapidapi-key=${RAPID_API_KEY}`;
}

async function importExercises() {
  console.log('🚀 Starting exercise import...');

  const exercises = await fetchExercisesFromRapidAPI(20);
  if (!exercises.length) {
    console.log('No exercises fetched from RapidAPI.');
    return;
  }

  let createdCount = 0;
  let skippedCount = 0;

  for (const ex of exercises) {
    // Check if exercise already exists in Sanity
    const existing = await sanity.fetch(
      `*[_type == "exercise" && exerciseId == $id] {_id}`,
      { id: ex.id }
    );

    if (existing.length > 0) {
      skippedCount++;
      continue;
    }

    const doc = {
      _type: 'exercise',
      exerciseId: ex.id,
      name: ex.name,
      bodyPart: ex.bodyPart,
      target: ex.target,
      equipment: ex.equipment,
      difficulty: ex.difficulty || 'medium',
      instructions: ex.instructions || [],
      tags: ex.tags || [],
      gifUrl: getExerciseGifUrl(ex.id),
    };

    try {
      await sanity.create(doc);
      createdCount++;
    } catch (err) {
      console.error(`Error creating exercise ${ex.name}:`, err);
    }
  }

  console.log('✅ Import complete');
  console.log(`Created: ${createdCount}`);
  console.log(`Skipped: ${skippedCount}`);
}

importExercises();
