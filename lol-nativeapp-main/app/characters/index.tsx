import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import { ScrollView } from "react-native-virtualized-view";
import { Link, router, useLocalSearchParams } from "expo-router";
import { useData } from "../../context/DataContext";
import FontAwesome from "@expo/vector-icons/FontAwesome";

const CLASSES = [
  "All",
  "Tank",
  "Mage",
  "Assassin",
  "Marksman",
  "Support",
  "Fighter",
];

const Characters = () => {
  const { data, toggleFavorite, favorites } = useData();
  const { class: selectedClass } = useLocalSearchParams();
  const [currentClass, setCurrentClass] = useState("All");

  useEffect(() => {
    if (typeof selectedClass === "string") {
      setCurrentClass(selectedClass);
    } else {
      setCurrentClass("All");
    }
  }, [selectedClass]);

  const handlePress = (id: number) => {
    router.push(`/characters/${id}`);
  };

  const handlePressAdd = () => {
    router.push(`/characters/add`);
  };

  const filteredData =
    currentClass === "All"
      ? data || []
      : (data || []).filter((item) =>
          item.tags?.some(
            (tag) => tag.toLowerCase() === currentClass.toLowerCase()
          )
        );

  const renderItem = ({ item }: { item: any }) => {
    const isFavorite = favorites.includes(item.id);

    return (
      <TouchableOpacity
        style={styles.championCard}
        onPress={() => handlePress(item.id)}
      >
        <Image
          source={{ uri: item.image.loading }}
          style={styles.championImage}
        />
        <View style={styles.textContainer}>
          <Text style={styles.championName}>{item.name}</Text>
          <Text style={styles.championTitle}>{item.title}</Text>
        </View>
        <TouchableOpacity
          style={styles.favoriteIcon}
          onPress={() => toggleFavorite(item.id)}
        >
          <FontAwesome
            name={isFavorite ? "heart" : "heart"}
            size={26}
            color={isFavorite ? "red" : "#ffffffb4"}
          />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <View>
      <View style={styles.addContent}>
        <Link href={`/characters/add`} asChild>
          <FontAwesome name="plus" size={24} color="#C19D4D" />
        </Link>
      </View>
      <ScrollView>
        <View style={styles.container}>
          <Text style={[styles.title, { fontFamily: "BeaufortforLOL-Bold" }]}>
            CHAMPIONS
          </Text>

          <View style={styles.classSelector}>
            {CLASSES.map((className) => (
              <TouchableOpacity
                key={className}
                style={[
                  styles.classButton,
                  currentClass === className && styles.activeClassButton,
                ]}
                onPress={() => {
                  router.push(`/characters?class=${className}`);
                  setCurrentClass(className);
                }}
              >
                <Text
                  style={[
                    styles.classButtonText,
                    currentClass === className && styles.activeClassButtonText,
                  ]}
                >
                  {className}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.counter}>
            {`Champions found: ${filteredData.length}`}
          </Text>

          <FlatList
            data={filteredData}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            numColumns={2}
            contentContainerStyle={styles.flatListContent}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 30,
    flex: 1,
  },
  classSelector: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: 10,
    marginBottom: 20,
    justifyContent: "center",
  },
  classButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#C19D4D",
    borderRadius: 8,
    margin: 5,
    minWidth: "20%",
    alignItems: "center",
    justifyContent: "center",
  },
  activeClassButton: {
    backgroundColor: "#C19D4D",
    color: "white",
  },
  classButtonText: {
    fontSize: 14,
    color: "#C19D4D",
  },
  activeClassButtonText: {
    color: "#FFFFFF",
  },
  flatListContent: {
    paddingHorizontal: 10,
  },
  championCard: {
    margin: 10,
    backgroundColor: "#1C1C1E",
    borderRadius: 15,
    overflow: "hidden",
    justifyContent: "flex-end",
    alignItems: "center",
    padding: 15,
    width: "45%",
    height: 300,
    borderWidth: 3,
    borderColor: "#C19D4D",
  },
  championImage: {
    width: "130%",
    height: "130%",
    borderRadius: 10,
    marginBottom: 10,
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 0,
    resizeMode: "cover",
  },
  textContainer: {
    position: "absolute",
    bottom: 15,
    left: 15,
    width: "100%",
    zIndex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.9)",
    borderRadius: 10,
    padding: 10,
  },
  championName: {
    fontWeight: "bold",
    fontFamily: "BeaufortforLOL-Bold",
    fontSize: 18,
    color: "#C19D4D",
    textAlign: "center",
  },
  championTitle: {
    fontSize: 14,
    color: "#EDE6D4",
    opacity: 0.6,
    textAlign: "center",
  },
  favoriteIcon: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  title: {
    color: "#C19D4D",
    textAlign: "center",
    fontSize: 40,
    marginBottom: 20,
  },
  addContent: {
    position: "absolute",
    width: 70,
    height: 70,
    backgroundColor: "#ffffff",
    top: 630,
    right: 20,
    zIndex: 2,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  counter: {
    color: "#9c9c9c",
    textAlign: "center",
    fontSize: 14,
    marginBottom: 10,
  },
});

export default Characters;
