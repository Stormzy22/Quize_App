// app/dashboard/country/[id].tsx
import React, { useMemo } from "react";
import {
  Image,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Text } from "@/components/ui/text";
import FloriaHeader from "@/components/ui/FloriaHeader";
import { useSupabase } from "@/context/SupabaseContext";
import type { Country } from "@/types";

const background = require("@/assets/images/background2.jpg");

const CountryDetailScreen = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { countries, isFavorite, toggleFavorite } = useSupabase();

  const country: Country | undefined = useMemo(
    () => countries.find((c) => String(c.id) === String(id)),
    [countries, id]
  );

  // ------- land niet gevonden -------
  if (!country) {
    return (
      <ImageBackground
        source={background}
        style={styles.background}
        resizeMode="cover"
      >
        <SafeAreaView style={styles.safeArea}>
          <FloriaHeader section="country" />

          <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Text style={styles.errorText}>Country not found.</Text>
            <TouchableOpacity
              style={[styles.actionButton, styles.returnButton, { marginTop: 16 }]}
              onPress={() => router.back()}
            >
              <Text style={styles.actionButtonText}>Return</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </ImageBackground>
    );
  }

  const favorite = isFavorite(country.id);

  // ------- normale detailpagina -------
  return (
    <ImageBackground
      source={background}
      style={styles.background}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.safeArea}>
        <FloriaHeader section="country" />

        {/* Titel */}
        <Text style={styles.title}>{country.name}</Text>

        {/* Vlag */}
        {country.flag_url && (
          <View style={styles.flagWrapper}>
            <Image
              source={{ uri: country.flag_url }}
              style={styles.flag}
              resizeMode="cover"
            />
          </View>
        )}

        {/* Info box */}
        <View style={styles.infoBox}>
          <Text style={styles.infoLine}>
            <Text style={styles.infoLabel}>Capital: </Text>
            <Text style={styles.infoValue}>
              {country.capital ?? "Unknown"}
            </Text>
          </Text>
          <Text style={styles.infoLine}>
            <Text style={styles.infoLabel}>Population: </Text>
            <Text style={styles.infoValue}>
              {country.population ?? "Unknown"}
            </Text>
          </Text>
          <Text style={styles.infoLine}>
            <Text style={styles.infoLabel}>Currency: </Text>
            <Text style={styles.infoValue}>
              {country.currency ?? "Unknown"}
            </Text>
          </Text>
          <Text style={styles.infoLine}>
            <Text style={styles.infoLabel}>Abbreviation: </Text>
            <Text style={styles.infoValue}>
              {country.abbreviation ?? "Unknown"}
            </Text>
          </Text>
        </View>

        {/* Knoppen rij: Return + Favorite */}
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.actionButton, styles.returnButton]}
            onPress={() => router.back()}
            activeOpacity={0.9}
          >
            <Text style={styles.actionButtonText}>Return</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.actionButton,
              styles.favoriteButton,
              favorite && styles.favoriteButtonActive,
            ]}
            onPress={() => toggleFavorite(country)}
            activeOpacity={0.9}
          >
            <Text style={styles.actionButtonText}>
              {favorite ? "Favorited" : "Favorite"}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};

export default CountryDetailScreen;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 12,
  },

  title: {
    color: "#ffffff",
    fontSize: 32,
    fontWeight: "700",
    fontStyle: "italic",
    textAlign: "center",
    marginTop: 8,
    marginBottom: 16,
  },

  flagWrapper: {
    alignItems: "center",
    marginBottom: 24,
  },
  flag: {
    width: 300,
    height: 180,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.5)",
  },

  infoBox: {
    backgroundColor: "rgba(0,0,0,0.55)",
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 14,
    marginBottom: 32,
  },
  infoLine: {
    marginBottom: 4,
  },
  infoLabel: {
    color: "#e5e7eb",
    fontWeight: "700",
  },
  infoValue: {
    color: "#ffffff",
  },

  /* Buttons */
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  actionButton: {
    flex: 1,
    height: 48,
    borderRadius: 9999,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 4,
  },
  returnButton: {
    backgroundColor: "#38bdf8", // blauw
  },
  favoriteButton: {
    backgroundColor: "#22c55e", // groen
  },
  favoriteButtonActive: {
    backgroundColor: "#16a34a",
    borderWidth: 2,
    borderColor: "#bbf7d0",
  },
  actionButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },

  errorText: {
    color: "#ffffff",
    fontSize: 16,
    textAlign: "center",
  },
});
