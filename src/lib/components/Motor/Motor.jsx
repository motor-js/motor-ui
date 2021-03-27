import React, { useState } from 'react'
import { ThemeContext } from '../../contexts/ThemeProvider'
import { EngineContext } from '../../contexts/EngineProvider'
import { ConfigContext } from '../../contexts/ConfigProvider'
import { CapabilityContext } from '../../contexts/CapabilityProvider'
import { deepMerge } from '../../utils/object'
import defaultTheme from '../../themes/defaultTheme'
import Login from '../Login'
import NotConnected from '../NotConnected'
import useEngine from '../../hooks/useEngine'
import useCapability from '../../hooks/useCapability'

function Motor({
  children, theme, config, logo, logoWidth, logoHeight, capabilityAPI,
}) {
  const [myTheme, setMyTheme] = useState(defaultTheme)
  const [myConfig, setMyConfig] = useState(config)
  const nextTheme = deepMerge(myTheme, theme)

  const engine = useEngine(myConfig, capabilityAPI)
  //const app = useCapability(myConfig)
  const { app } = engine ? { app: {} } : engine
 
  // eslint-disable-next-line react/react-in-jsx-scope
  return (
    <EngineContext.Provider value={engine}>
      <CapabilityContext.Provider value={app}>
        <ConfigContext.Provider value={myConfig}>
          <ThemeContext.Provider value={nextTheme}>
            <Login logo={logo} logoHeight={logoHeight} logoWidth={logoWidth} />
            <NotConnected />
            {children}
          </ThemeContext.Provider>
        </ConfigContext.Provider>
      </CapabilityContext.Provider>
    </EngineContext.Provider>
  )
}

export default Motor
