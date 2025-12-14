// app/dashboard/index.tsx
import React from "react";
import { View, Image, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "@/components/ui/text";
import { useRouter } from "expo-router";
import FloriaHeader from "@/components/ui/FloriaHeader";

const earth = require("../../assets/images/earth2.png");

const DashboardHome = () => {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>

      <View style={styles.content}>
        <Image source={earth} style={styles.earth} />

        <Text style={styles.titleTop}>Welcome to</Text>
        <Text style={styles.titleBottom}>Floria</Text>

        <TouchableOpacity
          style={[styles.button, styles.quizButton]}
          onPress={() => router.push("/dashboard/quiz")}
        >
          <Text style={styles.buttonText}>Quiz</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.countryButton]}
          onPress={() => router.push("/dashboard/countries")}
        >
          <Text style={styles.buttonText}>Country</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.favoritesButton]}
          onPress={() => router.push("/dashboard/favorites")}
        >
          <Text style={styles.buttonText}>Favorites</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default DashboardHome;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 12,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  earth: {
    width: 180,
    height: 180,
    marginBottom: 40,
    backgroundColor: "white",
    borderRadius: 100
  },
  titleTop: {
    color: "#ffffff",
    fontSize: 32,
    fontWeight: "800",
    textAlign: "center",
  },
  titleBottom: {
    color: "#ffffff",
    fontSize: 38,
    fontWeight: "800",
    fontStyle: "italic",
    textAlign: "center",
    marginBottom: 48,
  },
  button: {
    width: "80%",
    maxWidth: 360,
    borderRadius: 9999,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 16,
    borderColor: "white",
    borderWidth: 1
  },
  quizButton: {
    backgroundColor: "#020608ff", 
  },
  countryButton: {
    backgroundColor: "#0b0b0bff", 
  },
  favoritesButton: {
    backgroundColor: "#090909ff", 
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "700",
  },
});
