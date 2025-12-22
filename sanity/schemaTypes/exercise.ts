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
      // readOnly: true,
    },
    {
      name: 'name',
      type: 'string',
    },
    {
      name: 'bodyPart',
      type: 'string',
    },
    {
      name: 'target',
      title: 'Target Muscle',
      type: 'string',
    },
    {
      name: 'equipment',
      type: 'string',
    },
    {
      name: 'instructions',
      type: 'array',
      of: [{type: 'string'}],
    },
    {
      name: 'gifUrl',
      type: 'url',
    },
    {
      name: 'difficulty',
      type: 'string',
      options: {
        list: ['Beginner', 'Intermediate', 'Advanced'],
      },
    },
    {
      name: 'tags',
      type: 'array',
      of: [{type: 'string'}],
    },
    {
      name: 'description',
      type: 'text',
    },
    {
      name: 'videoUrl',
      type: 'url',
    },
    {
      name: 'isActive',
      type: 'boolean',
      initialValue: true,
    },
  ],
}
