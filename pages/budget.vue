<template>
  <div>
    <h1 class="text-3xl font-bold mb-6">Budget & Variance</h1>

    <div class="bg-white p-6 rounded-lg shadow mb-6">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-2xl font-bold">Budget vs Actuals Variance Analysis</h2>
        <div class="flex items-center gap-4">
          <button class="btn btn-primary">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
            Upload SAP Actuals
          </button>
        </div>
      </div>

      <div class="overflow-x-auto mb-6">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th v-for="header in headers" :key="header" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{{ header }}</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="item in budgetData" :key="item.category">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ item.category }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ item.budget.toLocaleString() }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ item.actual.toLocaleString() }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm" :class="getVariance(item).class">{{ getVariance(item).value.toLocaleString() }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm" :class="getVariance(item).class">{{ getVariance(item).percentage.toFixed(2) }}%</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                <span :class="getStatus(getVariance(item).percentage).class" class="px-2 py-1 text-xs font-semibold rounded-full">{{ getStatus(getVariance(item).percentage).text }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="bg-gray-50 p-4 rounded-lg h-96 flex flex-col">
          <h3 class="text-lg font-semibold mb-2">Budget vs Actual Comparison</h3>
          <div class="flex-1">
            <Bar :data="barChartData" :options="chartOptions" />
          </div>
        </div>
        <div class="bg-gray-50 p-4 rounded-lg h-96 flex flex-col">
          <h3 class="text-lg font-semibold mb-2">Cost Breakdown</h3>
          <div class="flex-1">
            <Pie :data="pieChartData" :options="chartOptions" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Bar, Pie } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement)

const { data: apiData } = await useFetch('/api/budget')

const budgetData = computed(() => apiData.value?.data || [])

const headers = ['Category', 'Budget', 'Actual', 'Variance', 'Variance %', 'Status']

const getVariance = (item: any) => {
  const variance = item.actual - item.budget
  const percentage = (variance / item.budget) * 100
  return {
    value: variance,
    percentage: percentage,
    class: variance > 0 ? 'text-green-600' : 'text-red-600'
  }
}

const getStatus = (percentage: number) => {
  if (Math.abs(percentage) < 5) {
    return { text: 'On Track', class: 'bg-green-100 text-green-800' }
  } else if (Math.abs(percentage) < 10) {
    return { text: 'Warning', class: 'bg-yellow-100 text-yellow-800' }
  } else {
    return { text: 'Alert', class: 'bg-red-100 text-red-800' }
  }
}

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false
}

const barChartData = computed(() => ({
  labels: budgetData.value.map((item: any) => item.category),
  datasets: [
    {
      label: 'Budget',
      backgroundColor: '#4A5568',
      data: budgetData.value.map((item: any) => item.budget)
    },
    {
      label: 'Actual',
      backgroundColor: '#2563EB',
      data: budgetData.value.map((item: any) => item.actual)
    }
  ]
}))

const pieChartData = computed(() => ({
  labels: budgetData.value.filter((item: any) => item.category.includes('Cost')).map((item: any) => item.category),
  datasets: [
    {
      backgroundColor: ['#4A5568', '#718096', '#A0AEC0', '#CBD5E0'],
      data: budgetData.value.filter((item: any) => item.category.includes('Cost')).map((item: any) => item.actual)
    }
  ]
}))

useHead({
  title: 'Budget & Variance - Godrej Egg',
  meta: [
    { name: 'description', content: 'Budget vs actuals variance analysis' }
  ]
})
</script>

<style scoped>
.btn {
    @apply inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white;
}
.btn-primary {
    @apply bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500;
}
</style>
