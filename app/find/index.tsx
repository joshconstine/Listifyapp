import { Ingredient, Recipe } from "../../types/recipe";
import { View, Text, StyleSheet } from "react-native";
import { useState } from "react";
import { useEffect } from "react";
import { ScrollView } from "react-native-gesture-handler";
import { MultipleSelectList } from "react-native-dropdown-select-list";
import { SelectData } from "../(tabs)/createRecipe";

import PlusButton from "../../components/PlusButton";
import { MinusButton } from "../../components/MinusButton";
import RecipeCard from "../../components/RecipeCard";

export function Page() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [uniqueIngredients, setUniqueIngredients] = useState<Ingredient[]>([]);
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);

  const getIngredients = async () => {
    try {
      const response = await fetch(
        "http://172.21.0.3:8080/api/mobile/v1/ingredients",
        {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        }
      ); // Replace with your Docker container's IP or hostname if needed
      const data = (await response.json()) as Record<string, Ingredient[]>;
      const uniqueIngredients = Object.values(data).flat();
      setUniqueIngredients(uniqueIngredients);
      // console.log(data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error  recipes. Status:", error);
      setIsLoading(false);
    }
  };
  const getRecipes = async () => {
    try {
      const response = await fetch(
        "http://172.21.0.3:8080/api/mobile/v1/recipes",
        {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        }
      ); // Replace with your Docker container's IP or hostname if needed
      const data = await response.json();
      setRecipes(data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error  recipes. Status:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getRecipes();
    getIngredients();
  }, []);
  const data: SelectData = uniqueIngredients.map((ingredient) => ({
    key: String(ingredient.Ingredient_id),
    value: ingredient.Name,
  }));
  const filteredRecipes = recipes.filter((recipe) =>
    recipe.Ingredients?.some((ingredient) =>
      selectedIngredients.includes(ingredient.Name)
    )
  );
  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.title}>What's in your kitchen?</Text>
        <Text style={styles.subTitle}>We will find matching recipes</Text>
        <MultipleSelectList
          placeholder="Select your Ingredients..."
          searchPlaceholder="Select your Ingredients..."
          searchicon={<></>}
          notFoundText="No Ingredients found"
          setSelected={(val: any) => setSelectedIngredients(val)}
          inputStyles={{
            width: "100%",
            borderWidth: 0,
            color: "grey",
          }}
          arrowicon={<PlusButton />}
          closeicon={<MinusButton />}
          boxStyles={{
            width: "100%",
          }}
          data={data}
          save="value"
        />
        <View style={styles.recipesContainer}>
          {filteredRecipes.map((recipe) => (
            <RecipeCard recipe={recipe} key={recipe.Recipe_id} />
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
    paddingHorizontal: 32,
    marginTop: 72,
    gap: 16,
    alignItems: "flex-start",
  },
  recipesContainer: {
    flex: 1,
    alignItems: "flex-start",
    width: "100%",
    gap: 4,
  },

  title: {
    fontSize: 30,
    fontWeight: "bold",
  },

  subTitle: {
    fontSize: 16,
    color: "grey",
  },

  ingredients: {
    fontSize: 12,
    color: "grey",
  },
});

export default Page;
