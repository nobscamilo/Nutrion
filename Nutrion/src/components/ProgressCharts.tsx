'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { useMealHistory } from '@/hooks/useMealHistory';
import type { MealType } from '@/types/nutrition';

type DateRange = 'week' | 'month' | 'all';
type MetricType = 'cg' | 'kcal' | 'carbs';

const COLORS = {
  cg: '#3b82f6',
  kcal: '#f59e0b',
  carbs: '#10b981',
  Desayuno: '#3b82f6',
  Merienda: '#8b5cf6',
  Comida: '#f59e0b',
  Cena: '#10b981'
};

interface ProgressChartsProps {
  className?: string;
}

export default function ProgressCharts({ className = '' }: ProgressChartsProps) {
  const { history, isLoading, getStats, getChartData } = useMealHistory();
  const [dateRange, setDateRange] = useState<DateRange>('week');
  const [mealTypeFilter, setMealTypeFilter] = useState<MealType | 'all'>('all');
  const [metricType, setMetricType] = useState<MetricType>('cg');

  // Calculate date range
  const { startDate, endDate } = useMemo(() => {
    const end = new Date();
    let start = new Date();

    if (dateRange === 'week') {
      start.setDate(end.getDate() - 7);
    } else if (dateRange === 'month') {
      start.setDate(end.getDate() - 30);
    } else {
      // 'all' - get earliest date from history
      if (history.length > 0) {
        const timestamps = history.map(h => h.timestamp);
        start = new Date(Math.min(...timestamps));
      }
    }

    return { startDate: start, endDate: end };
  }, [dateRange, history]);

  // Get chart data
  const chartData = useMemo(() => {
    return getChartData(
      startDate,
      endDate,
      mealTypeFilter
    );
  }, [getChartData, startDate, endDate, mealTypeFilter]);

  // Get statistics
  const stats = useMemo(() => getStats(), [getStats]);

  // Aggregate data by date for line chart
  const aggregatedData = useMemo(() => {
    const dataByDate = new Map<string, { date: string; cg: number; kcal: number; carbs: number; count: number }>();

    chartData.forEach(point => {
      const existing = dataByDate.get(point.date);
      if (existing) {
        existing.cg += point.cg;
        existing.kcal += point.kcal;
        existing.carbs += point.carbs;
        existing.count += 1;
      } else {
        dataByDate.set(point.date, {
          date: point.date,
          cg: point.cg,
          kcal: point.kcal,
          carbs: point.carbs,
          count: 1
        });
      }
    });

    return Array.from(dataByDate.values())
      .sort((a, b) => a.date.localeCompare(b.date))
      .map(d => ({
        date: d.date,
        cg: Math.round(d.cg),
        kcal: Math.round(d.kcal),
        carbs: Math.round(d.carbs)
      }));
  }, [chartData]);

  // Data for meal type distribution pie chart
  const mealTypeData = useMemo(() => {
    return [
      { name: 'Desayuno', value: stats.mealsByType.Desayuno },
      { name: 'Merienda', value: stats.mealsByType.Merienda },
      { name: 'Comida', value: stats.mealsByType.Comida },
      { name: 'Cena', value: stats.mealsByType.Cena }
    ].filter(item => item.value > 0);
  }, [stats]);

  if (isLoading) {
    return (
      <div className={`bg-white rounded-lg shadow-md border border-green-100 p-6 ${className}`}>
        <div className="text-center py-8">
          <div className="text-4xl animate-spin mb-4">⭕</div>
          <p className="text-gray-600">Cargando historial...</p>
        </div>
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className={`bg-white rounded-lg shadow-md border border-green-100 p-6 ${className}`}>
        <h3 className="text-lg font-semibold text-green-700 mb-4 flex items-center gap-2">
          <span>📊</span>
          Gráficos de Progreso
        </h3>
        <div className="text-center py-8 text-gray-500">
          <div className="text-4xl mb-4">📈</div>
          <p className="font-semibold">No hay datos de historial</p>
          <p className="text-sm mt-2">Guarda tus comidas para ver gráficos de progreso</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-md border border-green-100 p-4 sm:p-6 ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h3 className="text-lg font-semibold text-green-700 flex items-center gap-2">
          <span>📊</span>
          Gráficos de Progreso
        </h3>

        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          <Select value={dateRange} onValueChange={(v: DateRange) => setDateRange(v)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Última semana</SelectItem>
              <SelectItem value="month">Último mes</SelectItem>
              <SelectItem value="all">Todo</SelectItem>
            </SelectContent>
          </Select>

          <Select value={mealTypeFilter} onValueChange={(v: MealType | 'all') => setMealTypeFilter(v)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="Desayuno">Desayuno</SelectItem>
              <SelectItem value="Merienda">Merienda</SelectItem>
              <SelectItem value="Comida">Comida</SelectItem>
              <SelectItem value="Cena">Cena</SelectItem>
            </SelectContent>
          </Select>

          <Select value={metricType} onValueChange={(v: MetricType) => setMetricType(v)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cg">Carga Glucémica</SelectItem>
              <SelectItem value="kcal">Calorías</SelectItem>
              <SelectItem value="carbs">Carbohidratos</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
          <div className="text-xs text-blue-600 font-semibold mb-1">Total Comidas</div>
          <div className="text-2xl font-bold text-blue-700">{stats.totalMeals}</div>
        </div>
        <div className="bg-orange-50 rounded-lg p-3 border border-orange-200">
          <div className="text-xs text-orange-600 font-semibold mb-1">CG Promedio</div>
          <div className="text-2xl font-bold text-orange-700">{stats.avgCG.toFixed(1)}</div>
        </div>
        <div className="bg-green-50 rounded-lg p-3 border border-green-200">
          <div className="text-xs text-green-600 font-semibold mb-1">Kcal Promedio</div>
          <div className="text-2xl font-bold text-green-700">{stats.avgKcal.toFixed(0)}</div>
        </div>
        <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
          <div className="text-xs text-purple-600 font-semibold mb-1">Carbs Promedio</div>
          <div className="text-2xl font-bold text-purple-700">{stats.avgCarbs.toFixed(1)}g</div>
        </div>
      </div>

      {/* Charts */}
      <div className="space-y-6">
        {/* Line Chart - Temporal Evolution */}
        {aggregatedData.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-3">
              Evolución Temporal - {metricType === 'cg' ? 'Carga Glucémica' : metricType === 'kcal' ? 'Calorías' : 'Carbohidratos'}
            </h4>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={aggregatedData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="date" 
                  stroke="#6b7280"
                  tick={{ fontSize: 12 }}
                />
                <YAxis stroke="#6b7280" tick={{ fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey={metricType} 
                  stroke={COLORS[metricType]} 
                  strokeWidth={2}
                  dot={{ fill: COLORS[metricType], r: 4 }}
                  name={metricType === 'cg' ? 'CG' : metricType === 'kcal' ? 'Kcal' : 'Carbs (g)'}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Bar Chart - By Meal Type */}
        {mealTypeData.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-3">
                Distribución por Tipo de Comida
              </h4>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={mealTypeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" stroke="#6b7280" tick={{ fontSize: 12 }} />
                  <YAxis stroke="#6b7280" tick={{ fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="value" fill="#3b82f6" name="Cantidad">
                    {mealTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[entry.name as MealType]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Pie Chart */}
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-3">
                Proporción de Comidas
              </h4>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={mealTypeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#3b82f6"
                    dataKey="value"
                  >
                    {mealTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[entry.name as MealType]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="mt-6 pt-4 border-t text-xs text-gray-500 text-center">
        Mostrando {chartData.length} comidas del {startDate.toLocaleDateString()} al {endDate.toLocaleDateString()}
      </div>
    </div>
  );
}
