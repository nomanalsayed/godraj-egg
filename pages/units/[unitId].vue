<template>
  <div>
    <div v-if="unit">
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-3xl font-bold mb-2">{{ unit.name }}</h1>
          <span :class="statusBadge(unit.status)" class="px-2 py-1 text-xs font-semibold rounded-full">{{ unit.status }}</span>
        </div>
        <div class="flex gap-4">
          <button @click="openEditUnitModal" class="btn btn-secondary">Edit</button>
          <button @click="handleDeleteUnit" class="btn btn-danger">Delete</button>
        </div>
      </div>

      <div class="mt-6">
        <div class="flex border-b border-gray-200">
          <button @click="activeTab = 'houses'" :class="{ 'border-b-2 border-blue-500': activeTab === 'houses' }" class="px-4 py-2 text-lg font-medium">Houses</button>
          <button @click="activeTab = 'placements'" :class="{ 'border-b-2 border-blue-500': activeTab === 'placements' }" class="px-4 py-2 text-lg font-medium">Placements</button>
        </div>

        <div v-if="activeTab === 'houses'" class="mt-4">
          <div class="bg-white p-6 rounded-lg shadow-lg">
            <div class="flex justify-between items-center mb-4">
              <h2 class="text-2xl font-bold text-gray-700">Houses in {{ unit.name }}</h2>
              <button @click="showLinkHouseModal = true" class="btn btn-primary">Link Houses</button>
            </div>
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200 text-sm">
                <thead class="bg-gray-100">
                  <tr>
                    <th class="px-4 py-2 text-left font-semibold text-gray-600">House</th>
                    <th class="px-4 py-2 text-left font-semibold text-gray-600">Capacity (PS)</th>
                    <th class="px-4 py-2 text-left font-semibold text-gray-600">Status</th>
                    <th class="px-4 py-2 text-left font-semibold text-gray-600">Availability</th>
                    <th class="px-4 py-2 text-left font-semibold text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="house in houses" :key="house.id">
                    <td class="px-4 py-2 font-medium">{{ house.label }}</td>
                    <td class="px-4 py-2">{{ house.capacity_ps }}</td>
                    <td class="px-4 py-2">
                      <span :class="statusBadge(house.status)" class="px-2 py-1 text-xs font-semibold rounded-full">{{ house.status }}</span>
                    </td>
                    <td class="px-4 py-2">{{ house.is_occupied_now ? 'Occupied' : 'Available' }}</td>
                    <td class="px-4 py-2">
                      <nuxt-link :to="`/houses/${house.id}`" class="text-blue-600 hover:underline">View</nuxt-link>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div v-if="activeTab === 'placements'" class="mt-4">
          <div class="bg-white p-6 rounded-lg shadow-lg">
            <h2 class="text-2xl font-bold text-gray-700 mb-4">Placements in {{ unit.name }}</h2>
            <!-- Placements table will be implemented here -->
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <p>Loading unit details...</p>
    </div>

    <!-- Feedback Message -->
    <div v-if="showFeedback" class="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg">
      Unit saved successfully!
    </div>

    <!-- Edit Unit Modal -->
    <div v-if="showEditUnitModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 class="text-xl font-bold mb-4">Edit Unit</h3>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Unit Name</label>
            <input v-model="unit.name" type="text" class="form-input" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Status</label>
            <select v-model="unit.status" class="form-select">
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          
          <!-- Linked Houses Section -->
          <div class="border-t pt-4 mt-4">
            <h4 class="text-lg font-bold mb-2">Linked Houses</h4>
            <div class="space-y-2">
              <div v-for="house in houses" :key="house.id" class="flex items-center justify-between bg-gray-100 p-2 rounded-md">
                <span>{{ house.label }}</span>
                <button @click="unlinkHouse(house.id)" class="text-red-500 hover:text-red-700">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
            </div>
            <div class="mt-4">
              <label class="block text-sm font-medium text-gray-700">Link New Houses</label>
              <select multiple v-model="selectedHousesToLink" class="form-multiselect">
                <option v-for="house in availableHouses" :key="house.id" :value="house.id">{{ house.label }}</option>
              </select>
            </div>
          </div>

        </div>
        <div class="mt-6 flex justify-end gap-3">
          <button @click="showEditUnitModal = false" class="btn btn-secondary">Cancel</button>
          <button @click="handleSaveUnit" class="btn btn-primary">Save</button>
        </div>
      </div>
    </div>

    <!-- Link House Modal -->
    <div v-if="showLinkHouseModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 class="text-xl font-bold mb-4">Link Houses to {{ unit.name }}</h3>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Select Houses</label>
            <select multiple v-model="selectedHouses" class="form-multiselect">
              <option v-for="house in allHouses" :key="house.id" :value="house.id">{{ house.label }}</option>
            </select>
          </div>
        </div>
        <div class="mt-6 flex justify-end gap-3">
          <button @click="showLinkHouseModal = false" class="btn btn-secondary">Cancel</button>
          <button @click="handleLinkHouses" class="btn btn-primary">Save</button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

