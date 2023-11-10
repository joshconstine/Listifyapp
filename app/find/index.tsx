import { Ingredient, Recipe } from "../../types/recipe";
import { View, Text, Image, StyleSheet } from "react-native";
import { useState } from "react";
import { useEffect } from "react";
import { ScrollView } from "react-native-gesture-handler";
import { MultipleSelectList } from "react-native-dropdown-select-list";
import { SelectData } from "../(tabs)/createRecipe";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../../constants/Colors";
import { AntDesign } from "@expo/vector-icons";

export const PlusButton = () => {
  return (
    <View
      style={{
        backgroundColor: Colors.accent.blue,
        borderRadius: 5,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Ionicons name="add" size={24} color="white" />
    </View>
  );
};
export const MinusButton = () => {
  return (
    <View
      style={{
        backgroundColor: Colors.accent.darker,
        borderRadius: 5,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <AntDesign name="minus" size={24} color="white" />
    </View>
  );
};

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
            <View key={recipe.Recipe_id} style={styles.recipe}>
              <Text style={styles.title}>{recipe.Name}</Text>
              <Text style={styles.subTitle}>Ingredients:</Text>
              {recipe.Ingredients?.map((ingredient) => {
                const isSelected = selectedIngredients.includes(
                  ingredient.Name
                );
                return (
                  <Text
                    key={ingredient.Ingredient_id}
                    style={isSelected ? styles.selectedTag : styles.tag}
                  >
                    {ingredient.Name}
                  </Text>
                );
              })}
            </View>
          ))}
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
  selectedTag: {
    fontSize: 16,
    backgroundColor: "green",
    color: "white",
    padding: 8,
    borderRadius: 8,
  },
});

export default Page;
