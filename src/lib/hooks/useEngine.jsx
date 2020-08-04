import { useState } from 'react';
import cogoToast from 'cogo-toast';

const enigma = require('enigma.js');
const schema = require('enigma.js/schemas/12.170.2.json');
const SenseUtilities = require('enigma.js/sense-utilities');

const MAX_RETRIES = 3;

function useEngine(config) {
  const intercept = [
    {
      // We only want to handle failed responses from QIX Engine:
      onRejected: function retryAbortedError(sessionReference, request, error) {
        console.warn('Request: Rejected', error);
        // We only want to handle aborted QIX errors:
        if (
          error.code === schema.enums.LocalizedErrorCode.LOCERR_GENERIC_ABORTED
        ) {
          // We keep track of how many consecutive times we have tried to do this call:
          request.tries = (request.tries || 0) + 1;
          console.warn(`Request: Retry #${request.tries}`);
          // We do not want to get stuck in an infinite loop here if something has gone
          // awry, so we only retry until we have reached MAX_RETRIES:
          if (request.tries <= MAX_RETRIES) {
            return request.retry();
          }
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
  const [engine, setEngine] = useState(() => {
    (async () => {
      if (config) {
        const myConfig = config;
        // Make it work for Qlik Core scaling https://github.com/qlik-oss/core-scaling
        // qlikcore/engine:12.248.0
        if (myConfig.core) {
          myConfig.subpath = myConfig.prefix ? `${myConfig.prefix}/app` : 'app';
          myConfig.route = `doc/${myConfig.appId}`;
        }
        const url = SenseUtilities.buildUrl(myConfig);
        try {
          const session = enigma.create({ schema, url, intercept });
          session.on('suspended', () => {
            console.warn('session suspended');
          });
          const _global = await session.open();
          const _doc = await _global.openDoc(config.appId);
          setEngine(_doc);
        } catch (err) {
          console.warn('Error', err);
          if (err.code === 1003) {
            setEngineError(`No engine. App Not found.`);
          //  cogoToast.error('App Not Found')
          } else {
         //   cogoToast.error('Enigma Error')
         console.warn('ERROR WARNING', err)
          }
        }
      }
    })();
  }, []);

  return { engine, engineError };
}

export default useEngine;
