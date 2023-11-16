import React from "react";
import {
  Alert,
  Button,
  Pressable,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { SignedIn, SignedOut, useAuth } from "@clerk/clerk-expo";

import { Text, View } from "../../components/Themed";

import { Animated, FlatList, StyleSheet } from "react-native";
import SignUpScreen from "../../components/SignUpScreen";
import SignInScreen from "../../components/SignInScreen";
import { Sign } from "crypto";

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
  const [user, setUser] = React.useState<User | null>(null);
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
  };

  React.useEffect(() => {
    fetchUser();
  }, []);

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
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255, 255, 255, 0.1)"
      />
      <Text>Profile</Text>
      <Text>{userId}</Text>
      <Text>{user?.username}</Text>

      <SafeAreaView style={styles.container}>
        <SignedIn>
          <Text>You are Signed in</Text>
          <SignOut />
        </SignedIn>
        <SignedOut>
          <SignUpScreen />
          <SignInScreen />
        </SignedOut>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  separator: {
    height: 1,
    width: "100%",
    marginBottom: 20,
  },
});
