import React from 'react'
import PropTypes from 'prop-types'
import StyledSidebar from './StyledSidebar'

const Sidebar = ({
  children,
  isOpen,
  collapsable,
  ...rest
}) => {

  return (
    <StyledSidebar
      collapsable={collapsable}
      height={{ min: '100%' }}
      open={isOpen}
      {...rest}
    >
      {children}
    </StyledSidebar>
  )
}

export default Sidebar

Sidebar.propTypes = {
  /** contents of the sidebar */
  children: PropTypes.node,
  /** whether the sidebar is collapsable */
  collapsable: PropTypes.bool,
}

Sidebar.defaultProps = {
  children: undefined,
  collapsable: false,
}

