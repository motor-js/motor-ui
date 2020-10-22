import React, { useContext, useCallback, useMemo } from "react";
import { Legend as BaseLegend } from "@visx/legend";
import { RectShape, LineShape, CircleShape } from "@visx/legend";

import ChartContext from "../../context/ChartContext";
import { isDefined } from "../../utils/chartUtils";
import { selectColor } from "../../../../utils";

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
  } = useContext(ChartContext);

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

      const legendShape = Shape || dataRegistry?.[shapeProps.item]?.legendShape;
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
    <BaseLegend
      style={legendStyles}
      itemMargin={alignLeft ? "0 8px 0 0" : "0 0 0 8px"}
      shapeMargin="0 4px 0 0"
      direction={direction}
      legendLabelProps={legendLabelProps}
      scale={colorScale}
      shape={renderShape}
      {...props}
    />
  ) : null;
}
