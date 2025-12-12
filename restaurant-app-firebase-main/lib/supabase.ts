import { createClient } from "@supabase/supabase-js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppState } from "react-native";
import { Database } from "database.types";

// ❗ Vul hier gewoon je eigen URL en key in
const supabaseURL = "https://ihdxlnxubcwwegwlsbxj.supabase.co";
const supabasePublishableKey =
  "sb_publishable_AncbMAm...zXiAmmpx"; // volledige key plakken

// Deze check mag je weglaten of zo laten staan, hij faalt nu toch niet meer
if (!supabaseURL || !supabasePublishableKey) {
  throw new Error("Missing supabase environment variables");
}

export const supabase = createClient<Database>(supabaseURL, supabasePublishableKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

AppState.addEventListener("change", (state) => {
  if (state === "active") {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});
