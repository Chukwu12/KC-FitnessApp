import React, { useEffect, useState } from "react";
import { 
  Text, 
  SafeAreaView, 
  FlatList, 
  View, 
  ActivityIndicator, 
  StyleSheet 
} from "react-native";
import { Image } from "expo-image"; // ✅ Works on web + mobile
import { client } from "../../../lib/sanity";

type Exercise = {
  _id: string;
  name: string;
  bodyPart: string;
  target: string;
  equipment: string;
  gifUrl?: string;
  instructions?: string[];
  difficulty?: string;
  tags?: string[];
};

export default function Exercises() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const data = await client.fetch(`
          *[_type == "exercise"]{
            _id,
            name,
            bodyPart,
            target,
            equipment,
            difficulty,
            tags,
            instructions,
            gifUrl
          }
        `);
        setExercises(data);
      } catch (error) {
        console.error("Error fetching exercises:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchExercises();
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text style={styles.loadingText}>Loading exercises...</Text>
      </SafeAreaView>
    );
  }

  if (!exercises.length) {
    return (
      <SafeAreaView style={styles.center}>
        <Text style={styles.emptyText}>No exercises found.</Text>
      </SafeAreaView>
    );
  }

  const renderItem = ({ item }: { item: Exercise }) => (
    <View style={styles.card}>
      {item.gifUrl ? (
        <Image
          source={{ uri: item.gifUrl }}
          style={styles.image}
          contentFit="cover"
        />
      ) : (
        <View style={[styles.image, styles.placeholder]}>
          <Text>No Image</Text>
        </View>
      )}
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.subtext}>
        {item.target} • {item.equipment}
      </Text>
      {item.instructions?.length > 0 && (
        <View style={styles.instructions}>
          <Text style={styles.instructionTitle}>Instructions:</Text>
          {item.instructions.map((step, index) => (
            <Text key={index} style={styles.instructionStep}>
              • {step}
            </Text>
          ))}
        </View>
      )}
      {item.tags?.length > 0 && (
        <View style={styles.tagsContainer}>
          {item.tags.map((tag, idx) => (
            <Text key={idx} style={styles.tag}>
              {tag}
            </Text>
          ))}
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={exercises}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#F9FAFB" },
  columnWrapper: { justifyContent: "space-between" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { marginTop: 8, color: "#6B7280" },
  emptyText: { color: "#6B7280", fontSize: 18 },
  card: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  image: { width: "100%", height: 140, borderRadius: 12, marginBottom: 8 },
  placeholder: { 
    justifyContent: "center", 
    alignItems: "center", 
    backgroundColor: "#E5E7EB" 
  },
  name: { fontSize: 16, fontWeight: "600", marginBottom: 4 },
  subtext: { fontSize: 14, color: "#4B5563" },
  instructions: { marginTop: 8 },
  instructionTitle: { fontWeight: "600", marginBottom: 4 },
  instructionStep: { fontSize: 14, color: "#4B5563" },
  tagsContainer: { flexDirection: "row", flexWrap: "wrap", marginTop: 8 },
  tag: {
    fontSize: 12,
    backgroundColor: "#DBEAFE",
    color: "#1E40AF",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 12,
    marginRight: 4,
    marginBottom: 4,
  },
});
