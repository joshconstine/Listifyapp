import FontAwesome from "@expo/vector-icons/FontAwesome";
import React from "react";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { useEffect, useState } from "react";
import { useColorScheme } from "react-native";
import { SelectedRecipesContext } from "./(tabs)/selectedRecipesContext";
import { SelectedRecipe } from "../types/recipe";
import { ClerkProvider, SignedIn, SignedOut, useAuth } from "@clerk/clerk-expo";
import * as SecureStore from "expo-secure-store";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(tabs)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  const [selectedRecipes, setSelectedRecipes] = useState<SelectedRecipe[]>([]);

  const tokenCache = {
    async getToken(key: string) {
      try {
        return SecureStore.getItemAsync(key);
      } catch (err) {
        return null;
      }
    },
    async saveToken(key: string, value: string) {
      try {
        return SecureStore.setItemAsync(key, value);
      } catch (err) {
        return;
      }
    },
  };
  return (
    <ClerkProvider
      tokenCache={tokenCache}
      publishableKey={
        "pk_test_YWN0aXZlLWxvbmdob3JuLTkxLmNsZXJrLmFjY291bnRzLmRldiQ"
      }
    >
      <SelectedRecipesContext.Provider
        value={{ selectedRecipes, setSelectedRecipes }}
      >
        <ThemeProvider
          value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
          <Stack>
            <Stack.Screen
              name="(tabs)"
              options={{
                headerTransparent: true,
                headerTintColor: "blue",
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="recipe/[slug]"
              options={{
                headerTransparent: true,
                headerTitle: "",
              }}
            />
            <Stack.Screen
              name="find/index"
              options={{
                headerTransparent: true,
                headerTitle: "",
              }}
            />
            <Stack.Screen name="modal" options={{ presentation: "modal" }} />
          </Stack>
        </ThemeProvider>
      </SelectedRecipesContext.Provider>
    </ClerkProvider>
  );
}
