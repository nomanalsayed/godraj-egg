// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  
  modules: [
    '@nuxtjs/tailwindcss'
  ],
  
  typescript: {
    strict: true,
    typeCheck: true,
    tsConfig: {
      compilerOptions: {
        types: [
          '@nuxt/types',
          '@nuxtjs/tailwindcss'
        ]
      }
    }
  },
  
  css: ['~/assets/css/main.css'],
  
  app: {
    head: {
      title: 'Godrej Egg Production Forecasting',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Parent stock and egg production forecasting system' }
      ]
    }
  },
  
  nitro: {
    experimental: {
      database: true
    }
  }
})
