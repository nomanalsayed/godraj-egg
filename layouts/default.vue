<template>
  <div class="flex h-screen bg-gray-100">
    <!-- Sidebar -->
    <aside 
      class="fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-blue-900 to-blue-800 text-white transform transition-transform duration-300 ease-in-out"
      :class="sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'"
    >
      <!-- Sidebar Header -->
      <div class="flex items-center justify-between h-16 px-6 bg-blue-950 border-b border-blue-700">
        <div class="flex items-center space-x-3">
          <span class="text-3xl">🥚</span>
          <h1 class="text-lg font-bold">Godrej Egg</h1>
        </div>
        <button 
          @click="toggleSidebar" 
          class="lg:hidden text-white hover:text-gray-300"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Navigation Menu -->
      <nav class="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        <!-- Dashboard Section -->
        <div class="mb-6">
          <h3 class="px-3 mb-2 text-xs font-semibold text-blue-300 uppercase tracking-wider">
            Main
          </h3>
          <NuxtLink
            to="/"
            @click="closeSidebarOnMobile"
            class="flex items-center px-3 py-2.5 rounded-lg transition-all duration-200"
            :class="isActive('/') 
              ? 'bg-blue-700 text-white shadow-lg' 
              : 'text-blue-100 hover:bg-blue-800 hover:text-white'"
          >
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span class="font-medium">Dashboard</span>
          </NuxtLink>
        </div>

        <!-- Production Section -->
        <div class="mb-6">
          <h3 class="px-3 mb-2 text-xs font-semibold text-blue-300 uppercase tracking-wider">
            Production
          </h3>
          <NuxtLink
            to="/forecast"
            @click="closeSidebarOnMobile"
            class="flex items-center px-3 py-2.5 rounded-lg transition-all duration-200"
            :class="isActive('/forecast') 
              ? 'bg-blue-700 text-white shadow-lg' 
              : 'text-blue-100 hover:bg-blue-800 hover:text-white'"
          >
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <span class="font-medium">Forecast</span>
          </NuxtLink>
          
          <NuxtLink
            to="/analytics"
            @click="closeSidebarOnMobile"
            class="flex items-center px-3 py-2.5 rounded-lg transition-all duration-200"
            :class="isActive('/analytics') 
              ? 'bg-blue-700 text-white shadow-lg' 
              : 'text-blue-100 hover:bg-blue-800 hover:text-white'"
          >
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span class="font-medium">Analytics</span>
          </NuxtLink>

          <NuxtLink
            to="/placement"
            @click="closeSidebarOnMobile"
            class="flex items-center px-3 py-2.5 rounded-lg transition-all duration-200"
            :class="isActive('/placement')
              ? 'bg-blue-700 text-white shadow-lg'
              : 'text-blue-100 hover:bg-blue-800 hover:text-white'"
          >
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span class="font-medium">Placement</span>
          </NuxtLink>

          <NuxtLink
            to="/weekly-forecast"
            @click="closeSidebarOnMobile"
            class="flex items-center px-3 py-2.5 rounded-lg transition-all duration-200"
            :class="isActive('/weekly-forecast')
              ? 'bg-blue-700 text-white shadow-lg'
              : 'text-blue-100 hover:bg-blue-800 hover:text-white'"
          >
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7" />
            </svg>
            <span class="font-medium">Weekly Forecast</span>
          </NuxtLink>

          <NuxtLink
            to="/production-summary"
            @click="closeSidebarOnMobile"
            class="flex items-center px-3 py-2.5 rounded-lg transition-all duration-200"
            :class="isActive('/production-summary')
              ? 'bg-blue-700 text-white shadow-lg'
              : 'text-blue-100 hover:bg-blue-800 hover:text-white'"
          >
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m-1 4h1m5-4h1m-1 4h1m-1-4h1m-1-4h1" />
            </svg>
            <span class="font-medium">Production Summary</span>
          </NuxtLink>
        </div>

        <!-- Financials Section -->
        <div class="mb-6">
          <h3 class="px-3 mb-2 text-xs font-semibold text-blue-300 uppercase tracking-wider">
            Financials
          </h3>
          <NuxtLink
            to="/budget"
            @click="closeSidebarOnMobile"
            class="flex items-center px-3 py-2.5 rounded-lg transition-all duration-200"
            :class="isActive('/budget')
              ? 'bg-blue-700 text-white shadow-lg'
              : 'text-blue-100 hover:bg-blue-800 hover:text-white'"
          >
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
            </svg>
            <span class="font-medium">Budget & Variance</span>
          </NuxtLink>
        </div>

        <!-- Reports Section -->
        <div class="mb-6">
          <h3 class="px-3 mb-2 text-xs font-semibold text-blue-300 uppercase tracking-wider">
            Reports
          </h3>
          <NuxtLink
            to="/reports"
            @click="closeSidebarOnMobile"
            class="flex items-center px-3 py-2.5 rounded-lg transition-all duration-200"
            :class="isActive('/reports')
              ? 'bg-blue-700 text-white shadow-lg'
              : 'text-blue-100 hover:bg-blue-800 hover:text-white'"
          >
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V7a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span class="font-medium">Reports</span>
          </NuxtLink>
        </div>

        <!-- Settings Section -->
        <div>
          <h3 class="px-3 mb-2 text-xs font-semibold text-blue-300 uppercase tracking-wider">
            Settings
          </h3>
          <NuxtLink
            to="/standards"
            @click="closeSidebarOnMobile"
            class="flex items-center px-3 py-2.5 rounded-lg transition-all duration-200"
            :class="isActive('/standards')
              ? 'bg-blue-700 text-white shadow-lg'
              : 'text-blue-100 hover:bg-blue-800 hover:text-white'"
          >
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
            <span class="font-medium">Standards (LIRM)</span>
          </NuxtLink>

          <button
            class="w-full flex items-center px-3 py-2.5 rounded-lg text-blue-100 hover:bg-blue-800 hover:text-white transition-all duration-200"
          >
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span class="font-medium">Settings</span>
          </button>
        </div>
      </nav>

      <!-- Sidebar Footer -->
      <div class="p-4 border-t border-blue-700">
        <div class="flex items-center space-x-3 px-3 py-2">
          <div class="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
            <span class="text-sm font-bold">GE</span>
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium truncate">Godrej Egg</p>
            <p class="text-xs text-blue-300 truncate">Production System</p>
          </div>
        </div>
      </div>
    </aside>

    <!-- Main Content Area -->
    <div class="flex-1 flex flex-col lg:ml-64">
      <!-- Top Header -->
      <header class="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div class="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
          <div class="flex items-center">
            <button 
              @click="toggleSidebar" 
              class="lg:hidden mr-4 text-gray-600 hover:text-gray-900"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h2 class="text-xl font-semibold text-gray-800">
              {{ pageTitle }}
            </h2>
          </div>
          
          <div class="flex items-center space-x-4">
            <button class="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
            <div class="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold">
              U
            </div>
          </div>
        </div>
      </header>

      <!-- Page Content -->
      <main class="flex-1 overflow-y-auto bg-gray-50 p-4 sm:p-6 lg:p-8">
        <slot />
      </main>

      <!-- Footer -->
      <footer class="bg-white border-t border-gray-200 py-4 px-4 sm:px-6 lg:px-8">
        <p class="text-center text-sm text-gray-500">
          © 2025 Godrej Egg Production Forecasting System
        </p>
      </footer>
    </div>

    <!-- Mobile Sidebar Overlay -->
    <div 
      v-if="sidebarOpen" 
      @click="toggleSidebar"
      class="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
    ></div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const sidebarOpen = ref(false)

const isActive = (path: string) => {
  return route.path === path
}

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
}

import { useWindowSize } from '@vueuse/core'

const { width: windowWidth } = useWindowSize()

const closeSidebarOnMobile = () => {
  if (windowWidth.value < 1024) {
    sidebarOpen.value = false
  }
}

const pageTitle = computed(() => {
  const titles: Record<string, string> = {
    '/': 'Dashboard',
    '/forecast': 'Production Forecast',
    '/analytics': 'Analytics Dashboard',
    '/placement': 'Placement Schedule',
    '/weekly-forecast': 'Weekly Forecast',
    '/production-summary': 'Production Summary',
    '/budget': 'Budget & Variance',
    '/standards': 'Standards (LIRM)',
    '/reports': 'Reports'
  }
  return titles[route.path] || 'Godrej Egg Forecasting'
})
</script>

<style scoped>
/* Smooth scrollbar styling */
aside::-webkit-scrollbar {
  width: 6px;
}

aside::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
}

aside::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 3px;
}

aside::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}
</style>
