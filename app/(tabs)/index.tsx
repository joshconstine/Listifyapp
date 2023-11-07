import { ActivityIndicator, ScrollView, StyleSheet } from "react-native";

import EditScreenInfo from "../../components/EditScreenInfo";
import { Text, View } from "../../components/Themed";
import React, { useEffect, useState } from "react";
import { Recipe } from "../../types/recipe";
import { Link } from "expo-router";
import { Image } from "react-native";
import Checkbox from "expo-checkbox";

export default function TabOneScreen() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRecipes, setSelectedRecipes] = useState<
    { isChecked: boolean; recipeId: number }[]
  >([]);

  useEffect(() => {
    const selectedRecipes = recipes.map((recipe) => ({
      isChecked: false,
      recipeId: recipe.Recipe_id,
    }));
    setSelectedRecipes(selectedRecipes);
  }, [recipes]);

  const toggleRecipe = (recipeId: number) => {
    const newSelectedRecipes = selectedRecipes.map((recipe) => {
      if (recipe.recipeId === recipeId) {
        return {
          ...recipe,
          isChecked: !recipe.isChecked,
        };
      }
      return recipe;
    });
    setSelectedRecipes(newSelectedRecipes);
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
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      <View style={styles.container}>
        <ScrollView>
          {isLoading ? (
            <ActivityIndicator size="large" style={styles.loadingIndicator} />
          ) : (
            <View style={styles.recipesContainer}>
              {recipes.length === 0 && (
                <Text style={styles.noRecipesText}>No recipes found</Text>
              )}
              {recipes.map((recipe: Recipe) => {
                const isChecked = selectedRecipes.find(
                  (selectedRecipe) =>
                    selectedRecipe.recipeId === recipe.Recipe_id
                )?.isChecked;
                return (
                  <View key={recipe.Recipe_id}>
                    <Link href={`/recipe/${recipe.Recipe_id}`}>
                      <View style={styles.recipeItem}>
                        <Image
                          source={{ uri: recipe.Photos[0] }}
                          style={styles.recipeImage}
                        />
                        <Text style={styles.recipeName}>{recipe.Name}</Text>
                        <Checkbox
                          value={isChecked}
                          onValueChange={() => toggleRecipe(recipe.Recipe_id)}
                          color={isChecked ? "#4630EB" : undefined}
                        />
                      </View>
                    </Link>
                  </View>
                );
              })}
            </View>
          )}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },

  loadingIndicator: {
    marginVertical: 20,
  },
  recipesContainer: {
    marginBottom: 20,
  },
  recipeItem: {
    marginBottom: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 16,
    borderRadius: 10,
  },
  recipeImage: {
    width: 200,
    height: 200,
    borderRadius: 10,
  },
  recipeName: {
    fontSize: 18,
    marginTop: 10,
    fontWeight: "bold",
  },
  noRecipesText: {
    fontSize: 16,
    color: "gray",
  },
  footer: {
    backgroundColor: "#4630EB",
    padding: 16,
  },
  footerText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },
  page: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
