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
import { isEmpty } from "../../../../../utils";

export type BaseGlyphSeriesProps<
  XScale extends AxisScale,
  YScale extends AxisScale,
  Datum extends object
> = SeriesProps<XScale, YScale, Datum> & {
  /** Whether line should be rendered horizontally instead of vertically. */
  horizontal?: boolean;
  /** The size of a `Glyph`, a `number` or a function which takes a `Datum` and returns a `number`. */
  size?: number;
  // The style of a `Glyph`;
  style?: object;
  // The type of a `Glyph`;
  type?: string;
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
  // size = 12,
  renderGlyphs,
  elAccessor,
  index,
  style,
  type,
}: BaseGlyphSeriesProps<XScale, YScale, Datum> &
  WithRegisteredDataProps<XScale, YScale, Datum>) {
  const {
    colorScale,
    theme,
    width,
    height,
    currentSelectionIds,
    handleClick,
    multiColor,
    measureInfo,
    dataKeys,
    size,
    setBarStyle,
  } = useContext(DataContext);
  const { showTooltip, hideTooltip } = useContext(TooltipContext) ?? {};

  const [hoverId, setHoverId] = useState(null);

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

  const { scatter, valueLabelStyles, points } = theme;

  const glyphSize =
    type === "scatter" ? scatter.size || size : points.size || size;

  const getGlyphSize = (d: any) => Number(d[3].qNum / avgSize) * glyphSize;

  const getElemNumber = useCallback(elAccessor, [elAccessor]);

  let styleProps: object = null;

  switch (type) {
    case "text":
      styleProps = {
        ...valueLabelStyles,
        fontSize: valueLabelStyles.fontSize[size],
        ...style,
      };
      break;
    case "scatter":
      styleProps = {
        ...scatter,
        fontSize: valueLabelStyles.fontSize[size],
        ...style,
      };
      break;
    default:
      styleProps = {
        ...points,
        ...style,
      };
  }

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

  const onMouseMoveDatum = (event: MouseEvent, datum: any, id: number) => {
    const { x, y } = localPoint(event) || {};
    setHoverId(id);

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
              : dataKeys.length === 1
              ? colorScale(colorScale.domain()[0])
              : colorScale?.(dataKey) ?? theme?.colors?.[0] ?? "#222", // @TODO allow prop overriding
            styleProps: {
              ...styleProps,
              ...setBarStyle(id, isEmpty(currentSelectionIds), hoverId),
            },
            size: sizeByValue ? getGlyphSize(datum) : glyphSize,
            datum,
            onClick: () => handleMouseClick(id),
            onMouseMove: (e: MouseEvent) => onMouseMoveDatum(e, datum, id),
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
