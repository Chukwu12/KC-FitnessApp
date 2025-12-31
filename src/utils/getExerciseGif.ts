const RAPID_API_KEY = process.env.EXPO_PUBLIC_RAPID_API_KEY;
const RESOLUTION = 180;

export const getExerciseGif = (exerciseId: string) =>
  `https://exercisedb.p.rapidapi.com/image?exerciseId=${exerciseId}&resolution=${RESOLUTION}&rapidapi-key=${process.env.EXPO_PUBLIC_RAPID_API_KEY}`;
