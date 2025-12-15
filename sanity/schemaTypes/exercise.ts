// schemaTypes/exercise.ts
export default {
  name: 'exercise',
  title: 'Exercise',
  type: 'document',
  fields: [
    {
      name: 'exerciseId',
      title: 'Exercise ID (RapidAPI)',
      type: 'string',
      readOnly: true,
    },
    {
      name: 'name',
      title: 'Name',
      type: 'string',
    },
    {
      name: 'bodyPart',
      title: 'Body Part',
      type: 'string',
    },
    {
      name: 'target',
      title: 'Target Muscle',
      type: 'string',
    },
    {
      name: 'equipment',
      title: 'Equipment',
      type: 'string',
    },
    {
      name: 'instructions',
      title: 'Instructions',
      type: 'text', // ✅ IMPORTANT
    },
    {
      name: 'gifUrl',
      title: 'Exercise GIF URL',
      type: 'url',
    },
    {
      name: 'difficulty',
      title: 'Difficulty',
      type: 'string',
      options: {
        list: ['Beginner', 'Intermediate', 'Advanced'],
      },
    },
    {
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
    },
  ],
};
