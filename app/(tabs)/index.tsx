import { ActivityIndicator, ScrollView, StyleSheet, Image } from "react-native";

import { Text, View } from "../../components/Themed";
import React, { useContext, useEffect, useState } from "react";
import { Recipe } from "../../types/recipe";

import { SelectedRecipesContext } from "./selectedRecipesContext";
import DiscoverCard from "../../components/DiscoverCard";
import { AntDesign } from "@expo/vector-icons";
export default function TabOneScreen() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { selectedRecipes, setSelectedRecipes } = useContext(
    SelectedRecipesContext
  );

  const toggleRecipe = (recipe: Recipe) => {
    let newSelectedRecipes = [];
    if (
      selectedRecipes.some(
        (selectedRecipe) => selectedRecipe.Recipe_id === recipe.Recipe_id
      )
    ) {
      newSelectedRecipes = [
        ...selectedRecipes.filter(
          (selectedRecipe) => selectedRecipe.Recipe_id !== recipe.Recipe_id
        ),
      ];
      setSelectedRecipes(newSelectedRecipes);
    } else {
      newSelectedRecipes = [...selectedRecipes, recipe];
      setSelectedRecipes(newSelectedRecipes);
    }
  };

  const getRecipes = async () => {
    try {
      const response = await fetch(
        "http://172.21.0.3:8080/api/mobile/v1/recipes",
        {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        }
      ); // Replace with your Docker container's IP or hostname if needed
      const data = await response.json();
      setRecipes(data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error  recipes. Status:", error);
      setIsLoading(false);
    }
  };
  const selectedImage =
    "https://foodly-bucket.s3.us-west-1.amazonaws.com/listify/potato.jpeg";

  useEffect(() => {
    getRecipes();
  }, []);
  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }
  const overlayText = recipes.length + " Recipes";
  return (
    <ScrollView>
      <View style={styles.container}>
        <DiscoverCard />
        <View>
          <Image source={{ uri: selectedImage }} style={styles.recipeImage} />
          <Text style={styles.overlay}>Potato Based Recipes</Text>
          <Text style={styles.overlayhelper}>{overlayText}</Text>
          <View style={styles.favoriteContainer}>
            <AntDesign name="eyeo" size={24} color="white" />
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 32,
    gap: 16,
  },
  recipeImage: {
    width: "100%",
    height: 500,
    borderRadius: 10,
  },
  overlay: {
    position: "absolute",
    top: 400,
    left: 16,
    fontSize: 30,
    fontWeight: "bold",
    color: "white",
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  overlayhelper: {
    position: "absolute",
    top: 450,
    left: 16,
    fontSize: 20,
    color: "white",
  },
  favoriteContainer: {
    position: "absolute",
    top: 20,
    right: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "black",
    padding: 8,
    borderRadius: 10,
  },
});
