<template>
  <div>
    <h1 class="text-3xl font-bold mb-6">PS Placement Schedule</h1>

    <!-- Main Content Area -->
    <div class="bg-white p-6 rounded-lg shadow-lg">
      <!-- Header: Filters & Actions -->
      <div class="mb-4">
        <div class="flex justify-between items-center mb-4">
            <h2 class="text-2xl font-bold text-gray-700">Placement Overview</h2>
            <div class="flex items-center gap-2">
                <button @click="showImportModal = true" class="btn btn-secondary">Import CSV</button>
                <button @click="exportCSV" class="btn btn-secondary">Export CSV</button>
                <button @click="openAddModal" class="btn btn-primary">Add Placement</button>
            </div>
        </div>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 border rounded-lg bg-gray-50">
            <input v-model="filters.fy" type="text" placeholder="Fiscal Year (e.g., FY26)" class="form-input" />
            <input v-model="filters.unit" type="text" placeholder="Unit Name" class="form-input" />
            <input v-model="filters.house" type="text" placeholder="House Name" class="form-input" />
            <select v-model="filters.status" class="form-select">
                <option value="">All Statuses</option>
                <option value="planned">Planned</option>
                <option value="running">Running</option>
                <option value="closed">Closed</option>
            </select>
        </div>
      </div>

      <!-- Timeline Visualization -->
      <div class="mb-8 p-4 border rounded-lg">
        <h3 class="text-xl font-bold mb-4">Timeline View</h3>
        <div class="timeline-container overflow-x-auto">
            <div class="timeline-header">
                <div v-for="month in timelineMonths" :key="month.name" class="timeline-month">{{ month.name }}</div>
            </div>
            <div v-for="group in groupedPlacements" :key="group.key" class="timeline-row">
                <div class="row-label">{{ group.key }}</div>
                <div class="row-bars">
                    <div v-for="p in group.placements" :key="p.id" 
                         class="timeline-bar-wrapper"
                         :style="{ left: getPosition(p.date_in), width: getWidth(p.date_in, p.date_ready_next) }">
                        <div :class="statusBadge(p.status)" class="timeline-bar">
                            <span class="timeline-tooltip">{{ p.remarks }} ({{ formatDate(p.date_in) }} - {{ formatDate(p.date_ready_next) }})</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>

      <!-- Data Table -->
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 text-xs">
          <thead class="bg-gray-100">
            <tr>
              <th class="px-4 py-2 text-left font-semibold text-gray-600">Unit & House</th>
              <th class="px-4 py-2 text-left font-semibold text-gray-600">PS Qty (Plan/Actual)</th>
              <th class="px-4 py-2 text-left font-semibold text-gray-600">In</th>
              <th class="px-4 py-2 text-left font-semibold text-gray-600">Lay</th>
              <th class="px-4 py-2 text-left font-semibold text-gray-600">Cull</th>
              <th class="px-4 py-2 text-left font-semibold text-gray-600">Ready for Next</th>
              <th class="px-4 py-2 text-left font-semibold text-gray-600">Gap (Wks)</th>
              <th class="px-4 py-2 text-left font-semibold text-gray-600">Remarks / Status</th>
              <th class="px-4 py-2 text-left font-semibold text-gray-600">Source/Origin</th>
              <th class="px-4 py-2 text-left font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-if="isLoading">...Loading</tr>
            <tr v-for="p in placements" :key="p.id">
              <td class="px-4 py-2 font-medium">{{ p.unit_name }} / {{ p.house_name }}</td>
              <td class="px-4 py-2">{{ p.ps_quantity_planned }} / {{ p.ps_quantity_actual || 'N/A' }}</td>
              <td class="px-4 py-2">{{ formatDate(p.date_in) }}</td>
              <td class="px-4 py-2">{{ formatDate(p.date_lay) }}</td>
              <td class="px-4 py-2">{{ formatDate(p.date_cull) }}</td>
              <td class="px-4 py-2">{{ formatDate(p.date_ready_next) }}</td>
              <td class="px-4 py-2 font-bold">{{ p.gap_weeks }}</td>
              <td class="px-4 py-2">
                <span :class="statusBadge(p.status)" class="px-2 py-1 text-xs font-semibold rounded-full">{{ p.status }}</span>
                <p class="text-gray-500">{{ p.remarks }}</p>
              </td>
              <td class="px-4 py-2">{{ p.origin }}</td>
              <td class="px-4 py-2 space-x-2">
                <button @click="openEditModal(p)" class="text-blue-500">Edit</button>
                <button @click="handleDelete(p.id)" class="text-red-500">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
       <!-- TODO: Add pagination controls -->
    </div>

    <!-- Add/Edit Modal -->
    <div v-if="showPlacementModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div class="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <h3 class="text-xl font-bold mb-4">{{ isCreateMode ? 'Add Placement' : 'Edit Placement' }}</h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div class="md:col-span-1">
                    <label class="block text-sm font-medium text-gray-700">Unit</label>
                    <select v-model="placementForm.unit_id" @change="onUnitChange" class="form-select">
                        <option v-for="unit in activeUnits" :key="unit.id" :value="unit.id">{{ unit.name }}</option>
                    </select>
                </div>
                <div class="md:col-span-1">
                    <label class="block text-sm font-medium text-gray-700">House</label>
                    <select v-model="placementForm.house_id" class="form-select">
                        <option v-for="house in houses" :key="house.id" :value="house.id">{{ house.label }}</option>
                    </select>
                </div>
                <input v-model="placementForm.fiscal_year" placeholder="Fiscal Year" class="form-input" />
                <input v-model.number="placementForm.ps_quantity_planned" type="number" placeholder="PS Qty Planned" class="form-input" />
                <input v-model.number="placementForm.ps_quantity_actual" type="number" placeholder="PS Qty Actual" class="form-input" />
                <input v-model="placementForm.date_in" type="date" placeholder="Date In" class="form-input" />
                <input v-model="placementForm.date_lay" type="date" placeholder="Date Lay" class="form-input" />
                <input v-model="placementForm.date_cull" type="date" placeholder="Date Cull" class="form-input" />
                <input v-model="placementForm.date_ready_next" type="date" placeholder="Date Ready Next" class="form-input" />
                <input v-model.number="placementForm.gap_weeks" type="number" placeholder="Gap Weeks" class="form-input" />
                <input v-model="placementForm.origin" placeholder="Origin" class="form-input" />
                <select v-model="placementForm.status" class="form-select">
                    <option value="planned">Planned</option>
                    <option value="running">Running</option>
                    <option value="closed">Closed</option>
                </select>
                <textarea v-model="placementForm.remarks" placeholder="Remarks" class="form-input md:col-span-3"></textarea>
            </div>
            <div class="mt-6 flex justify-end gap-3">
                <button @click="showPlacementModal = false" class="btn btn-secondary">Cancel</button>
                <button @click="handleSave" class="btn btn-primary">Save</button>
            </div>
        </div>
    </div>

    <!-- Import Modal -->
    <div v-if="showImportModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div class="bg-white rounded-lg p-8 max-w-xl w-full space-y-6">
            <div class="flex justify-between items-start">
                <h3 class="text-2xl font-bold text-gray-800">Import Placements CSV</h3>
                <button class="text-gray-500 hover:text-gray-700" @click="closeImportModal">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
            </div>

            <!-- Step 1 -->
            <div class="space-y-2">
                <h4 class="text-lg font-semibold text-gray-700">Step 1: Download Template</h4>
                <p class="text-sm text-gray-600">Download the sample CSV file and fill it with your data. Do not change the column headers.</p>
                <a href="/samples/placements.csv" download="placements_sample.csv" class="inline-flex items-center text-sm text-blue-600 hover:underline">
                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                    Download Sample CSV
                </a>
            </div>

            <hr/>

            <!-- Step 2 -->
            <div class="space-y-2">
                <h4 class="text-lg font-semibold text-gray-700">Step 2: Upload File</h4>
                <label for="file-upload" class="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                    <div class="w-full border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true"><path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>
                        <span class="mt-2 block text-sm font-medium">{{ selectedFile ? selectedFile.name : 'Click to select a file' }}</span>
                        <span class="mt-1 block text-xs text-gray-500">CSV up to 1MB</span>
                    </div>
                </label>
                <input id="file-upload" name="file-upload" type="file" class="sr-only" @change="onFileSelected" accept=".csv">
            </div>

            <!-- Feedback Area -->
            <div v-if="uploadStatus" class="p-4 rounded-md" :class="{'bg-red-100 text-red-700': uploadStatus.includes('failed'), 'bg-green-100 text-green-700': !uploadStatus.includes('failed')}">
                <p class="text-sm font-medium">{{ uploadStatus }}</p>
            </div>

            <!-- Footer -->
            <div class="mt-8 flex justify-end gap-3">
                <button class="btn btn-secondary" @click="closeImportModal">Cancel</button>
                <button @click="triggerFileUpload" :disabled="!selectedFile" class="btn btn-primary disabled:bg-gray-400 disabled:cursor-not-allowed">Upload File</button>
            </div>
        </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, onMounted, computed } from 'vue'

