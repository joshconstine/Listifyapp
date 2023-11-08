import { useLocalSearchParams } from "expo-router";
import { Recipe } from "../../types/recipe";
import { View, Text, Image, StyleSheet } from "react-native";
import { useState } from "react";
import { useEffect } from "react";
import RecipeInfo from "../../components/RecipeInfo";
import RecipeAuthor from "../../components/RecipeAuthor";
import { ScrollView } from "react-native-gesture-handler";
import IngredientsContainer from "../../components/IngredientsContainer";

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
        <IngredientsContainer recipe={recipe} />
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

  tag: {
    fontSize: 16,
  },
});

export default Page;
