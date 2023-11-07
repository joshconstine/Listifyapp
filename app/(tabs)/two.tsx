import { StyleSheet } from "react-native";

import { Text, View } from "../../components/Themed";
import { SelectedRecipesContext } from "./selectedRecipesContext";
export default function ListScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>List</Text>
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      <SelectedRecipesContext.Consumer>
        {({ selectedRecipes }) => (
          <Text>{JSON.stringify(selectedRecipes)}</Text>
        )}
      </SelectedRecipesContext.Consumer>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
