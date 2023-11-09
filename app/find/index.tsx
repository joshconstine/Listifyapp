import { Ingredient, Recipe } from "../../types/recipe";
import { View, Text, Image, StyleSheet } from "react-native";
import { useState } from "react";
import { useEffect } from "react";
import { ScrollView } from "react-native-gesture-handler";

export function Page() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [ingredients, setIngredients] = useState<Record<string, Ingredient[]>>(
    {}
  );

  const [uniqueIngredients, setUniqueIngredients] = useState<Ingredient[]>([]);

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
      setIngredients(data);
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

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.title}>What's in your kitchen?</Text>
        <Text style={styles.subTitle}>Enter ingredients</Text>
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
  },

  tag: {
    fontSize: 16,
  },
});

export default Page;
