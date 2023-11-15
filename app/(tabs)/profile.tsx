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

export default function ProfileScreen() {
  const { isLoaded, signOut, userId } = useAuth();
  // const [user, setUser] = React.useState(null);
  // const fetchUser = async () => {
  //   const response = await fetch(
  //     "http://172.21.0.3:8080/api/mobile/v1/users/" + userId,
  //     {
  //       method: "GET",
  //       headers: {
  //         Accept: "application/json",
  //       },
  //     }
  //   ); // Replace with your Docker container's IP or hostname if needed
  //   const data = await response.json();
  //   console.log(data);
  // };
  // React.useEffect(() => {
  //   fetchUser();
  // }, []);

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
