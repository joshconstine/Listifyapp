import {
  Alert,
  Button,
  Pressable,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import * as ImagePicker from "expo-image-picker";

import { Text, View } from "../../components/Themed";
import { Animated, FlatList, StyleSheet, Image } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { useEffect, useState } from "react";
import { Ingredient, Tag } from "../../types/recipe";
import {
  MultipleSelectList,
  SelectList,
} from "react-native-dropdown-select-list";
import { router, useRouter } from "expo-router";
import Colors from "../../constants/Colors";
import PlusButton from "../../components/PlusButton";
import { MinusButton } from "../../components/MinusButton";

export type SelectData = {
  key: string;
  value: string;
  disabled?: boolean;
}[];

export default function CreateRecipeScreen() {
  const [formVals, setFormVals] = useState<{
    name: string;
    description: string;
  }>({
    name: "",
    description: "",
  });
  const [ingredients, setIngredients] = useState<Record<string, Ingredient[]>>(
    {}
  );
  const router = useRouter();
  const [tags, setTags] = useState<Tag[]>([]);

  const [uniqueIngredients, setUniqueIngredients] = useState<Ingredient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [image, setImage] = useState(null);
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
  const getTags = async () => {
    try {
      const response = await fetch(
        "http://172.21.0.3:8080/api/mobile/v1/tags",
        {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        }
      ); // Replace with your Docker container's IP or hostname if needed
      const data = await response.json();
      setTags(data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error  tags. Status:", error);
      setIsLoading(false);
    }
  };
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  useEffect(() => {
    getIngredients();
    getTags();
  }, []);
  const data: SelectData = uniqueIngredients.map((ingredient) => ({
    key: String(ingredient.Ingredient_id),
    value: ingredient.Name,
  }));
  const tagsData: SelectData = tags.map((tag) => ({
    key: String(tag.Tag_id),
    value: tag.Name,
  }));
  const handleSubmit = async () => {
    const recipeIngredients = selectedIngredients.map((ingredient) => {
      return uniqueIngredients.find((uniqueIngredient) => {
        return uniqueIngredient.Name === ingredient;
      });
    });
    const recipeTags = selectedTags.map((tag) => {
      return tags.find((uniqueTag) => {
        return uniqueTag.Name === tag;
      });
    });

    try {
      const response = await fetch(
        "http://172.21.0.3:8080/api/mobile/v1/recipes",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            Name: formVals.name,
            Description: formVals.description,
            Ingredients: recipeIngredients,
            Tags: recipeTags,
          }),
        }
      ); // Replace with your Docker container's IP or hostname if needed`
      const createdRecipeId = await response.json();
      const route = "/recipe/" + createdRecipeId;

      setSelectedIngredients([]);
      setSelectedTags([]);
      setFormVals({
        name: "",
        description: "",
      });

      router.push(route as any);
    } catch (error) {
      console.error("Error  recipes. Status:", error);
    }
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <TextInput
          placeholder="Recipe Name"
          style={{
            borderColor: "gray",
            borderWidth: 1,
            borderRadius: 10,
            padding: 10,
          }}
          onChangeText={(text) => setFormVals({ ...formVals, name: text })}
          value={formVals.name}
        />
        <MultipleSelectList
          placeholder="Select Tags"
          searchPlaceholder="Select Tags"
          setSelected={(val: any) => {
            setSelectedTags(val);
          }}
          badgeStyles={{
            backgroundColor: Colors.accent.darker,
          }}
          arrowicon={<PlusButton />}
          closeicon={<MinusButton />}
          data={tagsData}
          save="value"
        />
        <TextInput
          multiline={true}
          numberOfLines={4}
          placeholder="Recipe Description"
          style={{
            borderColor: "gray",
            borderWidth: 1,
            borderRadius: 10,
            padding: 10,
          }}
          onChangeText={(text) =>
            setFormVals({ ...formVals, description: text })
          }
          value={formVals.description}
        />
        <MultipleSelectList
          placeholder="Select Ingredients"
          searchPlaceholder="Select Ingredients"
          setSelected={(val: any) => {
            setSelectedIngredients(val);
          }}
          closeicon={<MinusButton />}
          arrowicon={<PlusButton />}
          data={data}
          save="value"
        />
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <Button title="Pick an image from camera roll" onPress={pickImage} />
          {image && (
            <Image
              source={{ uri: image }}
              style={{ width: 200, height: 200 }}
            />
          )}
        </View>
        <Button
          title="Create Recipe"
          onPress={handleSubmit}
          color={Colors.accent.darkBlue}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 16,
  },
});
