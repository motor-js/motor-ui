import React, { useState } from 'react'
import utility from '../utils/CapApiUtils'

let capabilityApisPromise
let capApiSAASPromise

const loadCapSAAS = async config => {
  try {
    if (capApiSAASPromise) {
      await capApiSAASPromise

      return
    }
    const tenantUrl = config.host
    const webIntegrationId = config.webIntId

    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = `https://${tenantUrl}/resources/autogenerated/qlik-styles.css`
    document.head.appendChild(link)
    link.loaded = new Promise(resolve => {
      link.onload = () => { resolve() }
    })

    const script = document.createElement('script')
    script.src = `https://${tenantUrl}/resources/assets/external/requirejs/require.js`
    script.onload = async () => {
      window.require.config({
        baseUrl: `https://${tenantUrl}/resources`,
        webIntegrationId,
      })
    }
    document.body.appendChild(script)
    script.loaded = new Promise(resolve => {
      script.onload = () => { resolve() }
    })

    capApiSAASPromise = Promise.all([link.loaded, script.loaded])
    await capApiSAASPromise
  } catch (error) {
    throw new Error(error)
  }
}

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

function useCapability(config, isLoaded) {
  const [app, setApp] = useState(() => {
    (async () => {
      if (config && config.qcs) {
        const prefix = (config.prefix !== '') ? `/${config.prefix}/` : '/'

        const qConfig = {
          host: config.host,
          isSecure: config.secure,
          port: config.port || 443,
          prefix,
          appId: config.appId,
          webIntegrationId: config.webIntId,
        }

        try {
          await loadCapSAAS(qConfig)
          window.require.config({
            baseUrl: `https://${qConfig.host}/resources`,
            webIntegrationId: config.webIntId,
          })

          window.require(['js/qlik'], async q => {
            const app = q.openApp(qConfig.appId, qConfig)
            // apply theme set in QSE
            app.theme.get().then(theme => {
              theme.apply()
            })
            setApp(app)

            return 1
          }) 
        } catch (error) {
          throw new Error(error)
        }
      } else {
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
              setApp(app)
            } else {
              window.require(['js/qlik'], q => {
                utility.globals.qlik = q
                utility.globals.resize = () => {
                  q.resize()
                }
                const app = q.openApp(config.appId, { ...config, isSecure: config.secure, prefix })
                setApp(app)
                resolve(app)
                return 1
              })
            }
          })
        } catch (error) {
          throw new Error(error)
        }
      }
    })()
  }, [])

  return { app }
}

export default useCapability
