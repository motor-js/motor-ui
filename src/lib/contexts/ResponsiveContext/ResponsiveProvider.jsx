import React from 'react'
import screenSize from '../../hooks/useScreenSize'
import { ResponsiveContext } from '.'

function ResponsiveProvider({ children }) {
  const { screen } = screenSize()

  return (
    <ResponsiveContext.Provider value={screen}>
      {children}
    </ResponsiveContext.Provider>
  )
}

export default ResponsiveProvider
