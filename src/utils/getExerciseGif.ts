const RAPID_API_KEY = process.env.RAPID_API_KEY;
const RESOLUTION = 180;

export const getExerciseGif = (exerciseId: string) =>
  `https://exercisedb.p.rapidapi.com/image?exerciseId=${exerciseId}&resolution=${RESOLUTION}&rapidapi-key=${RAPID_API_KEY}`;
