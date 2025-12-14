// app/dashboard/_layout.tsx
import React from "react";
import { ImageBackground, StyleSheet } from "react-native";
import { Slot } from "expo-router";

const background = require("@/assets/images/background.jpg");

export default function DashboardLayout() {
  return (
    <ImageBackground
      source={background}
      style={styles.background}
      resizeMode="cover"
    >
      {/* Alle nested routes: /dashboard, /dashboard/quiz, /dashboard/countries, ... */}
      <Slot />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
});






