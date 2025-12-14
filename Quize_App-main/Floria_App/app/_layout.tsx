// app/_layout.tsx
import { Stack } from "expo-router";
import SupabaseProvider from "@/context/SupabaseContext";

export default function RootLayout() {
  return (
    <SupabaseProvider>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />
    </SupabaseProvider>
  );
}


