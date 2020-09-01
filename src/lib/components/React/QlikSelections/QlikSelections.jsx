import React, { useRef, useEffect, useContext } from 'react'
import PropTypes from "prop-types"
import useCapability from '../../../hooks/useCapability'
import { ConfigContext } from '../../../contexts/ConfigProvider'
import Spinner from '../Spinner'

const QlikSelections = ({
  height,
  width,
  border,
}) => {
  const node = useRef(null)
  const myConfig = useContext(ConfigContext)
  const { viz } = useCapability(myConfig)

  useEffect(() => {
    if(viz) {
      try {
        (async () => {
          viz.getObject(node.current, 'CurrentSelections')
        })();
      } catch (_error) {
        console.warn(_error);
      }
    }
  },[viz])

  return (
    <div style={{ height, border }}>
      { viz ? (<div ref={node} width={width} />) : (<Spinner width={width} size={30} />)}
    </div>
  )

}

export default QlikSelections

QlikSelections.propTypes = {
  height: PropTypes.string,
  width: PropTypes.string,
  border: PropTypes.string,
}

QlikSelections.defaultProps = {
  height: '38px',
  width: '100%',
  border: null,
}