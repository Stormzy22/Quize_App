// components/FloriaHeader.tsx
import React, { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "expo-router";
import { useSupabase } from "@/context/SupabaseContext";
import {
  Animated,
  Easing,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  PanResponder,
} from "react-native";

const earth = require("@/assets/images/earth2.png");
const menuIcon = require("@/assets/images/menu.png"); // 👈 nieuw

type Section = "home" | "quiz" | "countries" | "favorites" | "country";

type DashboardRoute =
  | "/dashboard"
  | "/dashboard/quiz"
  | "/dashboard/countries"
  | "/dashboard/favorites";

type Props = {
  section?: Section;
};

const DRAWER_WIDTH = 260;

export default function FloriaHeader({ section }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const { logout } = useSupabase();

  const [open, setOpen] = useState(false);
  const slideX = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
  const dimOpacity = useRef(new Animated.Value(0)).current;

  const active: Section =
    section ??
    (pathname.startsWith("/dashboard/quiz")
      ? "quiz"
      : pathname.startsWith("/dashboard/countries")
      ? "countries"
      : pathname.startsWith("/dashboard/favorites")
      ? "favorites"
      : pathname.startsWith("/dashboard/country/")
      ? "country"
      : "home");

  // animatie
  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideX, {
        toValue: open ? 0 : -DRAWER_WIDTH,
        duration: open ? 280 : 220,
        easing: open ? Easing.out(Easing.cubic) : Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(dimOpacity, {
        toValue: open ? 1 : 0,
        duration: open ? 280 : 220,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [open, slideX, dimOpacity]);

  const goTo = (path: DashboardRoute) => {
    if (pathname === path) {
      setOpen(false);
      return;
    }
    router.push(path);
    setOpen(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      setOpen(false);
    }
  };

  // swipe vanaf linkerrand om te openen
  const edgePanResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gesture) =>
        !open && gesture.moveX <= 30 && gesture.dx > 20,
      onPanResponderRelease: () => setOpen(true),
    })
  ).current;

  // swipe in drawer om te sluiten
  const drawerPanResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gesture) =>
        open && gesture.dx < -10,
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dx < -40) setOpen(false);
      },
    })
  ).current;

  return (
    <>
      {/* onzichtbare swipe-zone links */}
      <View style={styles.edgeSwipeArea} {...edgePanResponder.panHandlers} />

      {/* header */}
      <View style={styles.headerRow}>
        <TouchableOpacity
          style={styles.hamburgerButton}
          onPress={() => setOpen(true)}
          activeOpacity={0.8}
        >
          {/* 👇 ipv drie lijntjes nu je menu.png */}
          <Image source={menuIcon} style={styles.menuIcon} resizeMode="contain" />
        </TouchableOpacity>

        <View style={styles.logoRow}>
          <Image source={earth} style={styles.logoIcon} resizeMode="contain" />
          <Text style={styles.logoText}>Floria</Text>
        </View>

        <View style={styles.headerSpacer} />
      </View>

      {/* drawer + overlay (altijd gemount, maar alleen klikbaar als open) */}
      <View
        style={styles.drawerWrapper}
        pointerEvents={open ? "auto" : "none"}
      >
        {/* overlay over volledige screen */}
        <Animated.View style={[styles.backdrop, { opacity: dimOpacity }]}>
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={() => setOpen(false)}
          />
        </Animated.View>

        {/* drawer links */}
        <Animated.View
          style={[styles.drawer, { transform: [{ translateX: slideX }] }]}
          {...drawerPanResponder.panHandlers}
        >
          <Text style={styles.drawerTitle}>Menu</Text>

          <DrawerItem
            label="Home"
            active={active === "home"}
            onPress={() => goTo("/dashboard")}
          />
          <DrawerItem
            label="Quiz"
            active={active === "quiz"}
            onPress={() => goTo("/dashboard/quiz")}
          />
          <DrawerItem
            label="Countries"
            active={active === "countries" || active === "country"}
            onPress={() => goTo("/dashboard/countries")}
          />
          <DrawerItem
            label="Favorites"
            active={active === "favorites"}
            onPress={() => goTo("/dashboard/favorites")}
          />

          <View style={styles.divider} />

          <DrawerItem label="Logout" danger onPress={handleLogout} />
        </Animated.View>
      </View>
    </>
  );
}

/* helper item */

type DrawerItemProps = {
  label: string;
  onPress: () => void;
  active?: boolean;
  danger?: boolean;
};

const DrawerItem = ({ label, onPress, active, danger }: DrawerItemProps) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.8}
    style={[
      styles.drawerItem,
      active && styles.drawerItemActive,
      danger && styles.drawerItemDanger,
    ]}
  >
    <Text
      style={[
        styles.drawerItemText,
        active && styles.drawerItemTextActive,
        danger && styles.drawerItemTextDanger,
      ]}
    >
      {label}
    </Text>
  </TouchableOpacity>
);

/* styles */

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
  },
  hamburgerButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
     //backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
  },
  // 👇 nieuw: stijl voor het menu-icoon
  menuIcon: {
    width: 18,
    height: 18,
    tintColor: "#ffffff", // als je icon zwart/wit is, wordt hij mooi wit
  },
  logoRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  logoIcon: {
    width: 24,
    height: 24,
    marginRight: 8,
    backgroundColor: "white",
    borderRadius: 100
  },
  logoText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "600",
  },
  headerSpacer: {
    width: 36,
  },

  edgeSwipeArea: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 20,
    zIndex: 40,
  },

  // wrapper over volledige screen
  drawerWrapper: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 50,
  },

  // overlay full-screen
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.45)",
  },

  // drawer links
  drawer: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: DRAWER_WIDTH,
    backgroundColor: "#050505",
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 30,
  },

  drawerTitle: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 24,
  },
  drawerItem: {
    paddingVertical: 10,
  },
  drawerItemActive: {
    backgroundColor: "#111827",
    borderRadius: 6,
    paddingHorizontal: 8,
  },
  drawerItemDanger: {
    marginTop: 12,
  },
  drawerItemText: {
    color: "#e5e7eb",
    fontSize: 16,
  },
  drawerItemTextActive: {
    color: "#38bdf8",
    fontWeight: "700",
  },
  drawerItemTextDanger: {
    color: "#f97373",
  },
  divider: {
    height: 1,
    backgroundColor: "#1f2937",
    marginVertical: 16,
  },
});
