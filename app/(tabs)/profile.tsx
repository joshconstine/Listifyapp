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
  const [user, setUser] = React.useState<User | null>(null);
  const [showLogin, setShowLogin] = React.useState<boolean>(true);
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
      <SafeAreaView style={styles.container}>
        <SignedIn>
          <Text>Profile</Text>
          <Text>{userId}</Text>
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
