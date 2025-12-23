import React, { useEffect, useState } from "react";
import {
  Text,
  SafeAreaView,
  FlatList,
  View,
  ActivityIndicator,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { Image } from "expo-image";
import { client } from "../../../lib/sanity";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

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
  const [filteredExercises, setFilteredExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  const exercisesQuery = `
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
  `;

  const fetchExercises = async () => {
    try {
      const data = await client.fetch(exercisesQuery);
      setExercises(data);
      setFilteredExercises(data);
    } catch (error) {
      console.error("Error fetching exercises:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExercises();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchExercises();
    setRefreshing(false);
  };

  // Filter exercises when searchQuery changes
  useEffect(() => {
    if (!searchQuery) {
      setFilteredExercises(exercises);
    } else {
      setFilteredExercises(
        exercises.filter((ex) =>
          ex.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }
  }, [searchQuery, exercises]);

  const renderItem = ({ item }: { item: Exercise }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/exercise-detail?id=${item._id}`)}
    >
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
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text style={styles.loadingText}>Loading exercises...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header + Search Bar */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Exercise Library</Text>
        <Text style={styles.headerSubtitle}>
          Discover and master new exercises
        </Text>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#687280" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search exercises..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons name="close-circle" size={20} color="#687280" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Exercise List */}
      <FlatList
        data={filteredExercises}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#3882F6"]}
            tintColor="#3882F6"
            title="Pull to refresh exercises"
            titleColor="#6B7280"
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="fitness-outline" size={64} color="#9CA3AF" />
            <Text style={styles.emptyTitle}>
              {searchQuery ? "No exercises found" : "No exercises yet"}
            </Text>
            <Text style={styles.emptySubtitle}>
              {searchQuery
                ? "Try adjusting your search"
                : "Your exercises will appear here"}
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB" },
  columnWrapper: { justifyContent: "space-between", paddingHorizontal: 16 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { marginTop: 8, color: "#6B7280" },
  header: {
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  headerTitle: { fontSize: 24, fontWeight: "bold", color: "#111827" },
  headerSubtitle: { color: "#6B7280", marginTop: 4 },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    padding: 8,
    marginTop: 8,
  },
  searchInput: { flex: 1, marginLeft: 8, color: "#111827" },
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
    marginHorizontal: 8,
  },
  image: { width: "100%", height: 140, borderRadius: 12, marginBottom: 8 },
  placeholder: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#E5E7EB",
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
  emptyContainer: { alignItems: "center", padding: 32 },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginTop: 8,
  },
  emptySubtitle: { color: "#6B7280", textAlign: "center", marginTop: 4 },
});
