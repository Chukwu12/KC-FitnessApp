const RAPID_API_KEY = process.env.RAPID_API_KEY || '37f1b5db7dmshed85f7a4b6b1560p120095jsn81ceddcd8740';
const RESOLUTION = 180;

export const getExerciseGif = (exerciseId: string) =>
  `https://exercisedb.p.rapidapi.com/image?exerciseId=${exerciseId}&resolution=${RESOLUTION}&rapidapi-key=${RAPID_API_KEY}`;
