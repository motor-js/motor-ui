import React, { useContext, useCallback, useState } from "react";
import LinePath from "@visx/shape/lib/shapes/LinePath";
import { AxisScale } from "@visx/axis";
import DataContext from "../../../context/DataContext";
import { SeriesProps } from "../../../types";
import withRegisteredData, {
  WithRegisteredDataProps,
} from "../../../enhancers/withRegisteredData";
import getScaledValueFactory from "../../../utils/getScaledValueFactory";
import useEventEmitter, { HandlerParams } from "../../../hooks/useEventEmitter";
import findNearestDatumX from "../../../utils/findNearestDatumX";
import TooltipContext from "../../../context/TooltipContext";
import findNearestDatumY from "../../../utils/findNearestDatumY";
import { localPoint } from "@visx/event";
import { isEmpty } from "../../../../../utils";
import isDefined from "../../../typeguards/isDefined";

import { GlyphCircle } from "@visx/glyph";
import { Text } from "@visx/text";

export type BaseLineSeriesProps<
  XScale extends AxisScale,
  YScale extends AxisScale,
  Datum extends object
> = SeriesProps<XScale, YScale, Datum> & {
  /** Rendered component which is passed path props by BaseLineSeries after processing. */
  PathComponent?:
    | React.FC<Omit<React.SVGProps<SVGPathElement>, "ref">>
    | "path";
} & Omit<
    React.SVGProps<SVGPathElement>,
    "x" | "y" | "x0" | "x1" | "y0" | "y1" | "ref"
  >;

function BaseLineSeries<
  XScale extends AxisScale,
  YScale extends AxisScale,
  Datum extends object
