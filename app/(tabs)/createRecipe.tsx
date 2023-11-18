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
import ImagePickerButton from "../../components/ImagePickerButton";

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
  const [image, setImage] = useState<string | null>(null);

  const handleSubmit = async () => {
    let body = new FormData();
    // @ts-ignore
    body.append("photo", {
      uri: image,
      name: "image.jpeg",
      type: "image/jpeg",
    });
    body.append("Content-Type", "image/jpeg");
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

    body.append("Name", formVals.name);
    body.append("Description", formVals.description);
    body.append("Ingredients", JSON.stringify(recipeIngredients));
    body.append("Tags", JSON.stringify(recipeTags));
    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_DOMAIN}/api/mobile/v1/recipes`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "multipart/form-data",
          },
          body: body,
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
  const getIngredients = async () => {
    try {
      const response = await fetch(
        "http://172.23.0.3:8080/api/mobile/v1/ingredients",
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
        "http://172.23.0.3:8080/api/mobile/v1/tags",
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
        <ImagePickerButton
          setImage={setImage}
          image={image}
          title="Upload Image"
        />
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
