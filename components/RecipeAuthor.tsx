import React from "react";
import { Recipe } from "../types/recipe";
import { View, Text, Image, StyleSheet } from "react-native";
import { useThemeColor } from "./Themed";
import Colors from "../constants/Colors";

type Props = {
  recipe: Recipe;
};

export default function RecipeAuthor({ recipe }: Props) {
  const Author = "Sam the Cooking Guy";
  const AuthorImageUrl =
    "https://foodly-bucket.s3.us-west-1.amazonaws.com/listify/userImages/sam.jpeg";

  return (
    <View style={styles.container}>
      <Image source={{ uri: AuthorImageUrl }} style={styles.iamge} />
      <View style={styles.authorGroup}>
        <Text style={styles.helpertext}>Recipe by</Text>
        <Text style={styles.text}>{Author}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  text: {
    fontSize: 14,
    fontWeight: "bold",
    color: Colors.accent.darker,
  },
  authorGroup: {
    flex: 1,
    gap: 1,
  },
  helpertext: {
    fontSize: 10,
    color: "grey",
  },
  iamge: {
    width: 40,
    height: 40,
    borderRadius: 5,
    shadowColor: "black",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 1 },
  },
});
