import React, {
  useContext,
  useCallback,
  useMemo,
  useState,
  EventHandler,
} from "react";
import { AxisScale } from "@visx/axis";
import DataContext from "../../../context/DataContext";
import { GlyphProps, GlyphsProps, SeriesProps } from "../../../types";
import withRegisteredData, {
  WithRegisteredDataProps,
} from "../../../enhancers/withRegisteredData";
import getScaledValueFactory from "../../../utils/getScaledValueFactory";
import useEventEmitter, { HandlerParams } from "../../../hooks/useEventEmitter";
import findNearestDatumX from "../../../utils/findNearestDatumX";
import TooltipContext from "../../../context/TooltipContext";
import findNearestDatumY from "../../../utils/findNearestDatumY";
import isValidNumber from "../../../typeguards/isValidNumber";
import { localPoint } from "@visx/event";

export type BaseGlyphSeriesProps<
  XScale extends AxisScale,
  YScale extends AxisScale,
  Datum extends object
> = SeriesProps<XScale, YScale, Datum> & {
  /** Whether line should be rendered horizontally instead of vertically. */
  horizontal?: boolean;
  /** The size of a `Glyph`, a `number` or a function which takes a `Datum` and returns a `number`. */
  // size?: number | ((d: Datum) => number);
  size?: number;
  /** Function which handles rendering glyphs. */
  renderGlyphs: (
    glyphsProps: GlyphsProps<XScale, YScale, Datum>
  ) => React.ReactNode;
};

function BaseGlyphSeries<
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
  horizontal,
  size = 8,
  renderGlyphs,
  elAccessor,
  index,
}: BaseGlyphSeriesProps<XScale, YScale, Datum> &
  WithRegisteredDataProps<XScale, YScale, Datum>) {
  const {
    colorScale,
    theme,
    width,
    height,
    currentSelectionIds,
    handleClick,
    setBarStyle,
    multiColor,
    measureInfo,
  } = useContext(DataContext);
  const { showTooltip, hideTooltip } = useContext(TooltipContext) ?? {};

  const getScaledX = useCallback(
    getScaledValueFactory(xScale, xAccessor, index),
    [xScale, xAccessor]
  );

  const getScaledY = useCallback(
    getScaledValueFactory(yScale, yAccessor, index),
    [yScale, yAccessor]
  );

  const sizeByValue = measureInfo.length === 3;
  const avgSize = sizeByValue
    ? (measureInfo[2].qMax + measureInfo[2].qMin) / 2
    : null;

  const getGlyphSize = (d: any) => Number(d[3].qNum / avgSize) * size;

  const getElemNumber = useCallback(elAccessor, [elAccessor]);

  const [hoverId, setHoverId] = useState(null);

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
      elAccessor,
      width,
      height,
      showTooltip,
      horizontal,
    ]
  );
  useEventEmitter("mousemove", handleMouseMove);
  useEventEmitter("mouseout", hideTooltip);

  const handleMouseClick = (id: string) => {
    const selectionId = Number(id);
    const selections = currentSelectionIds.includes(selectionId)
      ? currentSelectionIds.filter(function(value: number, index, arr) {
          return value !== selectionId;
        })
      : [...currentSelectionIds, selectionId];
    handleClick(selections);
  };

  // const onMouseMove = (params?: HandlerParams) => {
  //   const { x: svgMouseX, y: svgMouseY } = localPoint(params) || {};
  //   const svgPoint = { x: svgMouseX, y: svgMouseY };
  //   if (svgPoint && width && height && showTooltip) {
  //     const datum = (horizontal ? findNearestDatumY : findNearestDatumX)({
  //       point: svgPoint,
  //       data,
  //       xScale,
  //       yScale,
  //       xAccessor,
  //       yAccessor,
  //       width,
  //       height,
  //     });
  //     console.log(datum);
  //     if (datum) {
  //       showTooltip({
  //         key: dataKey,
  //         ...datum,
  //         svgPoint,
  //       });
  //     }
  //   }
  // };

  const onMouseMoveDatum = (event: MouseEvent, datum: any) => {
    const { x, y } = localPoint(event) || {};

    const nearestDatum: any = {};
    nearestDatum.key = dataKey;
    nearestDatum.datum = datum;
    nearestDatum.index = datum[0].qElemNumber;
    nearestDatum.svgPoint = { x, y };

    if (datum && showTooltip) {
      showTooltip({
        ...nearestDatum,
      });
    }
  };

  const onMouseLeave = () => {
    hideTooltip();
    // console.log("hoverid", hoverId);
    setHoverId(null);
  };

  const glyphs = useMemo(
    () =>
      data
        .map((datum, i) => {
          const x = getScaledX(datum);
          if (!isValidNumber(x)) return null;
          const y = getScaledY(datum);
          if (!isValidNumber(y)) return null;
          const id = getElemNumber(datum);
          if (!isValidNumber(id)) return null;
          return {
            key: `${i}`,
            x,
            y,
            id,
            color: multiColor
              ? colorScale?.(multiColor[i])
              : colorScale?.(dataKey) ?? theme?.colors?.[0] ?? "#222", // @TODO allow prop overriding
            // size: typeof size === "function" ? size(datum) : size,
            size: sizeByValue ? getGlyphSize(datum) : size,
            datum,
            // style: setBarStyle(id, isEmpty(currentSelectionIds), hoverId),
            onClick: () => handleMouseClick(id),
            onMouseEnter: () => setHoverId(Number(id)),
            // onMouseMove: (e) => onMouseMoveDatum(e, datum, getColor(datum, i))
            onMouseMove: (e: MouseEvent) => onMouseMoveDatum(e, datum),
            onMouseLeave: onMouseLeave,
          };
        })
        .filter((point) => point) as GlyphProps<Datum>[],
    [getScaledX, getScaledY, data, size]
  );

  return (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <g className="visx-glyph-series">
      {renderGlyphs({ glyphs, xScale, yScale, horizontal })}
    </g>
  );
}

export default withRegisteredData(BaseGlyphSeries);
