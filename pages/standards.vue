<template>
  <div>
    <h1 class="text-3xl font-bold mb-6">Standards (LIRM)</h1>

    <div class="bg-white p-6 rounded-lg shadow mb-6">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-2xl font-bold">Standard LIRM (Layer In Rearing & Maturity)</h2>
        <div class="flex items-center gap-4">
          <button @click="showUploadModal = true" class="btn bg-gray-500 hover:bg-gray-600">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
            Bulk Upload
          </button>
          <button @click="openAddWeekModal" class="btn btn-primary">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
            Add Week
          </button>
        </div>
      </div>

      <div class="overflow-x-auto mt-6">
        <table class="min-w-full divide-y divide-gray-200 text-xs">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-3 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">Week</th>
              <th class="px-3 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">Male</th>
              <th class="px-3 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">Female</th>
              <th class="px-3 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">Avg Fem</th>
              <th class="px-3 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">M House PS %</th>
              <th class="px-3 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">Select HE %</th>
              <th class="px-3 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">HHHE PS1</th>
              <th class="px-3 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">HHHE PS2</th>
              <th class="px-3 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">Depletion %</th>
              <th class="px-3 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">Cumm Depl %</th>
              <th class="px-3 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">Livability %</th>
              <th class="px-3 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">Hand Wk HE</th>
              <th class="px-3 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">HE/W/B</th>
              <th class="px-3 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">HHHE Cumm</th>
              <th class="px-3 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">Actions</th>
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
              <td class="px-3 py-2 whitespace-nowrap text-right text-sm font-medium">
                <button @click="openWeekEditor(item)" class="text-blue-600 hover:text-blue-900">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.536L16.732 3.732z"></path></svg>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Edit/Add Modal -->
    <div v-if="showWeekEditModal && editingWeekData" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-xl font-bold">{{ isCreateMode ? 'Add New Week' : 'Edit Week ' + editingWeekData.week }}</h3>
          <button class="text-gray-500 hover:text-gray-700" @click="showWeekEditModal = false">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <div class="grid grid-cols-2 gap-4">
            <div><label class="block text-sm font-medium text-gray-700">Week</label><input v-model.number="editingWeekData.week" type="number" class="mt-1 block w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 bg-gray-100" :disabled="!isCreateMode" /></div>
            <div><label class="block text-sm font-medium text-gray-700">Male</label><input v-model.number="editingWeekData.male" type="number" class="mt-1 block w-full rounded-md border border-gray-300 shadow-sm py-2 px-3" /></div>
            <div><label class="block text-sm font-medium text-gray-700">Female</label><input v-model.number="editingWeekData.female" type="number" class="mt-1 block w-full rounded-md border border-gray-300 shadow-sm py-2 px-3" /></div>
            <div><label class="block text-sm font-medium text-gray-700">Avg Fem</label><input v-model.number="editingWeekData.avg_fem" type="number" class="mt-1 block w-full rounded-md border border-gray-300 shadow-sm py-2 px-3" /></div>
            <div><label class="block text-sm font-medium text-gray-700">M House PS %</label><input v-model.number="editingWeekData.m_house_ps" type="number" class="mt-1 block w-full rounded-md border border-gray-300 shadow-sm py-2 px-3" /></div>
            <div><label class="block text-sm font-medium text-gray-700">Select HE %</label><input v-model.number="editingWeekData.select_he" type="number" class="mt-1 block w-full rounded-md border border-gray-300 shadow-sm py-2 px-3" /></div>
            <div><label class="block text-sm font-medium text-gray-700">HHHE PS1</label><input v-model.number="editingWeekData.hhhe_ps1" type="number" class="mt-1 block w-full rounded-md border border-gray-300 shadow-sm py-2 px-3" /></div>
            <div><label class="block text-sm font-medium text-gray-700">HHHE PS2</label><input v-model.number="editingWeekData.hhhe_ps2" type="number" class="mt-1 block w-full rounded-md border border-gray-300 shadow-sm py-2 px-3" /></div>
            <div><label class="block text-sm font-medium text-gray-700">Depletion %</label><input v-model.number="editingWeekData.depletion" type="number" class="mt-1 block w-full rounded-md border border-gray-300 shadow-sm py-2 px-3" /></div>
            <div><label class="block text-sm font-medium text-gray-700">Cumm Depl %</label><input v-model.number="editingWeekData.cumm_depl" type="number" class="mt-1 block w-full rounded-md border border-gray-300 shadow-sm py-2 px-3" /></div>
            <div><label class="block text-sm font-medium text-gray-700">Livability %</label><input v-model.number="editingWeekData.livability" type="number" class="mt-1 block w-full rounded-md border border-gray-300 shadow-sm py-2 px-3" /></div>
            <div><label class="block text-sm font-medium text-gray-700">Hand Wk HE</label><input v-model.number="editingWeekData.hand_wk_he" type="number" class="mt-1 block w-full rounded-md border border-gray-300 shadow-sm py-2 px-3" /></div>
            <div><label class="block text-sm font-medium text-gray-700">HE/W/B</label><input v-model.number="editingWeekData.he_w_b" type="number" class="mt-1 block w-full rounded-md border border-gray-300 shadow-sm py-2 px-3" /></div>
            <div><label class="block text-sm font-medium text-gray-700">HHHE Cumulative</label><input v-model.number="editingWeekData.hhhe_cumm" type="number" class="mt-1 block w-full rounded-md border border-gray-300 shadow-sm py-2 px-3" /></div>
        </div>
        <div class="mt-6 flex justify-between items-center">
            <button v-if="!isCreateMode" @click="deleteWeek" class="btn bg-red-600 hover:bg-red-700">Delete</button>
            <div class="flex justify-end gap-3 flex-grow">
                <button class="btn bg-gray-200 text-gray-700 hover:bg-gray-300" @click="showWeekEditModal = false">Cancel</button>
                <button class="btn btn-primary" @click="saveWeek">Save Changes</button>
            </div>
        </div>
      </div>
    </div>

    <!-- CSV Upload Modal -->
    <div v-if="showUploadModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div class="bg-white rounded-lg p-8 max-w-xl w-full space-y-6">
            <div class="flex justify-between items-start">
                <h3 class="text-2xl font-bold text-gray-800">Bulk Upload Standards</h3>
                <button class="text-gray-500 hover:text-gray-700" @click="closeUploadModal">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
            </div>

            <!-- Step 1 -->
            <div class="space-y-2">
                <h4 class="text-lg font-semibold text-gray-700">Step 1: Download Template</h4>
                <p class="text-sm text-gray-600">Download the sample CSV file and fill it with your data. Do not change the column headers.</p>
                <a href="/samples/standards_lirm.csv" download="sample_standards.csv" class="inline-flex items-center text-sm text-blue-600 hover:underline">
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
            <div v-if="uploadError || uploadSuccess" class="p-4 rounded-md" :class="{'bg-red-100 text-red-700': uploadError, 'bg-green-100 text-green-700': uploadSuccess}">
                <p class="text-sm font-medium">{{ uploadError || uploadSuccess }}</p>
            </div>

            <!-- Footer -->
            <div class="mt-8 flex justify-end gap-3">
                <button class="btn bg-gray-200 text-gray-700 hover:bg-gray-300" @click="closeUploadModal">Cancel</button>
                <button @click="triggerFileUpload" :disabled="!selectedFile" class="btn btn-primary disabled:bg-gray-400 disabled:cursor-not-allowed">Upload File</button>
            </div>
        </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed } from '#imports'