interface Unit {
  id: string;
  name: string;
  status: string;
}

interface House {
  id: string;
  unit_id: string;
  label: string;
  capacity_ps: number;
  status: string;
  is_occupied_now: boolean;
}

const route = useRoute()
const router = useRouter()
const unitId = route.params.unitId as string

const unit = ref<Unit | null>(null)
const houses = ref<House[]>([])
const allHouses = ref<House[]>([])
const selectedHouses = ref<string[]>([])
const selectedHousesToLink = ref<string[]>([])
const activeTab = ref('houses')
const showLinkHouseModal = ref(false)
const showEditUnitModal = ref(false)
const showFeedback = ref(false)

const availableHouses = computed(() => {
  return allHouses.value.filter(house => !houses.value.some(linkedHouse => linkedHouse.id === house.id))
})

const fetchUnitDetails = async () => {
  try {
    const response = await $fetch<{ data: Unit }>(`/api/units/${unitId}`)
    unit.value = response.data
  } catch (e) {
    console.error('Failed to fetch unit details', e)
  }
}

const fetchHousesForUnit = async () => {
  try {
    const response = await $fetch<{ data: House[] }>(`/api/houses?unit_id=${unitId}`)
    houses.value = response.data
    selectedHouses.value = houses.value.map(h => h.id)
  } catch (e) {
    console.error('Failed to fetch houses for unit', e)
  }
}

const fetchAllHouses = async () => {
  try {
    const response = await $fetch<{ data: House[] }>('/api/houses')
    allHouses.value = response.data
  } catch (e) {
    console.error('Failed to fetch all houses', e)
  }
}

const openEditUnitModal = () => {
  showEditUnitModal.value = true
}

const handleSaveUnit = async () => {
  if (!unit.value) {
    return
  }
  try {
    const response = await $fetch<{ data: Unit }>(`/api/units/${unitId}`, { method: 'PUT', body: unit.value })
    unit.value = response.data

    // Handle linking new houses
    if (selectedHousesToLink.value.length > 0) {
      await $fetch(`/api/units/${unitId}/link-houses`, {
        method: 'POST',
        body: { house_ids: selectedHousesToLink.value }
      })
    }

    showEditUnitModal.value = false
    showFeedback.value = true
    setTimeout(() => {
      showFeedback.value = false
    }, 3000)
    fetchHousesForUnit() // Refresh linked houses
  } catch (e) {
    console.error('Save failed', e)
  }
}

const unlinkHouse = async (houseId: string) => {
  if (confirm('Are you sure you want to unlink this house?')) {
    try {
      await $fetch(`/api/houses/${houseId}/unlink`, { method: 'POST' })
      fetchHousesForUnit() // Refresh linked houses
    } catch (e) {
      console.error('Unlink failed', e)
    }
  }
}

const handleDeleteUnit = async () => {
  if (confirm('Are you sure you want to delete this unit?')) {
    try {
      await $fetch(`/api/units/${unitId}`, { method: 'DELETE' })
      router.push('/units')
    } catch (e) {
      console.error('Delete failed', e)
    }
  }
}

const handleLinkHouses = async () => {
  try {
    await $fetch(`/api/units/${unitId}/link-houses`, { 
      method: 'POST', 
      body: { house_ids: selectedHouses.value }
    })
    showLinkHouseModal.value = false
    fetchHousesForUnit()
  } catch (e) {
    console.error('Failed to link houses', e)
  }
}

onMounted(() => {
  fetchUnitDetails()
  fetchHousesForUnit()
  fetchAllHouses()
})

const statusBadge = (status: string) => {
  const classes: Record<string, string> = {
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-red-100 text-red-800',
    running: 'bg-blue-100 text-blue-800',
    available: 'bg-yellow-100 text-yellow-800',
    closed: 'bg-gray-100 text-gray-800',
    maintenance: 'bg-purple-100 text-purple-800',
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

useHead({ title: computed(() => unit.value?.name || 'Unit Details') })
</script>

<style scoped>
.form-multiselect {
    @apply block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm;
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
.btn-danger {
    @apply bg-red-600 hover:bg-red-700 focus:ring-red-500 text-white;
}
</style>