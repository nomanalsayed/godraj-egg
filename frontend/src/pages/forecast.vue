<template>
  <div class="container mx-auto p-6 space-y-8">
    <h1 class="text-2xl font-bold text-gray-800">Production Forecast</h1>
    
    <FileUpload @files-uploaded="handleFilesUploaded" />

    <div v-if="chartData.length" class="space-y-8">
      <!-- Charts Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ForecastChart 
          :chart-data="chartData[0]"
          class="col-span-2"
        />
        <ForecastChart 
          :chart-data="chartData[1]"
        />
        <ForecastChart 
          :chart-data="chartData[2]"
        />
      </div>

      <!-- Data Tables -->
      <div class="overflow-x-auto rounded-lg border">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th 
                v-for="header in tableHeaders" 
                :key="header" 
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                @click="sortTable(header)"
              >
                <div class="flex items-center justify-between">
                  {{ header }}
                  <span v-if="sortColumn === header" class="ml-2">
                    {{ sortDirection === 'asc' ? '↑' : '↓' }}
                  </span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="row in tableData" :key="row.week">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ row.week }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm" :class="{
                'text-green-600': row.he > 180,
                'text-red-600': row.he < 180
              }">{{ row.he.toLocaleString() }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ row.doc.toLocaleString() }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ row.feed.toLocaleString() }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm" :class="{
                'text-green-600': row.livability >= 98.5,
                'text-yellow-600': row.livability >= 98 && row.livability < 98.5,
                'text-red-600': row.livability < 98
              }">{{ row.livability.toFixed(1) }}%</td>
            </tr>
          </tbody>
          <tfoot class="bg-gray-50">
            <tr>
              <td class="px-6 py-3 text-sm font-medium text-gray-900">Totals</td>
              <td class="px-6 py-3 text-sm text-gray-900">{{ totals.he }}</td>
              <td class="px-6 py-3 text-sm text-gray-900">{{ totals.doc }}</td>
              <td class="px-6 py-3 text-sm text-gray-900">{{ totals.feed }} kg</td>
              <td class="px-6 py-3 text-sm text-gray-900">-</td>
            </tr>
          </tfoot>
        </table>
      </div>

      <PlacementTimeline 
        v-if="placementData.length"
        :placement-data="placementData"
        class="mt-8"
      />

      <div class="flex justify-end space-x-4">
        <button 
          @click="exportCSV"
          class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          Export Forecast CSV
        </button>
        <button 
          @click="exportVarianceCSV"
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          Export Variance CSV
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import FileUpload from '@/components/FileUpload.vue';
import ForecastChart from '@/components/ForecastChart.vue';

import PlacementTimeline from '@/components/PlacementTimeline.vue';

const tableHeaders = ['Week', 'HE', 'DOC', 'Feed Consumption', 'Livability'];
const chartData = ref([]);
const tableData = ref([]);
const totals = ref({ he: 0, doc: 0, feed: 0 });
const placementData = ref([]);
const sortColumn = ref('');
const sortDirection = ref('asc');

const sortTable = (column) => {
  if (sortColumn.value === column) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortColumn.value = column;
    sortDirection.value = 'asc';
  }

  tableData.value.sort((a, b) => {
    const valA = a[column.toLowerCase().replace(/ /g, '_')];
    const valB = b[column.toLowerCase().replace(/ /g, '_')];
    
    if (typeof valA === 'string') return valA.localeCompare(valB);
    if (sortDirection.value === 'asc') return valA - valB;
    return valB - valA;
  });
};

const handleFilesUploaded = async (files) => {
  try {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });

    const response = await axios.post('/api/forecast', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    chartData.value = response.data.charts;
    tableData.value = response.data.tableData;
    totals.value = response.data.totals;
    placementData.value = response.data.placementData || [];
  } catch (error) {
    console.error('Forecast error:', error);
    alert('Error processing forecast. Please check the files and try again.');
  }
};

const processUploadedData = (files) => {
  // Fallback mock data
  return {
    charts: [
      {
        type: 'line',
        categories: ['Week 64', 'Week 65', 'Week 66'],
        series: [
          { name: 'HE', data: [181, 183, 179] },
          { name: 'HHHE Cumulative', data: [179, 181, 180] }
        ],
        referenceValue: 181
      },
      {
        type: 'line',
        categories: ['Week 64', 'Week 65', 'Week 66'],
        series: [
          { name: 'HHHE Cumulative', data: [179, 181, 180] }
        ],
        variance: [2, 0, -1]
      },
      {
        type: 'bar',
        categories: ['Week 64', 'Week 65', 'Week 66'],
        series: [
          { name: 'Feed Consumption', data: [4200, 4350, 4280] }
        ]
      }
    ],
    tableData: [
      { week: 'Week 64', he: 181, doc: 280000, feed: 4200, livability: 98.5 },
      { week: 'Week 65', he: 183, doc: 285000, feed: 4350, livability: 98.2 },
      { week: 'Week 66', he: 179, doc: 278000, feed: 4280, livability: 98.7 }
    ],
    totals: { he: 543, doc: 843000, feed: 12830 },
    placementData: [
      { id: 1, name: 'House A', in_date: '2025-03-01', ready_date: '2025-06-15', type: 'running' },
      { id: 2, name: 'House B', in_date: '2025-04-10', ready_date: '2025-07-20', type: 'import' },
      { id: 3, name: 'House C', in_date: '2025-05-01', ready_date: '2025-08-01', type: 'local' },
      { id: 4, name: 'House D', in_date: '2025-02-15', ready_date: '2025-05-30', type: 'closed' }
    ]
  };
};

const exportCSV = async () => {
  try {
    const response = await axios.get('/api/export/forecast', {
      responseType: 'blob'
    });
    
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'forecast_FY26.csv');
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (error) {
    console.error('Export error:', error);
    alert('Error exporting forecast CSV');
  }
};

const exportVarianceCSV = async () => {
  try {
    const response = await axios.get('/api/export/variance', {
      responseType: 'blob'
    });
    
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'variance_FY26.csv');
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (error) {
    console.error('Export error:', error);
    alert('Error exporting variance CSV');
  }
};
</script>
