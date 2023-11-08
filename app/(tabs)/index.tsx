import { ActivityIndicator, ScrollView, StyleSheet } from "react-native";

import { Text, View } from "../../components/Themed";
import React, { useContext, useEffect, useState } from "react";
import { Recipe } from "../../types/recipe";

import { SelectedRecipesContext } from "./selectedRecipesContext";
import DiscoverCard from "../../components/DiscoverCard";
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

  useEffect(() => {
    getRecipes();
  }, []);
  return (
    <View style={styles.container}>
      <DiscoverCard />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    padding: 16,
    paddingHorizontal: 32,
    gap: 16,
    alignItems: "center",
  },
});
