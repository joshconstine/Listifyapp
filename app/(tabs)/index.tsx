import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Image,
  ImageBackground,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import { Text, View } from "../../components/Themed";
import React, { useContext, useEffect, useState } from "react";
import { Recipe } from "../../types/recipe";

import { SelectedRecipesContext } from "./selectedRecipesContext";
import DiscoverCard from "../../components/DiscoverCard";
import { AntDesign } from "@expo/vector-icons";
import Colors from "../../constants/Colors";
export default function TabOneScreen() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
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
    <View style={styles.container}>
      <ImageBackground
        source={{ uri: selectedImage }}
        style={styles.backgroundImage}
      >
        <LinearGradient
          // Background Linear Gradient
          colors={["rgba(0,0,0,0.8)", "transparent"]}
          style={styles.background}
        />
        <View style={styles.innerContainer}>
          <View style={styles.topGroup}>
            <DiscoverCard />
            <TextInput
              style={{
                height: 40,
                borderColor: "#f6f7fc",
                backgroundColor: "white",
                borderWidth: 1,
                width: "100%",
                borderRadius: 10,
                padding: 10,
              }}
              onChangeText={(text) => setSearch(text)}
              value={search}
              placeholder="Discover new recipes"
            />
          </View>
          <View style={styles.bottomGroup}>
            <Text style={styles.overlay}>This Week's Top Recipes</Text>
            <Text style={styles.overlayHelper}>
              Make a delecious dish inspired by this week's most popular recipes
            </Text>
            <TouchableOpacity style={styles.discoverWrapper}>
              <Text style={styles.discoverText}>Discover</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 16,
    height: "100%",
  },
  background: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: 800,
  },
  innerContainer: {
    paddingHorizontal: 32,
    paddingVertical: 32,
    backgroundColor: "transparent",
    flexDirection: "column",
    justifyContent: "space-between",
    height: "100%",
    width: "100%",
  },
  topGroup: {
    backgroundColor: "transparent",
    flexDirection: "column",
    gap: 16,
  },
  bottomGroup: {
    color: "white",
    backgroundColor: "transparent",
    width: "100%",
    alignSelf: "center",
    alignItems: "center",
    flexDirection: "column",
    gap: 8,
  },
  discoverWrapper: {
    backgroundColor: Colors.accent.blue,
    paddingVertical: 12,
    width: 140,
    borderRadius: 30,
    color: "white",
    textAlign: "center",
  },
  discoverText: {
    color: "white",
    textAlign: "center",
    fontSize: 18,
  },
  recipeImage: {
    width: "100%",
    height: 500,
    borderRadius: 10,
  },
  overlay: {
    fontSize: 30,
    fontWeight: "bold",
    width: 200,
    color: "white",
  },
  overlayHelper: {
    fontSize: 16,
    width: 260,
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
  backgroundImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  linearGradient: {
    flex: 1,
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 5,
  },
});
