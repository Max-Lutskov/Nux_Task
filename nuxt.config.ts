// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  devtools: { enabled: true },

  devServer: {
    host: 'localhost',
    port: 3000
  },

  css: [
    "@/assets/app.scss",
  ],

  modules: ['@pinia/nuxt', '@nuxt/icon'],

  runtimeConfig: {
    public: {
      apiBase: 'https://jsonplaceholder.typicode.com',
    },
  },

  ssr: false
});