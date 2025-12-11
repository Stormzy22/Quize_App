import React, { useState, useEffect } from "react";
import { Link, router } from "expo-router";
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { useData } from "../context/DataContext";
import { ScrollView } from "react-native-virtualized-view";

const classes = [
  { name: "Tank", icon: require("../assets/images/icons/tank.webp") },
  { name: "Mage", icon: require("../assets/images/icons/mage.webp") },
  { name: "Assassin", icon: require("../assets/images/icons/slayer.webp") },
  { name: "Marksman", icon: require("../assets/images/icons/marksman.webp") },
  {
    name: "Support",
    icon: require("../assets/images/icons/controller.webp"),
  },
  { name: "Fighter", icon: require("../assets/images/icons/fighter.webp") },
];

const Index = () => {
  const { data } = useData();
  const [articles, setArticles] = useState<
    { id: number; title: string; description: string; image: string }[]
  >([]);

  const { news } = useData();

  if (!news) {
    return (
      <View style={styles.loadingScreen}>
        <Image
          source={require("@/assets/images/logo.png")}
          style={styles.homeImage}
        />
        <Text>Loading data...</Text>
      </View>
    );
  }

  const handlePress = () => {
    router.push(`/characters`);
  };

  const handlePressNews = () => {
    router.push(`/news`);
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.newsImg }} style={styles.newsImage} />
      <View style={styles.cardContent}>
        <Text style={styles.newsTitle}>{item.newsTitle}</Text>
        <Text style={styles.newsSubTitle}>{item.newsSubTitle}</Text>
      </View>
    </View>
  );

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.homeContainer}>
          <Image
            source={require("@/assets/images/home.jpg")}
            style={styles.homeImage}
          />

          <View style={styles.textContainer}>
            <Text style={styles.subTitle}>CHOOSE YOUR</Text>
            <Text style={[styles.title, { fontFamily: "BeaufortforLOL-Bold" }]}>
              CHAMPION
            </Text>
            <Text style={styles.corpseText}>
              Whether you like to dive straight into the fray, support your
              teammates, or something in between, there’s a spot for you on the
              Rift.
            </Text>
            <View style={styles.classes}>
              {classes.map((classItem) => (
                <Link
                  key={classItem.name}
                  href={`/characters?class=${classItem.name}`}
                  asChild
                >
                  <TouchableOpacity style={styles.classIcon}>
                    <Image
                      source={classItem.icon}
                      style={styles.iconImage}
                      resizeMode="contain"
                    />
                    <Text style={styles.classText}>{classItem.name}</Text>
                  </TouchableOpacity>
                </Link>
              ))}
            </View>
            <TouchableOpacity
              style={styles.button}
              onPress={() => handlePress()}
            >
              <View>
                <Text
                  style={[
                    styles.buttonText,
                    { fontFamily: "BeaufortforLOL-Bold" },
                  ]}
                >
                  Discover our Champions
                </Text>
              </View>
            </TouchableOpacity>
          </View>
          <Text style={[styles.subTitle]}>DISCOVER OUR</Text>
          <Text style={[styles.title, { fontFamily: "BeaufortforLOL-Bold" }]}>
            Latest news
          </Text>
          <View style={styles.container}>
            <FlatList
              data={news.slice(0, 2)}
              keyExtractor={(item, index) => index.toString()}
              renderItem={renderItem}
              contentContainerStyle={styles.newsList}
            />
          </View>
          <TouchableOpacity
            style={styles.button}
            onPress={() => handlePressNews()}
          >
            <View>
              <Text
                style={[
                  styles.buttonText,
                  { fontFamily: "BeaufortforLOL-Bold" },
                ]}
              >
                See more news...
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 30,
    flex: 1,
  },
  homeImage: {
    width: "100%",
    height: 300,
    borderRadius: 15,
    resizeMode: "cover",
  },
  homeContainer: {
    paddingHorizontal: 20,
  },
  classes: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: 20,
  },
  classIcon: {
    margin: 5,
    alignItems: "center",
    backgroundColor: "#0F1922",
    width: "30%",
    borderRadius: 10,
    padding: 10,
  },
  iconImage: {
    width: 40,
    height: 40,
  },
  classText: {
    marginTop: 5,
    color: "#C19D4D",
    fontSize: 12,
    textAlign: "center",
  },
  loadingScreen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    alignContent: "center",
  },
  title: {
    color: "#C19D4D",
    textAlign: "center",
    fontSize: 40,
    marginBottom: 20,
    marginTop: 10,
    textTransform: "uppercase",
  },
  subTitle: {
    textAlign: "center",
    fontSize: 17,
  },
  textContainer: {
    marginTop: 100,
    textAlign: "center",
  },
  corpseText: {
    textAlign: "center",
    fontSize: 13,
    color: "#939393",
  },
  button: {
    height: 70,
    backgroundColor: "#0F1922",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
    marginBottom: 100,
    borderRadius: 10,
  },
  buttonText: {
    color: "#C19D4D",
    fontSize: 17,
    textTransform: "uppercase",
  },
  newsList: {
    paddingHorizontal: 0,
  },
  card: {
    backgroundColor: "#fff",
    marginBottom: 20,
    borderRadius: 10,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  newsImage: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
  },
  cardContent: {
    padding: 15,
  },
  newsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  newsSubTitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 10,
  },
});

export default Index;
