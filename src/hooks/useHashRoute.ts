import { useEffect, useState } from 'react'

function readPath() {
  return window.location.hash.replace(/^#/, '') || '/'
}

export function useHashRoute() {
  const [path, setPath] = useState(readPath)

  useEffect(() => {
    const onHashChange = () => setPath(readPath())
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  return path
}
