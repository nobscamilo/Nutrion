'use client';

import { useState, useCallback, useEffect } from 'react';
import { IndexedDBService } from '@/lib/indexedDBService';
import type { MealHistoryEntry, MealHistoryStats, ChartDataPoint } from '@/types/externalAPI';
import type { FoodEntry, NutritionalSummary, UserProfile, MealType } from '@/types/nutrition';

const HISTORY_RETENTION_DAYS = 90;

export function useMealHistory() {
  const [history, setHistory] = useState<MealHistoryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load history from IndexedDB
  const loadHistory = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const dbService = IndexedDBService.getInstance();
      const allHistory = await dbService.getAll<MealHistoryEntry>('mealHistory');
      
      // Filter out entries older than retention period
      const cutoffDate = Date.now() - (HISTORY_RETENTION_DAYS * 24 * 60 * 60 * 1000);
      const validHistory = allHistory.filter(entry => entry.timestamp >= cutoffDate);
      
      // Sort by timestamp descending (newest first)
      validHistory.sort((a, b) => b.timestamp - a.timestamp);
      
      setHistory(validHistory);
      
      // Clean up old entries
      if (validHistory.length < allHistory.length) {
        const oldEntries = allHistory.filter(entry => entry.timestamp < cutoffDate);
        for (const entry of oldEntries) {
          await dbService.delete('mealHistory', entry.id);
        }
      }
      
    } catch (err) {
      console.error('Error loading meal history:', err);
      setError(err instanceof Error ? err.message : 'Error al cargar historial');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save a new meal entry
  const saveMeal = useCallback(async (
    mealType: MealType,
    foods: FoodEntry[],
    summary: NutritionalSummary,
    profile?: UserProfile
  ): Promise<boolean> => {
    try {
      if (foods.length === 0) {
        throw new Error('No hay alimentos para guardar');
      }

      const now = new Date();
      const entry: MealHistoryEntry = {
        id: `meal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        date: now.toISOString().split('T')[0], // YYYY-MM-DD
        timestamp: now.getTime(),
        mealType,
        foods: foods.map(f => ({
          name: f.name,
          quantity: f.quantity,
          gi: f.gi,
          carbs_g: f.carbs_g,
          cg: f.cg,
          kcal: f.kcal
        })),
        summary: {
          totalCG: summary.totalCG,
          totalKcal: summary.totalKcal,
          totalCarbs: summary.totalCarbs,
          weightedGI: summary.weightedGI,
          ire: summary.ire,
          vg: summary.vg
        },
        profile: profile ? {
          nombre: profile.nombre,
          peso: profile.peso
        } : undefined
      };

      const dbService = IndexedDBService.getInstance();
      await dbService.put('mealHistory', entry);
      
      // Reload history
      await loadHistory();
      
      console.log('✓ Comida guardada en historial:', entry.id);
      return true;
      
    } catch (err) {
      console.error('Error saving meal:', err);
      setError(err instanceof Error ? err.message : 'Error al guardar comida');
      return false;
    }
  }, [loadHistory]);

  // Delete a meal entry
  const deleteMeal = useCallback(async (id: string): Promise<boolean> => {
    try {
      const dbService = IndexedDBService.getInstance();
      await dbService.delete('mealHistory', id);
      
      // Reload history
      await loadHistory();
      
      console.log('✓ Comida eliminada del historial:', id);
      return true;
      
    } catch (err) {
      console.error('Error deleting meal:', err);
      setError(err instanceof Error ? err.message : 'Error al eliminar comida');
      return false;
    }
  }, [loadHistory]);

  // Clear all history
  const clearHistory = useCallback(async (): Promise<boolean> => {
    try {
      const dbService = IndexedDBService.getInstance();
      await dbService.clear('mealHistory');
      
      setHistory([]);
      console.log('✓ Historial limpiado');
      return true;
      
    } catch (err) {
      console.error('Error clearing history:', err);
      setError(err instanceof Error ? err.message : 'Error al limpiar historial');
      return false;
    }
  }, []);

  // Get statistics from history
  const getStats = useCallback((): MealHistoryStats => {
    if (history.length === 0) {
      return {
        totalMeals: 0,
        avgCG: 0,
        avgKcal: 0,
        avgCarbs: 0,
        maxCG: 0,
        minCG: 0,
        mealsByType: {
          Desayuno: 0,
          Merienda: 0,
          Comida: 0,
          Cena: 0
        }
      };
    }

    const totalCG = history.reduce((sum, entry) => sum + entry.summary.totalCG, 0);
    const totalKcal = history.reduce((sum, entry) => sum + entry.summary.totalKcal, 0);
    const totalCarbs = history.reduce((sum, entry) => sum + entry.summary.totalCarbs, 0);
    
    const cgValues = history.map(entry => entry.summary.totalCG);
    const maxCG = Math.max(...cgValues);
    const minCG = Math.min(...cgValues);

    const mealsByType = history.reduce((acc, entry) => {
      acc[entry.mealType] = (acc[entry.mealType] || 0) + 1;
      return acc;
    }, {} as MealHistoryStats['mealsByType']);

    return {
      totalMeals: history.length,
      avgCG: totalCG / history.length,
      avgKcal: totalKcal / history.length,
      avgCarbs: totalCarbs / history.length,
      maxCG,
      minCG,
      mealsByType: {
        Desayuno: mealsByType.Desayuno || 0,
        Merienda: mealsByType.Merienda || 0,
        Comida: mealsByType.Comida || 0,
        Cena: mealsByType.Cena || 0
      }
    };
  }, [history]);

  // Get chart data for a date range
  const getChartData = useCallback((
    startDate?: Date,
    endDate?: Date,
    mealType?: MealType | 'all'
  ): ChartDataPoint[] => {
    let filteredHistory = [...history];

    // Filter by date range
    if (startDate) {
      const startTime = startDate.getTime();
      filteredHistory = filteredHistory.filter(entry => entry.timestamp >= startTime);
    }
    if (endDate) {
      const endTime = endDate.getTime();
      filteredHistory = filteredHistory.filter(entry => entry.timestamp <= endTime);
    }

    // Filter by meal type
    if (mealType && mealType !== 'all') {
      filteredHistory = filteredHistory.filter(entry => entry.mealType === mealType);
    }

    // Convert to chart data points
    return filteredHistory.map(entry => ({
      date: entry.date,
      cg: entry.summary.totalCG,
      kcal: entry.summary.totalKcal,
      carbs: entry.summary.totalCarbs,
      mealType: entry.mealType,
      label: `${entry.mealType} - ${entry.date}`
    }));
  }, [history]);

  // Get entries for a specific date
  const getEntriesByDate = useCallback((date: string): MealHistoryEntry[] => {
    return history.filter(entry => entry.date === date);
  }, [history]);

  // Load history on mount
  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  return {
    history,
    isLoading,
    error,
    saveMeal,
    deleteMeal,
    clearHistory,
    loadHistory,
    getStats,
    getChartData,
    getEntriesByDate
  };
}
