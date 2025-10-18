<template>
  <div class="space-y-4 p-4 border rounded-lg">
    <div class="space-y-2">
      <label class="block text-sm font-medium text-gray-700">
        Upload Required CSVs
      </label>
      <input
        type="file"
        multiple
        accept=".csv"
        @change="handleFileUpload"
        class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
      />
    </div>

    <div v-if="uploadedFiles.length" class="space-y-2">
      <h3 class="text-sm font-medium">Selected Files:</h3>
      <ul class="list-disc pl-5 text-sm text-gray-600">
        <li v-for="file in uploadedFiles" :key="file.name">
          {{ file.name }} ({{ (file.size / 1024).toFixed(2) }} KB)
        </li>
      </ul>
      <AccessControl required-role="planner">
        <button
          @click="emitFiles"
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          Generate Forecast
        </button>
      </AccessControl>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import AccessControl from './AccessControl.vue';

const emit = defineEmits(['files-uploaded']);

const uploadedFiles = ref([]);

const handleFileUpload = (event) => {
  uploadedFiles.value = Array.from(event.target.files).filter(file => 
    ['standards_lirm.csv', 'placements.csv', 'weekly_actuals.csv']
      .includes(file.name.toLowerCase())
  );
};

const emitFiles = () => {
  if (uploadedFiles.value.length === 3) {
    emit('files-uploaded', uploadedFiles.value);
  } else {
    alert('Please upload all required CSV files');
  }
};
</script>
