// Environment configuration with validation
export interface EnvironmentConfig {
  googleMapsApiKey: string
  geminiApiKey: string
  anthropicApiKey: string
  supabaseUrl: string
  supabaseAnonKey: string
  appEnv: 'development' | 'production' | 'test'
  debugMode: boolean
  sentryDsn?: string
}

// Validate required environment variables
function validateEnvironment(): EnvironmentConfig {
  const requiredVars = [
    'VITE_GOOGLE_MAPS_API_KEY',
    'VITE_SUPABASE_URL', 
    'VITE_SUPABASE_ANON_KEY'
  ]

  const missing = requiredVars.filter(varName => !import.meta.env[varName])
  
  if (missing.length > 0) {
    console.error('Missing required environment variables:', missing)
    throw new Error(`Missing environment variables: ${missing.join(', ')}`)
  }

  return {
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    geminiApiKey: import.meta.env.VITE_GEMINI_API_KEY || '',
    anthropicApiKey: import.meta.env.VITE_ANTHROPIC_API_KEY || '',
    supabaseUrl: import.meta.env.VITE_SUPABASE_URL,
    supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
    appEnv: (import.meta.env.VITE_APP_ENV as any) || 'development',
    debugMode: import.meta.env.VITE_DEBUG_MODE === 'true',
    sentryDsn: import.meta.env.VITE_SENTRY_DSN
  }
}

// Export validated configuration
export const config = validateEnvironment()

// Helper functions
export const isProduction = config.appEnv === 'production'
export const isDevelopment = config.appEnv === 'development'
export const isDebugMode = config.debugMode && !isProduction

// Safe logging that respects environment
export const safeLog = {
  info: (...args: any[]) => {
    if (isDevelopment || isDebugMode) {
      console.log(...args)
    }
  },
  warn: (...args: any[]) => {
    if (isDevelopment || isDebugMode) {
      console.warn(...args)
    }
  },
  error: (...args: any[]) => {
    // Always log errors, but send to error reporting in production
    console.error(...args)
    
    if (isProduction && config.sentryDsn) {
      // In production, you'd send to Sentry or similar service
      // Sentry.captureException(new Error(args.join(' ')))
    }
  }
}