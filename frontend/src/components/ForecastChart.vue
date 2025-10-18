<template>
  <div class="bg-white p-4 rounded-lg shadow-sm border">
    <apexchart
      :type="chartData.type"
      :height="380"
      :options="chartOptions"
      :series="series"
    ></apexchart>
  </div>
</template>

<script setup>
import { computed, watch } from 'vue';

const props = defineProps({
  chartData: {
    type: Object,
    required: true,
    validator: (value) => {
      return ['line', 'bar'].includes(value.type) && 
             Array.isArray(value.categories) && 
             Array.isArray(value.series);
    }
  }
});

const chartOptions = computed(() => ({
  chart: {
    id: `chart-${Date.now()}`,
    toolbar: { show: true },
    zoom: { enabled: false }
  },
  xaxis: {
    categories: props.chartData.categories,
    title: { text: 'Week Number' },
    labels: { rotate: -45 }
  },
  yaxis: {
    title: { 
      text: props.chartData.type === 'bar' ? 'Feed Consumption (kg)' : 'Count' 
    }
  },
  annotations: props.chartData.type === 'line' && props.chartData.referenceValue ? {
    yaxis: [{
      y: 181,
      borderColor: '#FF4560',
      label: {
        text: 'Standard 181',
        style: { color: '#fff', background: '#FF4560' }
      }
    }]
  } : undefined,
  dataLabels: { enabled: false },
  stroke: { 
    width: 2,
    dashArray: props.chartData.variance ? [5, 5] : 0
  },
  colors: ['#3B82F6', '#10B981'],
  responsive: [{
    breakpoint: 768,
    options: {
      chart: { height: 300 },
      xaxis: { labels: { rotate: 0 } }
    }
  }]
}));

const series = computed(() => {
  if (props.chartData.variance) {
    return [
      ...props.chartData.series,
      {
        name: 'Variance',
        data: props.chartData.variance,
        type: 'line'
      }
    ];
  }
  return props.chartData.series;
});

watch(() => props.chartData, () => {
  // Force re-render on data change
  chartOptions.value = { ...chartOptions.value };
});
</script>

<!-- Sample data structure for testing:
{
  type: 'line',
  categories: ['Week 1', 'Week 2', 'Week 3'],
  series: [
    { name: 'HE', data: [120, 135, 128] },
    { name: 'HHHE Cumulative', data: [175, 181, 179] }
  ],
  referenceValue: 181
}
-->
