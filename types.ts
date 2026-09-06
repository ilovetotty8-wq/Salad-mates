export interface Ingredient {
  id: string;
  name: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  ingredients: Ingredient[];
  createdAt: string;
}

export interface ProductionIngredient {
  ingredientId: string;
  ingredientName: string;
  lotCode: string;
}

export interface ProductionRun {
  id: string;
  batchId: string;
  productId: string;
  productName: string;
  dateTime: string;
  timesMade: number;
  totalQuantity: number;
  boxesProduced: number;
  ph: string;
  notes: string;
  ingredients: ProductionIngredient[];
}
