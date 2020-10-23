import React, { useCallback, useContext } from "react";
import { useTooltipInPortal, defaultStyles } from "@visx/tooltip";
import { TooltipProps as BaseTooltipProps } from "@visx/tooltip/lib/tooltips/Tooltip";
import { PickD3Scale } from "@visx/scale";
import { UseTooltipPortalOptions } from "@visx/tooltip/lib/hooks/useTooltipInPortal";

import TooltipContext from "../context/TooltipContext";
import DataContext from "../context/DataContext";
import { TooltipContextType } from "../types";
import getScaleBandwidth from "../utils/getScaleBandwidth";

/** fontSize + lineHeight from default styles break precise location of crosshair, etc. */
const TOOLTIP_NO_STYLE = {
  position: "absolute",
  pointerEvents: "none",
  fontSize: 0,
  lineHeight: 0,
};

const INVISIBLE_STYLES = {
  position: "absolute",
  left: 0,
  top: 0,
  opacity: 0,
  width: 0,
  height: 0,
  pointerEvents: "none",
};

export default function Tooltip({
  debounce,
  detectBounds,
  horizontalCrosshairStyle,
  glyphStyle,
  renderTooltip,
  resizeObserverPolyfill,
  scroll = true,
  showDatumGlyph = false,
  showHorizontalCrosshair = false,
  showSeriesGlyphs = false,
  showVerticalCrosshair = false,
  snapTooltipToDatumX = false,
  snapTooltipToDatumY = false,
  verticalCrosshairStyle,
  ...tooltipProps
}) {
  const {
    colorScale,
    theme,
    innerHeight,
    innerWidth,
    margin,
    xScale,
    yScale,
    dataRegistry,
  } = useContext(DataContext) || {};
  const tooltipContext = useContext(TooltipContext);
  const { containerRef, TooltipInPortal } = useTooltipInPortal({
    debounce,
    detectBounds,
    polyfill: resizeObserverPolyfill,
    scroll,
  });

  // To correctly position itself in a Portal, the tooltip must know its container bounds
  // this is done by rendering an invisible node whose ref can be used to find its parentElement
  const setContainerRef = useCallback(
    (ownRef) => {
      containerRef(ownRef?.parentElement ?? null);
    },
    [containerRef]
  );

  const tooltipContent = tooltipContext?.tooltipOpen
    ? renderTooltip({ ...tooltipContext, colorScale })
    : null;

  const showTooltip = tooltipContext?.tooltipOpen && tooltipContent != null;

  let tooltipLeft = tooltipContext?.tooltipLeft;
  let tooltipTop = tooltipContext?.tooltipTop;

  const xScaleBandwidth = xScale ? getScaleBandwidth(xScale) : 0;
  const yScaleBandwidth = yScale ? getScaleBandwidth(yScale) : 0;

  const getDatumLeftTop = useCallback(
    (key, datum) => {
      const entry = dataRegistry?.get(key);
      const xAccessor = entry?.xAccessor;
      const yAccessor = entry?.yAccessor;
      const left =
        xScale && xAccessor
          ? Number(xScale(xAccessor(datum))) + xScaleBandwidth / 2 ?? 0
          : undefined;
      const top =
        yScale && yAccessor
          ? Number(yScale(yAccessor(datum))) + yScaleBandwidth / 2 ?? 0
          : undefined;
      return { left, top };
    },
    [dataRegistry, xScaleBandwidth, yScaleBandwidth, xScale, yScale]
  );

  const nearestDatum = tooltipContext?.tooltipData?.nearestDatum;
  const nearestDatumKey = nearestDatum?.key ?? "";

  // snap x- or y-coord to the actual data point (not event coordinates)
  if (
    showTooltip &&
    nearestDatum &&
    (snapTooltipToDatumX || snapTooltipToDatumY)
  ) {
    const { left, top } = getDatumLeftTop(nearestDatumKey, nearestDatum.datum);
    tooltipLeft = snapTooltipToDatumX ? left : tooltipLeft;
    tooltipTop = snapTooltipToDatumY ? top : tooltipTop;
  }

  // collect positions + styles for glyphs; glyphs always snap to Datum, not event coords
  const glyphProps = [];

  if (showTooltip && (showDatumGlyph || showSeriesGlyphs)) {
    const radius = Number(glyphStyle?.radius ?? 4);
    const strokeWidth = Number(glyphStyle?.strokeWidth ?? 1.5);

    if (showSeriesGlyphs) {
      Object.values(tooltipContext?.tooltipData?.datumByKey ?? {}).forEach(
        ({ key, datum }) => {
          const color =
            colorScale?.(key) ?? theme?.htmlLabelStyles?.color ?? "#222";
          const { left, top } = getDatumLeftTop(key, datum);
          glyphProps.push({
            left: left == null ? left : left - radius - strokeWidth,
            top: top == null ? top : top - radius - strokeWidth,
            fill: color,
            stroke: theme?.backgroundColor,
            strokeWidth,
            radius,
          });
        }
      );
    } else if (nearestDatum) {
      const { left, top } = getDatumLeftTop(
        nearestDatumKey,
        nearestDatum.datum
      );
      glyphProps.push({
        left: (left ?? 0) - radius - strokeWidth,
        top: (top ?? 0) - radius - strokeWidth,
        fill:
          (nearestDatumKey && colorScale?.(nearestDatumKey)) ??
          null ??
          theme?.gridStyles?.stroke ??
          theme?.htmlLabelStyles?.color ??
          "#222",
        radius,
        strokeWidth,
      });
    }
  }

  return (
    // Tooltip can be rendered as a child of SVG or HTML since its output is rendered in a Portal.
    // So use svg element to find container ref because it's a valid child of SVG and HTML parents.
    <>
      <svg ref={setContainerRef} style={INVISIBLE_STYLES} />
      {showTooltip && (
        <>
          {/** To correctly position crosshair / glyphs in a Portal, we leverage the logic in TooltipInPortal */}
          {showVerticalCrosshair && (
            <TooltipInPortal
              className="visx-crosshair visx-crosshair-vertical"
              left={tooltipLeft}
              top={margin?.top}
              offsetLeft={0}
              offsetTop={0}
              detectBounds={false}
              style={TOOLTIP_NO_STYLE}
            >
              <svg width="1" height={innerHeight}>
                <line
                  x1={0}
                  x2={0}
                  y1={0}
                  y2={innerHeight}
                  strokeWidth={1.5}
                  stroke={
                    theme?.gridStyles?.stroke ??
                    theme?.htmlLabelStyles?.color ??
                    "#222"
                  }
                  {...verticalCrosshairStyle}
                />
              </svg>
            </TooltipInPortal>
          )}
          {showHorizontalCrosshair && (
            <TooltipInPortal
              className="visx-crosshair visx-crosshair-horizontal"
              left={margin?.left}
              top={tooltipTop}
              offsetLeft={0}
              offsetTop={0}
              detectBounds={false}
              style={TOOLTIP_NO_STYLE}
            >
              <svg width={innerWidth} height={1}>
                <line
                  x1={0}
                  x2={innerWidth}
                  y1={0}
                  y2={0}
                  strokeWidth={1.5}
                  stroke={
                    theme?.gridStyles?.stroke ??
                    theme?.htmlLabelStyles?.color ??
                    "#222"
                  }
                  {...horizontalCrosshairStyle}
                />
              </svg>
            </TooltipInPortal>
          )}
          {glyphProps.map(
            ({ left, top, fill, stroke, strokeWidth, radius }, i) =>
              top == null || left == null ? null : (
                <TooltipInPortal
                  key={i}
                  className="visx-tooltip-glyph"
                  left={left}
                  top={top}
                  offsetLeft={0}
                  offsetTop={0}
                  detectBounds={false}
                  style={TOOLTIP_NO_STYLE}
                >
                  <svg
                    width={(radius + strokeWidth) * 2}
                    height={(radius + strokeWidth) * 2}
                  >
                    {/** @TODO expand to support any @visx/glyph glyph */}
                    <circle
                      cx={radius + strokeWidth}
                      cy={radius + strokeWidth}
                      r={radius}
                      fill={fill}
                      stroke={stroke}
                      strokeWidth={strokeWidth}
                      paintOrder="fill"
                      {...glyphStyle}
                    />
                  </svg>
                </TooltipInPortal>
              )
          )}
          <TooltipInPortal
            left={tooltipLeft}
            top={tooltipTop}
            style={{
              ...defaultStyles,
              background: theme?.backgroundColor ?? "white",
              boxShadow: `0 1px 2px ${
                theme?.htmlLabelStyles?.color
                  ? `${theme?.htmlLabelStyles?.color}55`
                  : "#22222255"
              }`,

              ...theme?.htmlLabelStyles,
            }}
            {...tooltipProps}
          >
            {tooltipContent}
          </TooltipInPortal>
        </>
      )}
    </>
  );
}
