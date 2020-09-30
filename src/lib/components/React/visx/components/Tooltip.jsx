import React, { useContext } from "react";
import { TooltipWithBounds } from "@visx/tooltip";
import { timeParse, timeFormat } from "d3-time-format";

import TooltipContext from "../context/TooltipContext";
import ChartContext from "../context/ChartContext";
import { isNull, selectColor } from "../../../../utils";

export default function Tooltip({
  snapToDataX,
  snapToDataY,
  shiftTooltipTop = 0,
  shiftTooltipLeft = 0,
  showClosestItem,
  useSingleColor,
  valueOnly,
  valueWithText,
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
    size,
    formatTooltipDate,
    parseDateFormat,
  } = useContext(ChartContext) || {};

  // const parseDate = timeParse("%Y%m%d");
  // const formatDate = timeFormat("%b %d");
  const parseDate = timeParse(parseDateFormat);
  const formatDate = timeFormat(formatTooltipDate);
  // const formatYear = timeFormat("%Y");
  const dateFormatter = (date) => formatDate(parseDate(date));

  // early return if there's no tooltip
  const { closestDatum, svgMouseX, svgMouseY } = tooltipData || {};

  if (!closestDatum || svgMouseX == null || svgMouseY == null) return null;

  const { xAccessor, yAccessor } = dataRegistry[closestDatum.key];

  const xCoord = snapToDataX
    ? xScale(xAccessor(closestDatum.datum)) +
      (xScale.bandwidth?.() ?? 0) / 2 +
      shiftTooltipLeft
    : svgMouseX + shiftTooltipLeft;

  const yCoord = snapToDataY
    ? yScale(yAccessor(closestDatum.datum)) -
      (yScale.bandwidth?.() ?? 0) / 2 +
      shiftTooltipTop
    : svgMouseY + shiftTooltipTop;

  const getValue = (measure, data) =>
    data.datum.filter((s) => s.qText === measure)[0].qNum;

  function renderTooltip({ closestData, closestDatum, colorScale }) {
    const seriesKey = closestDatum.key;
    const headingColor = useSingleColor
      ? selectColor(theme?.tooltip?.headingColor, theme)
      : null;

    const color =
      headingColor ||
      (singleDimension && singleMeasure && dataKeys
        ? colorScale(`${closestDatum.datum[0].qText}`)
        : colorScale(`${closestDatum.key}`));

    let xVal = closestDatum.datum[0].qText || x0;
    xVal =
      isNull(parseDate(xVal)) || isNull(formatTooltipDate)
        ? xVal
        : dateFormatter(xVal);

    //  if (typeof xVal === "string") {

    //  } else if (
    //    typeof xVal !== "string" &&
    //    Number(xVal) > 40000
    //  ) {
    //    // for Excel number formatted date
    //    xVal = formatDate(
    //      new Date((xVal - (25567 + 1)) * 86400 * 1000)
    //    );
    //  }
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
        {valueOnly || valueWithText ? (
          <div>
            {valueWithText && <strong style={{ color }}>{yValText} </strong>}
            {yVal && formatValue(yVal)}
          </div>
        ) : showClosestItem ? (
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
            <div
            // style={{
            //   color: "white",
            //   backgroundColor: "black",
            // }}
            >
              {xVal}
            </div>
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
                  closestDatum.datum[0].qText && (
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
                      {formatValue(closestDatum.datum[index + 1].qNum)}
                    </div>
                  )
              )}
            {!singleDimension &&
              singleMeasure &&
              dataKeys &&
              dataKeys.map(
                (measure, index) =>
                  // closestData?.[`${measure}`] &&
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
                      {measure} {formatValue(getValue(measure, closestDatum))}
                    </div>
                  )
              )}
          </>
        )}
      </>
    );
  }

  return (
    <TooltipWithBounds
      left={xCoord}
      top={yCoord}
      style={{
        ...theme?.tooltip?.tooltipStyles,
        fontSize: theme?.tooltip?.tooltipStyles?.fontSize[size],
        background:
          selectColor(theme?.tooltip?.tooltipStyles?.backgroundColor, theme) ??
          "white",
        color:
          selectColor(theme?.tooltip?.tooltipStyles?.color, theme) ?? "#222",
      }}
    >
      {renderTooltip({ ...tooltipData, colorScale })}
    </TooltipWithBounds>
  );
}
