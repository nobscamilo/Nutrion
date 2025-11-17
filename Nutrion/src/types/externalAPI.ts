// Types for External Food APIs and Meal History

// OpenFoodFacts API Types
export interface OpenFoodFactsProduct {
  code: string;
  product_name?: string;
  brands?: string;
  nutriments?: {
    'energy-kcal_100g'?: number;
    'carbohydrates_100g'?: number;
    'sugars_100g'?: number;
    'fat_100g'?: number;
    'proteins_100g'?: number;
    'fiber_100g'?: number;
    'sodium_100g'?: number;
  };
  image_url?: string;
  image_small_url?: string;
  categories?: string;
  labels?: string;
}

export interface OpenFoodFactsResponse {
  status: number;
  status_verbose: string;
  product?: OpenFoodFactsProduct;
}

export interface OpenFoodFactsSearchResponse {
  count: number;
  page: number;
  page_count: number;
  page_size: number;
  products: OpenFoodFactsProduct[];
}

export interface ExternalFoodItem {
  code: string;
  name: string;
  brand?: string;
  kcal: number;
  carbs: number;
  sugars?: number;
  fat?: number;
  protein?: number;
  fiber?: number;
  sodium?: number;
  imageUrl?: string;
  categories?: string;
  labels?: string;
  source: 'openfoodfacts';
}

// Meal History Types
export interface MealHistoryEntry {
  id: string;
  date: string; // ISO date string
  timestamp: number;
  mealType: 'Desayuno' | 'Merienda' | 'Comida' | 'Cena';
  foods: {
    name: string;
    quantity: number;
    gi: number;
    carbs_g: number;
    cg: number;
    kcal: number;
  }[];
  summary: {
    totalCG: number;
    totalKcal: number;
    totalCarbs: number;
    weightedGI: number;
    ire: number;
    vg: number;
  };
  profile?: {
    nombre: string;
    peso: number;
  };
}

export interface MealHistoryStats {
  totalMeals: number;
  avgCG: number;
  avgKcal: number;
  avgCarbs: number;
  maxCG: number;
  minCG: number;
  mealsByType: {
    Desayuno: number;
    Merienda: number;
    Comida: number;
    Cena: number;
  };
}

export interface ChartDataPoint {
  date: string;
  cg: number;
  kcal: number;
  carbs: number;
  mealType?: string;
  label?: string;
}

export interface ProgressChartFilters {
  dateRange: 'week' | 'month' | 'custom';
  startDate?: string;
  endDate?: string;
  mealType?: 'all' | 'Desayuno' | 'Merienda' | 'Comida' | 'Cena';
  metric: 'cg' | 'kcal' | 'carbs' | 'all';
}

// API Search Options
export interface FoodSearchOptions {
  query: string;
  page?: number;
  pageSize?: number;
  language?: string;
}

export interface BarcodeSearchOptions {
  code: string;
  language?: string;
}

// API Response Wrappers
export interface APISearchResult {
  success: boolean;
  data?: ExternalFoodItem[];
  error?: string;
  total?: number;
  page?: number;
}

export interface APIProductResult {
  success: boolean;
  data?: ExternalFoodItem;
  error?: string;
}
