import React, { useContext } from "react";
import { Recipe } from "../types/recipe";
import { View, Text, StyleSheet } from "react-native";
import Colors from "../constants/Colors";
import RecipeSelector from "./RecipeSelector";
import { SelectedRecipesContext } from "../app/(tabs)/selectedRecipesContext";

type Props = {
  recipe: Recipe;
};

export default function IngredientsContainer({ recipe }: Props) {
  const { selectedRecipes } = useContext(SelectedRecipesContext);
  const servings =
    selectedRecipes.find(
      (selectedRecipe) => selectedRecipe.recipe.Recipe_id === recipe.Recipe_id
    )?.servings || 1;

  return (
    <>
      <View style={styles.titleContainer}>
        <Text style={styles.sectionTitle}>Ingredients</Text>
        <RecipeSelector recipe={recipe} />
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
    paddingVertical: 12,
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
    backgroundColor: Colors.accent.darkBlue,
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
    backgroundColor: Colors.accent.blue,
    borderRadius: 5,
    padding: 4,
    color: "white",
  },
});
