import React, { useContext, useCallback, useMemo } from "react";
// import { Legend as BaseLegend } from "@visx/legend";
import { LegendOrdinal, LegendItem, LegendLabel } from "@visx/legend";
import { RectShape, LineShape, CircleShape } from "@visx/legend";

import DataContext from "../../context/DataContext";
import { selectColor, isDefined } from "../../../../utils";

export default function Legend({
  alignLeft = true,
  direction = "row",
  shape: Shape,
  style,
  ...props
}) {
  const {
    theme,
    margin,
    colorScale,
    dataRegistry,
    legendLabelStyle,
    size,
  } = useContext(DataContext);

  const legendLabelProps = useMemo(
    () => ({
      style: {
        ...theme.legendLabelStyles,
        fontSize: theme.legendLabelStyles.fontSize[size],
        ...legendLabelStyle,
      },
    }),
    [theme]
  );
  const legendStyles = useMemo(
    () => ({
      display: "flex",
      background:
        selectColor(theme?.legendStyles.backgroundColor, theme) ?? "white",
      color: isDefined(legendLabelStyle)
        ? selectColor(legendLabelStyle.fill, theme)
        : selectColor(theme?.legendLabelStyles?.fill, theme),
      paddingLeft: margin.left,
      paddingRight: margin.right,

      [direction === "row" || direction === "row-reverse"
        ? "justifyContent"
        : "alignItems"]: alignLeft ? "flex-start" : "flex-end",
      style,
      overflow: "hidden",
    }),
    [theme, margin, alignLeft, direction, style]
  );
  const renderShape = useCallback(
    (shapeProps) => {
      if (Shape && typeof Shape !== "string") return <Shape {...shapeProps} />;

      const legendShape =
        Shape || isDefined(dataRegistry.entries()[0])
          ? dataRegistry.entries().length === 1
            ? dataRegistry.entries()[0].legendShape
            : dataRegistry
                .entries()
                .filter((item) => item.key === shapeProps.item)[0].legendShape
          : null;

      switch (legendShape) {
        case "circle":
          return <CircleShape {...shapeProps} />;
        case "line":
          return <LineShape {...shapeProps} />;
        case "dashed-line":
          return (
            <LineShape
              {...shapeProps}
              style={{ strokeDasharray: "5,3", ...shapeProps.style }}
            />
          );
        case "rect":
        default:
          return <RectShape {...shapeProps} />;
      }
    },
    [dataRegistry, Shape]
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
                alert(`clicked: ${JSON.stringify(label)}`);
              }}
            >
              <svg width={legendGlyphSize} height={legendGlyphSize}>
                <rect
                  fill={label.value}
                  width={legendGlyphSize}
                  height={legendGlyphSize}
                />
              </svg>
              <LegendLabel align="left" margin="0 0 0 4px">
                {label.text}
              </LegendLabel>
            </LegendItem>
          ))}
        </div>
      )}
    </LegendOrdinal>
  ) : null;
}
