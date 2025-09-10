import { createClient, type SupabaseClient } from '@supabase/supabase-js'

export default defineNuxtPlugin((_nuxtApp) => {
  const config = useRuntimeConfig()
  const supabaseUrl = config.public.supabaseUrl
  const supabaseAnonKey = config.public.supabaseAnonKey

  const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey)

  return {
    provide: {
      supabase
    }
  }
})

declare module '#app' {
  interface NuxtApp {
    $supabase: SupabaseClient
  }
}

declare module 'vue' {
  interface ComponentCustomProperties {
    $supabase: SupabaseClient
  }
}

