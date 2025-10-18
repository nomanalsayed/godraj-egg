<template>
  <div class="p-4">
    <h1 class="text-2xl mb-4">Production Reports</h1>
    
    <div v-if="pending" class="text-center p-8">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
    </div>

    <div v-else class="overflow-x-auto">
      <table class="w-full border-collapse">
        <thead>
          <tr class="bg-gray-100">
            <th class="p-2 border">Week Date</th>
            <th class="p-2 border">Age</th>
            <th class="p-2 border">Stock Count</th>
            <th class="p-2 border">Weekly Production</th>
            <th class="p-2 border">Adjusted Production</th>
            <th class="p-2 border">Weekly Depletion</th>
            <th class="p-2 border">Cumulative Depletion</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="report in reports" :key="report.week_date" class="hover:bg-gray-50">
            <td class="p-2 border">{{ report.week_date }}</td>
            <td class="p-2 border">{{ report.age }}</td>
            <td class="p-2 border">{{ report.stock_count }}</td>
            <td class="p-2 border">{{ report.weekly_production?.toFixed(2) }}</td>
            <td class="p-2 border">{{ report.adjusted_production?.toFixed(2) }}</td>
            <td class="p-2 border">{{ report.weekly_depletion?.toFixed(2) }}</td>
            <td class="p-2 border">{{ report.cumulative_depletion?.toFixed(2) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
const { data: reports, pending } = await useFetch('/api/reports')

const exportReport = (reportType: string) => {
  if (process.client) {
    (globalThis as any).alert(`Exporting ${reportType} report. (This is a placeholder)`)
  }
}

useHead({
  title: 'Reports - Godrej Egg',
  meta: [
    { name: 'description', content: 'Generate and export reports.' }
  ]
})
</script>