import Papa from 'papaparse'
import type { Placement } from '~/server/utils/db'

interface Unit {
  id: string;
  name: string;
  status: string;
}

interface House {
  id: string;
  unit_id: string;
  label: string;
}

const placements = ref<Placement[]>([])
const units = ref<Unit[]>([])
const activeUnits = computed(() => units.value.filter(u => u.status === 'active'))
const houses = ref<House[]>([])
const isLoading = ref(false)
const showPlacementModal = ref(false)
const showImportModal = ref(false)
const isCreateMode = ref(false)
const uploadStatus = ref('')
const selectedFile = ref<File | null>(null)

const placementForm = reactive<Partial<Placement>>({})

const filters = reactive({
  fy: 'FY26',
  unit: '',
  house: '',
  status: ''
})

// --- Timeline Computeds ---
const timelineRange = computed(() => {
    if (filters.fy === 'FY26') {
        return { start: new Date('2025-04-01'), end: new Date('2026-03-31') };
    }
    const start = new Date();
    start.setDate(1);
    start.setMonth(0);
    const end = new Date(start.getFullYear() + 1, 0, 0);
    return { start, end };
});

const totalTimelineDays = computed(() => {
    const diff = timelineRange.value.end.getTime() - timelineRange.value.start.getTime();
    return diff / (1000 * 60 * 60 * 24);
});

