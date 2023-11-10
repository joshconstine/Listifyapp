import Checkbox from "expo-checkbox";
import React, { useContext } from "react";
import { Button, View, StyleSheet } from "react-native";
import { Recipe } from "../types/recipe";
import { SelectedRecipesContext } from "../app/(tabs)/selectedRecipesContext";
import { Text } from "./Themed";
import Colors from "../constants/Colors";
type Props = { recipe: Recipe };

function RecipeSelector({ recipe }: Props) {
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
  const selectedRecipe = selectedRecipes.find(
    (selectedRecipe) => selectedRecipe.recipe.Recipe_id === recipe.Recipe_id
  );
  const isChecked = !!selectedRecipe;
  const servings = selectedRecipe?.servings ?? 0;
  return (
    <View>
      {!isChecked && (
        <Checkbox
          value={isChecked}
          onValueChange={() => toggleRecipe(recipe)}
          color={isChecked ? "#4630EB" : undefined}
        />
      )}
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
                      selectedRecipe.recipe.Recipe_id === recipe.Recipe_id
                  );
                  if (newSelectedRecipes[index].servings === 1) {
                    () => toggleRecipe(recipe);
                    newSelectedRecipes.splice(index, 1);
                  } else {
                    newSelectedRecipes[index].servings -= 1;
                  }
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
                      selectedRecipe.recipe.Recipe_id === recipe.Recipe_id
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
  );
}
export default RecipeSelector;

const styles = StyleSheet.create({
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
