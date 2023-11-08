import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Link, Tabs } from "expo-router";
import { Pressable, View, useColorScheme } from "react-native";
import { AntDesign, Entypo, Feather } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";

import Colors from "../../constants/Colors";
import { useContext, useState } from "react";
import { SelectedRecipesContext } from "./selectedRecipesContext";
import { Recipe } from "../../types/recipe";
/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const [selectedRecipes, setSelectedRecipes] = useState<Recipe[]>([]);

  return (
    <SelectedRecipesContext.Provider
      value={{ selectedRecipes, setSelectedRecipes }}
    >
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: "black",
          tabBarStyle: {
            height: 70,
            backgroundColor: "white",
            borderTopColor: "transparent",
            paddingHorizontal: 40,
          },
          tabBarShowLabel: false,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Recipes",
            tabBarIcon: ({ color }) => (
              <AntDesign name="find" size={24} color={color} />
            ),
            // headerRight: () => (
            //   <Link href="/modal" asChild
            //     <Pressable>
            //       {({ pressed }) => (
            //         <FontAwesome
            //           name="info-circle"
            //           size={20}
            //           color={Colors[colorScheme ?? "light"].text}
            //           style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
            //         />
            //       )}
            //     </Pressable>
            //   </Link>
            // ),
          }}
        />
        <Tabs.Screen
          name="search"
          options={{
            title: "",
            tabBarIcon: ({ color }) => (
              <Feather name="search" size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="createRecipe"
          options={{
            title: "",
            tabBarIcon: ({ color }) => (
              <Ionicons name="add-circle-outline" size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="list"
          options={{
            title: "",
            tabBarIcon: ({ color }) => (
              <Entypo name="shopping-basket" size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "",
            tabBarIcon: ({ color }) => (
              <AntDesign name="user" size={24} color={color} />
            ),
          }}
        />
      </Tabs>
    </SelectedRecipesContext.Provider>
  );
}
