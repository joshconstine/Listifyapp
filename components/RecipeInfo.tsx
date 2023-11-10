import React from "react";
import { Recipe } from "../types/recipe";
import { View, Text, Image, StyleSheet } from "react-native";
import { useThemeColor } from "./Themed";
import Colors from "../constants/Colors";

type Props = {
  recipe: Recipe;
};

export default function RecipeInfo({ recipe }: Props) {
  const recipeInfo = "#1 Recipe This Week";

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{recipeInfo}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  text: {
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 6,
    backgroundColor: Colors.accent.normal,
    fontSize: 12,
    fontWeight: "bold",
    color: Colors.accent.darker,
  },
});
