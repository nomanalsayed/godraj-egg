<template>
  <div>
    <h1 class="text-3xl font-bold mb-6">All Houses</h1>

    <div class="bg-white p-6 rounded-lg shadow-lg">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-2xl font-bold text-gray-700">All Houses</h2>
        <div class="flex items-center gap-4">
          <select v-model="filterUnit" class="form-select">
            <option value="all">All Units</option>
            <option v-for="unit in units" :key="unit.id" :value="unit.id">{{ unit.name }}</option>
          </select>
          <select v-model="filterStatus" class="form-select">
            <option value="all">All Statuses</option>
            <option value="available">Available</option>
            <option value="running">Running</option>
            <option value="closed">Closed</option>
            <option value="maintenance">Maintenance</option>
          </select>
          <button @click="openAddHouseModal" class="btn btn-primary whitespace-nowrap">Add House</button>
        </div>
      </div>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 text-sm">
          <thead class="bg-gray-100">
            <tr>
              <th class="px-4 py-2 text-left font-semibold text-gray-600">House</th>
              <th class="px-4 py-2 text-left font-semibold text-gray-600">Unit</th>
              <th class="px-4 py-2 text-left font-semibold text-gray-600">Capacity (PS)</th>
              <th class="px-4 py-2 text-left font-semibold text-gray-600">Status</th>
              <th class="px-4 py-2 text-left font-semibold text-gray-600">Availability</th>
              <th class="px-4 py-2 text-left font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="house in filteredHouses" :key="house.id">
              <td class="px-4 py-2 font-medium">{{ house.label }}</td>
              <td class="px-4 py-2">{{ getUnitName(house.unit_id) }}</td>
              <td class="px-4 py-2">{{ house.capacity_ps }}</td>
              <td class="px-4 py-2">
                <span :class="statusBadge(house.status)" class="px-2 py-1 text-xs font-semibold rounded-full">{{ house.status }}</span>
              </td>
              <td class="px-4 py-2">{{ house.is_occupied_now ? 'Occupied' : 'Available' }}</td>
              <td class="px-4 py-2">
                <button @click="openEditHouseModal(house)" class="text-blue-600 hover:text-blue-900">Edit</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Add/Edit House Modal -->
    <div v-if="showHouseModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 class="text-xl font-bold mb-4">{{ isCreateMode ? 'Add New House' : 'Edit House' }}</h3>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Label</label>
            <input v-model="houseForm.label" type="text" class="form-input" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Unit</label>
            <select v-model="houseForm.unit_id" class="form-select" :disabled="isEditMode">
              <option v-for="unit in units" :key="unit.id" :value="unit.id">{{ unit.name }}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Capacity (PS)</label>
            <input v-model.number="houseForm.capacity_ps" type="number" class="form-input" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Status</label>
            <select v-model="houseForm.status" class="form-select">
              <option value="available">Available</option>
              <option value="running">Running</option>
              <option value="closed">Closed</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>
        </div>
        <div class="mt-6 flex justify-end gap-3">
          <button @click="showHouseModal = false" class="btn btn-secondary">Cancel</button>
          <button @click="handleSaveHouse" class="btn btn-primary">Save</button>
        </div>
      </div>
    </div>

    <!-- Feedback Message -->
    <div v-if="showFeedback" class="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg">
      House saved successfully!
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, reactive } from 'vue'
import { useRouter } from 'vue-router'

interface Unit {
  id: string;
  name: string;
}

interface House {
  id: string;
  unit_id: string;
  label: string;
  capacity_ps: number;
  status: string;
  is_occupied_now: boolean;
}

const houses = ref<House[]>([])
const units = ref<Unit[]>([])
const filterUnit = ref('all')
const filterStatus = ref('all')

const filteredHouses = computed(() => {
  let filtered = houses.value

  if (filterUnit.value !== 'all') {
    filtered = filtered.filter(h => h.unit_id === filterUnit.value)
  }

  if (filterStatus.value !== 'all') {
    filtered = filtered.filter(h => h.status === filterStatus.value)
  }

  return filtered
})

const showHouseModal = ref(false)
const isCreateMode = ref(false)
const houseForm = reactive<Partial<House>>({
  unit_id: '',
  label: '',
  capacity_ps: 0,
  status: 'available'
})

const showFeedback = ref(false)

const fetchHouses = async () => {
  try {
    const response = await $fetch<{ data: House[] }>('/api/houses')
    houses.value = response.data
  } catch (e) {
    console.error('Failed to fetch houses', e)
  }
}

const fetchUnits = async () => {
  try {
    const response = await $fetch<{ data: Unit[] }>('/api/units')
    units.value = response.data
  } catch (e) {
    console.error('Failed to fetch units', e)
  }
}

const router = useRouter()

const goToHouse = (id: string) => {
  router.push(`/houses/${id}`)
}

const getUnitName = (unitId: string) => {
  const unit = units.value.find(u => u.id === unitId)
  return unit ? unit.name : 'N/A'
}

onMounted(() => {
  fetchHouses()
  fetchUnits()
})

const openAddHouseModal = () => {
  isCreateMode.value = true
  Object.assign(houseForm, { unit_id: '', label: '', capacity_ps: 0, status: 'available' })
  showHouseModal.value = true
}

const openEditHouseModal = (house: House) => {
  console.log('openEditHouseModal called with house:', house)
  isCreateMode.value = false
  houseForm.id = house.id
  houseForm.unit_id = house.unit_id
  houseForm.label = house.label
  houseForm.capacity_ps = house.capacity_ps
  houseForm.status = house.status
  showHouseModal.value = true
}

const handleSaveHouse = async () => {
  try {
    const url = isCreateMode.value ? '/api/houses' : `/api/houses/${houseForm.id}`
    const method = isCreateMode.value ? 'POST' : 'PUT'
    const response = await $fetch<{ data: House }>(url, { method, body: houseForm })

    if (isCreateMode.value) {
      houses.value.push(response.data)
    } else {
      const index = houses.value.findIndex(h => h.id === response.data.id)
      if (index !== -1) {
        houses.value[index] = response.data
      }
    }

    showHouseModal.value = false
    showFeedback.value = true
    setTimeout(() => {
      showFeedback.value = false
    }, 3000)
  } catch (e) {
    console.error('Save failed', e)
  }
}

const statusBadge = (status: string) => {
  const classes: Record<string, string> = {
    running: 'bg-blue-100 text-blue-800',
    available: 'bg-yellow-100 text-yellow-800',
    closed: 'bg-gray-100 text-gray-800',
    maintenance: 'bg-purple-100 text-purple-800',
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

useHead({ title: 'All Houses' })
</script>