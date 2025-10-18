<template>
  <div>
    <h1 class="text-3xl font-bold mb-6">Standards (LIRM)</h1>

    <div class="bg-white p-6 rounded-lg shadow mb-6">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-2xl font-bold">Standard LIRM (Layer In Rearing & Maturity)</h2>
        <div class="flex items-center gap-4">
<button 
  class="btn btn-primary" 
  @click="openEditor"
  v-if="userHasEditAccess"
>
  <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.536L16.732 3.732z"></path></svg>
  Edit Standards
</button>
<div v-if="showEditModal && editData.length" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
  <div class="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
    <div class="flex justify-between items-center mb-4">
      <h3 class="text-xl font-bold">Edit Standards</h3>
      <button @click="showEditModal = false" class="text-gray-500 hover:text-gray-700">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <div v-for="(item, index) in editData" :key="item.week" class="mb-6 p-4 border rounded">
      <h4 class="font-semibold mb-2">Week {{ item.week }}</h4>
          <div class="grid grid-cols-7 gap-4">
        <div v-for="(value, key) in item" :key="key" class="space-y-2">
          <label class="block text-sm font-medium text-gray-700" v-if="String(key) !== 'week'">
            {{ String(key).toUpperCase() }}
          </label>
            <input
              v-if="String(key) !== 'week'"
              :model-value="editData[index]?.[key]"
              @update:model-value="($event: string) => editData[index] && (editData[index][key] = parseFloat($event))"
              type="number"
              step="0.01"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
        </div>
      </div>
    </div>

    <div class="mt-6 flex justify-end gap-3">
      <button @click="showEditModal = false" class="btn bg-gray-200 text-gray-700 hover:bg-gray-300">
        Cancel
      </button>
      <button @click="saveStandards" class="btn btn-primary">
        Save Changes
      </button>
    </div>
  </div>
</div>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 text-xs">
          <thead class="bg-gray-50">
            <tr>
              <th v-for="header in headers" :key="header" class="px-3 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">{{ header }}</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="item in standardsData" :key="item.week">
              <td class="px-3 py-2 whitespace-nowrap font-medium text-gray-900">{{ item.week }}</td>
              <td class="px-3 py-2 whitespace-nowrap text-gray-500">{{ item.male }}</td>
              <td class="px-3 py-2 whitespace-nowrap text-gray-500">{{ item.female }}</td>
              <td class="px-3 py-2 whitespace-nowrap text-gray-500">{{ item.avg_fem }}</td>
              <td class="px-3 py-2 whitespace-nowrap text-gray-500">{{ item.m_house_ps }}%</td>
              <td class="px-3 py-2 whitespace-nowrap text-gray-500">{{ item.select_he }}%</td>
              <td class="px-3 py-2 whitespace-nowrap text-gray-500">{{ item.hhhe_ps1 }}</td>
              <td class="px-3 py-2 whitespace-nowrap text-gray-500">{{ item.hhhe_ps2 }}</td>
              <td class="px-3 py-2 whitespace-nowrap text-red-500">{{ item.depletion }}%</td>
              <td class="px-3 py-2 whitespace-nowrap text-red-500">{{ item.cumm_depl }}%</td>
              <td class="px-3 py-2 whitespace-nowrap text-green-600 font-semibold">{{ item.livability }}%</td>
              <td class="px-3 py-2 whitespace-nowrap text-gray-500">{{ item.hand_wk_he }}</td>
              <td class="px-3 py-2 whitespace-nowrap text-gray-500">{{ item.he_w_b }}</td>
              <td class="px-3 py-2 whitespace-nowrap text-blue-600 font-semibold">{{ item.hhhe_cumm }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface StandardData {
  week: number
  male: number
  female: number
  depletion: number
  livability: number
  hand_wk_he: number
  he_w_b: number
  hhhe_cumm: number
}

const showEditModal = ref(false)
const editData = ref<StandardData[]>([])
const user = useAuthUser()

const userHasEditAccess = computed(() => {
  console.log('Current user roles:', user.value?.roles)
  return user.value?.roles?.includes('Admin')
})

const { data: apiData } = await useFetch('/api/standards')

watch(apiData, (newData: { data: StandardData[] } | null) => {
  if (newData?.data) {
    editData.value = structuredClone(newData.data)
  }
}, { immediate: true })

const standardsData = computed(() => apiData.value?.data || [])

function openEditor() {
  if (!userHasEditAccess.value) {
    console.warn('Edit access requires Admin privileges')
    showEditModal.value = false
    return
    return
  }
  showEditModal.value = true
}

async function saveStandards() {
  if (!userHasEditAccess.value) {
    console.error('User lacks edit permissions')
    return
  }
  
  try {
    await $fetch('/api/standards', {
      method: 'PUT' as const,
      headers: {
        'Content-Type': 'application/json'
      },
      body: { data: editData.value }
    })
    showEditModal.value = false
    refreshNuxtData()
  } catch (error) {
    console.error('Error saving standards:', error)
  }
}

const headers = [
  'Week', 'Male', 'Female', 'Depletion %', 'Livability %', 'Hand wk. HE', 'HE/W/B', 'HHHE Cumulative'
]

useHead({
  title: 'Standards (LIRM) - Godrej Egg',
  meta: [
    { name: 'description', content: 'LIRM standards for egg production' }
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
