import React, {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useContext,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Champion } from "@/types/types";
import * as Notifications from "expo-notifications";

interface NewsItem {
  newsImg: string;
  newsTitle: string;
  newsSubTitle: string;
  newsDate: string;
}

interface DataContextType {
  data: Champion[] | null;
  setData: React.Dispatch<React.SetStateAction<Champion[] | null>>;
  favorites: number[];
  toggleFavorite: (id: number) => void;
  news: NewsItem[] | null;
  fetchChampions: () => void;
}

export const DataContext = createContext<DataContextType | undefined>(
  undefined
);

interface DataProviderProps {
  children: ReactNode;
}

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const [data, setData] = useState<Champion[] | null>(null);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [news, setNews] = useState<NewsItem[] | null>(null);

  const fetchChampions = async () => {
    try {
      const response = await fetch(
        "https://raw.githubusercontent.com/HamzaChl/champions/main/champions.json"
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const newData = await response.json();
      setData(newData);
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  const fetchNews = async () => {
    try {
      const response = await fetch(
        "https://raw.githubusercontent.com/HamzaChl/lol-nativejson/refs/heads/main/news.json"
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const newData = await response.json();
      setNews(newData);
    } catch (error) {
      console.error("Error loading news data:", error);
    }
  };

  const askForNotificationPermissions = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== "granted") {
      alert("Permission for notifications not granted!");
    }
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
      }),
    });
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Checkout the latest news !",
        body: "See the latest League Of Legends news",
        data: { screen: "news" },
      },
      trigger: {
        seconds: 1,
        channelId: "news",
      },
    });
  };

  const loadFavorites = async () => {
    try {
      const storedFavorites = await AsyncStorage.getItem("favorites");
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      }
    } catch (error) {
      console.error("Error loading favorites:", error);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      askForNotificationPermissions();
    }, 100);
    fetchChampions();
  }, []);

  useEffect(() => {
    fetchNews();
    loadFavorites();
  }, []);

  const toggleFavorite = async (id: number) => {
    try {
      let updatedFavorites;
      if (favorites.includes(id)) {
        updatedFavorites = favorites.filter((favId) => favId !== id);
      } else {
        updatedFavorites = [...favorites, id];
      }
      setFavorites(updatedFavorites);
      await AsyncStorage.setItem("favorites", JSON.stringify(updatedFavorites));
    } catch (error) {
      console.error("Error updating favorites:", error);
    }
  };

  return (
    <DataContext.Provider
      value={{
        data,
        setData,
        favorites,
        toggleFavorite,
        news,
        fetchChampions,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};
