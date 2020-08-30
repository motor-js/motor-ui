import React, { useContext } from "react";
import { animated, useSprings } from "react-spring";
import ChartContext from "../../context/ChartContext";
import { formatValue } from "../../util/formatValue";

export default function animatedText({
  bars,
  x,
  y,
  width,
  height,
  ...rectProps
}) {
  const { theme } = useContext(ChartContext);

  const {
    svgLabel: { baseLabel },
  } = theme;

  const labelProps = {
    ...baseLabel,
    pointerEvents: "none",
    stroke: "#fff",
    strokeWidth: 2,
    paintOrder: "stroke",
    fontSize: 12,
  };
  const animatedText = useSprings(
    bars.length,
    bars.map((bar) => ({
      x: x?.(bar) ?? bar.x,
      y: y?.(bar) ?? bar.y,
      width: width?.(bar) ?? bar.width,
      height: height?.(bar) ?? bar.height,
      value: bar.value,
      color: bar.color,
    }))
  );

  return (
    // react complains when using component if we don't wrap in Fragment
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <>
      {animatedText.map((bar, index) => (
        <animated.text
          key={`${index}`}
          x={bar.x}
          y={bar.y}
          width={bar.width}
          height={bar.height}
          fill={bar.color}
          {...labelProps}
          {...rectProps}
        >
          {formatValue(roundNum, bar.value, precision)}
        </animated.text>
      ))}
    </>
  );
}
