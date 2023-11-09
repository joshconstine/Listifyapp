import { Pressable, ScrollView, TouchableOpacity } from "react-native";

import { Text, View } from "../../components/Themed";
import { Animated, FlatList, StyleSheet } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { useEffect, useState } from "react";
import { Ingredient } from "../../types/recipe";
import {
  MultipleSelectList,
  SelectList,
} from "react-native-dropdown-select-list";

type SelectData = {
  key: string;
  value: string;
  disabled?: boolean;
}[];

export default function CreateRecipeScreen() {
  const [formVals, setFormVals] = useState<{
    name: string;
    description: string;
    ingredients: Ingredient[];
  }>({
    name: "",
    description: "",
    ingredients: [],
  });
  const [ingredients, setIngredients] = useState<Record<string, Ingredient[]>>(
    {}
  );
  const [uniqueIngredients, setUniqueIngredients] = useState<Ingredient[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  useEffect(() => {
    getIngredients();
  }, []);
  const data: SelectData = uniqueIngredients.map((ingredient) => ({
    key: String(ingredient.Ingredient_id),
    value: ingredient.Name,
  }));

  return (
    <View style={styles.container}>
      <Text>Create Recipe here</Text>
      <TextInput
        placeholder="Recipe Name"
        style={{
          height: 40,
          borderColor: "gray",
          borderWidth: 1,
          width: 300,
          borderRadius: 10,
          padding: 10,
          margin: 10,
        }}
        onChangeText={(text) => setFormVals({ ...formVals, name: text })}
        value={formVals.name}
      />
      <TextInput
        multiline={true}
        numberOfLines={6}
        placeholder="Recipe Description"
        style={{
          borderColor: "gray",
          borderWidth: 1,
          width: 300,
          borderRadius: 10,
          padding: 10,
          margin: 10,
        }}
        onChangeText={(text) => setFormVals({ ...formVals, description: text })}
        value={formVals.description}
      />
      <MultipleSelectList
        setSelected={(val: string) => {
          const ingredient = uniqueIngredients.find(
            (ingredient) => ingredient.Name === val
          );
          if (ingredient) {
            setFormVals({
              ...formVals,
              ingredients: [...formVals.ingredients, ingredient],
            });
          }
        }}
        data={data}
        save="value"
      />
      {/* {Object.keys(ingredients).map((key) => (
        <View key={key}>
          <Text>{key}</Text>
          {ingredients[key].map((ingredient) => (
            <TouchableOpacity
              key={ingredient.Ingredient_id}
              onPress={() => {
                setFormVals({
                  ...formVals,
                  ingredients: [...formVals.ingredients, ingredient],
                });
              }}
            >
              <Text>{ingredient.Name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      ))} */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  separator: {
    height: 1,
    width: "100%",
    marginBottom: 20,
  },
});
