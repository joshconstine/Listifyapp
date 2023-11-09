import React from "react";
import { Recipe } from "../types/recipe";
import { View, Text, Image, StyleSheet, Pressable } from "react-native";
import { useThemeColor } from "./Themed";
import Colors from "../constants/Colors";
import { AntDesign } from "@expo/vector-icons";
import { Link } from "expo-router";

type Props = {};

export default function DiscoverCard({}: Props) {
  const bloomurl =
    "https://foodly-bucket.s3.us-west-1.amazonaws.com/listify/bloom-girl-ordering-food-online.png";
  return (
    <View style={styles.container}>
      <Image style={styles.image} source={{ uri: bloomurl }}></Image>
      <View style={styles.wordContainer}>
        <Text style={styles.text}>
          Find recipes based on what you already have at home
        </Text>
        <Link href="/find">
          <View>
            <View style={styles.CTAContainer}>
              <Text style={styles.CTAText}>Lets try! </Text>
              <AntDesign
                name="arrowright"
                size={18}
                color={Colors.accent.darker}
              />
            </View>
          </View>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 16,
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
    backgroundColor: "#f6f7fc",
  },
  image: {
    width: 100,
    height: 100,
    padding: 12,
    borderRadius: 10,
    backgroundColor: "#fff",
  },
  CTAContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    color: Colors.accent.darker,
  },
  CTAText: {
    fontSize: 14,
    fontWeight: "bold",
    color: Colors.accent.darker,
  },
  text: {
    fontSize: 18,
    lineHeight: 24,
  },
  wordContainer: {
    flexDirection: "column",
    gap: 4,
    width: 200,
  },
});
