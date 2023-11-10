import { Pressable, ScrollView, TouchableOpacity } from "react-native";

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
import { Ionicons } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";

interface IIngredientType {
  ingredientType: string;
  ingredients: IngredientWithQuantityAndType[];
}

const renderRightActions = (
  progress: any,
  dragAnimatedValue: any,
  onRemoveIngredient: any,
  ingredient: IngredientWithQuantityAndType
) => {
  const opacity = dragAnimatedValue.interpolate({
    inputRange: [-50, 0],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });
  return (
    <View style={styles.swipedRow}>
      <View style={styles.swipedConfirmationContainer}>
        <Text style={styles.deleteConfirmationText}>Are you sure?</Text>
      </View>
      <Animated.View style={[styles.deleteButton, { opacity }]}>
        <TouchableOpacity
          onPress={() => onRemoveIngredient(ingredient.Ingredient_id)}
        >
          <Text style={styles.removeButton}>Remove</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

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
    const newSelectedRecipes = selectedRecipes.map((selected) => {
      const newIngredients = selected.recipe.Ingredients.filter(
        (ingredient) => ingredient.Ingredient_id !== ingredientId
      );
      return { ...selected, Ingredients: newIngredients };
    });
    setSelectedRecipes(newSelectedRecipes);
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
          <Pressable onPress={toggleCollapsed}>
            {({ pressed }) => (
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  gap: 8,
                }}
              >
                <Text style={styles.sectionTitle}>Your Selected Recipes</Text>
                {!isCollapsed ? (
                  <Feather name="minus" size={24} color="black" />
                ) : (
                  <Ionicons name="add" size={24} color="black" />
                )}
              </View>
            )}
          </Pressable>
          <Collapsible collapsed={isCollapsed} style={styles.section}>
            {selectedRecipes.map((selectedRecipe) => (
              <Link
                href={`/recipe/${selectedRecipe.recipe.Recipe_id}`}
                key={selectedRecipe.recipe.Recipe_id}
              >
                <View style={styles.listItem}>
                  <Image
                    source={{ uri: selectedRecipe.recipe.Photos[0] }}
                    style={styles.image}
                  />
                  <Text
                    style={{
                      fontWeight: "bold",
                    }}
                  >
                    {selectedRecipe.recipe.Name}
                  </Text>
                </View>
              </Link>
            ))}
          </Collapsible>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}> Recipe Ingredients</Text>
          {listIngredients.map((ingredientType) => (
            <View key={ingredientType.ingredientType}>
              <Text style={styles.sectionTitle}>
                {ingredientType.ingredientType}
              </Text>
              {ingredientType.ingredients.map((ingredient) => (
                <Swipeable
                  key={ingredient.Ingredient_id + ingredient.Name}
                  renderRightActions={(a, b) =>
                    renderRightActions(a, b, onRemoveIngredient, ingredient)
                  }
                >
                  <View style={styles.row}>
                    <Text
                      style={{
                        fontWeight: "bold",
                        fontSize: 16,
                      }}
                    >
                      {ingredient.Name}
                    </Text>
                    <Text>{`${ingredient.Quantity}: ${
                      ingredient.Quantity_type
                    }${
                      ingredient.Quantity > 1 &&
                      ingredient.Quantity_type_id !== 1
                        ? "s"
                        : ""
                    }`}</Text>
                  </View>
                </Swipeable>
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
    paddingLeft: 5,
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
