import { Ingredient, Recipe } from "../../types/recipe";
import { View, Text, Image, StyleSheet } from "react-native";
import { useState } from "react";
import { useEffect } from "react";
import { ScrollView } from "react-native-gesture-handler";
import {
  MultipleSelectList,
  SelectList,
} from "react-native-dropdown-select-list";
import { SelectData } from "../(tabs)/createRecipe";

export function Page() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [matchingRecipes, setMatchingRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [uniqueIngredients, setUniqueIngredients] = useState<Ingredient[]>([]);
  const [selectedIngredients, setSelectedIngredients] = useState<Ingredient[]>(
    []
  );
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
      setMatchingRecipes(data);
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

  useEffect(() => {
    const newMatchingRecipes = recipes.filter((recipe) =>
      recipe.Ingredients?.some((ingredient) =>
        selectedIngredients.some(
          (selectedIngredient) =>
            selectedIngredient.Ingredient_id === ingredient.Ingredient_id
        )
      )
    );
    setMatchingRecipes(newMatchingRecipes);
  }, [selectedIngredients]);

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.title}>What's in your kitchen?</Text>
        <Text style={styles.subTitle}>We will find matching recipes</Text>
        <MultipleSelectList
          placeholder="Select Ingredients"
          setSelected={(val: string) => {
            const ingredient = uniqueIngredients.find(
              (ingredient) => ingredient.Name === val
            );
            if (ingredient) {
              setSelectedIngredients((p) => [...p, ingredient]);
            }
          }}
          data={data}
          save="value"
        />
        <View style={styles.recipesContainer}>
          {matchingRecipes?.map((recipe) => {
            const matchedIngredients = recipe.Ingredients?.filter(
              (ingredient) =>
                selectedIngredients.some(
                  (selectedIngredient) =>
                    selectedIngredient.Ingredient_id ===
                    ingredient.Ingredient_id
                )
            );
            const image = recipe.Photos
              ? recipe.Photos[0]
              : "../../assets/images/placeholder.png";
            return (
              <View key={recipe.Recipe_id} style={styles.recipe}>
                <Text>{recipe.Name}</Text>
                <Image source={{ uri: image }} style={styles.recipeImage} />
                <View>
                  {matchedIngredients?.map((ingredient) => (
                    <Text key={ingredient.Ingredient_id}>
                      {ingredient.Name} - {ingredient.Quantity}
                    </Text>
                  ))}
                </View>
              </View>
            );
          })}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingHorizontal: 32,
    marginTop: 72,
    gap: 16,
    alignItems: "flex-start",
  },
  recipesContainer: {
    flex: 1,
    alignItems: "flex-start",
    gap: 16,
  },
  recipe: {
    flex: 1,
    alignItems: "flex-start",
    gap: 16,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
  },
  recipeImage: {
    width: "100%",
    height: 180,
    marginVertical: 8,
    borderRadius: 20,
  },
  subTitle: {
    fontSize: 16,
    color: "grey",
  },

  tag: {
    fontSize: 16,
  },
});

export default Page;
