import React, {
  useContext,
  useCallback,
  useMemo,
  useEffect,
  useState,
} from "react";
import { PositionScale } from "@visx/shape/lib/types";
import { scaleBand } from "@visx/scale";
import isChildWithProps from "../../../typeguards/isChildWithProps";
import { BaseBarSeriesProps } from "./BaseBarSeries";
import { BarsProps, DataContextType } from "../../../types";
import DataContext from "../../../context/DataContext";
import getScaleBandwidth from "../../../utils/getScaleBandwidth";
import findNearestDatumY from "../../../utils/findNearestDatumY";
import findNearestDatumX from "../../../utils/findNearestDatumX";
import useEventEmitter, { HandlerParams } from "../../../hooks/useEventEmitter";
import TooltipContext from "../../../context/TooltipContext";
import getScaleBaseline from "../../../utils/getScaleBaseline";
import { isEmpty } from "../../../../../utils";
import { localPoint } from "@visx/event";

export type BaseBarGroupProps<
  XScale extends PositionScale,
  YScale extends PositionScale
> = {
  /** `BarSeries` elements */
  children: JSX.Element | JSX.Element[];
  /** Group band scale padding, [0, 1] where 0 = no padding, 1 = no bar. */
  padding?: number;
  /** Comparator function to sort `dataKeys` within a bar group. By default the DOM rendering order of `BarGroup`s `children` is used. */
  sortBars?: (dataKeyA: string, dataKeyB: string) => number;
  /** Rendered component which is passed BarsProps by BaseBarGroup after processing. */
  BarsComponent: React.FC<BarsProps<XScale, YScale>>;
};

export default function BaseBarGroup<
  XScale extends PositionScale,
  YScale extends PositionScale,
  Datum extends object
