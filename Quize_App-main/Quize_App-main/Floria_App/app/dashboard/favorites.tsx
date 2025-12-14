// app/dashboard/favorites.tsx
import FloriaHeader from "@/components/ui/FloriaHeader";
import React from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  View,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "@/components/ui/text";
import { useSupabase } from "@/context/SupabaseContext";
import type { Country } from "@/types";
import { useRouter } from "expo-router";

const FavoritesScreen = () => {
  const { favorites, toggleFavorite } = useSupabase();
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <FloriaHeader section="favorites" />

      <Text style={styles.title}>Favorite Countrys</Text>

      <ScrollView
        style={styles.list}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        {favorites.length === 0 && (
          <Text style={styles.emptyText}>
            Je hebt nog geen favoriete landen toegevoegd.
          </Text>
        )}

        {favorites.map((country: Country) => (
          <TouchableOpacity
            key={country.id}
            style={styles.rowOuter}
            activeOpacity={0.85}
            onPress={() =>
              router.push({
                pathname: "/dashboard/country/[id]",
                params: { id: String(country.id) },
              })
            }
          >
            <View style={styles.rowInner}>
              {country.flag_url ? (
                <Image
                  source={{ uri: country.flag_url }}
                  style={styles.flag}
                  resizeMode="cover"
                />
              ) : (
                <View style={styles.flagPlaceholder}>
                  <Text style={styles.flagPlaceholderText}>?</Text>
                </View>
              )}

              <Text style={styles.countryName}>{country.name}</Text>

              <TouchableOpacity
                style={styles.iconButton}
                onPress={(e) => {
                  e.stopPropagation();
                  toggleFavorite(country);
                }}
              >
                <Text style={styles.iconButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default FavoritesScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 12,
  },

  title: {
    fontSize: 32,
    color: "#ffffff",
    fontStyle: "italic",
    marginBottom: 24,
  },

  list: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 24,
  },

  rowOuter: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#454646ff",
    marginBottom: 16,
    padding: 2,
  },
  rowInner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#000000",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  flag: {
    width: 40,
    height: 26,
    borderRadius: 4,
    marginRight: 12,
  },
  flagPlaceholder: {
    width: 40,
    height: 26,
    borderRadius: 4,
    marginRight: 12,
    backgroundColor: "rgba(255,255,255,0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  flagPlaceholderText: {
    color: "#ffffff",
  },
  countryName: {
    flex: 1,
    color: "#ffffff",
    fontSize: 16,
  },
  iconButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#060000ff",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 1, 2, 0.9)",
  },
  iconButtonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "700",
  },
  emptyText: {
    color: "#ffffff",
    textAlign: "center",
    marginTop: 8,
  },
});
