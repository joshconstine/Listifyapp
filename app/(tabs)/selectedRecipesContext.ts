import React, { createContext, useContext, useState } from "react";
export interface ISelectedRecipe {
  recipeId: number;
  isChecked: boolean;
}
interface SelectedRecipesContextInterface {
  selectedRecipes: ISelectedRecipe[];
  setSelectedRecipes: any;
}

const initialValue: SelectedRecipesContextInterface = {
  selectedRecipes: [],
  setSelectedRecipes: () => {},
};

export const SelectedRecipesContext = createContext(initialValue);
