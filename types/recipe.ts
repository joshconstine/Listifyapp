export type Recipe = {
  Recipe_id: number;
  Name: string;
  Description: string;
  Photos: string[];
  Tags: Tag[];
  TagString: string;
  Ingredients: Ingredient[];
};

export type Tag = {
  Tag_id: number;
  Name: string;
};

export type Ingredient = {
  Ingredient_id: number;
  Name: string;
  Quantity: number;
  Quantity_type: string;
  Quantity_type_id: number;
};
