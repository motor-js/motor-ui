import React, { useState } from 'react'
import useContextMenu from '../../hooks/useContextMenu'
import {
  StyledMenu, StyledListItem, StyledDownload, StyledFileDownload,
} from './MenuTheme'

const Menu = ({ outerRef, exportDataCallback, exportImageCallback, open }) => {
  const { xPos, yPos, menu } = useContextMenu(outerRef, open)

  if (menu) {
    return (
      <StyledMenu
        className="menu"
        top={yPos}
        left={xPos}
        size="medium"
      >
        <StyledListItem onClick={() => { exportDataCallback() }}>
          <StyledDownload />
          <span>Export Data</span>
        </StyledListItem>
        {/* }
          <StyledListItem onClick={() => { exportImageCallback() }}>
          <StyledDownload />
            Export Image
          </StyledListItem>
          <StyledListItem>Export PDF</StyledListItem>\
      */}
      </StyledMenu>
    )
  }

  return <></>
}

export default Menu

Menu.propTypes = {

}

Menu.defaultProps = {

}