>({
  data,
  dataKey,
  xAccessor,
  xScale,
  yAccessor,
  yScale,
  elAccessor,
  PathComponent = "path",
  showLabels = true,
  index,
  size,
  ...lineProps
}: BaseLineSeriesProps<XScale, YScale, Datum> &
  WithRegisteredDataProps<XScale, YScale, Datum>) {
  const {
    colorScale,
    theme,
    width,
    height,
    currentSelectionIds,
    handleClick,
    setBarStyle,
    horizontal,
    valueLabelStyle,
  } = useContext(DataContext);
  const { showTooltip, hideTooltip } = useContext(TooltipContext) ?? {};

  const showPoints = { symbol: "square", size: 50, strokeWidth: 2 };

  console.log(valueLabelStyle, size);

  const { valueLabelStyles } = theme;

  const labelProps = {
    ...valueLabelStyles,
    fontSize: valueLabelStyles.fontSize[size],
    ...valueLabelStyle,
  };

  const getScaledX = useCallback(
    getScaledValueFactory(xScale, xAccessor, index),
    [xScale, xAccessor]
  );
  const [hoverId, setHoverId] = useState(null);
  const getScaledY = useCallback(
    getScaledValueFactory(yScale, yAccessor, index),
    [yScale, yAccessor]
  );
  const color = colorScale?.(dataKey) ?? theme?.colors?.[0] ?? "#222";
  // let ChartGlyph = getSymbol(isDefined(glyph) ? glyph.symbol : showPoints);
  let ChartGlyph = GlyphCircle;
  // let ChartGlyph = showPoints;

  const handleMouseMove = useCallback(
    (params?: HandlerParams) => {
      const { svgPoint } = params || {};
      if (svgPoint && width && height && showTooltip) {
        const datum = (horizontal ? findNearestDatumY : findNearestDatumX)({
          point: svgPoint,
          data,
          xScale,
          yScale,
          xAccessor,
          yAccessor,
          width,
          height,
        });
        if (datum) {
          showTooltip({
            key: dataKey,
            ...datum,
            svgPoint,
          });
        }
      }
    },
    [
      dataKey,
      data,
      xScale,
      yScale,
      xAccessor,
      yAccessor,
      width,
      height,
      showTooltip,
      horizontal,
    ]
  );

  useEventEmitter("mousemove", handleMouseMove);
  useEventEmitter("mouseout", hideTooltip);

  const onClick = (event: MouseEvent) => {
    const { x: svgMouseX, y: svgMouseY } = localPoint(event) || {};
    const svgPoint = {
      x: svgMouseX,
      y: svgMouseY,
    };
    if (svgPoint && width && height) {
      const datum = (horizontal ? findNearestDatumY : findNearestDatumX)({
        point: svgPoint,
        data,
        xScale,
        yScale,
        xAccessor,
        yAccessor,
        width,
        height,
      });

      if (datum) {
        const selectionId = Number(elAccessor(datum.datum));

        const selections = currentSelectionIds.includes(selectionId)
          ? currentSelectionIds.filter(function(value: number, index, arr) {
              return value !== selectionId;
            })
          : [...currentSelectionIds, selectionId];
        handleClick(selections);
      }
    }
  };

  const onMouseMove = (event: MouseEvent) => {
    const { x: svgMouseX, y: svgMouseY } = localPoint(event) || {};
    const svgPoint = {
      x: svgMouseX,
      y: svgMouseY,
    };
    if (svgPoint && width && height && showTooltip) {
      const datum = (horizontal ? findNearestDatumY : findNearestDatumX)({
        point: svgPoint,
        data,
        xScale,
        yScale,
        xAccessor,
        yAccessor,
        width,
        height,
      });
      if (datum) {
        showTooltip({
          key: dataKey,
          ...datum,
          svgPoint,
        });
      }
    }
  };

  const onMouseLeave = () => {
    hideTooltip();
    setHoverId(null);
  };

  return (
    <g className="visx-line-series">
      <LinePath
        data={data}
        x={getScaledX}
        y={getScaledY}
        stroke={color}
        strokeWidth={2}
        {...lineProps}
      >
        {({ path }) => (
          <PathComponent
            stroke={color}
            strokeWidth={2}
            fill="none"
            style={setBarStyle(hoverId, isEmpty(currentSelectionIds), hoverId)}
            onClick={onClick}
            onMouseEnter={() => setHoverId(Number(data))}
            onMouseMove={onMouseMove}
            onMouseLeave={onMouseLeave}
            {...lineProps}
            d={path(data) || ""}
          />
        )}
      </LinePath>
      {(showPoints || showLabels) &&
        data.map((d, i) => {
          const left = getScaledX(d);
          const top = getScaledY(d);
          d.selectionId = Number(elAccessor(d));
          return (
            <g key={`line-glyph-${i}`}>
              {showPoints && (
                <ChartGlyph
                  left={left}
                  top={top}
                  size={
                    isDefined(showPoints) ? showPoints.size : theme.points.size
                  }
                  fill={color}
                  stroke={color}
                  strokeWidth={
                    isDefined(showPoints)
                      ? showPoints.strokeWidth
                      : theme.points.strokeWidth
                  }
                  style={{ cursor: "pointer " }}
                  onClick={() => {
                    const selections = currentSelectionIds.includes(
                      d.selectionId
                    )
                      ? currentSelectionIds.filter(function(value) {
                          return value !== d.selectionId;
                        })
                      : [...currentSelectionIds, d.selectionId];
                    handleClick(selections);
                  }}
                  onMouseMove={onMouseMove}
                  onMouseLeave={() => {
                    hideTooltip();
                  }}
                />
              )}
              {showLabels && (
                <Text
                  {...labelProps}
                  key={`line-label-${i}`}
                  x={left}
                  y={top}
                  dx={horizontal ? "0.5em" : 0}
                  dy={horizontal ? 0 : "-0.74em"}
                >
                  {/* {formatValue(getValue(d))} */}
                  {yAccessor(d)}
                </Text>
              )}
            </g>
          );
        })}
    </g>
  );
}

export default withRegisteredData(BaseLineSeries);
