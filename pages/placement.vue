<template>
  <div>
    <h1 class="text-3xl font-bold mb-6">Placement Schedule</h1>

    <div class="bg-white p-6 rounded-lg shadow mb-6">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-2xl font-bold">PS Placement Schedule FY'26</h2>
        <div class="flex items-center gap-4">
          <select v-model="statusFilter" class="form-select">
            <option value="">All Status</option>
            <option value="running">Running</option>
            <option value="closed">Closed</option>
            <option value="ready">Ready for Next Cycle</option>
          </select>
          <button class="btn btn-primary">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
            Add Placement
          </button>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th v-for="header in headers" :key="header" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{{ header }}</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="item in filteredSchedule" :key="item.in_date">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                <span :class="statusBadge(item.status)">{{ item.unit_status }}</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ item.ps_quantity }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ item.actual_quantity }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ item.in_date }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ item.lay_date }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ item.cull_date }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ item.ready_date }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ item.gap_weeks }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ item.remarks }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { data: scheduleData } = await useFetch('/api/placement-schedule')

const schedule = computed(() => scheduleData.value?.data || [])
const statusFilter = ref('')

const headers = [
  'Unit Status',
  'PS Quantity',
  'Actual Quantity',
  'In',
  'Lay',
  'Cull',
  'Ready for Next Cycle',
  'Gap (weeks)',
  'Remarks'
]

const filteredSchedule = computed(() => {
  if (!statusFilter.value) {
    return schedule.value
  }
  return schedule.value.filter((item: any) => item.status === statusFilter.value)
})

const statusBadge = (status: string) => {
  const baseClasses = 'px-2 py-1 text-xs font-semibold rounded-full'
  switch (status) {
    case 'running':
      return `${baseClasses} bg-green-100 text-green-800`
    case 'closed':
      return `${baseClasses} bg-gray-100 text-gray-800`
    case 'ready':
      return `${baseClasses} bg-blue-100 text-blue-800`
    default:
      return `${baseClasses} bg-gray-100 text-gray-800`
  }
}

useHead({
  title: 'Placement Schedule - Godrej Egg',
  meta: [
    { name: 'description', content: 'Parent stock placement schedule' }
  ]
})
</script>

<style scoped>
.form-select {
  @apply block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md;
}
.btn {
    @apply inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white;
}
.btn-primary {
    @apply bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500;
}
</style>
