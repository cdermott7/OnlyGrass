import React, { Component, ErrorInfo, ReactNode } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'
import { motion } from 'framer-motion'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo)
    
    // In production, you'd send this to your error reporting service
    // Example: Sentry.captureException(error, { extra: errorInfo })
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined })
  }

  private handleReload = () => {
    window.location.reload()
  }

  public render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback
      }

      // Default error UI
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 px-4">
          <motion.div 
            className="text-center max-w-md"
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <motion.div 
              className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center shadow-xl"
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <AlertTriangle className="w-10 h-10 text-white" />
            </motion.div>
            
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Something went wrong</h1>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Don't worry, even the best grass touchers encounter bumps in the field. Let's get you back to discovering amazing patches!
            </p>
            
            <div className="space-y-4">
              <motion.button
                onClick={this.handleRetry}
                className="w-full px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <RefreshCw className="w-5 h-5 inline mr-2" />
                Try Again
              </motion.button>
              
              <motion.button
                onClick={this.handleReload}
                className="w-full px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-300"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Reload App
              </motion.button>
            </div>
            
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-8 text-left">
                <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                  Show Error Details (Dev Mode)
                </summary>
                <pre className="mt-4 p-4 bg-gray-100 rounded-lg text-xs text-gray-800 overflow-auto max-h-40">
                  {this.state.error.toString()}
                </pre>
              </details>
            )}
          </motion.div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary