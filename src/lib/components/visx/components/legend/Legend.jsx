import React, { useContext, useCallback, useMemo } from "react";
// import { Legend as BaseLegend } from "@visx/legend";
import { LegendOrdinal, LegendItem, LegendLabel } from "@visx/legend";
import { RectShape, LineShape, CircleShape } from "@visx/legend";

import DataContext from "../../context/DataContext";
import { selectColor, isDefined } from "../../../../utils";

const legendGlyphSize = 15;

export default function Legend({
  alignLeft = true,
  direction = "row",
  // shape: Shape,
  style,
  ...props
}) {
  const {
    theme,
    margin,
    colorScale,
    dataRegistry,
    legendLabelStyle,
    size = "small",
  } = useContext(DataContext);

  const legendLabelProps = useMemo(
    () => ({
      ...theme.legendLabelStyles,
      fontSize: theme.legendLabelStyles.fontSize[size],
      ...legendLabelStyle,
    }),
    [theme]
  );

  return props.scale || colorScale ? (
    <LegendOrdinal
      scale={colorScale}
      labelFormat={(label) => `${label.toUpperCase()}`}
    >
      {(labels) => (
        <div style={{ display: "flex", flexDirection: "row" }}>
          {labels.map((label, i) => (
            <LegendItem
              key={`legend-quantile-${i}`}
              margin="0 5px"
              onClick={() => {
                // if (events) alert(`clicked: ${JSON.stringify(label)}`);
                console.log(`clicked: ${JSON.stringify(label)}`);
              }}
            >
              <svg width={legendGlyphSize} height={legendGlyphSize}>
                <rect
                  fill={label.value}
                  width={legendGlyphSize}
                  height={legendGlyphSize}
                />
              </svg>
              <LegendLabel align="left" style={legendLabelProps}>
                {label.text}
              </LegendLabel>
            </LegendItem>
          ))}
        </div>
      )}
    </LegendOrdinal>
  ) : null;
}
