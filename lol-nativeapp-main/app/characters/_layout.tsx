import { Stack } from "expo-router";
import { StyleSheet } from "react-native";

const CharactersLayout = () => {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        headerStyle: styles.header,
        headerTitleStyle: styles.headerTitle,
        headerTintColor: "#C19D4D",
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerTitle: "Champions",
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          headerTitle: "Champion Details",
          presentation: "modal",
          headerBackTitle: "", // Masquer le titre du bouton retour
        }}
      />
    </Stack>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#030D16",
  },
  headerTitle: {
    color: "#EEE6D4",
    fontSize: 20,
  },
});

export default CharactersLayout;
