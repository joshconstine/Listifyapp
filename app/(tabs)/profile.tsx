import React, { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Pressable,
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { SignedIn, SignedOut, useAuth } from "@clerk/clerk-expo";

import { Text, View } from "../../components/Themed";

import { Animated, FlatList, StyleSheet } from "react-native";
import { Sign } from "crypto";
import SignInCard from "../../components/SignInCard";
import SignUpCard from "../../components/SignUpCard";

export type User = {
  clerkId: string;
  username: string | null;
  photoUrl: string | null;
};
type UserDataJSON = {
  Clerk_id: string;
  Photo_url: string | null;
  Username: string | null;
};

export default function ProfileScreen() {
  const { isLoaded, signOut, userId } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [usernameInput, setUsernameInput] = useState<string>(
    user?.username || ""
  );
  const [showLogin, setShowLogin] = useState<boolean>(true);
  const fetchUser = async () => {
    const response = await fetch(
      `${process.env.EXPO_PUBLIC_API_DOMAIN}/api/mobile/v1/users/` + userId,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      }
    ); // Replace with your Docker container's IP or hostname if needed
    const data: UserDataJSON = await response.json();
    console.log(data);
    setUser({
      clerkId: data.Clerk_id,
      username: data.Username,
      photoUrl: data.Photo_url,
    });
    setUsernameInput(data.Username || "");
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleSubmit = async () => {
    let body = new FormData();
    // @ts-ignore
    body.append("photo", {
      uri: image,
      name: "image.jpeg",
      type: "image/jpeg",
    });
    body.append("Content-Type", "image/jpeg");
    body.append("Username", usernameInput);

    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_DOMAIN}/api/mobile/v1/users/` + userId,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "multipart/form-data",
          },
          body: body,
        }
      ); // Replace with your Docker container's IP or hostname if needed`
    } catch (error) {
      console.error("Error updateing user info:", error);
    }
  };
  const handleInputChange = (text: string) => {
    setUsernameInput(text);
  };

  const SignOut = () => {
    if (!isLoaded) {
      return null;
    }
    return (
      <View>
        <Button
          title="Sign Out"
          onPress={() => {
            signOut();
          }}
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.container}>
        <SignedIn>
          <Text>Profile</Text>
          <Text>{userId}</Text>
          <TextInput
            style={{ height: 40, borderColor: "gray", borderWidth: 1 }}
            onChangeText={handleInputChange}
            value={usernameInput}
          />
          <Text>{user?.username}</Text>
          <Text>You are Signed in</Text>
          <SignOut />
        </SignedIn>
        <SignedOut>
          {showLogin ? (
            <SignInCard setShowLogin={setShowLogin} />
          ) : (
            <SignUpCard setShowLogin={setShowLogin} />
          )}
        </SignedOut>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#d1e0e0",
    alignItems: "center",
    justifyContent: "center",
  },
});
