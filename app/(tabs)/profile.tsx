import React from "react";
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { SignedIn, SignedOut } from "@clerk/clerk-expo";

import { Text, View } from "../../components/Themed";

import { Animated, FlatList, StyleSheet } from "react-native";
import SignUpScreen from "../../components/SignUpScreen";
import SignInScreen from "../../components/SignInScreen";
import { Sign } from "crypto";

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255, 255, 255, 0.1)"
      />
      <Text>Profile here</Text>
      <SafeAreaView style={styles.container}>
        <SignedIn>
          <Text>You are Signed in</Text>
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
