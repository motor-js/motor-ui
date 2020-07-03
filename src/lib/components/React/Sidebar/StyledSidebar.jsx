import styled, { css } from 'styled-components'
import { defaultProps } from '../../../default-props'
import Box from '../Box'

const collapsableStyle = css`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  z-index: 0;
  width:  ${props => props.width} 
  transition: transform 0.3s ease-in-out;
  transform: ${({ open }) => (open ? 'translateX(0)' : 'translateX(-100%)')};
`

const StyledSidebar = styled(Box)`
  ${props => props.collapsable && collapsableStyle} 
`

StyledSidebar.defaultProps = {}
Object.setPrototypeOf(StyledSidebar.defaultProps, defaultProps)

export default StyledSidebar
