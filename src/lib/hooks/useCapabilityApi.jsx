import React, { useState } from 'react'
import utility from '../utils/CapApiUtils'

// let qlik;
// let { qlik } = utility.qlobals;
let capabilityApisPromise

const loadCapabilityApis = async config => {
  try {
    if (capabilityApisPromise) {
      await capabilityApisPromise

      return
    }
    const capabilityApisJS = document.createElement('script')
    const prefix = (config.prefix !== '') ? `/${config.prefix}` : ''
    capabilityApisJS.src = `${(config.secure ? 'https://' : 'http://') + config.host + (config.port ? `:${config.port}` : '') + prefix}/resources/assets/external/requirejs/require.js`
    document.head.appendChild(capabilityApisJS)
    capabilityApisJS.loaded = new Promise(resolve => {
      capabilityApisJS.onload = () => { resolve() }
    })
    const capabilityApisCSS = document.createElement('link')
    capabilityApisCSS.href = `${(config.secure ? 'https://' : 'http://') + config.host + (config.port ? `:${config.port}` : '') + prefix}/resources/autogenerated/qlik-styles.css`
    capabilityApisCSS.type = 'text/css'
    capabilityApisCSS.rel = 'stylesheet'
    document.head.appendChild(capabilityApisCSS)
    capabilityApisCSS.loaded = new Promise(resolve => {
      capabilityApisCSS.onload = () => { resolve() }
    })

    capabilityApisPromise = Promise.all([capabilityApisJS.loaded, capabilityApisCSS.loaded])

    await capabilityApisPromise
  } catch (error) {
    throw new Error(error)
  }
}

function useCapabilityApi(config) {
  const [capEngine, setCapEngine] = useState(() => {
    (async () => {
      console.log(config)
      if (config) {
        try {
          await loadCapabilityApis(config)
          const prefix = (config.prefix !== '') ? `/${config.prefix}/` : '/'
          window.require.config({
            baseUrl: `${(config.secure ? 'https://' : 'http://') + config.host + (config.port ? `:${config.port}` : '') + prefix}resources`,
            paths: {
              qlik: `${(config.secure ? 'https://' : 'http://') + config.host + (config.port ? `:${config.port}` : '') + prefix}resources/js/qlik`,
            },
            config: {
              text: {
                useXhr() {
                  return true
                },
              },
            },
          })

          return new Promise(resolve => {
            if (utility.globals.qlik) {
              const app = utility.globals.qlik.openApp(config.appId, { ...config, isSecure: config.secure, prefix })
              // apply theme set in QSE
              app.theme.get().then(theme => {
                theme.apply()
              })
              setCapEngine(app)
              console.log('called')
            } else {
              window.require(['js/qlik'], q => {
                utility.globals.qlik = q
                utility.globals.resize = () => {
                  q.resize()
                }
                const app = q.openApp(config.appId, { ...config, isSecure: config.secure, prefix })
                setCapEngine(app)
                console.log('called')
              })
            }
          })
        } catch (error) {
          throw new Error(error)
        }
      }
    })()
  }, [])
  console.log('cap en', capEngine)
  return { capEngine }
}

export default useCapabilityApi
