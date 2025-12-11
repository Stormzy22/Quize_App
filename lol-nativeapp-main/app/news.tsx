import React from "react";
import { View, Text, StyleSheet, FlatList, Image } from "react-native";
import { useData } from "@/context/DataContext";
import { ScrollView } from "react-native-virtualized-view";

const News = () => {
  const { news } = useData();

  if (!news) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Loading news...</Text>
      </View>
    );
  }

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.newsImg }} style={styles.newsImage} />
      <View style={styles.cardContent}>
        <Text style={styles.newsTitle}>{item.newsTitle}</Text>
        <Text style={styles.newsSubTitle}>{item.newsSubTitle}</Text>
        <Text style={styles.newsDate}>{item.newsDate}</Text>
      </View>
    </View>
  );

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={[styles.title, { fontFamily: "BeaufortforLOL-Bold" }]}>
          NEWS
        </Text>
        <FlatList
          data={news}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.newsList}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 30,
    flex: 1,
    backgroundColor: "#f4f4f4",
  },
  title: {
    color: "#C19D4D",
    textAlign: "center",
    fontSize: 40,
    marginBottom: 20,
    textTransform: "uppercase",
  },
  newsList: {
    paddingHorizontal: 10,
  },
  card: {
    margin: 10,
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
  newsDate: {
    fontSize: 12,
    color: "#aaa",
  },
});

export default News;