>({
  children,
  padding = 0.1,
  sortBars,
  BarsComponent,
}: BaseBarGroupProps<XScale, YScale>) {
  const {
    xScale,
    yScale,
    colorScale,
    theme,
    dataRegistry,
    registerData,
    unregisterData,
    width,
    height,
    currentSelectionIds,
    handleClick,
    horizontal,
    setBarStyle,
  } = (useContext(DataContext) as unknown) as DataContextType<
    XScale,
    YScale,
    Datum
  >;

  const [hoverId, setHoverId] = useState(0);

  const { hover, selection, nonSelection, noSelections } = theme;

  const barSeriesChildren = useMemo(
    () =>
      React.Children.toArray(children).filter((child) =>
        isChildWithProps<BaseBarSeriesProps<XScale, YScale, Datum>>(child)
      ),
    [children]
  ) as React.ReactElement<BaseBarSeriesProps<XScale, YScale, Datum>>[];

  // extract data keys from child series
  const dataKeys: string[] = useMemo(
    () =>
      barSeriesChildren
        .map((child) => child.props.dataKey ?? "")
        .filter((key) => key),
    [barSeriesChildren]
  );

  // register all child data
  useEffect(() => {
    const dataToRegister = barSeriesChildren.map((child) => {
      const {
        dataKey: key,
        data,
        index,
        xAccessor,
        yAccessor,
        elAccessor,
      } = child.props;
      return { key, data, index, xAccessor, yAccessor, elAccessor };
    });

    registerData(dataToRegister);
    return () => unregisterData(dataKeys);
  }, [registerData, unregisterData, barSeriesChildren, dataKeys]);

  // create group scale
  const groupScale = useMemo(
    () =>
      scaleBand<string>({
        domain: sortBars ? [...dataKeys].sort(sortBars) : dataKeys,
        range: [0, getScaleBandwidth(horizontal ? yScale : xScale)],
        padding,
      }),
    [sortBars, dataKeys, xScale, yScale, horizontal, padding]
  );

  const { showTooltip, hideTooltip } = useContext(TooltipContext) ?? {};
  const handleMouseMove = useCallback(
    (params?: HandlerParams) => {
      const { svgPoint } = params || {};
      // invoke showTooltip for each key so all data is available in context,
      // and let Tooltip find the nearest point among them
      dataKeys.forEach((key) => {
        const entry = dataRegistry.get(key);
        if (entry && svgPoint && width && height && showTooltip) {
          const datum = (horizontal ? findNearestDatumY : findNearestDatumX)({
            point: svgPoint,
            data: entry.data,
            xScale,
            yScale,
            xAccessor: entry.xAccessor,
            yAccessor: entry.yAccessor,
            width,
            height,
          });
          if (datum) {
            showTooltip({
              key,
              ...datum,
              svgPoint,
            });
          }
        }
      });
    },
    [
      dataKeys,
      dataRegistry,
      horizontal,
      xScale,
      yScale,
      width,
      height,
      showTooltip,
    ]
  );
  useEventEmitter("mousemove", handleMouseMove);
  useEventEmitter("mouseout", hideTooltip);

  const xZeroPosition = useMemo(() => (xScale ? getScaleBaseline(xScale) : 0), [
    xScale,
  ]);
  const yZeroPosition = useMemo(() => (yScale ? getScaleBaseline(yScale) : 0), [
    yScale,
  ]);

  const registryEntries = dataKeys.map((key) => dataRegistry.get(key));

  // if scales and data are not available in the registry, bail
  if (
    registryEntries.some((entry) => entry == null) ||
    !xScale ||
    !yScale ||
    !colorScale
  ) {
    return null;
  }

  const barThickness = getScaleBandwidth(groupScale);

  const bars = registryEntries.flatMap(
    ({ xAccessor, yAccessor, elAccessor, data, key, index }) => {
      const getLength = (d: Datum) =>
        horizontal
          ? (xScale(xAccessor(d, index)) ?? 0) - xZeroPosition
          : (yScale(yAccessor(d, index)) ?? 0) - yZeroPosition;

      const getGroupPosition = horizontal
        ? (d: Datum) => yScale(yAccessor(d)) ?? 0
        : (d: Datum) => xScale(xAccessor(d)) ?? 0;

      const withinGroupPosition = groupScale(key) ?? 0;

      const getX = horizontal
        ? (d: Datum) => xZeroPosition + Math.min(0, getLength(d))
        : (d: Datum) => getGroupPosition(d) + withinGroupPosition;

      const getY = horizontal
        ? (d: Datum) => getGroupPosition(d) + withinGroupPosition
        : (d: Datum) => yZeroPosition + Math.min(0, getLength(d));

      const getElemNumber = (d: Datum) => elAccessor(d) ?? null;

      const getWidth = horizontal
        ? (d: Datum) => Math.abs(getLength(d))
        : () => barThickness;
      const getHeight = horizontal
        ? () => barThickness
        : (d: Datum) => Math.abs(getLength(d));

      const handleMouseClick = (id: string) => {
        const selectionId = Number(id);
        const selections = currentSelectionIds.includes(selectionId)
          ? currentSelectionIds.filter(function(value: number, index, arr) {
              return value !== selectionId;
            })
          : [...currentSelectionIds, selectionId];
        handleClick(selections);
      };

      const onMouseMove = (params?: HandlerParams) => {
        const { x: svgMouseX, y: svgMouseY } = localPoint(params) || {};
        const svgPoint = { x: svgMouseX, y: svgMouseY };
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
              key,
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

      return data.map((datum, index) => ({
        key: `${key}-${index}`,
        x: getX(datum),
        y: getY(datum),
        id: getElemNumber(datum),
        width: getWidth(datum),
        height: getHeight(datum),
        fill: colorScale(key),
        style: setBarStyle(
          Number(getElemNumber(datum)),
          isEmpty(currentSelectionIds),
          hoverId
        ),
        onClick: () => handleMouseClick(getElemNumber(datum)),
        onMouseEnter: () => setHoverId(Number(getElemNumber(datum))),
        onMouseLeave: () => setHoverId(null),
        onMouseMove: onMouseMove,
        // onMouseLeave: onMouseLeave,
      }));
    }
  );

  return (
    <g className="visx-bar-group">
      <BarsComponent
        bars={bars}
        horizontal={horizontal}
        xScale={xScale}
        yScale={yScale}
      />
    </g>
  );
}
