'use client'

import { useEffect, useState } from 'react'

// Simple hook implementation to avoid adding another dependency
function useWindowWidth() {
  const [width, setWidth] = useState(0)

  useEffect(() => {
    // Handler to call on window resize
    function handleResize() {
      setWidth(window.innerWidth)
    }

    // Add event listener
    window.addEventListener('resize', handleResize)

    // Call handler right away so state gets updated with initial window size
    handleResize()

    // Remove event listener on cleanup
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return width
}

export default useWindowWidth
