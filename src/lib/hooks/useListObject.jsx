import {
  useCallback, useRef, useReducer, useEffect,
} from 'react'
import { deepMerge } from '../utils/object'
// import useSequencer from './useSequencer';

const initialState = {
  qDoc: null,
  qObject: null,
  qData: null,
  qLayout: null,
  selections: null,
}

function reducer(state, action) {
  const {
    payload: {
      qData, qLayout, selections, qDoc,
    }, type,
  } = action
  switch (type) {
    case 'update':
      return {
        ...state, qData, qLayout, selections,
      }
    case 'init':
      return {
        ...state, qDoc,
      }
    default:
      throw new Error()
  }
}

const initialProps = {
  autoSortByState: 1,
  qSortByAscii: 1,
  qSortByLoadOrder: 1,
  dimension: null,
  label: null,
  qListObjectDef: null,
  qPage: {
    qTop: 0,
    qLeft: 0,
    qWidth: 1,
    qHeight: 100,
  },
}

const useListObject = props => {
  const {
    qPage: qPageProp, dimension, qListObjectDef, qSortByAscii, qSortByLoadOrder, autoSortByState,
  } = deepMerge(initialProps, props)
  const { engine } = props

  const _isMounted = useRef(true)
  const [state, dispatch] = useReducer(reducer, initialState)

  const {
    qData, qLayout, selections,
  } = state

  const qObject = useRef(null)
  const qPage = useRef(qPageProp)

  /** Generate the Definition file */
  const generateQProp = useCallback((currentColumn = 0) => {
    const qProp = { qInfo: { qType: 'visualization' } }
    if (qListObjectDef) {
      qProp.qListObjectDef = qListObjectDef
    } else {
      const qDimensions = dimension.filter(col => (typeof col === 'string' && !col.startsWith('='))
        || (typeof col === 'object' && col.qDef && col.qDef.qFieldDefs)
        || (typeof col === 'object' && col.qLibraryId && col.qType && col.qType === 'dimension'))
        .map(col => {
          if (typeof col === 'string') {
            return { qDef: { qFieldDefs: [col], qSortCriterias: [{ qSortByLoadOrder, qSortByAscii }] } }
          }

          return col
        })
      const qLibraryId = { qLibraryId: (typeof dimension[0] === 'object' && dimension[0].qLibraryId) ? dimension[0].qLibraryId : '' }
      const qDef = qDimensions[currentColumn]
      qProp.qListObjectDef = {
        ...qLibraryId,
        ...qDef,
        qShowAlternatives: true,
        qAutoSortByState: { qDisplayNumberOfRows: autoSortByState },
      }
    }

    return qProp
  }, [autoSortByState, dimension, qListObjectDef, qSortByAscii, qSortByLoadOrder])

  const getLayout = useCallback(() => qObject.current.getLayout(), [])

  // Edit to extract all data
  const getData = useCallback(async () => {
    const qDataPages = await qObject.current.getListObjectData('/qListObjectDef', [qPage.current])

    return qDataPages[0]
  }, [])

  const update = useCallback(async () => {
    const _qLayout = await getLayout()
    const _qData = await getData()
    if (_qData && _isMounted.current) {
      const _selections = await _qData.qMatrix.filter(row => row[0].qState === 'S')
      dispatch({
        type: 'update',
        payload: {
          qData: _qData,
          qLayout: _qLayout,
          selections: _selections,
        },
      })
    } else if (_isMounted.current) {
      dispatch({
        type: 'update',
        payload:
        {
          qData: _qData,
          qLayout: _qLayout,
        },
      })
    }
  }, [getData, getLayout])

  const changePage = useCallback(newPage => {
    qPage.current = { ...qPage.current, ...newPage }

    update()
  }, [update])

  const beginSelections = async () => {
    // Make sure we close all other open selections. We usually get that when we have morethan one dropDown in the same page and while one is open, we click on the second one
    await state.qDoc.abortModal(true)
    await qObject.current.beginSelections(['/qListObjectDef'])
  }

  const endSelections = async qAccept => {
    // await state.qEngine.abortModal(true)
    await qObject.current.endSelections(qAccept)
  }
  const select = useCallback((qElemNumber, toggle = true, ignoreLock = false) => qObject.current.selectListObjectValues('/qListObjectDef', qElemNumber, toggle, ignoreLock), [])

  const searchListObjectFor = useCallback(string => qObject.current.searchListObjectFor('/qListObjectDef', string), [])

  const acceptListObjectSearch = useCallback((ignoreLock = false) => qObject.current.acceptListObjectSearch('/qListObjectDef', true, ignoreLock), [])

  const applyPatches = useCallback(patches => qObject.current.applyPatches(patches), [])

  const clearSelections = useCallback(() => qObject.current.clearSelections('/qListObjectDef'), [])

  useEffect(() => {
    if (!engine || qObject.current) return;
    (async () => {
      const qProp = generateQProp()
      const qDoc = await engine
      qObject.current = await qDoc.createSessionObject(qProp)
      // ToDo: make sure init is not called on every render - convert qDoc to qEngine
      if (_isMounted.current) dispatch({ type: 'init', payload: { qDoc } })
      qObject.current.on('changed', () => { update() })
      update()
    })()
  }, [generateQProp, engine, update])

  useEffect(() => () => _isMounted.current = false, [])

  return {
    qLayout,
    qData,
    changePage,
    select,
    beginSelections,
    endSelections,
    searchListObjectFor,
    acceptListObjectSearch,
    applyPatches,
    selections,
    clearSelections,
  }
}

export default useListObject
