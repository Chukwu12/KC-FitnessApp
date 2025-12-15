import { defineField, defineType, defineArrayMember } from 'sanity'

export default defineType({
  name: 'workout',
  title: 'Workout',
  type: 'document',
  fields: [
    defineField({
      name: 'userId',
      title: 'User ID',
      description: 'The Clerk user ID of the person who performed this workout',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'date',
      title: 'Workout Date',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'duration',
      title: 'Duration (seconds)',
      type: 'number',
      validation: (Rule) => Rule.required().min(0),
    }),

    defineField({
      name: 'exercises',
      title: 'Workout Exercises',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'workoutExercise',
          title: 'Workout Exercise',
          fields: [
            defineField({
              name: 'exercise',
              title: 'Exercise',
              type: 'reference',
              to: [{ type: 'exercise' }],
              validation: (Rule) => Rule.required(),
            }),

            defineField({
              name: 'sets',
              title: 'Sets',
              type: 'array',
              of: [
                defineArrayMember({
                  type: 'object',
                  name: 'exerciseSet',
                  title: 'Exercise Set',
                  fields: [
                    defineField({
                      name: 'reps',
                      title: 'Repetitions',
                      type: 'number',
                      validation: (Rule) => Rule.required().min(0),
                    }),
                    defineField({
                      name: 'weight',
                      title: 'Weight',
                      type: 'number',
                      validation: (Rule) => Rule.min(0),
                    }),
                    defineField({
                      name: 'weightUnit',
                      title: 'Weight Unit',
                      type: 'string',
                      options: {
                        list: [
                          { title: 'Pounds (lbs)', value: 'lbs' },
                          { title: 'Kilograms (kg)', value: 'kg' },
                        ],
                        layout: 'radio',
                      },
                      initialValue: 'lbs',
                    }),
                  ],
                  preview: {
                    select: {
                      reps: 'reps',
                      weight: 'weight',
                      weightUnit: 'weightUnit',
                    },
                    prepare({ reps, weight, weightUnit }) {
                      return {
                        title: `${reps} reps`,
                        subtitle: weight
                          ? `${weight} ${weightUnit}`
                          : 'Bodyweight',
                      }
                    },
                  },
                }),
              ],
              validation: (Rule) => Rule.required().min(1),
            }),
          ],
          preview: {
            select: {
              title: 'exercise.name',
              sets: 'sets',
            },
            prepare({ title, sets }) {
              const count = sets?.length || 0
              return {
                title: title || 'Exercise',
                subtitle: `${count} set${count !== 1 ? 's' : ''}`,
              }
            },
          },
        }),
      ],
    }),
  ],

  preview: {
    select: {
      date: 'date',
      duration: 'duration',
      exercises: 'exercises',
    },
    prepare({ date, duration, exercises }) {
      const workoutDate = date
        ? new Date(date).toLocaleDateString()
        : 'No date'
      const minutes = duration ? Math.round(duration / 60) : 0
      const count = exercises?.length || 0

      return {
        title: `Workout – ${workoutDate}`,
        subtitle: `${minutes} min • ${count} exercise${
          count !== 1 ? 's' : ''
        }`,
      }
    },
  },
})
