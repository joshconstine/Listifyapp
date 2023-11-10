import React, { createContext, useContext, useState } from "react";
import { Recipe, SelectedRecipe } from "../../types/recipe";

interface SelectedRecipesContextInterface {
  selectedRecipes: SelectedRecipe[];
  setSelectedRecipes: React.Dispatch<React.SetStateAction<SelectedRecipe[]>>;
}

const initialValue: SelectedRecipesContextInterface = {
  selectedRecipes: [],
  setSelectedRecipes: () => {},
};

export const SelectedRecipesContext = createContext(initialValue);
