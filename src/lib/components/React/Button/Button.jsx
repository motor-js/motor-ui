import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import StyledButton from './StyledButton'
import { ConfigContext } from '../../../contexts/ConfigProvider'
import { EngineContext } from '../../../contexts/EngineProvider'
import useEngine from '../../../hooks/useEngine'

const Button = ({ ...rest }) => {
  const { engine } = useContext(EngineContext)

  return <StyledButton engine={engine} {...rest} />
}

Button.propTypes = {
  /** Type of the button, choose noAction to use as a regular
   button object, otherwise you can clear selections, go back or forward
   */
  type: PropTypes.oneOf(['clearSelections', 'back', 'forward', 'default']),
  /** To apply block css property to the button */
  block: PropTypes.bool,
  /** On click callback function */
  onClick: PropTypes.func,
  /** Size of the button */
  size: PropTypes.oneOf(['tiny', 'small', 'medium', 'large', 'xlarge']),
  /** Set background color */
  color: PropTypes.string,
  /** Set margin */
  margin: PropTypes.string,
  /** Set width */
  width: PropTypes.string,
  /** Set font color */
  fontColor: PropTypes.string,
  /** Set border radius */
  borderRadius: PropTypes.string,
  /** Set border */
  border: PropTypes.string,
  /** Set outline */
  outline: PropTypes.string,
  /** Set active transform */
  activeTransform: PropTypes.string,
  /** Set active background color */
  activeBackgroundColor: PropTypes.string,
  /** Set active background size */
  activeBackgroundSize: PropTypes.string,
  /** Set active transition */
  activeTransition: PropTypes.string,
  /** Set transition */
  transition: PropTypes.string,
  /** Set box shadow on hover */
  hoverBoxShadow: PropTypes.string,
  /** Set border on hover */
  hoverBorder: PropTypes.string,
  /** Set background on hover */
  hoverBackground: PropTypes.string,
}

Button.defaultProps = {
  type: 'default',
  block: false,
  onClick: () => {},
  size: 'medium',
  color: 'brand',
  margin: '5px',
  width: null,
  fontColor: null,
  borderRadius: null,
  border: null,
  outline: null,
  activeTransform: null,
  activeBackgroundColor: null,
  activeBackgroundSize: null,
  activeTransition: null,
  transition: null,
  hoverBoxShadow: null,
  hoverBorder: null,
  hoverBackground: null,
}

export default Button
