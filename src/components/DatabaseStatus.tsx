import React, { useState, useEffect } from 'react'
import { AlertTriangle, X, ExternalLink } from 'lucide-react'
import { supabase } from '../lib/supabase'

export const DatabaseStatus: React.FC = () => {
  const [showWarning, setShowWarning] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  
  useEffect(() => {
    const checkDatabase = async () => {
      try {
        await supabase.from('profiles').select('count').limit(1)
      } catch (error: any) {
        if (error.code === '42P01') {
          setShowWarning(true)
        }
      }
    }
    
    checkDatabase()
  }, [])

  if (!showWarning || dismissed) return null

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-amber-500 text-amber-900 px-4 py-3 flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <AlertTriangle className="w-5 h-5" />
        <div>
          <div className="font-semibold">Database Not Set Up</div>
          <div className="text-sm">
            Authentication is working but data won't persist.{' '}
            <a 
              href="https://supabase.com/dashboard" 
              target="_blank" 
              rel="noopener noreferrer"
              className="underline inline-flex items-center space-x-1"
            >
              <span>Set up database</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
      <button
        onClick={() => setDismissed(true)}
        className="text-amber-700 hover:text-amber-900"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  )
}