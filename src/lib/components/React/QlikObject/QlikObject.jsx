import React, {
  useRef, useEffect, useState, useContext,
} from 'react'
import PropTypes from 'prop-types'
import useCapability from '../../../hooks/useCapability'
import { ConfigContext } from '../../../contexts/ConfigProvider'
import Spinner from '../Spinner'

const QlikObject = ({
  id,
  type,
  cols,
  options,
  noSelections,
  noInteraction,
  width,
  height,
  minWidth,
  minHeight,
  exportData,
  exportDataTitle,
  exportDataOptions,
  exportImg,
  exportImgTitle,
  exportImgOptions,
  exportPdf,
  exportPdfTitle,
  exportPdfOptions,
}) => {
  const node = useRef(null)
  const myConfig = useContext(ConfigContext)
  const { viz } = useCapability(myConfig)
  const [qViz, setQViz] = useState(null)

  const create = async (viz) => {
    const getViz = id ? viz.visualization.get(id) : viz.visualization.create(type, cols, options)
    const _qViz = await getViz
    _qViz.setOptions(options)
    await setQViz(_qViz)
  }

  const show = () => {
    qViz.show(node.current, { noSelections, noInteraction })
  }

  const close = () => {
    qViz.close()
  }

  const resize = () => {
    qViz.resize()
  }

  useEffect(() => {
    if (viz) {
      try {
        (async () => {
          if (!qViz) await create();
          if (qViz) show();
          window.addEventListener('resize', resize);
        })()
      } catch (_error) {
        console.warn(_error)
      }
    }
    return () => {
      if (qViz) close();
      window.removeEventListener('resize', resize);
    };
  }, [viz])


  return (
    <div style={{ height, border }}>
      { viz ? (<div ref={node} width={width} />) : (<Spinner width={width} size={30} />)}
    </div>
  )
}

export default QlikObject

QlikObject.propTypes = {
  height: PropTypes.string,
  width: PropTypes.string,
  border: PropTypes.string,
}

QlikObject.defaultProps = {
  height: '100px',
  width: '300px',
  border: null,
}
