import React from 'react'
import { TooltipWithBounds } from '@vx/tooltip';

const Tooltip = ({
  key,
  top,
  left,
  tooltipData
}) => {

  return (
    <TooltipWithBounds
      // set this to random so it correctly updates with parent bounds
      key={key}
      top={top}
      left={left}
    >
      Data value <strong>{tooltipData}</strong>
    </TooltipWithBounds>
  )
}

export default Tooltip
