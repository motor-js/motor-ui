import {
  useState, useEffect, useCallback, useRef,
} from 'react'

const useSearch = ({
  engine,
  searchValue,
  dimensions,
  qCount,
  qGroupItemCount,
}) => {
  const [searchResults, setSearchResults] = useState()
  const _isMounted = useRef(true)

  useEffect(() => {
    if (engine === undefined) {
    } else {
      (async () => {
        try {
          const qDoc = await engine
          const search = await qDoc.searchResults(
            {
              qSearchFields: dimensions,
            },
            [searchValue],
            {
              qOffset: 0,
              qCount,
              qGroupItemOptions: [
                {
                  qGroupItemType: 'FIELD',
                  qOffset: 0,
                  qCount: qGroupItemCount,
                },
              ],
            },
          )
          const res = await search
          if (_isMounted.current) {
            setSearchResults(res)
          }
        } catch (e) {
          console.warn(e)
        }
      })()
    }
  }, [engine, searchValue, qCount, qGroupItemCount])

  useEffect(() => () => _isMounted.current = false, [])

  const select = useCallback(
    id => (async () => {
      const qDoc = await engine
      qDoc.selectAssociations(
        {
          qSearchFields: dimensions,
          qContext: 'CurrentSelections'
        },
        [searchValue],
        
        id,
      ),
      []
    })(),
  )

  /*
  const beginSelections = useCallback(
    () => qObject.current.beginSelections(["/qHyperCubeDef"]),
    [true]
  );

  const endSelections = useCallback(
    (qAccept) => qObject.current.endSelections(qAccept),
    []
  );
*/

  return {
    searchResults,
    select,
   // beginSelections,
   // endSelections,
  }
}

export default useSearch
