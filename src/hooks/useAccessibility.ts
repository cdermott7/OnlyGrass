import { useEffect, useRef } from 'react'

// Hook for managing focus and accessibility
export const useAccessibility = () => {
  const announceRef = useRef<HTMLDivElement>(null)

  // Announce to screen readers
  const announce = (message: string) => {
    if (announceRef.current) {
      announceRef.current.textContent = message
    }
  }

  // Focus management
  const trapFocus = (element: HTMLElement) => {
    const focusableElements = element.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    const firstElement = focusableElements[0] as HTMLElement
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus()
          e.preventDefault()
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus()
          e.preventDefault()
        }
      }
    }

    element.addEventListener('keydown', handleTabKey)
    firstElement?.focus()

    return () => {
      element.removeEventListener('keydown', handleTabKey)
    }
  }

  // Escape key handler
  const useEscapeKey = (callback: () => void) => {
    useEffect(() => {
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          callback()
        }
      }

      document.addEventListener('keydown', handleEscape)
      return () => document.removeEventListener('keydown', handleEscape)
    }, [callback])
  }

  // Screen reader announcement component
  const ScreenReaderAnnouncement = () => (
    <div
      ref={announceRef}
      aria-live="polite"
      aria-atomic="true"
      className="sr-only"
    />
  )

  return {
    announce,
    trapFocus,
    useEscapeKey,
    ScreenReaderAnnouncement
  }
}

// Keyboard navigation hook
export const useKeyboardNavigation = (
  items: any[],
  onSelect: (index: number) => void,
  isActive: boolean = true
) => {
  useEffect(() => {
    if (!isActive) return

    let currentIndex = 0

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          currentIndex = Math.min(currentIndex + 1, items.length - 1)
          break
        case 'ArrowUp':
          e.preventDefault()
          currentIndex = Math.max(currentIndex - 1, 0)
          break
        case 'Enter':
        case ' ':
          e.preventDefault()
          onSelect(currentIndex)
          break
        case 'Home':
          e.preventDefault()
          currentIndex = 0
          break
        case 'End':
          e.preventDefault()
          currentIndex = items.length - 1
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [items, onSelect, isActive])
}

// Focus visible hook for better keyboard navigation
export const useFocusVisible = () => {
  useEffect(() => {
    // Add focus-visible polyfill behavior
    const style = document.createElement('style')
    style.textContent = `
      .focus-visible-polyfill:focus:not(.focus-visible) {
        outline: none;
      }
    `
    document.head.appendChild(style)

    return () => {
      document.head.removeChild(style)
    }
  }, [])
}