const timelineMonths = computed(() => {
    const months = [];
    let current = new Date(timelineRange.value.start);
    while (current < timelineRange.value.end) {
        months.push({ name: current.toLocaleString('default', { month: 'short' }) });
        current.setMonth(current.getMonth() + 1);
    }
    return months;
});

const groupedPlacements = computed(() => {
    const groups: Record<string, { key: string, placements: Placement[] }> = {};
    for (const p of placements.value) {
        const key = `${p.unit_name} / ${p.house_name}`;
        if (!groups[key]) {
            groups[key] = { key, placements: [] };
        }
        groups[key].placements.push(p);
    }
    return Object.values(groups);
});

const getPosition = (dateIn: string) => {
    if (!dateIn) return '0%';
    const startDate = new Date(dateIn);
    const offset = (startDate.getTime() - timelineRange.value.start.getTime()) / (1000 * 60 * 60 * 24);
    const percentage = (offset / totalTimelineDays.value) * 100;
    return `${Math.max(0, percentage)}%`;
};

const getWidth = (dateIn: string, dateReady: string | null | undefined) => {
    if (!dateIn || !dateReady) return '5%';
    const startDate = new Date(dateIn);
    const endDate = new Date(dateReady);
    const duration = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
    const percentage = (duration / totalTimelineDays.value) * 100;
    return `${Math.max(1, percentage)}%`;
};

