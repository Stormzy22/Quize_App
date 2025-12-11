import React, { useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { ProfileContext } from "../context/ProfileContext";
import { FontAwesome } from "@expo/vector-icons";

const Profile = () => {
  const profileContext = useContext(ProfileContext);

  if (!profileContext) {
    throw new Error("Profile must be used within a ProfileProvider");
  }

  const {
    profileImage,
    setProfileImage,
    userName,
    setUserName,
    email,
    setEmail,
  } = profileContext;

  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [editingUserName, setEditingUserName] = useState(userName);
  const [editingEmail, setEditingEmail] = useState(email);

  const handleChoosePhoto = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert(
        "Permission denied",
        "You need to allow access to the library to import images."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const uri = result.assets[0].uri;
      await setProfileImage(uri);
    }
  };

  const handleSaveName = () => {
    setIsEditingName(false);
    setUserName(editingUserName);
  };

  const handleSaveEmail = () => {
    setIsEditingEmail(false);
    setEmail(editingEmail);
  };

  return (
    <View style={styles.container}>
      <View style={styles.profileContainer}>
        {profileImage ? (
          <Image source={{ uri: profileImage }} style={styles.profileImage} />
        ) : (
          <View style={styles.placeholderImage}>
            <Text style={styles.placeholderText}>Photo</Text>
          </View>
        )}

        <TouchableOpacity style={styles.button} onPress={handleChoosePhoto}>
          <Text style={styles.buttonText}>Import Photo</Text>
        </TouchableOpacity>

        <View style={styles.profileDetails}>
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Username</Text>
            {isEditingName ? (
              <>
                <TextInput
                  style={styles.input}
                  value={editingUserName}
                  onChangeText={setEditingUserName}
                  placeholder="Enter your username"
                />
                <TouchableOpacity
                  onPress={handleSaveName}
                  style={styles.saveIcon}
                >
                  <FontAwesome name="check" size={17} color="limegreen" />
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Text style={styles.text}>{userName || "Username"}</Text>
                <TouchableOpacity
                  onPress={() => setIsEditingName(true)}
                  style={styles.editIcon}
                >
                  <FontAwesome name="edit" size={17} color="black" />
                </TouchableOpacity>
              </>
            )}
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Email</Text>
            {isEditingEmail ? (
              <>
                <TextInput
                  style={styles.input}
                  value={editingEmail}
                  onChangeText={setEditingEmail}
                  placeholder="Enter your email"
                />
                <TouchableOpacity
                  onPress={handleSaveEmail}
                  style={styles.saveIcon}
                >
                  <FontAwesome name="check" size={17} color="green" />
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Text style={styles.text}>{email || "Email"}</Text>
                <TouchableOpacity
                  onPress={() => setIsEditingEmail(true)}
                  style={styles.editIcon}
                >
                  <FontAwesome name="edit" size={17} color="black" />
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 30,
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  profileContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
  },
  placeholderImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#cccccc",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  placeholderText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "#0F1922",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    color: "#C19D4D",
    fontSize: 17,
    textTransform: "uppercase",
  },
  profileDetails: {
    marginTop: 30,
    width: "100%",
    paddingHorizontal: 20,
  },
  fieldContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 10,
    width: 120,
  },
  input: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    fontSize: 16,
  },
  text: {
    fontSize: 16,
    color: "#555",
  },
  editIcon: {
    marginLeft: 10,
  },
  saveIcon: {
    marginLeft: 10,
  },
});

export default Profile;
