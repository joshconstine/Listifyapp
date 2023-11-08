import { ScrollView, StyleSheet, TouchableOpacity } from "react-native";

import { Text, View } from "../../components/Themed";
import { SelectedRecipesContext } from "./selectedRecipesContext";
import { useContext, useEffect, useState } from "react";
import { IngredientWithQuantityAndType, Recipe } from "../../types/recipe";

interface IIngredientType {
  ingredientType: string;
  ingredients: IngredientWithQuantityAndType[];
}

export default function ListScreen() {
  const { selectedRecipes, setSelectedRecipes } = useContext(
    SelectedRecipesContext
  );
  const [listIngredients, setListIngredients] = useState<IIngredientType[]>([]);

  const setIngredients = () => {
    const allIngredients = selectedRecipes.reduce(
      (p: IngredientWithQuantityAndType[], recipe: Recipe) => {
        return [...p, ...recipe.Ingredients];
      },
      []
    );
    const uniqueIngredients = allIngredients.reduce(
      (
        p: IngredientWithQuantityAndType[],
        ingredient: IngredientWithQuantityAndType
      ) => {
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
    const ingredientsByType = uniqueIngredients.reduce(
      (p: IIngredientType[], ingredient: IngredientWithQuantityAndType) => {
        const existingIngredientType = p.find(
          (pIngredientType) =>
            pIngredientType.ingredientType === ingredient.Ingredient_Type_Name
        );
        if (existingIngredientType) {
          existingIngredientType.ingredients.push(ingredient);
        } else {
          p.push({
            ingredientType: ingredient.Ingredient_Type_Name,
            ingredients: [ingredient],
          });
        }
        return p;
      },
      []
    );
    setListIngredients(ingredientsByType);
  };

  useEffect(() => {
    setIngredients();
  }, [selectedRecipes]);

  const onRemoveIngredient = (ingredientId: number) => {
    const newSelectedRecipes = selectedRecipes.map((recipe) => {
      const newIngredients = recipe.Ingredients.filter(
        (ingredient) => ingredient.Ingredient_id !== ingredientId
      );
      return { ...recipe, Ingredients: newIngredients };
    });
    setSelectedRecipes(newSelectedRecipes);
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
          {listIngredients.map((ingredientType) => (
            <View key={ingredientType.ingredientType}>
              <Text style={styles.sectionTitle}>
                {ingredientType.ingredientType}
              </Text>
              {ingredientType.ingredients.map((ingredient) => (
                <View
                  key={ingredient.Ingredient_id + ingredient.Name}
                  style={styles.listItem}
                >
                  <View style={styles.ingredientListItem}>
                    <Text style={styles.ingredient}>{ingredient.Name}</Text>
                    <Text>{`${ingredient.Quantity}: ${
                      ingredient.Quantity_type
                    }${
                      ingredient.Quantity > 1 &&
                      ingredient.Quantity_type_id !== 1
                        ? "s"
                        : ""
                    }`}</Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => onRemoveIngredient(ingredient.Ingredient_id)}
                  >
                    <Text style={styles.removeButton}>Remove</Text>
                  </TouchableOpacity>
                </View>
              ))}
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
    flex: 1,
    gap: 16,
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
  ingredient: {
    fontWeight: "bold",
  },
  ingredientListItem: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    marginBottom: 10,
  },
});
