import { Pressable, ScrollView, TouchableOpacity } from "react-native";

import { Text, View } from "../../components/Themed";

import { Animated, FlatList, StyleSheet } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { useState } from "react";

export default function CreateRecipeScreen() {
  const [formVals, setFormVals] = useState({
    name: "",
    description: "",
    ingredients: [],
  });
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
