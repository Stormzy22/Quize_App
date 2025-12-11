import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  Button,
  ScrollView,
  Image,
  Alert,
  TouchableOpacity,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useData } from "../../context/DataContext";

type ChampionStats = Record<
  | "hp"
  | "hpperlevel"
  | "mp"
  | "mpperlevel"
  | "movespeed"
  | "armor"
  | "armorperlevel"
  | "spellblock"
  | "spellblockperlevel"
  | "attackrange"
  | "hpregen"
  | "hpregenperlevel"
  | "mpregen"
  | "mpregenperlevel"
  | "crit"
  | "critperlevel"
  | "attackdamage"
  | "attackdamageperlevel"
  | "attackspeed"
  | "attackspeedperlevel",
  string
>;

interface Champion {
  id: string;
  name: string;
  title: string;
  blurb: string;
  info: {
    attack: string;
    defense: string;
    magic: string;
    difficulty: string;
  };
  tags: string[];
  partype: string;
  stats: ChampionStats;
  image: {
    loading: string;
  };
}

const AddPage: React.FC = () => {
  const { fetchChampions } = useData();

  const [champion, setChampion] = useState<Champion>({
    id: "",
    name: "",
    title: "",
    blurb: "",
    info: {
      attack: "",
      defense: "",
      magic: "",
      difficulty: "",
    },
    tags: [],
    partype: "",
    stats: {
      hp: "",
      hpperlevel: "",
      mp: "",
      mpperlevel: "",
      movespeed: "",
      armor: "",
      armorperlevel: "",
      spellblock: "",
      spellblockperlevel: "",
      attackrange: "",
      hpregen: "",
      hpregenperlevel: "",
      mpregen: "",
      mpregenperlevel: "",
      crit: "",
      critperlevel: "",
      attackdamage: "",
      attackdamageperlevel: "",
      attackspeed: "",
      attackspeedperlevel: "",
    },
    image: {
      loading: "",
    },
  });

  const [currentTag, setCurrentTag] = useState("");

  const handleInputChange = (
    key: keyof Champion,
    value: string | string[],
    nestedKey?: keyof ChampionStats | keyof Champion["info"]
  ) => {
    setChampion((prevState) => {
      if (key === "image") {
        return {
          ...prevState,
          image: {
            ...prevState.image,
            loading: value as string,
          },
        };
      }

      if (nestedKey) {
        if (key === "stats") {
          return {
            ...prevState,
            stats: {
              ...prevState.stats,
              [nestedKey]: value as string,
            },
          };
        } else if (key === "info") {
          return {
            ...prevState,
            info: {
              ...prevState.info,
              [nestedKey]: value as string,
            },
          };
        }
      }

      return {
        ...prevState,
        [key]: value,
      };
    });
  };

  const handleAddTag = () => {
    if (currentTag && !champion.tags.includes(currentTag)) {
      setChampion((prevState) => ({
        ...prevState,
        tags: [...prevState.tags, currentTag],
      }));
      setCurrentTag("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setChampion((prevState) => ({
      ...prevState,
      tags: prevState.tags.filter((t) => t !== tag),
    }));
  };

  const handleSubmit = () => {
    if (!champion.name || !champion.title || !champion.blurb) {
      Alert.alert("Error", "Name, title, and blurb are required fields.");
      return;
    }

    fetch("https://sampleapis.assimilate.be/lol/champions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImhhbXphLmNodGFpYmlAc3R1ZGVudC5hcC5iZSIsImlhdCI6MTczNDI2OTA1M30.7M_HAGvg87PHPQB8DEH72Zk6oFNteXZjSjT17L-Jgc8",
      },
      body: JSON.stringify(champion),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to add champion");
        }
        return response.json();
      })
      .then(() => {
        Alert.alert("Success", `Champion ${champion.name} has been added!`);
        setChampion({
          id: "",
          name: "",
          title: "",
          blurb: "",
          info: {
            attack: "",
            defense: "",
            magic: "",
            difficulty: "",
          },
          tags: [],
          partype: "",
          stats: {
            hp: "",
            hpperlevel: "",
            mp: "",
            mpperlevel: "",
            movespeed: "",
            armor: "",
            armorperlevel: "",
            spellblock: "",
            spellblockperlevel: "",
            attackrange: "",
            hpregen: "",
            hpregenperlevel: "",
            mpregen: "",
            mpregenperlevel: "",
            crit: "",
            critperlevel: "",
            attackdamage: "",
            attackdamageperlevel: "",
            attackspeed: "",
            attackspeedperlevel: "",
          },
          image: {
            loading: "",
          },
        });
        fetchChampions();
      })
      .catch(() => {
        Alert.alert("Error", "Failed to add champion.");
      });
  };

  return (
    <ScrollView style={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={[styles.title, { fontFamily: "BeaufortforLOL-Bold" }]}>
          Add a Champion
        </Text>
        <View style={styles.formContainer}>
          <Text style={styles.subtitle}>Main details:</Text>
          <TextInput
            style={styles.input}
            placeholder="Champion Name"
            value={champion.name}
            onChangeText={(text) => handleInputChange("name", text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Title"
            value={champion.title}
            onChangeText={(text) => handleInputChange("title", text)}
          />
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Blurb"
            value={champion.blurb}
            multiline
            onChangeText={(text) => handleInputChange("blurb", text)}
          />
          <Text style={styles.subtitle}>Tags:</Text>
          <View style={styles.tagsContainer}>
            {champion.tags.map((tag, index) => (
              <TouchableOpacity
                key={index}
                style={styles.tag}
                onPress={() => handleRemoveTag(tag)}
              >
                <Text style={styles.tagText}>{tag} ✕</Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.tagInputContainer}>
            <Picker
              selectedValue={currentTag}
              onValueChange={(value) => setCurrentTag(value as string)}
              style={styles.picker}
            >
              <Picker.Item label="Select a Tag" value="" />
              <Picker.Item label="Tank" value="Tank" />
              <Picker.Item label="Mage" value="Mage" />
              <Picker.Item label="Assassin" value="Assassin" />
              <Picker.Item label="Marksman" value="Marksman" />
              <Picker.Item label="Support" value="Support" />
              <Picker.Item label="Fighter" value="Fighter" />
            </Picker>
            <Button title="Add Tag" onPress={handleAddTag} />
          </View>
          <TextInput
            style={styles.input}
            placeholder="Partype"
            value={champion.partype}
            onChangeText={(text) => handleInputChange("partype", text)}
          />
          <Text style={styles.subtitle}>Infos:</Text>
          {Object.keys(champion.info).map((key) => (
            <TextInput
              key={key}
              style={styles.input}
              placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
              keyboardType="numeric"
              value={champion.info[key as keyof Champion["info"]]}
              onChangeText={(text) =>
                handleInputChange("info", text, key as keyof Champion["info"])
              }
            />
          ))}
          <Text style={styles.subtitle}>Stats:</Text>
          {Object.keys(champion.stats).map((stat) => (
            <TextInput
              key={stat}
              style={styles.input}
              placeholder={stat}
              keyboardType="numeric"
              value={champion.stats[stat as keyof ChampionStats]}
              onChangeText={(text) =>
                handleInputChange("stats", text, stat as keyof ChampionStats)
              }
            />
          ))}
          <Text style={styles.subtitle}>Image:</Text>
          <TextInput
            style={styles.input}
            placeholder="Image URL"
            value={champion.image.loading}
            onChangeText={(text) => handleInputChange("image", text)}
          />
          {champion.image.loading ? (
            <Image
              source={{ uri: champion.image.loading }}
              style={styles.imagePreview}
            />
          ) : null}
          <TouchableOpacity
            style={styles.button}
            onPress={() => handleSubmit()}
          >
            <View>
              <Text
                style={[
                  styles.buttonText,
                  { fontFamily: "BeaufortforLOL-Bold" },
                ]}
              >
                Add Champion
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
  },
  container: {
    padding: 20,
    paddingTop: 30,
    backgroundColor: "#F2F2F2",
    paddingBottom: 300,
  },
  formContainer: {
    backgroundColor: "#ffffff",
    padding: 30,
    borderRadius: 10,
  },
  title: {
    color: "#C19D4D",
    textAlign: "center",
    fontSize: 40,
    marginBottom: 40,
    textTransform: "uppercase",
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 15,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ced4da",
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
  },
  textArea: {
    height: 80,
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
  picker: {
    flex: 1,
    marginBottom: 15,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 10,
  },
  tag: {
    backgroundColor: "#e0e0e0",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    marginRight: 5,
    marginBottom: 5,
  },
  tagText: {
    fontSize: 14,
  },
  tagInputContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  imagePreview: {
    width: "100%",
    height: 200,
    marginBottom: 15,
    borderRadius: 8,
  },
});

export default AddPage;
