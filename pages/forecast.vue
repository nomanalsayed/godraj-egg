<template>
  <div>
    <div class="mb-6">
      <NuxtLink to="/" class="text-blue-600 hover:text-blue-800 flex items-center gap-2">
        ← Back to Dashboard
      </NuxtLink>
    </div>

    <h1 class="text-3xl font-bold mb-6">Egg Production Forecast</h1>

    <div class="bg-white p-6 rounded-lg shadow mb-6">
      <h2 class="text-2xl font-bold mb-4">Forecast Parameters</h2>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Start Week</label>
          <input 
            v-model="startWeek" 
            type="date" 
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Forecast Weeks</label>
          <input 
            v-model.number="forecastWeeks" 
            type="number" 
            min="1" 
            max="52" 
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div class="flex items-end">
          <button 
            @click="generateForecast" 
            class="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Generate Forecast
          </button>
        </div>
      </div>
    </div>

    <div v-if="forecastData.length > 0" class="bg-white p-6 rounded-lg shadow mb-6">
      <h2 class="text-2xl font-bold mb-4">Forecast Results</h2>
      
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div class="bg-blue-50 p-4 rounded-lg">
          <h3 class="text-sm font-semibold text-gray-600 mb-1">Total Forecast</h3>
          <p class="text-2xl font-bold text-blue-600">{{ totalForecast.toLocaleString() }}</p>
          <p class="text-xs text-gray-500">eggs</p>
        </div>
        
        <div class="bg-green-50 p-4 rounded-lg">
          <h3 class="text-sm font-semibold text-gray-600 mb-1">Avg Weekly</h3>
          <p class="text-2xl font-bold text-green-600">{{ avgWeekly.toLocaleString() }}</p>
          <p class="text-xs text-gray-500">eggs/week</p>
        </div>
        
        <div class="bg-purple-50 p-4 rounded-lg">
          <h3 class="text-sm font-semibold text-gray-600 mb-1">Peak Week</h3>
          <p class="text-2xl font-bold text-purple-600">{{ peakWeek.toLocaleString() }}</p>
          <p class="text-xs text-gray-500">eggs</p>
        </div>
        
        <div class="bg-orange-50 p-4 rounded-lg">
          <h3 class="text-sm font-semibold text-gray-600 mb-1">Active Birds</h3>
          <p class="text-2xl font-bold text-orange-600">{{ activeBirds.toLocaleString() }}</p>
          <p class="text-xs text-gray-500">birds</p>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Week</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Birds</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg Age</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Production Rate</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Forecast Eggs</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="(item, index) in forecastData" :key="index">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ index + 1 }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ item.week_date }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ item.total_birds.toLocaleString() }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ item.avg_age.toFixed(1) }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ (item.production_rate * 100).toFixed(1) }}%</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-semibold text-blue-600">{{ item.forecast_eggs.toLocaleString() }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-else class="bg-gray-50 p-12 rounded-lg text-center">
      <p class="text-gray-500 text-lg">Set parameters and click "Generate Forecast" to see predictions</p>
    </div>
  </div>
</template>

<script setup lang="ts">
const startWeek = ref('');
const forecastWeeks = ref(12);
const forecastData = ref<any[]>([]);

const { data: stockData } = await useFetch('/api/parent-stock');

const totalForecast = computed(() => {
  return forecastData.value.reduce((sum: number, item: any) => sum + item.forecast_eggs, 0);
});

const avgWeekly = computed(() => {
  return forecastData.value.length > 0 ? totalForecast.value / forecastData.value.length : 0;
});

const peakWeek = computed(() => {
  if (forecastData.value.length === 0) return 0;
  return Math.max(...forecastData.value.map((item: any) => item.forecast_eggs));
});

const activeBirds = computed(() => {
  if (forecastData.value.length === 0) return 0;
  return forecastData.value[0]?.total_birds || 0;
});

// Production rate curve based on age (simplified model)
const getProductionRate = (age: number): number => {
  if (age < 24) return 0; // Not yet laying
  if (age >= 24 && age <= 30) return 0.3 + ((age - 24) * 0.1); // Ramp up
  if (age > 30 && age <= 45) return 0.9; // Peak production
  if (age > 45 && age <= 55) return 0.9 - ((age - 45) * 0.03); // Gradual decline
  if (age > 55 && age <= 65) return 0.6 - ((age - 55) * 0.05); // Faster decline
  return 0.1; // End of lay
};

const generateForecast = () => {
  const parentStock = stockData.value?.data || [];
  
  if (parentStock.length === 0) {
    if (process.client) {
      (globalThis as any).alert('No parent stock data available')
    }
    return;
  }

  const forecast = [];
  const startDate = startWeek.value ? new Date(startWeek.value) : new Date();
  
  for (let week = 0; week < forecastWeeks.value; week++) {
    const weekDate = new Date(startDate);
    weekDate.setDate(weekDate.getDate() + (week * 7));
    
    // Calculate total birds and average age for this week
    let totalBirds = 0;
    let weightedAge = 0;
    
    parentStock.forEach((stock: any) => {
      const stockAge = stock.age + week;
      const birds = stock.birds || 0;
      
      if (stockAge >= 24 && stockAge <= 70) { // Only count laying birds
        totalBirds += birds;
        weightedAge += birds * stockAge;
      }
    });
    
    const avgAge = totalBirds > 0 ? weightedAge / totalBirds : 0;
    const productionRate = getProductionRate(avgAge);
    const forecastEggs = Math.round(totalBirds * productionRate * 7); // 7 days per week
    
    forecast.push({
      week_date: weekDate.toISOString().split('T')[0],
      total_birds: totalBirds,
      avg_age: avgAge,
      production_rate: productionRate,
      forecast_eggs: forecastEggs
    });
  }
  
  forecastData.value = forecast;
};

// Set default start week to today
onMounted(() => {
  const today = new Date();
  startWeek.value = today.toISOString().split('T')[0];
});

useHead({
  title: 'Production Forecast - Godrej Egg',
  meta: [
    { name: 'description', content: 'Egg production forecasting tool' }
  ]
});
</script>
