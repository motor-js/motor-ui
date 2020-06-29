import { useState, useEffect, useRef } from 'react'

let qDoc = null
let qObject = null

const useSelectionObject = ({ engine }) => {
  const _isMounted = useRef(true)
  const [qLayout, setQLatout] = useState(null)
  // const { qLayout } = state
  // const [qLayout, setQLayout] = useState(null)

  const update = async () => {
    const _qLayout = await qObject.getLayout()
    if (_isMounted.current) {
      setQLatout(_qLayout)
    }
  }

  const clearSelections = async (field, value) => {
    if (field) {
      const qField = await qDoc.getField(field)
      if (value) {
        await qField.toggleSelect(value)
      } else {
        await qField.clear()
      }
    } else {
      qDoc.clearAll()
    }
  }

  useEffect(() => {
    // eslint-disable-next-line no-empty
    if (engine === undefined) { } else {
      (async () => {
        const qProp = { qInfo: { qType: 'SelectionObject' }, qSelectionObjectDef: {} }
        qDoc = await engine
        qObject = await qDoc.createSessionObject(qProp)
        qObject.on('changed', () => { update() })
        update()
      })()
    }
  }, [engine])

  useEffect(() => (() => _isMounted.current = false), [])

  return { qLayout, clearSelections }
}

export default useSelectionObject
