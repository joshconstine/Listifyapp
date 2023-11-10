import { Pressable, ScrollView } from "react-native";

import { Text, View } from "../../components/Themed";
import { SelectedRecipesContext } from "./selectedRecipesContext";
import { useContext, useEffect, useState } from "react";
import {
  IngredientWithQuantityAndType,
  SelectedRecipe,
} from "../../types/recipe";
import { StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import Colors from "../../constants/Colors";
import RecipeCard from "../../components/RecipeCard";

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
      (p: IngredientWithQuantityAndType[], selectedRecipe: SelectedRecipe) => {
        if (selectedRecipe.recipe.Ingredients) {
          return [...p, ...selectedRecipe.recipe.Ingredients];
        }
        return p;
      },
      []
    );
    const uniqueIngredients = allIngredients?.reduce(
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
    const ingredientsByType = uniqueIngredients
      .reduce(
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
      )
      .sort((a, b) => (a.ingredientType < b.ingredientType ? -1 : 1));

    setListIngredients(ingredientsByType);
  };

  useEffect(() => {
    setIngredients();
  }, [selectedRecipes]);

  const onRemoveIngredient = (ingredientId: number) => {
    setSelectedRecipes((p) => {
      const updatedSelectedRecipes = p.map((selectedRecipe) => {
        const updatedIngredients = selectedRecipe.recipe.Ingredients?.filter(
          (ingredient) => ingredient.Ingredient_id !== ingredientId
        );
        return {
          ...selectedRecipe,
          recipe: {
            ...selectedRecipe.recipe,
            Ingredients: updatedIngredients,
          },
        };
      });
      return updatedSelectedRecipes;
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.section}>
          {listIngredients.map((ingredientType, i) => (
            <View key={ingredientType.ingredientType + i}>
              <Text style={styles.sectionTitle}>
                {ingredientType.ingredientType}
              </Text>
              {ingredientType.ingredients.map((ingredient, j) => (
                <View
                  style={styles.row}
                  key={ingredient.Ingredient_id + String(ingredient.Name)}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      backgroundColor: "transparent",
                      gap: 10,
                    }}
                  >
                    <Text
                      style={{
                        fontWeight: "bold",
                        fontSize: 18,
                      }}
                    >
                      {ingredient.Name}
                    </Text>
                    <Text
                      style={{
                        fontSize: 14,
                        color: "#818181",
                      }}
                    >{`${ingredient.Quantity}: ${ingredient.Quantity_type}${
                      ingredient.Quantity > 1 &&
                      ingredient.Quantity_type_id !== 1
                        ? "s"
                        : ""
                    }`}</Text>
                  </View>
                  <Pressable
                    onPress={() => onRemoveIngredient(ingredient.Ingredient_id)}
                  >
                    <View style={styles.removeWrapper}>
                      <FontAwesome name="remove" size={16} color="white" />
                    </View>
                  </Pressable>
                </View>
              ))}
            </View>
          ))}
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recipes in List</Text>
          {selectedRecipes.map((selectedRecipe) => (
            <RecipeCard
              recipe={selectedRecipe.recipe}
              key={selectedRecipe.recipe.Recipe_id}
            />
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
  },
  removeWrapper: {
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
    backgroundColor: Colors.accent.darker,
  },

  section: {
    marginBottom: 20,
    flex: 1,
    gap: 16,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 10,
  },

  row: {
    flexDirection: "row",
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    backgroundColor: "#efefef",
    gap: 10,
    borderRadius: 10,
    margin: 10,
    minHeight: 50,
  },
});
