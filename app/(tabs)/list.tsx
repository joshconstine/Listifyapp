import { Button, Pressable, ScrollView, TouchableOpacity } from "react-native";

import { Image } from "react-native";
import { Text, View } from "../../components/Themed";
import { SelectedRecipesContext } from "./selectedRecipesContext";
import { useContext, useEffect, useState } from "react";
import {
  IngredientWithQuantityAndType,
  Recipe,
  SelectedRecipe,
} from "../../types/recipe";
import { Link } from "expo-router";
import { Swipeable } from "react-native-gesture-handler";
import { Animated, FlatList, StyleSheet } from "react-native";
import Collapsible from "react-native-collapsible";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import Colors from "../../constants/Colors";

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
        return [...p, ...selectedRecipe.recipe.Ingredients];
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
        const updatedIngredients = selectedRecipe.recipe.Ingredients.filter(
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
  const [isCollapsed, setIsCollapsed] = useState(true);
  const toggleCollapsed = () => {
    setIsCollapsed((p) => {
      return !p;
    });
  };
  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.section}>
          {listIngredients.map((ingredientType) => (
            <View key={ingredientType.ingredientType}>
              <Text style={styles.sectionTitle}>
                {ingredientType.ingredientType}
              </Text>
              {ingredientType.ingredients.map((ingredient) => (
                <View style={styles.row} key={ingredient.Ingredient_id}>
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
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  removeWrapper: {
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
    backgroundColor: Colors.accent.darker,
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
    marginBottom: 10,
  },
  ingredientItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
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
  image: {
    width: 100,
    height: 60,
    borderRadius: 10,
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
  swipedRow: {
    flexDirection: "row",
    flex: 1,
    paddingLeft: 5,
    borderRadius: 10,
    backgroundColor: "#818181",
    margin: 10,
    minHeight: 50,
  },
  swipedConfirmationContainer: {
    flex: 1,
  },
  deleteConfirmationText: {
    color: "#fcfcfc",
    fontWeight: "bold",
  },
  deleteButton: {
    backgroundColor: "#b60000",
    flexDirection: "column",
    justifyContent: "center",
    height: "100%",
  },
  deleteButtonText: {
    color: "#fcfcfc",
    fontWeight: "bold",
    padding: 3,
  },
});
