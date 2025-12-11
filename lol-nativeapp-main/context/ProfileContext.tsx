import React, { createContext, useState, useEffect, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface ProfileContextType {
  profileImage: string | null;
  setProfileImage: (uri: string | null) => void;
  userName: string;
  setUserName: (name: string) => void;
  email: string;
  setEmail: (email: string) => void;
}

export const ProfileContext = createContext<ProfileContextType | undefined>(
  undefined
);

interface ProfileProviderProps {
  children: ReactNode;
}

export const ProfileProvider: React.FC<ProfileProviderProps> = ({
  children,
}) => {
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>("");
  const [email, setEmail] = useState<string>("");

  useEffect(() => {
    const loadProfileData = async () => {
      try {
        const storedImage = await AsyncStorage.getItem("profileImage");
        const storedUserName = await AsyncStorage.getItem("userName");
        const storedEmail = await AsyncStorage.getItem("email");

        if (storedImage) {
          setProfileImage(storedImage);
        }
        if (storedUserName) {
          setUserName(storedUserName);
        }
        if (storedEmail) {
          setEmail(storedEmail);
        }
      } catch (error) {
        console.error("Error loading profile data:", error);
      }
    };

    loadProfileData();
  }, []);

  const updateProfileImage = async (uri: string | null) => {
    try {
      if (uri) {
        await AsyncStorage.setItem("profileImage", uri);
      } else {
        await AsyncStorage.removeItem("profileImage");
      }
      setProfileImage(uri);
    } catch (error) {
      console.error("Error updating profile image:", error);
    }
  };

  const updateUserName = async (name: string) => {
    try {
      await AsyncStorage.setItem("userName", name);
      setUserName(name);
    } catch (error) {
      console.error("Error updating userName:", error);
    }
  };

  const updateEmail = async (email: string) => {
    try {
      await AsyncStorage.setItem("email", email);
      setEmail(email);
    } catch (error) {
      console.error("Error updating email:", error);
    }
  };

  return (
    <ProfileContext.Provider
      value={{
        profileImage,
        setProfileImage: updateProfileImage,
        userName,
        setUserName: updateUserName,
        email,
        setEmail: updateEmail,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};
