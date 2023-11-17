import {
  ActivityIndicator,
  Button,
  ScrollView,
  StyleSheet,
} from "react-native";

import { Text, View } from "../../components/Themed";
import React, { useContext, useEffect, useState } from "react";
import { Recipe } from "../../types/recipe";
import { Link } from "expo-router";
import { Image } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import Colors from "../../constants/Colors";
import RecipeSelector from "../../components/RecipeSelector";
export default function TabOneScreen() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterdRecipes, setFilterdRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    setFilterdRecipes(
      recipes.filter((recipe) =>
        recipe.Name.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, recipes]);

  const getRecipes = async () => {
    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_DOMAIN}/api/mobile/v1/recipes`,
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
      <TextInput
        style={{
          height: 40,
          borderColor: "gray",
          borderWidth: 1,
          width: 300,
          borderRadius: 10,
          padding: 10,
          margin: 10,
        }}
        onChangeText={(text) => setSearch(text)}
        value={search}
        placeholder="Discover new recipes"
      />
      <ScrollView>
        {isLoading ? (
          <ActivityIndicator size="large" style={styles.loadingIndicator} />
        ) : (
          <View style={styles.recipesContainer}>
            {recipes.length === 0 && (
              <Text style={styles.noRecipesText}>No recipes found</Text>
            )}
            {filterdRecipes.map((recipe: Recipe) => {
              return (
                <View key={recipe.Recipe_id}>
                  <Link href={`/recipe/${recipe.Recipe_id}`}>
                    <View style={styles.recipeItem}>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          width: "100%",
                        }}
                      >
                        <Text style={styles.recipeName}>{recipe.Name}</Text>
                        <RecipeSelector recipe={recipe} />
                      </View>

                      {recipe.Photos && recipe.Photos.length > 0 ? (
                        <Image
                          source={{ uri: recipe.Photos[0] }}
                          style={styles.recipeImage}
                        />
                      ) : (
                        <Image
                          source={require("../../assets/images/placeholder.png")}
                          style={styles.recipeImage}
                        />
                      )}
                    </View>
                  </Link>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    gap: 8,
  },

  loadingIndicator: {
    marginVertical: 20,
  },
  recipesContainer: {
    width: "100%",
    flex: 1,
    gap: 16,
  },
  recipeItem: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 16,
    width: 360,
    borderRadius: 10,
    flexDirection: "column",
    gap: 8,
    alignItems: "center",
  },
  recipeImage: {
    width: "100%",
    height: 260,
    borderRadius: 10,
  },
  recipeName: {
    fontSize: 20,
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
});
