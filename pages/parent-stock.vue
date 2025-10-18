<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">Parent Stock Management</h1>
    
    <div v-if="loading" class="text-center">
      Loading parent stock data...
    </div>

    <div v-else>
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Breed</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="item in parentStock" :key="item.id">
            <td class="px-6 py-4 whitespace-nowrap">{{ item.date }}</td>
            <td class="px-6 py-4 whitespace-nowrap">{{ item.breed }}</td>
            <td class="px-6 py-4 whitespace-nowrap">{{ item.quantity }}</td>
            <td class="px-6 py-4 whitespace-nowrap">{{ item.location }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
const { data: parentStock, pending: loading } = await useAsyncData(
  'parent-stock',
  () => $fetch('/api/parent-stock')
    .then(res => res.map(item => ({
      id: item.id,
      date: new Date(item.date).toLocaleDateString(),
      breed: item.breed_name,
      quantity: item.quantity.toLocaleString(),
      location: item.farm_location
    })))
)
</script>

<style scoped>
table {
  @apply shadow-sm rounded-lg overflow-hidden;
}

th, td {
  @apply px-6 py-4 whitespace-nowrap text-sm text-gray-900;
}

tr:nth-child(even) {
  @apply bg-gray-50;
}
</style>
