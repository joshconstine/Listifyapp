import React, { useState } from "react";
import { Recipe } from "../types/recipe";
import { View, Text, Image, StyleSheet, Pressable, Button } from "react-native";
import { useThemeColor } from "./Themed";
import Colors from "../constants/Colors";

type Props = {
  recipe: Recipe;
};

export default function IngredientsContainer({ recipe }: Props) {
  const [servings, setServings] = useState(1);

  return (
    <>
      <View style={styles.titleContainer}>
        <Text style={styles.sectionTitle}>Ingredients</Text>
        <View style={styles.servingsContainer}>
          <Text style={styles.servingText}>
            {" "}
            {`${servings} serving${servings > 1 ? "s" : ""}`}
          </Text>
          <View style={styles.servingsButtonContainer}>
            <Button
              title="-"
              disabled={servings === 1}
              color={"#3c959c"}
              onPress={(s) => setServings((s) => s - 1)}
            />
            <Button
              title="+"
              color={"#3c959c"}
              onPress={(s) => setServings((s) => s + 1)}
            />
          </View>
        </View>
      </View>
      {recipe?.Ingredients?.map((ingredient) => (
        <View style={styles.ingredientContainer} key={ingredient.Ingredient_id}>
          <Text style={styles.ingredient}>{ingredient.Name}</Text>
          <Text style={styles.ingredientQuantity}>
            {`${ingredient.Quantity * servings} ${ingredient.Quantity_type}${
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
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
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
  servingText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "white",
  },
  servingsButton: {
    fontSize: 14,
    fontWeight: "bold",
    color: "white",
    backgroundColor: "#3c959c",
    height: 16,
  },
  servingsButtonContainer: {
    flexDirection: "row",
    gap: 4,
  },
  servingsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    backgroundColor: "#50a9b0",
    borderRadius: 5,
    padding: 4,
    color: "white",
  },
});
