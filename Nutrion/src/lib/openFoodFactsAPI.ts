// OpenFoodFacts API Client
import type {
  OpenFoodFactsResponse,
  OpenFoodFactsSearchResponse,
  ExternalFoodItem,
  APISearchResult,
  APIProductResult,
  FoodSearchOptions,
  BarcodeSearchOptions
} from '@/types/externalAPI';

const BASE_URL = 'https://world.openfoodfacts.org';
const DEFAULT_LANGUAGE = 'es';

// Estimated GI values based on food categories
const CATEGORY_GI_ESTIMATES: { [key: string]: number } = {
  'cereales': 70,
  'pan': 75,
  'pasta': 50,
  'arroz': 70,
  'legumbres': 30,
  'frutas': 50,
  'verduras': 15,
  'lacteos': 35,
  'carnes': 0,
  'pescados': 0,
  'bebidas': 60,
  'dulces': 70,
  'snacks': 65,
  'default': 50
};

/**
 * Estimate Glycemic Index based on product categories and nutritional data
 */
function estimateGI(product: any): number {
  const categories = (product.categories || '').toLowerCase();
  const carbs = product.nutriments?.['carbohydrates_100g'] || 0;
  const sugars = product.nutriments?.['sugars_100g'] || 0;
  const fiber = product.nutriments?.['fiber_100g'] || 0;

  // If no carbs, GI is 0
  if (carbs < 1) return 0;

  // Check categories for GI estimation
  for (const [category, gi] of Object.entries(CATEGORY_GI_ESTIMATES)) {
    if (categories.includes(category)) {
      // Adjust based on fiber content (fiber lowers GI)
      const fiberAdjustment = Math.min(fiber * 2, 15);
      // Adjust based on sugar ratio (high sugar increases GI)
      const sugarRatio = carbs > 0 ? sugars / carbs : 0;
      const sugarAdjustment = sugarRatio > 0.5 ? 10 : 0;
      
      return Math.max(0, Math.min(100, gi - fiberAdjustment + sugarAdjustment));
    }
  }

  // Default estimation based on sugar/carb ratio
  const sugarRatio = carbs > 0 ? sugars / carbs : 0;
  if (sugarRatio > 0.7) return 70; // High sugar
  if (sugarRatio > 0.3) return 55; // Medium sugar
  if (fiber > 5) return 40; // High fiber
  
  return CATEGORY_GI_ESTIMATES.default;
}

/**
 * Map OpenFoodFacts product to internal ExternalFoodItem format
 */
function mapProductToFoodItem(product: any): ExternalFoodItem {
  const nutriments = product.nutriments || {};
  
  return {
    code: product.code || '',
    name: product.product_name || 'Producto sin nombre',
    brand: product.brands || undefined,
    kcal: nutriments['energy-kcal_100g'] || 0,
    carbs: nutriments['carbohydrates_100g'] || 0,
    sugars: nutriments['sugars_100g'] || undefined,
    fat: nutriments['fat_100g'] || undefined,
    protein: nutriments['proteins_100g'] || undefined,
    fiber: nutriments['fiber_100g'] || undefined,
    sodium: nutriments['sodium_100g'] || undefined,
    imageUrl: product.image_url || product.image_small_url || undefined,
    categories: product.categories || undefined,
    labels: product.labels || undefined,
    source: 'openfoodfacts'
  };
}

/**
 * Search products by name or keywords
 */
export async function searchFoodsByName(
  options: FoodSearchOptions
): Promise<APISearchResult> {
  const { query, page = 1, pageSize = 20, language = DEFAULT_LANGUAGE } = options;

  if (!query || query.trim().length < 2) {
    return {
      success: false,
      error: 'La búsqueda debe tener al menos 2 caracteres'
    };
  }

  try {
    const params = new URLSearchParams({
      search_terms: query.trim(),
      page: page.toString(),
      page_size: pageSize.toString(),
      json: '1',
      fields: 'code,product_name,brands,nutriments,image_url,image_small_url,categories,labels'
    });

    const url = `${BASE_URL}/cgi/search.pl?${params.toString()}`;
    
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'CalculadoraGlucemica/1.0'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: OpenFoodFactsSearchResponse = await response.json();

    if (!data.products || data.products.length === 0) {
      return {
        success: true,
        data: [],
        total: 0,
        page
      };
    }

    const mappedProducts = data.products
      .filter(p => p.product_name && p.nutriments)
      .map(mapProductToFoodItem);

    return {
      success: true,
      data: mappedProducts,
      total: data.count,
      page: data.page
    };

  } catch (error) {
    console.error('Error searching OpenFoodFacts:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido al buscar alimentos'
    };
  }
}

/**
 * Get product by barcode
 */
export async function getProductByBarcode(
  options: BarcodeSearchOptions
): Promise<APIProductResult> {
  const { code, language = DEFAULT_LANGUAGE } = options;

  if (!code || code.trim().length < 8) {
    return {
      success: false,
      error: 'Código de barras inválido'
    };
  }

  try {
    const url = `${BASE_URL}/api/v2/product/${code.trim()}?fields=code,product_name,brands,nutriments,image_url,image_small_url,categories,labels`;
    
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'CalculadoraGlucemica/1.0'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: OpenFoodFactsResponse = await response.json();

    if (data.status !== 1 || !data.product) {
      return {
        success: false,
        error: 'Producto no encontrado'
      };
    }

    const mappedProduct = mapProductToFoodItem(data.product);

    return {
      success: true,
      data: mappedProduct
    };

  } catch (error) {
    console.error('Error fetching product from OpenFoodFacts:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido al buscar producto'
    };
  }
}

/**
 * Convert ExternalFoodItem to internal FoodItem format
 */
export function externalToInternalFood(external: ExternalFoodItem) {
  // Estimate GI based on available data
  const estimatedGI = estimateGI({
    categories: external.categories,
    nutriments: {
      'carbohydrates_100g': external.carbs,
      'sugars_100g': external.sugars,
      'fiber_100g': external.fiber
    }
  });

  return {
    name: external.brand 
      ? `${external.name} (${external.brand})` 
      : external.name,
    gi: estimatedGI,
    carbs: external.carbs,
    kcal: external.kcal,
    density: undefined // Not available from API
  };
}

/**
 * Check if API is available
 */
export async function checkAPIAvailability(): Promise<boolean> {
  try {
    const response = await fetch(`${BASE_URL}/api/v2/product/3017620422003`, {
      method: 'HEAD',
      headers: {
        'User-Agent': 'CalculadoraGlucemica/1.0'
      }
    });
    return response.ok;
  } catch {
    return false;
  }
}
