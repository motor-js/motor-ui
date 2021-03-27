import { useState } from "react";
import { getCapabilityAPIs } from '../utils/CapApiUtils/ConnectCapAPI'
//import { qApp } from '../utils/CapApiUtils/ConnectCapNew'

const enigma = require("enigma.js");
const schema = require("enigma.js/schemas/12.170.2.json");
const SenseUtilities = require("enigma.js/sense-utilities");

const MAX_RETRIES = 3;

function useEngine(config, capabilityAPI) {

  const responseInterceptors = [
    {
      // We only want to handle failed responses from QIX Engine:
      onRejected: function retryAbortedError(sessionReference, request, error) {
        console.warn(
          "Captured Request: Rejected",
          `Error Code: ${error.code} : ${error}`
        );
        // We only want to handle aborted QIX errors:
        if (
          error.code === schema.enums.LocalizedErrorCode.LOCERR_GENERIC_ABORTED
        ) {
          // We keep track of how many consecutive times we have tried to do this call:
          request.tries = (request.tries || 0) + 1;
          console.warn(`Captured Request: Retry #${request.tries}`);
          // We do not want to get stuck in an infinite loop here if something has gone
          // awry, so we only retry until we have reached MAX_RETRIES:
          if (request.tries <= MAX_RETRIES) {
            return request.retry();
          }
        }
        if (
          error.code ===
          schema.enums.LocalizedErrorCode.LOCERR_GENERIC_INVALID_PARAMETERS
        ) {
          return error.code;
        }
        if (
          error.code ===
          schema.enums.LocalizedErrorCode.LOCERR_HC_MODAL_OBJECT_ERROR
        ) {
          return error.code;
        }
        // If it was not an aborted QIX call, or if we reached MAX_RETRIES, we let the error
        // trickle down to potential other interceptors, and finally down to resolving/rejecting
        // the initial promise that the user got when invoking the QIX method:
        console.warn(error);

        return this.Promise.reject(error);
      },
    },
  ];

  const [engineError, setEngineError] = useState(false);
  const [app, setApp] = useState(null)
  const [errorCode, seErrorCode] = useState(null);
  const [engine, setEngine] = useState(() => {
    (async () => {
      if (config && config.qcs) {
        const tenantUri = config.host;
        const webIntegrationId = config.webIntId;

        const fetchResult = await fetch(
          `https://${tenantUri}/api/v1/csrf-token`,
          {
            mode: "cors", // cors must be enabled
            credentials: "include", // credentials must be included
            headers: {
              "qlik-web-integration-id": webIntegrationId,
              "content-type": "application/json",
            },
          }
        ).catch((error) => {
          console.log("caught failed fetch", error);
        });

        const csrfToken = fetchResult.headers.get("qlik-csrf-token");
        if (csrfToken == null) {
          console.log("Not logged in");
          seErrorCode(-1);

          return -1;
        }
        const session = enigma.create({
          schema,
          url: `wss://${tenantUri}/app/${config.appId}?qlik-web-integration-id=${webIntegrationId}&qlik-csrf-token=${csrfToken}`,
          createSocket: (url) => new WebSocket(url),
          responseInterceptors,
        });
        session.on("suspended", () => {
          console.warn("Captured session suspended");
        });
        session.on("error", () => {
          console.warn("Captured session error");
        });
        session.on("closed", () => {
          console.warn("Session was closed");
          seErrorCode(-3);

          return -3;
        });
        const _global = await session.open();
        const _doc = await _global.openDoc(config.appId);
        const _app = await capabilityAPI && getCapabilityAPIs(config)
        setApp(_app)
        setEngine(_doc);
        seErrorCode(1);

        return 1;
      }
      if (config) {
        const myConfig = config;
        const url = SenseUtilities.buildUrl(myConfig);
        try {
          const session = enigma.create({
            schema,
            url,
            responseInterceptors,
          });
          session.on("suspended", () => {
            console.warn("Captured session suspended");
          });
          session.on("error", () => {
            console.warn("Captured session error");
          });
          session.on("closed", () => {
            console.warn("Session was closed");
            seErrorCode(-3);

            return -3;
          });
          const _global = await session.open();
          const _doc = await _global.openDoc(config.appId);
          const _app = await capabilityAPI && getCapabilityAPIs(config)
          setApp(_app)
          setEngine(_doc);
          seErrorCode(1);

          return 1;
        } catch (err) {
          console.warn("Captured Error", err);
          if (err.code === 1003) {
            setEngineError("No engine. App Not found.");
          }
          seErrorCode(-2);

          return -2;
        }
      }
    })();
  }, []);

  return { engine, engineError, errorCode, app }
}


export default useEngine;
