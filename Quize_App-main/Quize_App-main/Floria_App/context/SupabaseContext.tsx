// context/SupabaseContext.tsx
import { supabase } from "@/lib/supabase";
import { Country } from "@/types";
import { Session } from "@supabase/supabase-js";
import { useRouter } from "expo-router";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

interface SupabaseContextProps {
  session: Session | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  loggingIn: boolean;
  initializing: boolean;
  loading: boolean;
  error: Error | null;
  countries: Country[];
  favorites: Country[];
  toggleFavorite: (country: Country) => void;
  isFavorite: (id: number) => boolean;
}

const SupabaseContext = createContext<SupabaseContextProps | undefined>(
  undefined
);

const SupabaseProvider = ({ children }: { children: ReactNode }) => {
  const [loggingIn, setLoggingIn] = useState<boolean>(false);
  const [initializing, setInitializing] = useState<boolean>(true);
  const [session, setSession] = useState<Session | null>(null);

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const [countries, setCountries] = useState<Country[]>([]);
  const [favoriteCodes, setFavoriteCodes] = useState<string[]>([]);

  const router = useRouter();

  /* 👉 1. Sessie ophalen + routeren bij inloggen/uitloggen */
  useEffect(() => {
    let cancelled = false;

    const init = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (cancelled) return;
        setSession(data.session);
      } catch (e) {
        console.log("Error fetching session", e);
      } finally {
        if (cancelled) return;
        setInitializing(false);
      }
    };

    init();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, newSession) => {
      if (cancelled) return;
      setSession(newSession);

      if (event === "SIGNED_IN") {
        router.replace("/dashboard");
      } else if (event === "SIGNED_OUT") {
        router.replace("/login");
      }
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, []);

  /* 👉 2. Favorites ophalen uit Supabase wanneer je inlogt (GET op dezelfde API) */
  useEffect(() => {
    let cancelled = false;

    const fetchFavorites = async () => {
      if (!session) {
        setFavoriteCodes([]);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("favorites")
          .select("country_code")
          .eq("user_id", session.user.id);

        if (error) throw error;
        if (cancelled) return;

        const codes =
          data?.map((row: { country_code: string | null }) => row.country_code)
            .filter((c): c is string => !!c) ?? [];

        setFavoriteCodes(codes);
      } catch (e) {
        console.error("Error fetching favorites from Supabase", e);
      }
    };

    fetchFavorites();

    return () => {
      cancelled = true;
    };
  }, [session]);

  /* 👉 3. Countries ophalen (externe API) */
  useEffect(() => {
    if (!session) {
      setCountries([]);
      return;
    }

    let cancelled = false;

    const fetchCountries = async () => {
      try {
        setLoading(true);

        const response = await fetch(
          "https://sampleapis.assimilate.be/countries/countries"
        );

        if (!response.ok) {
          throw new Error("Kon landen niet ophalen van de API");
        }

        const data = await response.json();

        const mapped: Country[] = (data as any[]).map((item, index) => ({
          id: index + 1,
          created_at: null,
          name: item.name ?? "Onbekend",
          continent: item.continent ?? item.region ?? "Unknown",
          flag_url:
            item.flag_url ?? item.flag ?? item.media?.flag ?? null,
          capital: item.capital ?? item.capitalCity ?? null,
          population: item.population ?? item.populationCount ?? null,
          currency: item.currency ?? item.mainCurrency ?? null,
          abbreviation:
            item.abbreviation ?? item.code ?? item.alpha2Code ?? null,
        }));

        if (cancelled) return;

        setCountries(mapped);
        setError(null);
      } catch (e) {
        console.error("Error fetching countries from API", e);
        if (!cancelled) {
          setError(e as Error);
          setCountries([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchCountries();

    return () => {
      cancelled = true;
    };
  }, [session]);

  // landen die favoriet zijn op basis van de codes
  const favorites = useMemo(
    () =>
      countries.filter(
        (c) => c.abbreviation && favoriteCodes.includes(c.abbreviation)
      ),
    [countries, favoriteCodes]
  );

  /* 👉 4. Auth-functies */

  const login = async (email: string, password: string) => {
    setLoggingIn(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
    } finally {
      setLoggingIn(false);
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (err) {
      console.log(err);
    }
  };

  const signup = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
    } catch (e) {
      console.log(e);
      throw e;
    }
  };

  /* 👉 5. Favorites in memory + in Supabase */

  const toggleFavorite = async (country: Country) => {
    if (!session) return;
    if (!country.abbreviation) return;

    const code = country.abbreviation;
    const isFav = favoriteCodes.includes(code);

    // UI direct updaten (optimistic)
    setFavoriteCodes((prev) =>
      isFav ? prev.filter((c) => c !== code) : [...prev, code]
    );

    try {
      if (isFav) {
        const { error } = await supabase
          .from("favorites")
          .delete()
          .eq("user_id", session.user.id)
          .eq("country_code", code);

        if (error) throw error;
      } else {
        const { error } = await supabase.from("favorites").insert({
          user_id: session.user.id,
          country_code: code,
        });

        if (error) throw error;
      }
    } catch (e) {
      console.error("Error toggling favorite", e);
      // eventueel rollback als je wil
    }
  };

  const isFavorite = (id: number) => {
    const country = countries.find((c) => c.id === id);
    if (!country?.abbreviation) return false;
    return favoriteCodes.includes(country.abbreviation);
  };

  return (
    <SupabaseContext.Provider
      value={{
        loggingIn,
        initializing,
        session,
        login,
        logout,
        signup,
        loading,
        error,
        countries,
        favorites,
        toggleFavorite,
        isFavorite,
      }}
    >
      {children}
    </SupabaseContext.Provider>
  );
};

export const useSupabase = () => {
  const context = useContext(SupabaseContext);

  if (context === undefined) {
    throw new Error("useSupabase must be used within an SupabaseProvider");
  }

  return context;
};

export default SupabaseProvider;
