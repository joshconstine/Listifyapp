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
import Checkbox from "expo-checkbox";
import { SelectedRecipesContext } from "./selectedRecipesContext";
import { TextInput } from "react-native-gesture-handler";
import Colors from "../../constants/Colors";
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

  const { selectedRecipes, setSelectedRecipes } = useContext(
    SelectedRecipesContext
  );

  const toggleRecipe = (recipe: Recipe) => {
    let newSelectedRecipes = [];
    if (
      selectedRecipes.some(
        (selectedRecipe) => selectedRecipe.recipe.Recipe_id === recipe.Recipe_id
      )
    ) {
      newSelectedRecipes = [
        ...selectedRecipes.filter(
          (selectedRecipe) =>
            selectedRecipe.recipe.Recipe_id !== recipe.Recipe_id
        ),
      ];
      setSelectedRecipes(newSelectedRecipes);
    } else {
      newSelectedRecipes = [...selectedRecipes, { recipe, servings: 1 }];
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
        placeholder="Search for recipes"
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
              const selectedRecipe = selectedRecipes.find(
                (selectedRecipe) =>
                  selectedRecipe.recipe.Recipe_id === recipe.Recipe_id
              );
              const isChecked = !!selectedRecipe;
              const servings = selectedRecipe?.servings ?? 0;
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
                        <Checkbox
                          value={isChecked}
                          onValueChange={() => toggleRecipe(recipe)}
                          color={isChecked ? "#4630EB" : undefined}
                        />
                        {isChecked && (
                          <View style={styles.servingsContainer}>
                            <Text style={styles.servingText}>
                              {" "}
                              {`${servings} serving${servings > 1 ? "s" : ""}`}
                            </Text>
                            <View style={styles.servingsButtonContainer}>
                              <Button
                                title="-"
                                disabled={servings === 0}
                                color={"#3c959c"}
                                onPress={(s) => {
                                  setSelectedRecipes((p) => {
                                    const newSelectedRecipes = [...p];
                                    const index = newSelectedRecipes.findIndex(
                                      (selectedRecipe) =>
                                        selectedRecipe.recipe.Recipe_id ===
                                        recipe.Recipe_id
                                    );
                                    newSelectedRecipes[index].servings -= 1;
                                    return newSelectedRecipes;
                                  });
                                }}
                              />
                              <Button
                                title="+"
                                color={"#3c959c"}
                                onPress={(s) => {
                                  setSelectedRecipes((p) => {
                                    const newSelectedRecipes = [...p];
                                    const index = newSelectedRecipes.findIndex(
                                      (selectedRecipe) =>
                                        selectedRecipe.recipe.Recipe_id ===
                                        recipe.Recipe_id
                                    );
                                    newSelectedRecipes[index].servings += 1;
                                    return newSelectedRecipes;
                                  });
                                }}
                              />
                            </View>
                          </View>
                        )}
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
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
  servingText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "white",
  },
  servingsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    backgroundColor: Colors.accent.blue,
    borderRadius: 5,
    padding: 4,
    color: "white",
  },
  servingsButton: {
    fontSize: 14,
    fontWeight: "bold",
    color: "white",
    backgroundColor: Colors.accent.darkBlue,
    height: 16,
  },
  servingsButtonContainer: {
    flexDirection: "row",
    gap: 4,
  },
});
