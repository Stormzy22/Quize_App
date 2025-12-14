// app/dashboard/countries.tsx
import FloriaHeader from "@/components/ui/FloriaHeader";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useSupabase } from "@/context/SupabaseContext";
import type { Country } from "@/types";

/** ---- RENDER VAN ÉÉN RIJ (land) ---- */

type CountryRowProps = {
  country: Country;
  onPress: () => void;
  onToggleFavorite: () => void;
  favorite: boolean;
};

const CountryRow: React.FC<CountryRowProps> = ({
  country,
  onPress,
  onToggleFavorite,
  favorite,
}) => {
  const [flagError, setFlagError] = useState(false);

  // Als de vlag niet geladen kan worden -> land niet tonen
  if (!country.flag_url || flagError) {
    return null;
  }

  return (
    <TouchableOpacity style={styles.row} onPress={onPress}>
      <View style={styles.rowLeft}>
        <TouchableOpacity activeOpacity={0.9} onPress={onPress}>
          <ImageBackground
            source={{ uri: country.flag_url }}
            style={styles.flag}
            imageStyle={styles.flagImage}
            resizeMode="cover"
            onError={() => setFlagError(true)}
          />
        </TouchableOpacity>
        <Text style={styles.countryName}>{country.name}</Text>
      </View>

      <TouchableOpacity
        style={[styles.addButton, favorite && styles.addButtonActive]}
        onPress={(e) => {
          e.stopPropagation();
          onToggleFavorite();
        }}
      >
        <Text style={styles.addButtonText}>{favorite ? "✓" : "+"}</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

/** ---- HOOFDSCHERM ---- */

const CountriesScreen = () => {
  const router = useRouter();
  const { countries, loading, error, toggleFavorite, isFavorite } =
    useSupabase();
  const [search, setSearch] = useState("");

  // basisfilter: alleen landen met niet-lege flag_url die op een echte URL lijkt
  const countriesWithFlag = useMemo(
    () =>
      countries
        .filter((c) => {
          const url = c.flag_url?.trim();
          if (!url) return false;
          if (url.toLowerCase() === "null") return false;
          if (!url.startsWith("http")) return false;
          return true;
        })
        .sort((a, b) => a.name.localeCompare(b.name)),
    [countries]
  );

  // search
  const visibleCountries = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return countriesWithFlag;
    return countriesWithFlag.filter((c) =>
      c.name.toLowerCase().includes(q)
    );
  }, [countriesWithFlag, search]);

  /* ====== LOADING / ERROR STATES ====== */

  if (loading) {
    return (
      <SafeAreaView style={styles.centerSafeArea}>
        <ActivityIndicator />
        <Text style={styles.loadingText}>Landen aan het laden...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.centerSafeArea}>
        <Text style={styles.errorText}>Fout bij het ophalen van landen</Text>
        <Text style={styles.errorDetail}>{error.message}</Text>
      </SafeAreaView>
    );
  }

  /* ====== NORMAAL SCHERM ====== */

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Topbar met hamburger + logo */}
      <FloriaHeader section="countries" />

      {/* Titel */}
      <Text style={styles.title}>Countries</Text>

      {/* Search bar */}
      <View style={styles.searchWrapper}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search"
          placeholderTextColor="#6b7280"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Lijst */}
      <FlatList<Country>
        data={visibleCountries}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <CountryRow
            country={item}
            favorite={isFavorite(item.id)}
            onPress={() =>
              router.push({
                pathname: "/dashboard/country/[id]",
                params: { id: String(item.id) },
              })
            }
            onToggleFavorite={() => toggleFavorite(item)}
          />
        )}
      />
    </SafeAreaView>
  );
};

export default CountriesScreen;

/** ---- STYLES ---- */

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 12, // zelfde als quiz + favorites → header op exact dezelfde hoogte
  },

  centerSafeArea: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#ffffff",
    marginTop: 8,
  },
  errorText: {
    color: "#fee2e2",
    fontWeight: "600",
    marginBottom: 4,
  },
  errorDetail: {
    color: "#fecaca",
    textAlign: "center",
  },

  title: {
    color: "#ffffff",
    fontSize: 32,
    fontWeight: "700",
    marginBottom: 12,
  },

  /* SEARCH BAR */
  searchWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(243,244,246,1)",
    borderRadius: 9999,
    paddingHorizontal: 14,
    height: 44,
    marginBottom: 16,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 8,
    color: "#6b7280",
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#111827",
  },

  listContent: {
    paddingBottom: 24,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(0,0,0,0.85)",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#22d3ee",
  },
  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
    flexShrink: 1,
  },

  flag: {
    width: 48,
    height: 32,
    marginRight: 10,
    borderRadius: 4,
    overflow: "hidden",
  },
  flagImage: {
    borderRadius: 4,
  },

  countryName: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },

  addButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#22c55e",
    alignItems: "center",
    justifyContent: "center",
  },
  addButtonActive: {
    backgroundColor: "#16a34a",
    borderWidth: 2,
    borderColor: "#bbf7d0",
  },
  addButtonText: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "800",
    marginTop: -2,
  },
});
