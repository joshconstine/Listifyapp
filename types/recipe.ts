export type Recipe = {
  Recipe_id: number;
  Name: string;
  Description: string;
  Photos: string[];
  Tags: Tag[];
  TagString: string;
  Ingredients: IngredientWithQuantityAndType[];
};

export type Tag = {
  Tag_id: number;
  Name: string;
};

export type IngredientWithQuantityAndType = {
  Ingredient_id: number;
  Ingredient_Type_id: number;
  Ingredient_Type_Name: string;
  Name: string;
  Quantity: number;
  Quantity_type: string;
  Quantity_type_id: number;
};
