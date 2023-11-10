import React from "react";
import { Recipe } from "../types/recipe";
import { View, StyleSheet, Image } from "react-native";
import { Link } from "expo-router";
import { Text } from "./Themed";
import RecipeSelector from "./RecipeSelector";

type Props = {
  recipe: Recipe;
};

function RecipeCard({ recipe }: Props) {
  return (
    <View key={recipe.Recipe_id} style={styles.recipe}>
      <View>
        {recipe.Photos && recipe.Photos.length > 0 ? (
          <Image
            source={{ uri: recipe.Photos[0] }}
            style={styles.recipeImage}
          />
        ) : (
          <Image
            source={require("../assets/images/placeholder.png")}
            style={styles.recipeImage}
          />
        )}
      </View>
      <View
        style={{
          flexDirection: "column",
          gap: 8,
          alignItems: "flex-end",
        }}
      >
        <Link href={`/recipe/${recipe.Recipe_id}`}>
          <Text style={styles.recipeName}>{recipe.Name}</Text>
        </Link>
        <RecipeSelector recipe={recipe} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  recipe: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderRadius: 10,
    backgroundColor: "lightgrey",
    width: "100%",
  },
  recipeImage: {
    width: 160,
    height: 80,
    borderRadius: 10,
  },

  recipeName: {
    fontSize: 16,
    width: 100,
    fontWeight: "bold",
  },
});
export default RecipeCard;
