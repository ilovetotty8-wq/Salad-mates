export interface Recipe {
  id: string;
  title: string;
  description: string;
  category: string;
  prepTime: string;
  cookTime: string;
  servings: string;
  difficulty: "Easy" | "Medium" | "Hard";
  imageUrl: string;
  ingredients: string[];
  steps: string[];
  createdAt: string;
}

export interface AppUser {
  id: string;
  name: string;
  email: string;
  password: string;
  isAdmin: boolean;
  subscribed: boolean;
  subscribedAt?: string;
}

export type Screen =
  | "landing"
  | "auth"
  | "subscribe"
  | "recipes"
  | "recipe-detail"
  | "admin"
  | "profile";
