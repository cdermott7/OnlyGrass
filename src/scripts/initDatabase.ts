// Database initialization script
// Run this if you need to programmatically set up the database

import { supabase } from '../lib/supabase'

export async function initDatabase() {
  try {
    console.log('🌱 Initializing OnlyGrass database...')
    
    // Test connection
    const { data, error } = await supabase.from('profiles').select('count').single()
    
    if (error && error.code === '42P01') {
      console.error('❌ Database tables not found!')
      console.log('📋 Please run the SQL schema in your Supabase dashboard:')
      console.log('1. Go to https://supabase.com/dashboard')
      console.log('2. Open SQL Editor')
      console.log('3. Paste the contents of supabase-schema.sql')
      console.log('4. Click Run')
      return false
    }
    
    if (error) {
      console.error('❌ Database connection error:', error)
      return false
    }
    
    console.log('✅ Database connection successful!')
    console.log('✅ Tables are ready!')
    return true
    
  } catch (error) {
    console.error('❌ Failed to initialize database:', error)
    return false
  }
}

// Test function
export async function testDatabase() {
  console.log('🧪 Testing database connection...')
  
  try {
    // Test auth
    const { data: authData } = await supabase.auth.getUser()
    console.log('Auth status:', authData.user ? 'Authenticated' : 'Not authenticated')
    
    // Test tables
    const tables = ['profiles', 'challenges', 'achievements', 'friendships']
    
    for (const table of tables) {
      try {
        const { error } = await supabase.from(table).select('count').limit(1)
        if (error) {
          console.log(`❌ Table '${table}': ${error.message}`)
        } else {
          console.log(`✅ Table '${table}': OK`)
        }
      } catch (err) {
        console.log(`❌ Table '${table}': Error`)
      }
    }
    
  } catch (error) {
    console.error('Test failed:', error)
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  initDatabase()
}