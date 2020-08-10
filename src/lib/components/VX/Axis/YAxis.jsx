import { AxisLeft } from '@vx/axis'

const YAxis = ({
  scale,
  top,
  left,
  label,
  stroke,
  tickStroke,
  tickLabelProps,
}) => {

  return (
    <AxisLeft
      scale={scale}
      top={top}
      left={left}
      label={label}
      stroke={stroke}
      tickStroke={tickStroke}
      tickLabelProps={tickLabelProps}
    />
  )

}

export default YAxis
