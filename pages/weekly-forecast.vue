<template>
  <div>
    <h1 class="text-3xl font-bold mb-6">
      Weekly DOC Forecast
    </h1>

    <div class="bg-white p-6 rounded-lg shadow mb-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Start Week</label>
          <input v-model.number="startWeek" type="number" min="1" :max="weekHeaders.length" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Number of Weeks</label>
          <input v-model.number="numWeeks" type="number" min="1" :max="weekHeaders.length" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
        </div>
        <div class="flex items-end">
          <button class="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" @click="updateDisplay">
            Update Display
          </button>
        </div>
      </div>
    </div>

    <div class="overflow-x-auto bg-white p-6 rounded-lg shadow">
      <table class="min-w-full divide-y divide-gray-200 text-xs">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-2 py-2 text-left font-medium text-gray-500 uppercase tracking-wider sticky left-0 bg-gray-50 z-10">
              Age (Weeks)
            </th>
            <th v-for="week in displayedWeeks" :key="week" class="px-2 py-2 text-center font-medium text-gray-500 uppercase tracking-wider">
              {{ week }}
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="(rowData, age) in displayedData" :key="age">
            <td class="px-2 py-2 whitespace-nowrap font-medium text-gray-900 sticky left-0 bg-white z-10">
              {{ age }}
            </td>
            <td v-for="(value, index) in rowData" :key="index" class="px-2 py-2 whitespace-nowrap text-center" :class="value > 0 ? 'text-green-600 font-semibold' : 'text-gray-500'">
              {{ value === 0 ? '-' : value.toLocaleString() }}
            </td>
          </tr>
        </tbody>
        <tfoot class="bg-gray-100 font-bold">
          <tr class="total-row">
            <td class="px-2 py-2 whitespace-nowrap sticky left-0 bg-gray-100 z-10">
              TOTAL
            </td>
            <td v-for="(total, index) in totals" :key="index" class="px-2 py-2 whitespace-nowrap text-center">
              {{ total > 0 ? total.toLocaleString() : '-' }}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
const { data: forecastApiData } = await useFetch<WeeklyForecastData>('/api/weekly-forecast')

const weekHeaders = computed(() => forecastApiData.value?.weekHeaders || [])
const parentStockData = computed(() => forecastApiData.value?.parentStockData || {})

const startWeek = ref(1)
const numWeeks = ref(52)

const displayedWeeks = ref<string[]>([])
const displayedData = ref<Record<string, number[]>>({})
const totals = ref<number[]>([])

const updateDisplay = () => {
  const startIndex = startWeek.value - 1
  const endIndex = Math.min(startIndex + numWeeks.value, weekHeaders.value.length)

  displayedWeeks.value = weekHeaders.value.slice(startIndex, endIndex)

  const newDisplayedData: Record<string, number[]> = {}
  const ages = Object.keys(parentStockData.value).sort((a, b) => parseInt(a) - parseInt(b))

  ages.forEach((age) => {
    const rowData = parentStockData.value[age].slice(startIndex, endIndex)
    newDisplayedData[age] = rowData
  })
  displayedData.value = newDisplayedData

  const newTotals: number[] = []
  for (let i = 0; i < displayedWeeks.value.length; i++) {
    let total = 0
    ages.forEach((age) => {
      const weekData = parentStockData.value[age]
      if (weekData && weekData[startIndex + i]) {
        total += weekData[startIndex + i]
      }
    })
    newTotals.push(total)
  }
  totals.value = newTotals
}

onMounted(() => {
  updateDisplay()
})

watch([startWeek, numWeeks], () => {
  updateDisplay()
})

useHead({
  title: 'Weekly Forecast - Godrej Egg',
  meta: [
    { name: 'description', content: 'Weekly parent stock and egg production forecast' }
  ]
})
</script>

<style scoped>
.total-row {
    background-color: #dbeafe !important;
    font-weight: 700;
    border-top: 2px solid #2563eb;
}
</style>
