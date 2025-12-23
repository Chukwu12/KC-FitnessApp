import { createClient } from "@sanity/client";
import Constants from "expo-constants";

const { SANITY_PROJECT_ID, SANITY_DATASET } = Constants.expoConfig?.extra ?? {};

export const client = createClient({
  projectId: SANITY_PROJECT_ID,
  dataset: SANITY_DATASET,
  apiVersion: "2024-01-01",
  useCdn: false,
});
