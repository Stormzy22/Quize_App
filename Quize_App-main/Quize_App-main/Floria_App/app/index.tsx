// app/index.tsx
import * as React from "react";
import { ActivityIndicator, ImageBackground, View, StyleSheet } from "react-native";
import { Redirect } from "expo-router";
import { useSupabase } from "@/context/SupabaseContext";

const background = require("@/assets/images/background.jpg");

export default function IndexScreen() {
  const { initializing, session } = useSupabase();

  // Terwijl we nog bezig zijn met sessie ophalen
  if (initializing) {
    return (
      <ImageBackground source={background} style={styles.background} resizeMode="cover">
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#ffffff" />
        </View>
      </ImageBackground>
    );
  }

  // Als er een sessie is -> naar dashboard
  if (session) {
    return <Redirect href="/dashboard" />;
  }

  // Anders -> naar login
  return <Redirect href="/login" />;
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
