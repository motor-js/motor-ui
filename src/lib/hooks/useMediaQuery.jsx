import { useLayoutEffect, useState } from 'react'

export default function useMediaQuery(mediaQuery) {
  const [matches, setMatches] = useState(
    () => window.matchMedia(mediaQuery).matches,
  )
  useLayoutEffect(() => {
    const mediaQueryList = window.matchMedia(mediaQuery)
    const listener = e => setMatches(e.matches)
    mediaQueryList.addListener(listener)

    return () => mediaQueryList.removeListener(listener)
  }, [mediaQuery])

  return matches
}
