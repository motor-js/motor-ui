import React, { useContext } from "react";
import { TooltipWithBounds, Portal, defaultStyles } from "@vx/tooltip";
import { scaleOrdinal } from "@vx/scale";
import { timeParse, timeFormat } from "d3-time-format";

import TooltipContext from "../context/TooltipContext";
import ChartContext from "../context/ChartContext";

export const parseDate = timeParse("%Y%m%d");
export const formatDate = timeFormat("%b %d");
export const formatYear = timeFormat("%Y");
export const dateFormatter = (date) => formatDate(parseDate(date));

export default function Tooltip({
  // renderTooltip,
  snapToDataX,
  snapToDataY,
  showVerticalCrosshair,
  renderInPortal = false,
}) {
  const { tooltipData } = useContext(TooltipContext) || {};

  const {
    margin,
    xScale,
    yScale,
    colorScale,
    dataRegistry,
    height,
    theme,
    formatValue,
    measureInfo,
    dimensionInfo,
    dataKeys,
    singleDimension,
    singleMeasure,
    showClosestItem,
  } = useContext(ChartContext) || {};

  // early return if there's no tooltip
  const {
    closestDatum,
    svgMouseX,
    svgMouseY,
    pageX,
    pageY,
    svgOriginX,
    svgOriginY,
  } = tooltipData || {};

  if (!closestDatum || svgMouseX == null || svgMouseY == null) return null;

  const { xAccessor, yAccessor } = dataRegistry[closestDatum.key];

  const xCoord = snapToDataX
    ? xScale(xAccessor(closestDatum.datum)) +
      (xScale.bandwidth?.() ?? 0) / 2 +
      (renderInPortal ? svgOriginX : 0)
    : renderInPortal
    ? pageX
    : svgMouseX;

  const yCoord = snapToDataY
    ? yScale(yAccessor(closestDatum.datum)) -
      (yScale.bandwidth?.() ?? 0) / 2 +
      (renderInPortal ? svgOriginY : 0)
    : renderInPortal
    ? pageY
    : svgMouseY;

  const Container = renderInPortal ? Portal : React.Fragment;

  // const Console = (prop) => (
  //   console[Object.keys(prop)[0]](...Object.values(prop)),
  //   null // ➜ React components must return something
  // );

  const getValue = (measure, data) => {
    const x = data.datum.filter((s) => s.qText === measure);
    return x[0].qNum;
  };

  function renderTooltip({ closestData, closestDatum, colorScale }) {
    const seriesKey = closestDatum.key;
    const color =
      singleDimension && singleMeasure && dataKeys
        ? colorScale(`${closestDatum.datum[0].qText}`)
        : colorScale(`${closestDatum.key}`);
    let xVal = closestDatum.datum[0].qNum || x0;
    if (typeof xVal === "string") {
      xVal = parseDate(xVal) === null ? xVal : dateFormatter(xVal);
    } else if (typeof xVal !== "string" && Number(xVal) > 1000000) {
      xVal = formatDate(xVal);
    }
    let valIdx = null;

    if (singleDimension) {
      measureInfo.forEach((v, idx) => {
        if (v.qFallbackTitle === seriesKey) valIdx = idx + 1;
      });
    }

    const yVal = singleDimension
      ? closestDatum.datum[valIdx].qNum || "--"
      : closestDatum.datum.filter((d) => d.qText === seriesKey)[0].qNum || "--";

    const yValText = singleDimension
      ? seriesKey || "--"
      : measureInfo[0].qFallbackTitle || "--";

    return (
      <>
        {showClosestItem ? (
          <div>
            {seriesKey && (
              <div>
                <strong style={{ color }}>{seriesKey}</strong>
              </div>
            )}
            <div>
              <strong style={{ color }}>
                {dimensionInfo[0].qFallbackTitle}{" "}
              </strong>
              {xVal}
            </div>
            <div>
              <strong style={{ color }}>{yValText} </strong>
              {yVal && formatValue(yVal)}
            </div>
            {/*   {data && (
              <div>
                <strong style={{ color }}>index </strong>
                {data.indexOf(datum)}
              </div>
            )}{" "}
            */}
          </div>
        ) : (
          <>
            {/* <div>{closestDatum.datum[0].qText}</div> */}
            <div>{xVal}</div>
            {/* <Console log={"dd"} /> */}
            <br />
            {singleDimension && singleMeasure && dataKeys && (
              <div
                style={{
                  color: colorScale(`${closestDatum.datum[0].qText}`),
                  textDecoration: "underline solid currentColor",
                }}
              >
                {measureInfo[0].qFallbackTitle}{" "}
                {formatValue(closestDatum.datum[1].qNum)}
              </div>
            )}
            {singleDimension &&
              !singleMeasure &&
              measureInfo.map(
                (measure, index) =>
                  closestData?.[`${measure.qFallbackTitle}`] &&
                  closestDatum.datum[0].qText ===
                    closestData[`${measure.qFallbackTitle}`].datum[0].qText && (
                    <div
                      key={measure.qFallbackTitle}
                      style={{
                        color: colorScale(`${measure.qFallbackTitle}`),
                        textDecoration:
                          closestDatum.key === `${measure.qFallbackTitle}`
                            ? "underline solid currentColor"
                            : "none",
                        fontWeight:
                          closestDatum.key === `${measure.qFallbackTitle}`
                            ? "bold"
                            : "normal",
                      }}
                    >
                      {measure.qFallbackTitle}{" "}
                      {formatValue(
                        closestData[`${measure.qFallbackTitle}`].datum[
                          index + 1
                        ].qNum
                      )}
                    </div>
                  )
              )}
            {!singleDimension &&
              singleMeasure &&
              dataKeys &&
              dataKeys.map(
                (measure, index) =>
                  closestData?.[`${measure}`] &&
                  closestDatum.key && (
                    <div
                      key={measure}
                      style={{
                        color: colorScale(`${measure}`),
                        textDecoration:
                          closestDatum.key === `${measure}`
                            ? "underline solid currentColor"
                            : "none",
                        fontWeight:
                          closestDatum.key === `${measure}` ? "bold" : "normal",
                      }}
                    >
                      {measure}{" "}
                      {formatValue(
                        getValue(measure, closestData[`${measure}`])
                      )}
                    </div>
                  )
              )}
          </>
        )}
      </>
    );
  }

  return (
    <Container>
      {/** @TODO not doing this in SVG is jank. Better solution? */}
      {yScale && showVerticalCrosshair && (
        <div
          style={{
            position: "absolute",
            width: 1,
            height: height - margin.top - margin.bottom,
            top: 0,
            left: 0,
            transform: `translate(${xCoord}px,${
              renderInPortal ? svgOriginY + margin.top : margin.top
            }px)`,
            borderLeft: `1px solid ${theme?.xAxisStyles?.stroke ?? "#222"}`,
            pointerEvents: "none",
          }}
        />
      )}
      <TooltipWithBounds
        left={xCoord}
        top={yCoord}
        style={{
          ...defaultStyles,
          background: theme?.baseColor ?? "white",
          color: theme?.xAxisStyles?.stroke ?? "#222",
        }}
      >
        {renderTooltip({ ...tooltipData, colorScale })}
      </TooltipWithBounds>
    </Container>
  );
}
