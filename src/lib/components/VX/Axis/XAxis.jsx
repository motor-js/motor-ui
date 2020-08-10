import { AxisBottom } from '@vx/axis'

const XAxis = ({
  top,
  scale,
  numTicks,
  label,
  stroke,
  tickStroke,
  tickLabelProps
}) => {

  return (
    <AxisBottom
      top={top}
      scale={scale}
      numTicks={numTicks}
      label={label}
      stroke={stroke}
      tickStroke={tickStroke}
      tickLabelProps={tickLabelProps}
    />
  )

}

export default XAxis
