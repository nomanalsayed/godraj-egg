<template>
  <div>
    <div class="mb-6">
      <NuxtLink to="/" class="text-blue-600 hover:text-blue-800 flex items-center gap-2">
        ← Back to Dashboard
      </NuxtLink>
    </div>

    <h1 class="text-3xl font-bold mb-6">
      Analytics Dashboard
    </h1>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div class="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-lg shadow-lg">
        <h3 class="text-sm font-semibold opacity-90 mb-2">
          Total Birds
        </h3>
        <p class="text-3xl font-bold">
          {{ analytics.totalBirds.toLocaleString() }}
        </p>
        <p class="text-xs opacity-75 mt-1">
          All age groups
        </p>
      </div>

      <div class="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-lg shadow-lg">
        <h3 class="text-sm font-semibold opacity-90 mb-2">
          Laying Birds
        </h3>
        <p class="text-3xl font-bold">
          {{ analytics.layingBirds.toLocaleString() }}
        </p>
        <p class="text-xs opacity-75 mt-1">
          Age 24-65 weeks
        </p>
      </div>

      <div class="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-lg shadow-lg">
        <h3 class="text-sm font-semibold opacity-90 mb-2">
          Peak Production
        </h3>
        <p class="text-3xl font-bold">
          {{ analytics.peakBirds.toLocaleString() }}
        </p>
        <p class="text-xs opacity-75 mt-1">
          Age 30-45 weeks
        </p>
      </div>

      <div class="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-6 rounded-lg shadow-lg">
        <h3 class="text-sm font-semibold opacity-90 mb-2">
          Avg Age
        </h3>
        <p class="text-3xl font-bold">
          {{ analytics.avgAge.toFixed(1) }}
        </p>
        <p class="text-xs opacity-75 mt-1">
          weeks
        </p>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <div class="bg-white p-6 rounded-lg shadow">
        <h2 class="text-xl font-bold mb-4">
          Age Distribution
        </h2>
        <div class="space-y-3">
          <div v-for="dist in ageDistribution" :key="dist.category" class="flex items-center">
            <div class="w-32 text-sm font-medium text-gray-700">
              {{ dist.category }}
            </div>
            <div class="flex-1 bg-gray-200 rounded-full h-6 relative overflow-hidden">
              <div
                class="h-full rounded-full transition-all duration-500"
                :class="dist.color"
                :style="{ width: dist.percentage + '%' }"
              />
              <span class="absolute inset-0 flex items-center justify-center text-xs font-semibold text-gray-700">
                {{ dist.birds.toLocaleString() }} ({{ dist.percentage.toFixed(1) }}%)
              </span>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-lg shadow">
        <h2 class="text-xl font-bold mb-4">
          Stock Type Breakdown
        </h2>
        <div class="space-y-3">
          <div v-for="type in stockTypes" :key="type.type" class="flex items-center">
            <div class="w-32 text-sm font-medium text-gray-700">
              {{ type.type }}
            </div>
            <div class="flex-1 bg-gray-200 rounded-full h-6 relative overflow-hidden">
              <div
                class="h-full bg-blue-500 rounded-full transition-all duration-500"
                :style="{ width: type.percentage + '%' }"
              />
              <span class="absolute inset-0 flex items-center justify-center text-xs font-semibold text-gray-700">
                {{ type.birds.toLocaleString() }} ({{ type.percentage.toFixed(1) }}%)
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="bg-white p-6 rounded-lg shadow mb-6">
      <h2 class="text-xl font-bold mb-4">
        Weekly Stock Summary
      </h2>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Week Date
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Birds
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Laying Birds
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Avg Age
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Est. Production
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="week in weeklySummary.slice(0, 10)" :key="week.week_date">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {{ week.week_date }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ week.total_birds.toLocaleString() }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ week.laying_birds.toLocaleString() }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ week.avg_age.toFixed(1) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                {{ week.est_production.toLocaleString() }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="bg-white p-6 rounded-lg shadow">
      <h2 class="text-xl font-bold mb-4">
        Key Insights
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="border-l-4 border-blue-500 pl-4 py-2">
          <h3 class="font-semibold text-gray-800">
            Production Capacity
          </h3>
          <p class="text-sm text-gray-600 mt-1">
            {{ ((analytics.layingBirds / analytics.totalBirds) * 100).toFixed(1) }}% of total flock is in laying phase
          </p>
        </div>

        <div class="border-l-4 border-green-500 pl-4 py-2">
          <h3 class="font-semibold text-gray-800">
            Peak Performance
          </h3>
          <p class="text-sm text-gray-600 mt-1">
            {{ ((analytics.peakBirds / analytics.totalBirds) * 100).toFixed(1) }}% of flock is at peak production age
          </p>
        </div>

        <div class="border-l-4 border-purple-500 pl-4 py-2">
          <h3 class="font-semibold text-gray-800">
            Flock Health
          </h3>
          <p class="text-sm text-gray-600 mt-1">
            Average age of {{ analytics.avgAge.toFixed(1) }} weeks indicates {{ analytics.avgAge < 40 ? 'young' : analytics.avgAge < 55 ? 'mature' : 'aging' }} flock
          </p>
        </div>

        <div class="border-l-4 border-orange-500 pl-4 py-2">
          <h3 class="font-semibold text-gray-800">
            Replacement Planning
          </h3>
          <p class="text-sm text-gray-600 mt-1">
            {{ analytics.oldBirds.toLocaleString() }} birds over 55 weeks may need replacement soon
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { data: stockData } = await useFetch<{ data: ParentStock[] }>('/api/parent-stock')

const parentStock = computed(() => stockData.value?.data || [])

const analytics = computed(() => {
  const stock = parentStock.value

  const totalBirds = stock.reduce((sum: number, item: any) => sum + (item.birds || 0), 0)

  const layingBirds = stock
    .filter((item: any) => item.age >= 24 && item.age <= 65)
    .reduce((sum: number, item: any) => sum + (item.birds || 0), 0)

  const peakBirds = stock
    .filter((item: any) => item.age >= 30 && item.age <= 45)
    .reduce((sum: number, item: any) => sum + (item.birds || 0), 0)

  const oldBirds = stock
    .filter((item: any) => item.age > 55)
    .reduce((sum: number, item: any) => sum + (item.birds || 0), 0)

  const weightedAge = stock.reduce((sum: number, item: any) =>
    sum + (item.age * (item.birds || 0)), 0)
  const avgAge = totalBirds > 0 ? weightedAge / totalBirds : 0

  return {
    totalBirds,
    layingBirds,
    peakBirds,
    oldBirds,
    avgAge
  }
})

const ageDistribution = computed(() => {
  const stock = parentStock.value
  const total = analytics.value.totalBirds

  const categories = [
    { category: 'Young (0-23)', min: 0, max: 23, color: 'bg-yellow-400' },
    { category: 'Ramp-up (24-30)', min: 24, max: 30, color: 'bg-orange-400' },
    { category: 'Peak (31-45)', min: 31, max: 45, color: 'bg-green-500' },
    { category: 'Mature (46-55)', min: 46, max: 55, color: 'bg-blue-500' },
    { category: 'Declining (56+)', min: 56, max: 999, color: 'bg-red-500' }
  ]

  return categories.map((cat) => {
    const birds = stock
      .filter((item: any) => item.age >= cat.min && item.age <= cat.max)
      .reduce((sum: number, item: any) => sum + (item.birds || 0), 0)

    return {
      ...cat,
      birds,
      percentage: total > 0 ? (birds / total) * 100 : 0
    }
  })
})

const stockTypes = computed(() => {
  const stock = parentStock.value
  const total = analytics.value.totalBirds

  const types = stock.reduce((acc: any, item: any) => {
    const type = item.stock_type || 'Unknown'
    if (!acc[type]) {
      acc[type] = 0
    }
    acc[type] += item.birds || 0
    return acc
  }, {})

  return Object.entries(types).map(([type, birds]: [string, any]) => ({
    type,
    birds,
    percentage: total > 0 ? (birds / total) * 100 : 0
  }))
})

const weeklySummary = computed(() => {
  const stock = parentStock.value
  const weekMap = new Map()

  stock.forEach((item: any) => {
    const week = item.week_date
    if (!weekMap.has(week)) {
      weekMap.set(week, {
        week_date: week,
        total_birds: 0,
        laying_birds: 0,
        weighted_age: 0,
        est_production: 0
      })
    }

    const weekData = weekMap.get(week)
    const birds = item.birds || 0
    weekData.total_birds += birds
    weekData.weighted_age += item.age * birds

    if (item.age >= 24 && item.age <= 65) {
      weekData.laying_birds += birds
      // Simplified production estimate
      const rate = item.age >= 30 && item.age <= 45 ? 0.9 : 0.6
      weekData.est_production += Math.round(birds * rate * 7)
    }
  })

  return Array.from(weekMap.values())
    .map(week => ({
      ...week,
      avg_age: week.total_birds > 0 ? week.weighted_age / week.total_birds : 0
    }))
    .sort((a, b) => b.week_date.localeCompare(a.week_date))
})

useHead({
  title: 'Analytics - Godrej Egg',
  meta: [
    { name: 'description', content: 'Production analytics and insights' }
  ]
})
</script>
