<template>
  <div>
    <div v-if="house">
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-3xl font-bold mb-2">{{ house.label }}</h1>
          <p class="text-lg text-gray-500 mb-4">Unit: {{ unit.name }}</p>
          <span :class="statusBadge(house.status)" class="px-2 py-1 text-xs font-semibold rounded-full">{{ house.status }}</span>
        </div>
        <div class="flex gap-4">
          <button @click="openEditHouseModal" class="btn btn-secondary">Edit</button>
          <button @click="handleDeleteHouse" class="btn btn-danger">Delete</button>
        </div>
      </div>

      <div class="mt-6 bg-white p-6 rounded-lg shadow-lg">
        <h2 class="text-2xl font-bold text-gray-700 mb-4">House Details</h2>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <p class="text-sm text-gray-500">Capacity (PS)</p>
            <p class="text-lg font-semibold">{{ house.capacity_ps }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500">Availability</p>
            <p class="text-lg font-semibold">{{ house.is_occupied_now ? 'Occupied' : 'Available' }}</p>
          </div>
        </div>
      </div>

      <div class="mt-6 bg-white p-6 rounded-lg shadow-lg">
        <h2 class="text-2xl font-bold text-gray-700 mb-4">Placement Timeline</h2>
        <!-- Timeline will be implemented here -->
      </div>

    </div>
    <div v-else>
      <p>Loading house details...</p>
    </div>

    <!-- Edit House Modal -->
    <div v-if="showEditHouseModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 class="text-xl font-bold mb-4">Edit House</h3>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">House Label</label>
            <input v-model="houseForm.label" type="text" class="form-input" />
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
          <button @click="showEditHouseModal = false" class="btn btn-secondary">Cancel</button>
          <button @click="handleSaveHouse" class="btn btn-primary">Save</button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'

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

const route = useRoute()
const router = useRouter()
const houseId = route.params.houseId as string

const house = ref<House | null>(null)
const unit = ref<Unit | null>(null)
const showEditHouseModal = ref(false)

const houseForm = reactive<Partial<House>>({
  label: '',
  capacity_ps: 0,
  status: 'available'
})

const fetchHouseDetails = async () => {
  try {
    const response = await $fetch<{ data: House }>(`/api/houses/${houseId}`)
    house.value = response.data
    Object.assign(houseForm, structuredClone(house.value))
    if (house.value) {
      fetchUnitDetails(house.value.unit_id)
    }
  } catch (e) {
    console.error('Failed to fetch house details', e)
  }
}

const fetchUnitDetails = async (unitId: string) => {
  try {
    const response = await $fetch<{ data: Unit }>(`/api/units/${unitId}`)
    unit.value = response.data
  } catch (e) {
    console.error('Failed to fetch unit details', e)
  }
}

const openEditHouseModal = () => {
  showEditHouseModal.value = true
}

const handleSaveHouse = async () => {
  try {
    await $fetch(`/api/houses/${houseId}`, { method: 'PUT', body: houseForm })
    showEditHouseModal.value = false
    fetchHouseDetails()
  } catch (e) {
    console.error('Save failed', e)
  }
}

const handleDeleteHouse = async () => {
  if (confirm('Are you sure you want to delete this house?')) {
    try {
      await $fetch(`/api/houses/${houseId}`, { method: 'DELETE' })
      router.push('/houses')
    } catch (e) {
      console.error('Delete failed', e)
    }
  }
}

onMounted(fetchHouseDetails)

const statusBadge = (status: string) => {
  const classes: Record<string, string> = {
    running: 'bg-blue-100 text-blue-800',
    available: 'bg-yellow-100 text-yellow-800',
    closed: 'bg-gray-100 text-gray-800',
    maintenance: 'bg-purple-100 text-purple-800',
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

useHead({ title: computed(() => house.value?.label || 'House Details') })
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
.btn-danger {
    @apply bg-red-600 hover:bg-red-700 focus:ring-red-500 text-white;
}
</style>