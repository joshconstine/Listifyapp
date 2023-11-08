import React from "react";
import { Recipe } from "../types/recipe";
import { View, Text, Image, StyleSheet } from "react-native";
import { useThemeColor } from "./Themed";
import Colors from "../constants/Colors";

type Props = {
  recipe: Recipe;
};

export default function IngredientsContainer({ recipe }: Props) {
  return (
    <>
      <Text style={styles.sectionTitle}>Ingredients</Text>
      {recipe?.Ingredients?.map((ingredient) => (
        <View style={styles.ingredientContainer} key={ingredient.Ingredient_id}>
          <Text style={styles.ingredient}>{ingredient.Name}</Text>
          <Text style={styles.ingredientQuantity}>
            {`${ingredient.Quantity} ${ingredient.Quantity_type}${
              ingredient.Quantity > 1 && ingredient.Quantity_type_id !== 1
                ? "s"
                : ""
            }`}
          </Text>
        </View>
      ))}
    </>
  );
}

const styles = StyleSheet.create({
  ingredientContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "darkgrey",
    opacity: 0.5,
    padding: 8,
    width: "100%",
    borderRadius: 5,
  },
  ingredientQuantity: {
    fontSize: 16,
    fontWeight: "bold",
    color: "grey",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  ingredient: {
    fontSize: 18,
    fontWeight: "bold",
  },
});
