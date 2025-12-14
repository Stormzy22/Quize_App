// app/login.tsx
import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  ImageBackground,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "@/components/ui/text";
import { useSupabase } from "@/context/SupabaseContext";
import { useRouter } from "expo-router";

const background = require("@/assets/images/background.jpg");
const earth = require("@/assets/images/earth.png");

const LoginScreen = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [localError, setLocalError] = useState<string | null>(null);

  const { login, loggingIn } = useSupabase();
  const router = useRouter();

  const handleLogin = async () => {
    setLocalError(null);

    if (!email.trim() || !password) {
      setLocalError("Vul je e-mail en wachtwoord in.");
      return;
    }

    try {
      await login(email.trim(), password);
      // navigatie naar /dashboard gebeurt in SupabaseContext bij SIGNED_IN
    } catch (e: any) {
      setLocalError(e?.message ?? "Inloggen mislukt.");
    }
  };

  return (
    <ImageBackground
      source={background}
      style={styles.background}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.safeArea}>
       

        {/* De 'card' in het midden van het scherm */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Login</Text>

          {/* Email */}
          <Text style={styles.label}>Email</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="m@example.com"
            placeholderTextColor="#9ca3af"
            keyboardType="email-address"
            autoComplete="email"
            autoCapitalize="none"
            style={styles.input}
          />

          {/* Password + 'forgot password' */}
          <View style={styles.passwordRow}>
            <Text style={styles.label}>Password</Text>
            <TouchableOpacity
              onPress={() => {
                // TODO: eventueel later een "forgot password" scherm
              }}
            >
              <Text style={styles.linkSmall}>Forgot your password?</Text>
            </TouchableOpacity>
          </View>

          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="********"
            placeholderTextColor="#9ca3af"
            secureTextEntry
            style={styles.input}
          />

          {/* Foutmelding */}
          {localError && <Text style={styles.errorText}>{localError}</Text>}

          {/* Continue button */}
          <TouchableOpacity
            style={[styles.button, loggingIn && styles.buttonDisabled]}
            onPress={handleLogin}
            activeOpacity={0.9}
            disabled={loggingIn}
          >
            {loggingIn ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text style={styles.buttonText}>Continue</Text>
            )}
          </TouchableOpacity>

          {/* Sign up link onderaan */}
          <View style={styles.bottomRow}>
            <Text style={styles.bottomText}>Don&apos;t have an account?</Text>
            <TouchableOpacity onPress={() => router.push("/signup")}>
              <Text style={styles.bottomLink}>Sign up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
    justifyContent: "center",
  },
  headerRow: {
    position: "absolute",
    top: 16,
    left: 24,
    right: 24,
    flexDirection: "row",
    alignItems: "center",
  },
  logo: {
    width: 28,
    height: 28,
    marginRight: 8,
  },
  logoText: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "700",
    fontStyle: "italic",
  },

  card: {
    width: "100%",
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 24,
    backgroundColor: "rgba(15,23,42,0.92)", // donker-blauw/zwart
  },
  cardTitle: {
    color: "#ffffff",
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 16,
    textAlign: "center",
  },

  label: {
    color: "#e5e7eb",
    fontSize: 14,
    marginBottom: 4,
  },
  input: {
    borderRadius: 9999,
    backgroundColor: "rgba(17,24,39,1)",
    borderWidth: 1,
    borderColor: "rgba(55,65,81,1)",
    paddingHorizontal: 16,
    paddingVertical: 10,
    color: "#ffffff",
    fontSize: 16,
    marginBottom: 12,
  },
  passwordRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
  },
  linkSmall: {
    color: "#38bdf8",
    fontSize: 12,
  },

  errorText: {
    color: "#fca5a5",
    marginTop: 4,
    marginBottom: 8,
    textAlign: "center",
  },

  button: {
    marginTop: 8,
    borderRadius: 9999,
    backgroundColor: "#38bdf8",
    paddingVertical: 12,
    alignItems: "center",
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "700",
  },

  bottomRow: {
    marginTop: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
  },
  bottomText: {
    color: "#e5e7eb",
    fontSize: 14,
  },
  bottomLink: {
    color: "#38bdf8",
    fontSize: 14,
    fontWeight: "600",
    textDecorationLine: "underline",
  },
});
