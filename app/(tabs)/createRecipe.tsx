import { Pressable, ScrollView, TouchableOpacity } from "react-native";

import { Text, View } from "../../components/Themed";

import { Animated, FlatList, StyleSheet } from "react-native";

export default function CreateRecipeScreen() {
  return (
    <View style={styles.container}>
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255, 255, 255, 0.1)"
      />
      <Text>Create Recipe here</Text>
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