import Papa from 'papaparse'

interface StandardData {
  week: number; male: number; female: number; avg_fem: number; m_house_ps: number; select_he: number;
  hhhe_ps1: number; hhhe_ps2: number; depletion: number; cumm_depl: number; livability: number;
  hand_wk_he: number; he_w_b: number; hhhe_cumm: number;
}

const { data: apiData, refresh: refreshNuxtData } = await useFetch<{ data: StandardData[] }>('/api/standards')
const standardsData = computed(() => apiData.value?.data || [])

const showWeekEditModal = ref(false)
const editingWeekData = ref<StandardData | null>(null)
const isCreateMode = ref(false)

const showUploadModal = ref(false)
const uploadError = ref('')
const uploadSuccess = ref('')
const selectedFile = ref<File | null>(null)

function openAddWeekModal() {
  isCreateMode.value = true
  const nextWeek = (standardsData.value[standardsData.value.length - 1]?.week || 0) + 1
  editingWeekData.value = {
    week: nextWeek, male: 0, female: 0, avg_fem: 0, m_house_ps: 0, select_he: 0, hhhe_ps1: 0, hhhe_ps2: 0,
    depletion: 0, cumm_depl: 0, livability: 100, hand_wk_he: 0, he_w_b: 0, hhhe_cumm: 0
  }
  showWeekEditModal.value = true
}

function openWeekEditor(item: StandardData) {
  isCreateMode.value = false
  editingWeekData.value = structuredClone(item)
  showWeekEditModal.value = true
}

async function saveWeek() {
  if (!editingWeekData.value) return

  const method = isCreateMode.value ? 'POST' : 'PUT'
  const url = isCreateMode.value
    ? '/api/standards/week'
    : `/api/standards/week/${editingWeekData.value.week}`

  try {
    await $fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: editingWeekData.value
    })
    showWeekEditModal.value = false
    await refreshNuxtData()
  } catch (error) {
    console.error('Error saving week:', error)
  }
}

async function deleteWeek() {
    if (!editingWeekData.value) return

    if (confirm(`Are you sure you want to delete the record for week ${editingWeekData.value.week}?`)) {
        try {
            await $fetch(`/api/standards/week/${editingWeekData.value.week}`, { method: 'DELETE' })
            showWeekEditModal.value = false
            await refreshNuxtData()
        } catch (error) {
            console.error('Error deleting week:', error)
        }
    }
}

function onFileSelected(event: Event) {
  const target = event.target as HTMLInputElement
  selectedFile.value = target.files?.[0] || null
  uploadError.value = ''
  uploadSuccess.value = ''
}

function triggerFileUpload() {
  if (!selectedFile.value) return

  Papa.parse(selectedFile.value, {
    header: true,
    skipEmptyLines: true,
    complete: async (results) => {
      const parsedData = results.data.map((row: any) => {
        const newRow: { [key: string]: any } = {}
        for (const key in row) {
          const newKey = key.trim().toLowerCase().replace(/\s+/g, '_')
          newRow[newKey] = isNaN(parseFloat(row[key])) ? row[key] : parseFloat(row[key])
        }
        return newRow as StandardData
      })

      try {
        const response = await $fetch('/api/standards/bulk-upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: { data: parsedData }
        })
        uploadSuccess.value = (response as any).message || 'Upload successful!'
        selectedFile.value = null
        await refreshNuxtData()
      } catch (err: any) {
        uploadError.value = err.data?.message || 'An error occurred during upload.'
      }
    },
    error: (err) => {
      uploadError.value = err.message
    }
  })
}

function closeUploadModal() {
    showUploadModal.value = false
    selectedFile.value = null
    uploadError.value = ''
    uploadSuccess.value = ''
}

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
