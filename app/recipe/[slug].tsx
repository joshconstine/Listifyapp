import { useLocalSearchParams } from "expo-router";
import { Recipe } from "../../types/recipe";
import { View, Text, Image, StyleSheet } from "react-native";
import { useState } from "react";
import { useEffect } from "react";

export function Page() {
  const { slug } = useLocalSearchParams();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const getRecipe = async () => {
    try {
      const response = await fetch(
        "http://172.21.0.3:8080/api/mobile/v1/recipes/" + slug,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        }
      ); // Replace with your Docker container's IP or hostname if needed
      const data = await response.json();
      setRecipe(data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error  recipes. Status:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getRecipe();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.recipeName}>{recipe?.Name}</Text>
      <Image source={{ uri: recipe?.Photos[0] }} style={styles.recipeImage} />
      <Text style={styles.description}>{recipe?.Description}</Text>

      <Text style={styles.sectionTitle}>Tags:</Text>
      {recipe?.Tags?.map((tag) => (
        <Text key={tag.Tag_id} style={styles.tag}>
          {tag.Name}
        </Text>
      ))}
      <Text style={styles.sectionTitle}>Ingredients:</Text>
      {recipe?.Ingredients?.map((ingredient) => (
        <Text key={ingredient.Ingredient_id} style={styles.ingredient}>
          {`${ingredient.Name}: ${ingredient.Quantity} ${ingredient.Quantity_type}`}
        </Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  recipeName: {
    fontSize: 24,
    fontWeight: "bold",
  },
  recipeImage: {
    width: "100%",
    height: 200,
    marginTop: 16,
    borderRadius: 10,
  },
  description: {
    fontSize: 16,
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 16,
  },
  tag: {
    fontSize: 16,
    marginTop: 8,
  },
  ingredient: {
    fontSize: 16,
    marginTop: 8,
  },
});

export default Page;
