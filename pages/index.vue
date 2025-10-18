<template>
  <div>
    
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div class="bg-white p-4 rounded-lg shadow">
        <h3 class="text-lg font-semibold mb-2">Total Parent Stock</h3>
        <p class="text-3xl font-bold text-blue-600">{{ totalParentStock }}</p>
      </div>
      
      <div class="bg-white p-4 rounded-lg shadow">
        <h3 class="text-lg font-semibold mb-2">Active Flocks</h3>
        <p class="text-3xl font-bold text-green-600">{{ activeFlocks }}</p>
      </div>
      
      <div class="bg-white p-4 rounded-lg shadow">
        <h3 class="text-lg font-semibold mb-2">Latest Week</h3>
        <p class="text-3xl font-bold text-purple-600">{{ latestWeek }}</p>
      </div>
    </div>

    <div class="bg-white p-6 rounded-lg shadow mb-6">
      <h2 class="text-2xl font-bold mb-4">Parent Stock by Age</h2>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Age (weeks)</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Week Date</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Birds</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="stock in displayedStock" :key="`${stock.age}-${stock.week_date}`">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ stock.age }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ stock.week_date }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ stock.birds?.toLocaleString() || 0 }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ stock.stock_type }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div class="mt-4 flex justify-between items-center">
        <button 
          @click="loadMore" 
          v-if="hasMore"
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Load More
        </button>
        <span class="text-sm text-gray-600">Showing {{ displayedStock.length }} of {{ totalRecords }} records</span>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <NuxtLink 
        to="/forecast" 
        class="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white p-6 rounded-lg shadow-lg text-center transition-all"
      >
        <h3 class="text-xl font-bold mb-2">📊 Production Forecast</h3>
        <p class="text-sm opacity-90">View and analyze egg production forecasts</p>
      </NuxtLink>
      
      <NuxtLink 
        to="/analytics" 
        class="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white p-6 rounded-lg shadow-lg text-center transition-all"
      >
        <h3 class="text-xl font-bold mb-2">📈 Analytics Dashboard</h3>
        <p class="text-sm opacity-90">Detailed analytics and insights</p>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
const { data: stockData, refresh } = await useFetch('/api/parent-stock');

const pageSize = 20;
const currentPage = ref(1);

const parentStock = computed(() => stockData.value?.data || []);

const totalParentStock = computed(() => {
  return parentStock.value.reduce((sum: number, item: any) => sum + (item.birds || 0), 0);
});

const activeFlocks = computed(() => {
  const uniqueAges = new Set(parentStock.value.map((item: any) => item.age));
  return uniqueAges.size;
});

const latestWeek = computed(() => {
  if (parentStock.value.length === 0) return 'N/A';
  const dates = parentStock.value.map((item: any) => item.week_date).filter(Boolean);
  return dates.length > 0 ? dates[dates.length - 1] : 'N/A';
});

const displayedStock = computed<Stock[]>(() => {
  return parentStock.value.slice(0, currentPage.value * pageSize);
});

const totalRecords = computed(() => parentStock.value.length);

const hasMore = computed(() => {
  return displayedStock.value.length < totalRecords.value;
});

const loadMore = () => {
  currentPage.value++;
};

useHead({
  title: 'Godrej Egg Production Forecasting',
  meta: [
    { name: 'description', content: 'Egg production forecasting and analytics dashboard' }
  ]
});
</script>
