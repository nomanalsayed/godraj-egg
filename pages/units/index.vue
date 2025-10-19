<template>
  <div>
    <h1 class="text-3xl font-bold mb-6">Farm Units</h1>

    <div class="bg-white p-6 rounded-lg shadow-lg">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-2xl font-bold text-gray-700">All Units</h2>
        <div class="flex items-center gap-4">
          <select v-model="filterStatus" class="form-select">
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <button @click="openAddUnitModal" class="btn btn-primary whitespace-nowrap">Add Unit</button>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit Name</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Houses</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="unit in filteredUnits" :key="unit.id">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ unit.name }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <span :class="statusBadge(unit.status)" class="px-2 py-1 text-xs font-semibold rounded-full">{{ unit.status }}</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ unit.houses }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button @click="openEditUnitModal(unit)" class="text-blue-600 hover:text-blue-900">Edit</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Add/Edit Unit Modal -->
    <div v-if="showUnitModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 class="text-xl font-bold mb-4">{{ isCreateMode ? 'Add New Unit' : 'Edit Unit' }}</h3>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Unit Name</label>
            <input v-model="unitForm.name" type="text" class="form-input" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Status</label>
            <select v-model="unitForm.status" class="form-select">
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
        <div class="mt-6 flex justify-end gap-3">
          <button @click="showUnitModal = false" class="btn btn-secondary">Cancel</button>
          <button @click="handleSaveUnit" class="btn btn-primary">Save</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, computed } from 'vue'

interface Unit {
  id: string;
  name: string;
  status: string;
  houses: number;
  running: number;
  available: number;
}

const units = ref<Unit[]>([])
const filterStatus = ref('all')

const filteredUnits = computed(() => {
  if (filterStatus.value === 'all') {
    return units.value
  }
  return units.value.filter(u => u.status === filterStatus.value)
})

const showUnitModal = ref(false)
const isCreateMode = ref(false)
const unitForm = reactive<Partial<Unit>>({
  name: '',
  status: 'active'
})

const fetchUnits = async () => {
  try {
    const response = await $fetch<{ data: Unit[] }>('/api/units')
    units.value = response.data
  } catch (e) {
    console.error('Failed to fetch units', e)
  }
}

onMounted(fetchUnits)

const openAddUnitModal = () => {
  isCreateMode.value = true
  Object.assign(unitForm, { name: '', status: 'active' })
  showUnitModal.value = true
}

const openEditUnitModal = (unit: Unit) => {
  isCreateMode.value = false
  try {
    Object.assign(unitForm, JSON.parse(JSON.stringify(unit)))
  } catch (e) {
    console.error('Error in openEditUnitModal:', e)
  }
  showUnitModal.value = true
}

const handleSaveUnit = async () => {
  try {
    const url = isCreateMode.value ? '/api/units' : `/api/units/${unitForm.id}`
    const method = isCreateMode.value ? 'POST' : 'PUT'
    const response = await $fetch<{ data: Unit }>(url, { method, body: unitForm })
    console.log('response:', response)

    if (isCreateMode.value) {
      units.value = [...units.value, response.data]
    } else {
      const index = units.value.findIndex(u => u.id === response.data.id)
      if (index !== -1) {
        units.value[index] = response.data
      }
    }

    showUnitModal.value = false
  } catch (e) {
    console.error('Save failed', e)
  }
}

const statusBadge = (status: string) => {
  const classes: Record<string, string> = {
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-red-100 text-red-800',
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

useHead({ title: 'Farm Units' })
</script>

<style scoped>
.form-input, .form-select {
  @apply block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md;
}
.btn {
    @apply inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2;
}
.btn-primary {
    @apply bg-blue-600 hover:bg-blue-700 focus:ring-blue-500;
}
.btn-secondary {
    @apply bg-gray-600 hover:bg-gray-700 focus:ring-gray-500 text-white;
}
</style>
