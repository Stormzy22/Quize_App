// app/signup.tsx
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

const background = require("@/assets/images/background3.png");

const SignupScreen = () => {
  const { signup, loggingIn } = useSupabase(); 
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordRepeat, setPasswordRepeat] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const router = useRouter();

  const register = async () => {
    setErrorMsg(null);

    if (!email.trim() || !password || !passwordRepeat) {
      setErrorMsg("Vul alle velden in.");
      return;
    }

    if (password !== passwordRepeat) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    try {
      await signup(email.trim(), password);
      alert("Check your mailbox to verify your email.");
      router.replace("/login");
    } catch (e: any) {
      setErrorMsg(e?.message ?? "Registratie mislukt.");
    }
  };

  return (
    <ImageBackground
      source={background}
      style={styles.background}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.safeArea}>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Sign up</Text>

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

          {/* Password */}
          <Text style={styles.label}>Password</Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="********"
            placeholderTextColor="#9ca3af"
            secureTextEntry
            style={styles.input}
          />

          {/* Repeat password */}
          <Text style={styles.label}>Repeat password</Text>
          <TextInput
            value={passwordRepeat}
            onChangeText={setPasswordRepeat}
            placeholder="********"
            placeholderTextColor="#9ca3af"
            secureTextEntry
            style={styles.input}
          />

          {/* Foutmelding */}
          {errorMsg && <Text style={styles.errorText}>{errorMsg}</Text>}

          {/* Register button */}
          <TouchableOpacity
            style={[styles.button, loggingIn && styles.buttonDisabled]}
            onPress={register}
            activeOpacity={0.9}
            disabled={loggingIn}
          >
            {loggingIn ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text style={styles.buttonText}>Register</Text>
            )}
          </TouchableOpacity>

          {/* Terug naar login */}
          <View style={styles.bottomRow}>
            <Text style={styles.bottomText}>Already have an account?</Text>
            <TouchableOpacity onPress={() => router.replace("/login")}>
              <Text style={styles.bottomLink}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};

export default SignupScreen;

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
    backgroundColor: "rgba(0, 2, 6, 0.92)",
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
    marginTop: 8,
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
  },

  errorText: {
    color: "#fca5a5",
    marginTop: 8,
    marginBottom: 8,
    textAlign: "center",
  },

  button: {
    marginTop: 12,
    borderRadius: 9999,
    backgroundColor: "#373838ff",
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
