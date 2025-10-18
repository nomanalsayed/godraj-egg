<template>
  <div>
    <h1 class="text-3xl font-bold mb-6">Production Summary</h1>

    <div class="bg-white p-6 rounded-lg shadow mb-6">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-2xl font-bold">Production Summary for Existing KBF</h2>
        <div class="flex items-center gap-4">
          <label>Year:</label>
          <select v-model="selectedYear" class="form-select">
            <option v-for="year in years" :key="year" :value="year">{{ year }}</option>
          </select>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th rowspan="2" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Month</th>
              <th colspan="5" class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">No of HE in Lac</th>
              <th rowspan="2" class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Hatchability %</th>
              <th colspan="5" class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">No of DOC in Lac</th>
            </tr>
            <tr>
              <th v-for="year in years" :key="`he-${year}`" class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">{{ year }}</th>
              <th v-for="year in years" :key="`doc-${year}`" class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">{{ year }}</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="row in summaryData" :key="row.month">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ row.month }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">{{ row.fy26_he }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">{{ row.fy27_he }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">{{ row.fy28_he }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">{{ row.fy29_he }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">{{ row.fy30_he }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-center text-blue-600 font-semibold">{{ row.hatchability }}%</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-center text-green-600 font-semibold">{{ row.fy26_doc }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-center text-green-600 font-semibold">{{ row.fy27_doc }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-center text-green-600 font-semibold">{{ row.fy28_doc }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-center text-green-600 font-semibold">{{ row.fy29_doc }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-center text-green-600 font-semibold">{{ row.fy30_doc }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { data: apiData } = await useFetch('/api/production-summary')

const summaryData = computed(() => apiData.value?.data || [])

const years = ['FY26', 'FY27', 'FY28', 'FY29', 'FY30']
const selectedYear = ref('FY26')

useHead({
  title: 'Production Summary - Godrej Egg',
  meta: [
    { name: 'description', content: 'Summary of egg and DOC production.' }
  ]
})
</script>

<style scoped>
.form-select {
  @apply block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md;
}
</style>
