'use client';

import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { searchFoodsByName, externalToInternalFood } from '@/lib/openFoodFactsAPI';
import type { ExternalFoodItem } from '@/types/externalAPI';
import type { FoodItem } from '@/types/nutrition';

interface ExternalFoodSearchProps {
  onSelectFood: (food: FoodItem) => void;
  onClose: () => void;
}

export default function ExternalFoodSearch({ onSelectFood, onClose }: ExternalFoodSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<ExternalFoodItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = useCallback(async () => {
    if (!query.trim() || query.trim().length < 2) {
      setError('Escribe al menos 2 caracteres para buscar');
      return;
    }

    setIsSearching(true);
    setError(null);
    setHasSearched(true);

    try {
      const result = await searchFoodsByName({ query: query.trim(), pageSize: 20 });

      if (!result.success) {
        setError(result.error || 'Error al buscar alimentos');
        setResults([]);
        return;
      }

      setResults(result.data || []);
      
      if (result.data && result.data.length === 0) {
        setError('No se encontraron alimentos. Intenta con otro término de búsqueda.');
      }

    } catch (err) {
      console.error('Search error:', err);
      setError('Error de conexión. Verifica tu internet.');
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  }, [query]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  }, [handleSearch]);

  const handleSelectFood = useCallback((externalFood: ExternalFoodItem) => {
    const internalFood = externalToInternalFood(externalFood);
    onSelectFood(internalFood);
  }, [onSelectFood]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 border-b flex justify-between items-center bg-green-50">
          <div>
            <h3 className="text-lg font-semibold text-green-700 flex items-center gap-2">
              <span>🌍</span>
              Búsqueda Externa de Alimentos
            </h3>
            <p className="text-xs text-gray-600 mt-1">
              Busca productos comerciales en OpenFoodFacts
            </p>
          </div>
          <Button
            variant="ghost"
            onClick={onClose}
            className="p-2 hover:bg-green-100"
          >
            ✕
          </Button>
        </div>

        {/* Search Bar */}
        <div className="p-4 border-b bg-gray-50">
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="🔍 Buscar producto (ej: yogur natural, pan integral...)"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyPress}
              className="flex-1"
              disabled={isSearching}
            />
            <Button
              onClick={handleSearch}
              disabled={isSearching || query.trim().length < 2}
              className="min-w-[100px]"
            >
              {isSearching ? '⏳ Buscando...' : '🔍 Buscar'}
            </Button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-4">
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </div>
        )}

        {/* Results */}
        <div className="flex-1 overflow-y-auto p-4">
          {isSearching && (
            <div className="text-center py-8">
              <div className="text-4xl animate-spin mb-4">⭕</div>
              <p className="text-gray-600">Buscando en OpenFoodFacts...</p>
            </div>
          )}

          {!isSearching && hasSearched && results.length === 0 && !error && (
            <div className="text-center py-8 text-gray-500">
              <div className="text-4xl mb-4">🔍</div>
              <p>No se encontraron resultados</p>
            </div>
          )}

          {!isSearching && !hasSearched && (
            <div className="text-center py-8 text-gray-500">
              <div className="text-4xl mb-4">🌍</div>
              <p>Busca productos comerciales por nombre</p>
              <p className="text-sm mt-2">Base de datos: OpenFoodFacts</p>
            </div>
          )}

          {results.length > 0 && (
            <div className="space-y-3">
              {results.map((food, index) => (
                <div
                  key={`${food.code}-${index}`}
                  className="border border-gray-200 rounded-lg p-4 hover:border-green-300 hover:bg-green-50 transition-colors"
                >
                  <div className="flex gap-4">
                    {/* Image */}
                    {food.imageUrl && (
                      <div className="flex-shrink-0">
                        <img
                          src={food.imageUrl}
                          alt={food.name}
                          className="w-20 h-20 object-cover rounded border"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      </div>
                    )}

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 truncate">
                        {food.name}
                      </h4>
                      {food.brand && (
                        <p className="text-sm text-gray-600 truncate">
                          Marca: {food.brand}
                        </p>
                      )}
                      
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2 text-xs">
                        <div className="bg-blue-50 px-2 py-1 rounded">
                          <span className="font-semibold">Kcal:</span> {food.kcal.toFixed(0)}
                        </div>
                        <div className="bg-orange-50 px-2 py-1 rounded">
                          <span className="font-semibold">Carbs:</span> {food.carbs.toFixed(1)}g
                        </div>
                        {food.protein !== undefined && (
                          <div className="bg-purple-50 px-2 py-1 rounded">
                            <span className="font-semibold">Prot:</span> {food.protein.toFixed(1)}g
                          </div>
                        )}
                        {food.fat !== undefined && (
                          <div className="bg-yellow-50 px-2 py-1 rounded">
                            <span className="font-semibold">Grasas:</span> {food.fat.toFixed(1)}g
                          </div>
                        )}
                      </div>

                      {food.categories && (
                        <p className="text-xs text-gray-500 mt-2 truncate">
                          {food.categories.split(',').slice(0, 3).join(', ')}
                        </p>
                      )}
                    </div>

                    {/* Add Button */}
                    <div className="flex-shrink-0 flex items-center">
                      <Button
                        onClick={() => handleSelectFood(food)}
                        size="sm"
                        className="whitespace-nowrap"
                      >
                        ➕ Agregar
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t bg-gray-50 text-center text-xs text-gray-500">
          Datos proporcionados por{' '}
          <a
            href="https://world.openfoodfacts.org"
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-600 hover:underline"
          >
            OpenFoodFacts
          </a>
          {' '}• IG estimado automáticamente
        </div>
      </div>
    </div>
  );
}
