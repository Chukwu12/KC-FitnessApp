// schemaTypes/exercise.ts
import {defineType} from 'sanity'

export default defineType({
  name: 'exercise',
  title: 'Exercise',
  type: 'document',
  fields: [
    { name: 'exerciseId', title: 'Exercise ID', type: 'string' }, // original id from RapidAPI
    { name: 'name', title: 'Name', type: 'string' },
    { name: 'bodyPart', title: 'Body Part', type: 'string' },
    { name: 'target', title: 'Target Muscle', type: 'string' },
    { name: 'equipment', title: 'Equipment', type: 'string' },
    { name: 'gifUrl', title: 'GIF URL', type: 'url' },
    { name: 'instructions', title: 'Instructions', type: 'text' },
    { name: 'category', title: 'Category', type: 'string' }, // optional extra
    { name: 'level', title: 'Difficulty Level', type: 'string' }, // optional extra if API provides
  ],
})
