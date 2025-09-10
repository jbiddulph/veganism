// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: [
    '@pinia/nuxt',
    '@nuxt/ui'
  ],
  css: ['~/assets/css/main.css'],
  runtimeConfig: {
    // Private keys only available on the server
    databaseUrl: process.env.DATABASE_URL,
    supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
    // Public keys that are exposed to the client
    public: {
      supabaseUrl: process.env.NUXT_PUBLIC_SUPABASE_URL,
      supabaseAnonKey: process.env.NUXT_PUBLIC_SUPABASE_ANON_KEY
    }
  }
})
