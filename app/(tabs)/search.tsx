import {
  ActivityIndicator,
  Button,
  ScrollView,
  StyleSheet,
  Touchable,
  TouchableOpacity,
} from "react-native";

import { Text, View } from "../../components/Themed";
import React, { useContext, useEffect, useState } from "react";
import { Recipe, Tag } from "../../types/recipe";
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
  const [tags, setTags] = useState<Tag[]>([]);

  const getTags = async () => {
    try {
      const response = await fetch(
        "http://172.23.0.3:8080/api/mobile/v1/tags",
        {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        }
      ); // Replace with your Docker container's IP or hostname if needed
      const data = await response.json();
      setTags(data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error  tags. Status:", error);
      setIsLoading(false);
    }
  };
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
    getTags();
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
            {tags.map((tag) => {
              return (
                <View style={styles.tagGroup} key={tag.Tag_id}>
                  <View>
                    <Text style={styles.tagName}>{tag.Name}</Text>
                    <TouchableOpacity onPress={() => console.log("pressed")}>
                      <Text style={styles.tagHelper}>View More</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.recipeTypeContainer}>
                    {filterdRecipes.map((recipe: Recipe) => {
                      return (
                        <View key={recipe.Recipe_id}>
                          <Link href={`/recipe/${recipe.Recipe_id}`}>
                            <View style={styles.recipeItem}>
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
                              <View
                                style={{
                                  flexDirection: "row",
                                  justifyContent: "space-between",
                                  width: "100%",
                                  paddingHorizontal: 12,
                                }}
                              >
                                <Text style={styles.recipeName}>
                                  {recipe.Name}
                                </Text>
                                {/* <RecipeSelector recipe={recipe} /> */}
                              </View>
                            </View>
                          </Link>
                        </View>
                      );
                    })}
                  </View>
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
  tagGroup: {
    flexDirection: "column",
    gap: 16,
    width: "100%",
  },
  tagName: {
    fontSize: 24,
    fontWeight: "bold",
  },
  tagHelper: {
    fontSize: 16,
    color: "gray",
  },
  recipeTypeContainer: {
    width: "100%",
    flex: 1,
    flexDirection: "row",
    gap: 16,
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
    width: 140,
    borderRadius: 10,
    flexDirection: "column",
    gap: 8,
    alignItems: "center",
    paddingBottom: 8,
  },
  recipeImage: {
    width: "100%",
    height: 140,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  recipeName: {
    fontSize: 12,
    fontWeight: "bold",
    color: "gray",
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
