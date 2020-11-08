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
  curve,
  data,
  dataKey,
  xAccessor,
  xScale,
  yAccessor,
  yScale,
  elAccessor,
  PathComponent = "path",
  index,
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
  } = useContext(DataContext);
  const { showTooltip, hideTooltip } = useContext(TooltipContext) ?? {};

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
        curve={curve}
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
    </g>
  );
}

export default withRegisteredData(BaseLineSeries);
