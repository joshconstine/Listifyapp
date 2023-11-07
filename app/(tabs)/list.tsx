import { ScrollView, StyleSheet, TouchableOpacity } from "react-native";

import { Text, View } from "../../components/Themed";
import { SelectedRecipesContext } from "./selectedRecipesContext";
import { useContext, useEffect, useState } from "react";
import { Ingredient, Recipe } from "../../types/recipe";
export default function ListScreen() {
  const { selectedRecipes, setSelectedRecipes } = useContext(
    SelectedRecipesContext
  );
  const [listIngredients, setListIngredients] = useState<Ingredient[]>([]);

  const setIngredients = () => {
    const allIngredients = selectedRecipes.reduce(
      (p: Ingredient[], recipe: Recipe) => {
        return [...p, ...recipe.Ingredients];
      },
      []
    );
    const uniqueIngredients = allIngredients.reduce(
      (p: Ingredient[], ingredient: Ingredient) => {
        const existingIngredient = p.find(
          (pIngredient) => pIngredient.Name === ingredient.Name
        );
        if (existingIngredient) {
          existingIngredient.Quantity += ingredient.Quantity;
        } else {
          p.push(ingredient);
        }
        return p;
      },
      []
    );
    setListIngredients(uniqueIngredients);
  };

  useEffect(() => {
    setIngredients();
  }, [selectedRecipes]);

  const onRemoveIngredient = (ingredientId: number) => {
    const newListIngredients = listIngredients.filter(
      (ingredient) => ingredient.Ingredient_id !== ingredientId
    );

    setListIngredients(newListIngredients);
  };

  return (
    <View style={styles.container}>
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255, 255, 255, 0.1)"
      />
      <ScrollView>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Selected Recipes</Text>
          {selectedRecipes.map((selectedRecipe) => (
            <View key={selectedRecipe.Recipe_id} style={styles.listItem}>
              <Text>{selectedRecipe.Name}</Text>
            </View>
          ))}
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Ingredients</Text>
          {listIngredients.map((ingredient) => (
            <View
              key={ingredient.Ingredient_id + ingredient.Name}
              style={styles.listItem}
            >
              <Text>{ingredient.Name}</Text>
              <TouchableOpacity
                onPress={() => onRemoveIngredient(ingredient.Ingredient_id)}
              >
                <Text style={styles.removeButton}>Remove</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  separator: {
    height: 1,
    width: "100%",
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  listItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  removeButton: {
    color: "red",
  },
});
