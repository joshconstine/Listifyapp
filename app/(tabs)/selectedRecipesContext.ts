import React, { createContext, useContext, useState } from "react";
import { Recipe } from "../../types/recipe";

interface SelectedRecipesContextInterface {
  selectedRecipes: Recipe[];
  setSelectedRecipes: React.Dispatch<React.SetStateAction<Recipe[]>>;
}

const initialValue: SelectedRecipesContextInterface = {
  selectedRecipes: [],
  setSelectedRecipes: () => {},
};

export const SelectedRecipesContext = createContext(initialValue);
