import { View, Text, TouchableOpacity } from "react-native";
import { Exercise } from "@/lib/sanity/types";

const getDifficultyColor = (difficulty?: string) => {
  switch (difficulty) {
    case "beginner":
      return "bg-green-500";
    case "intermediate":
      return "bg-yellow-500";
    case "advanced":
      return "bg-red-500";
    default:
      return "bg-gray-400";
  }
};

const getDifficultyText = (difficulty?: string) => {
  switch (difficulty) {
    case "beginner":
      return "Beginner";
    case "intermediate":
      return "Intermediate";
    case "advanced":
      return "Advanced";
    default:
      return "Unknown";
  }
};

interface ExerciseCardProps {
  item: Exercise;
  onPress: () => void;
  showChevron?: boolean;
}

export default function ExerciseCard({
  item,
  onPress,
  showChevron = false,
}: ExerciseCardProps) {
  return (
    <TouchableOpacity
      className="bg-white rounded-2xl mb-4 shadow-sm border border-gray-100 p-4"
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text className="text-lg font-semibold text-gray-900">{item.name}</Text>

      <View className="flex-row items-center mt-2">
        <View
          className={`px-2 py-1 rounded-full ${getDifficultyColor(
            item.difficulty
          )}`}
        >
          <Text className="text-xs text-white font-medium">
            {getDifficultyText(item.difficulty)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
