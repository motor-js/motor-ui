import React, { useContext, useCallback, useMemo } from "react";
// import { Legend as BaseLegend } from "@visx/legend";
import { LegendOrdinal, LegendItem, LegendLabel } from "@visx/legend";
import { RectShape, LineShape, CircleShape } from "@visx/legend";

import DataContext from "../../context/DataContext";
import { selectColor } from "../../../../utils";

export default function Legend({ shape: Shape, style, ...props }) {
  const {
    theme,
    theme: { legendStyles: legendStyle },
    margin,
    colorScale,
    dataRegistry,
    legendLabelStyle,
    size = "medium",
  } = useContext(DataContext);

  const direction = legendStyle ? legendStyle.direction : "row";
  const alignLeft = legendStyle ? legendStyle.alignLeft : false;
  const legendGlyphSize = legendStyle ? legendStyle.legendGlyphSize : 15;

  const legendStyles = useMemo(
    () => ({
      display: "flex",
      flexDirection: direction,
      background: legendStyle
        ? selectColor(legendStyle.backgroundColor, theme)
        : "white",
      color: legendLabelStyle
        ? selectColor(legendLabelStyle.fill, theme)
        : selectColor(theme?.legendLabelStyles?.fill, theme),
      paddingLeft: legendStyle ? legendStyle.margin.left : margin.left,
      paddingRight: legendStyle ? legendStyle.margin.right : margin.right,
      paddingBottom: legendStyle
        ? legendStyle.margin.bottom
        : `${Math.min(10, parseInt(margin.bottom, 10))}px`,

      [direction === "row" || direction === "row-reverse"
        ? "justifyContent"
        : "alignItems"]: alignLeft ? "flex-start" : "flex-end",
      style,
      overflow: "hidden",
    }),
    [theme, margin, alignLeft, direction, style, legendLabelStyle]
  );

  const legendLabelProps = useMemo(
    () => ({
      ...theme.legendLabelStyles,
      fontSize: theme.legendLabelStyles.fontSize[size],
      ...legendLabelStyle,
    }),
    [theme]
  );

  const isUpperCase = legendStyle ? legendStyle.upperCase : false;

  const LegendComponent = LegendOrdinal;

  const renderText = (label) => (isUpperCase ? label.toUpperCase() : label);

  const renderShape = useCallback(
    (legendGlyphSize, value) => {
      switch (Shape) {
        case "circle":
          return (
            <CircleShape
              fill={value}
              width={legendGlyphSize}
              height={legendGlyphSize}
            />
          );
        case "line":
          return (
            <LineShape
              fill={value}
              width={legendGlyphSize}
              height={legendGlyphSize}
            />
          );
        case "dashed-line":
          return (
            <LineShape
              fill={value}
              width={legendGlyphSize}
              height={legendGlyphSize}
              style={{ strokeDasharray: "5,3" }}
              fill={value}
              width={legendGlyphSize}
              height={legendGlyphSize}
            />
          );
        case "rect":
        default:
          return (
            <RectShape
              fill={value}
              width={legendGlyphSize}
              height={legendGlyphSize}
              style={style}
            />
          );
      }
    },
    [dataRegistry, Shape]
  );

  return props.scale || colorScale ? (
    <LegendComponent
      scale={colorScale}
      labelFormat={(label) => `${renderText(label)}`}
    >
      {(labels) => (
        <div className="visx-legend" style={legendStyles}>
          {labels.map((label, i) => (
            <LegendItem
              key={`legend-quantile-${i}`}
              margin="0 5px"
              // onClick={() => {
              //   // if (events) alert(`clicked: ${JSON.stringify(label)}`);
              //   console.log(`clicked: ${JSON.stringify(label)}`);
              // }}
            >
              {renderShape(legendGlyphSize, label.value)}
              <LegendLabel align="left" style={legendLabelProps}>
                {label.text}
              </LegendLabel>
            </LegendItem>
          ))}
        </div>
      )}
    </LegendComponent>
  ) : null;
}
