import React, { useEffect, useState } from 'react';
import { Text, SafeAreaView, FlatList, View, Image, ActivityIndicator } from 'react-native';
import { client } from '../../../lib/sanity';

type Exercise = {
  _id: string;
  name: string;
  bodyPart: string;
  target: string;
  equipment: string;
  gifUrl: string;
  instructions: string[];
  difficulty: string;
  tags: string[];
};

export default function Exercises() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchExercises() {
      try {
        const data = await client.fetch(`
          *[_type == "exercise"]{
            _id,
            name,
            bodyPart,
            target,
            equipment,
            gifUrl,
            instructions,
            difficulty,
            tags
          }
        `);
        setExercises(data);
      } catch (err) {
        console.error('Error fetching exercises:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchExercises();
  }, []);

  if (loading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text className="mt-2 text-gray-500">Loading exercises...</Text>
      </SafeAreaView>
    );
  }

  if (!exercises.length) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center">
        <Text className="text-gray-500 text-lg">No exercises found.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50 p-4">
      <FlatList
        data={exercises}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View className="bg-white rounded-xl p-4 mb-4 shadow-sm border border-gray-100">
            <Text className="text-xl font-bold text-gray-900 mb-2">{item.name}</Text>
            <Image
              source={{ uri: item.gifUrl }}
              style={{ width: '100%', height: 200, borderRadius: 12 }}
              resizeMode="contain"
            />
            <Text className="text-gray-700 mt-2">Body Part: {item.bodyPart}</Text>
            <Text className="text-gray-700">Target Muscle: {item.target}</Text>
            <Text className="text-gray-700">Equipment: {item.equipment}</Text>
            <Text className="text-gray-700">Difficulty: {item.difficulty}</Text>

            {item.instructions?.length > 0 && (
              <View className="mt-2">
                <Text className="text-gray-800 font-semibold mb-1">Instructions:</Text>
                {item.instructions.map((step, index) => (
                  <Text key={index} className="text-gray-700">• {step}</Text>
                ))}
              </View>
            )}

            {item.tags?.length > 0 && (
              <View className="flex-row flex-wrap mt-2">
                {item.tags.map((tag, idx) => (
                  <Text
                    key={idx}
                    className="text-sm bg-blue-100 text-blue-700 px-2 py-1 rounded-full mr-2 mb-1"
                  >
                    {tag}
                  </Text>
                ))}
              </View>
            )}
          </View>
        )}
      />
    </SafeAreaView>
  );
}
