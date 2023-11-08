import { useLocalSearchParams } from "expo-router";
import { Recipe } from "../../types/recipe";
import { View, Text, Image, StyleSheet } from "react-native";
import { useState } from "react";
import { useEffect } from "react";
import RecipeInfo from "../../components/RecipeInfo";
import RecipeAuthor from "../../components/RecipeAuthor";
import { ScrollView } from "react-native-gesture-handler";

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
    <ScrollView>
      <View style={styles.container}>
        <RecipeInfo recipe={recipe} />
        <Text style={styles.recipeName}>{recipe?.Name}</Text>
        <Image source={{ uri: recipe?.Photos[0] }} style={styles.recipeImage} />
        <RecipeAuthor recipe={recipe} />
        <Text style={styles.description}>{recipe?.Description}</Text>

        {/* <Text style={styles.sectionTitle}>Tags:</Text> */}
        {/* {recipe?.Tags?.map((tag) => (
        <Text key={tag.Tag_id} style={styles.tag}>
          {tag.Name}
        </Text>
      ))} */}
        <Text style={styles.sectionTitle}>Ingredients</Text>
        {recipe?.Ingredients?.map((ingredient) => (
          <View
            style={styles.ingredientContainer}
            key={ingredient.Ingredient_id}
          >
            <Text style={styles.ingredient}>{ingredient.Name}</Text>
            <Text style={styles.ingredientQuantity}>
              {`${ingredient.Quantity} ${ingredient.Quantity_type}${
                ingredient.Quantity > 1 && ingredient.Quantity_type_id !== 1
                  ? "s"
                  : ""
              }`}
            </Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingHorizontal: 32,
    marginTop: 96,
    gap: 16,
    alignItems: "flex-start",
  },
  ingredientContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    backgroundColor: "darkgrey",
    opacity: 0.5,
    padding: 8,
    borderRadius: 5,
  },
  ingredientQuantity: {
    fontSize: 16,
    fontWeight: "bold",
    color: "grey",
  },
  recipeName: {
    fontSize: 30,
    fontWeight: "bold",
  },
  recipeImage: {
    width: "100%",
    height: 200,
    marginVertical: 8,
    borderRadius: 20,
  },
  description: {
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  tag: {
    fontSize: 16,
  },
  ingredient: {
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default Page;
