<template>
  <div class="bg-white p-4 rounded-lg shadow-sm border">
    <h3 class="text-lg font-semibold mb-4">Placement Schedule</h3>
    <div class="relative h-48 overflow-x-auto">
      <svg class="w-full h-full">
        <g v-for="(house, index) in placementData" :key="house.id" 
           :transform="`translate(0, ${index * 40})`">
          <rect 
            :x="getXPosition(house.in_date)"
            :width="getWidth(house.in_date, house.ready_date)"
            height="20"
            rx="4"
            :class="getHouseColor(house.type)"
          />
          <text 
            x="8" 
            y="15" 
            class="text-xs font-medium fill-current text-white"
          >
            {{ house.name }}
          </text>
        </g>
      </svg>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  placementData: {
    type: Array,
    required: true,
    validator: (data) => data.every(item => 
      'id' in item &&
      'name' in item &&
      'in_date' in item &&
      'ready_date' in item &&
      'type' in item
    )
  },
  timelineStart: {
    type: Date,
    default: () => new Date('2025-01-01')
  },
  timelineEnd: {
    type: Date,
    default: () => new Date('2026-12-31')
  }
});

const timelineDuration = computed(() => 
  props.timelineEnd - props.timelineStart
);

const getXPosition = (date) => {
  const position = ((new Date(date) - props.timelineStart) / timelineDuration.value) * 100;
  return `${Math.max(0, Math.min(100, position))}%`;
};

const getWidth = (startDate, endDate) => {
  const width = ((new Date(endDate) - new Date(startDate)) / timelineDuration.value) * 100;
  return `${Math.max(1, Math.min(100, width))}%`;
};

const getHouseColor = (type) => {
  return {
    'running': 'fill-green-500',
    'closed': 'fill-gray-400',
    'import': 'fill-blue-500',
    'local': 'fill-yellow-400'
  }[type.toLowerCase()] || 'fill-gray-300';
};
</script>