// --- Core Functions ---
const fetchPlacements = async () => {
  isLoading.value = true
  try {
    const query = new URLSearchParams({
        page: '1', 
        pageSize: '999',
        ...(filters.fy && { fy: filters.fy }),
        ...(filters.unit && { unit: filters.unit }),
        ...(filters.house && { house: filters.house }),
        ...(filters.status && { status: filters.status }),
    }).toString()

    const response = await $fetch<{ data: Placement[] }>(`/api/placements?${query}`)
    placements.value = response.data
  } catch (e) {
    console.error('Failed to fetch placements', e)
  } finally {
    isLoading.value = false
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

const fetchHouses = async (unitId: string) => {
  try {
    const response = await $fetch<{ data: House[] }>(`/api/houses?unit_id=${unitId}`)
    houses.value = response.data
  } catch (e) {
    console.error('Failed to fetch houses', e)
  }
}

const onUnitChange = () => {
  if (placementForm.unit_id) {
    fetchHouses(placementForm.unit_id)
  }
}

watch(filters, () => fetchPlacements(), { deep: true })
onMounted(() => {
  fetchPlacements()
  fetchUnits()
})

const openAddModal = () => {
    isCreateMode.value = true
    Object.assign(placementForm, { fiscal_year: 'FY26', status: 'planned' })
    showPlacementModal.value = true
}

const openEditModal = (placement: Placement) => {
    if (!placement.id) {
        console.error('Invalid placement object: missing id');
        return;
    }
    isCreateMode.value = false
    Object.assign(placementForm, structuredClone(placement))
    if (placementForm.unit_id) {
      fetchHouses(placementForm.unit_id)
    }
    showPlacementModal.value = true
}

const handleSave = async () => {
    try {
        const url = isCreateMode.value ? '/api/placements' : `/api/placements/${placementForm.id}`
        const method = isCreateMode.value ? 'POST' : 'PUT'
        await $fetch(url, { method, body: placementForm })
        showPlacementModal.value = false
        fetchPlacements()
    } catch (e) {
        console.error('Save failed', e)
    }
}

const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this placement?')) {
        try {
            await $fetch(`/api/placements/${id}`, { method: 'DELETE' })
            fetchPlacements()
        } catch (e) {
            console.error('Delete failed', e)
        }
    }
}

const onFileSelected = (event: Event) => {
  const target = event.target as HTMLInputElement
  selectedFile.value = target.files?.[0] || null
  uploadStatus.value = ''
}

const triggerFileUpload = () => {
  if (!selectedFile.value) return
  uploadStatus.value = 'Parsing file...'
  Papa.parse(selectedFile.value, {
    header: true,
    skipEmptyLines: true,
    complete: async (results) => {
      try {
        uploadStatus.value = 'Uploading data...'
        const response = await $fetch('/api/placements/upload', {
          method: 'POST',
          body: { data: results.data }
        })
        uploadStatus.value = (response as any).message || 'Upload complete!'
        selectedFile.value = null
        fetchPlacements()
      } catch (e: any) {
        uploadStatus.value = `Upload failed: ${e.data?.message || e.message}`
      }
    }
  })
}

const closeImportModal = () => {
    showImportModal.value = false
    selectedFile.value = null
    uploadStatus.value = ''
}

const exportCSV = () => {
    window.open(`/api/placements/export?fy=${filters.fy}`)
}

const statusBadge = (status: string | null | undefined) => {
  const classes: Record<string, string> = {
    planned: 'bg-yellow-400',
    running: 'bg-blue-400',
    closed: 'bg-gray-400',
  }
  return classes[status || ''] || 'bg-pink-400'
}

const formatDate = (dateStr: string | null | undefined) => {
    if (!dateStr) return 'N/A'
    return new Date(dateStr).toLocaleDateString('en-GB')
}

useHead({ title: 'Placement Schedule' })

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

/* Timeline Styles */
.timeline-container {
    @apply w-full select-none;
}
.timeline-header {
    @apply flex border-b-2 border-gray-200;
}
.timeline-month {
    @apply flex-1 text-center font-semibold text-sm text-gray-600 p-2;
}
.timeline-row {
    @apply flex items-center border-b border-gray-100;
}
.row-label {
    @apply w-48 p-2 text-xs font-medium text-gray-700 truncate;
}
.row-bars {
    @apply flex-1 h-10 relative bg-gray-50;
}
.timeline-bar-wrapper {
    @apply absolute h-full p-1;
}
.timeline-bar {
    @apply h-full rounded-md opacity-80 hover:opacity-100 cursor-pointer text-white text-xs flex items-center justify-center;
    position: relative;
}
.timeline-tooltip {
    @apply invisible absolute bottom-full mb-2 w-max p-2 text-xs font-medium text-white bg-gray-900 rounded-md shadow-lg opacity-0 transition-opacity;
    z-index: 10;
}
.timeline-bar:hover .timeline-tooltip {
    @apply visible opacity-100;
}
</style>