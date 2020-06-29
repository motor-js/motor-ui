import React from 'react'

export const ConfigContext = React.createContext({
  host: null,
  secure: null,
  port: null,
  prefix: null,
  app: null,
})

