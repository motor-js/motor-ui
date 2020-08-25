// import React, { useMemo } from "react";
// import { Bar } from "@vx/shape";
// import { Group } from "@vx/group";
// import { GradientTealBlue } from "@vx/gradient"; // npm up to date
// import { scaleBand, scaleLinear, scaleOrdinal } from "@vx/scale"; // npm up to date
// import { LegendOrdinal } from "@vx/legend"; // npm up to date
// import { AxisBottom, AxisLeft } from "@vx/axis"; // npm up to date

/* eslint-disable unicorn/consistent-function-scoping */
import React, { useState, useMemo } from "react";
import cityTemperature, {
  CityTemperature,
} from "@vx/mock-data/lib/mocks/cityTemperature";
import defaultTheme from "../../theme/default";
import darkTheme from "../../theme/darkTheme";
import Axis from "../../components/Axis";
import AnimatedAxis from "../../components/AnimatedAxis";
import ChartProvider from "../../components/providers/ChartProvider";
import XYChart from "../../components/XYChart";
import BarSeries from "../../components/series/BarSeries";
import LineSeries from "../../components/series/LineSeries";
import ChartBackground from "../../components/ChartBackground";
import EventProvider from "../../components/providers/TooltipProvider";
import Tooltip, { RenderTooltipArgs } from "../../.../../components/Tooltip";
// import { ScaleConfig } from "./types";
import Legend from "../../components/Legend";
import CustomLegendShape from "../../components/CustomLegendShape";
import Group from "../../components/series/Group";
import Stack from "../../components/series/Stack";

// @TODO wip updating data, not currently used
// const halfData = data.slice(0, Math.floor(data.length / 2));

const numDateTicks = 5;

const getDate = (d) => new Date(d.date);
// const getDate = (d) => new Date(d[0].qText);
// const getDate = (d) =>
//   new Date(
//     d[0].qText.split("/")[2],
//     d[0].qText.split("/")[1] - 1,
//     d[0].qText.split("/")[0]
//   );

// const getDate = (d) => {
//   console.log(d);
// };
const getSfTemperature = (d) => Number(d["San Francisco"]);
const getNyTemperature = (d) => Number(d["New York"]);
const getAustinTemperature = (d) => Number(d.Austin);

const axisTopMargin = { top: 40, right: 50, bottom: 30, left: 50 };
const axisBottomMargin = { top: 30, right: 50, bottom: 40, left: 50 };
const legendLabelFormat = (d) =>
  d === "sf"
    ? "San Francisco"
    : d === "ny"
    ? "New York"
    : d === "austin"
    ? "Austin"
    : d;

const renderTooltip = ({ closestData, closestDatum, colorScale }) => (
  <>
    <div>{closestDatum.datum.date}</div>
    <br />
    {closestData?.sf && closestDatum.datum.date === closestData.sf.datum.date && (
      <div
        style={{
          color: colorScale("sf"),
          textDecoration:
            closestDatum.key === "sf" ? "underline solid currentColor" : "none",
        }}
      >
        San Francisco {closestData.sf.datum["San Francisco"]}°F
      </div>
    )}
    {closestData?.ny && closestDatum.datum.date === closestData.ny.datum.date && (
      <div
        style={{
          color: colorScale("ny"),
          textDecoration:
            closestDatum.key === "ny" ? "underline solid currentColor" : "none",
        }}
      >
        New York {closestData.ny.datum["New York"]}°F
      </div>
    )}
    {closestData?.austin &&
      closestDatum.datum.date === closestData.austin.datum.date && (
        <div
          style={{
            color: colorScale("austin"),
            textDecoration:
              closestDatum.key === "austin"
                ? "underline solid currentColor"
                : "none",
          }}
        >
          Austin {closestData.austin.datum.Austin}°F
        </div>
      )}
  </>
);

/** memoize the accessor functions to prevent re-registering data. */
function useAccessors(
  temperatureAccessor,
  dataMultiplier,
  renderHorizontally,
  negativeValues
) {
  return useMemo(
    () => ({
      xAccessor: (d) =>
        renderHorizontally
          ? (negativeValues ? -1 : 1) * dataMultiplier * temperatureAccessor(d)
          : getDate(d),
      yAccessor: (d) =>
        renderHorizontally
          ? getDate(d)
          : (negativeValues ? -1 : 1) * dataMultiplier * temperatureAccessor(d),
    }),
    [renderHorizontally, negativeValues, dataMultiplier, temperatureAccessor]
  );
}

export default function CreateCombo({
  width,
  height,
  events = false,
  qData,
  setRefreshChart,
  beginSelections,
  select,
  setSelectionBarVisible,
  useSelectionColours,
  pendingSelections,
  SetPendingSelections,
}) {
  const data = cityTemperature.slice(100, 100 + 16);
  // const data = qData.qMatrix;
  // console.log(data);
  // console.log(qData);
  const [theme, setTheme] = useState("light");
  const [useCustomDomain, setUseCustomDomain] = useState(false);
  const [currData, setCurrData] = useState(data);
  const [useAnimatedAxes, setUseAnimatedAxes] = useState(false);
  const [autoWidth, setAutoWidth] = useState(false);
  const [renderHorizontally, setRenderHorizontally] = useState(false);
  const [negativeValues, setNegativeValues] = useState(false);
  const [includeZero, setIncludeZero] = useState(false);
  const [xAxisOrientation, setXAxisOrientation] = useState("bottom");
  const [yAxisOrientation, setYAxisOrientation] = useState("left");
  const [legendLeftRight, setLegendLeftRight] = useState("right");
  const [legendTopBottom, setLegendTopBottom] = useState("top");
  const [legendDirection, setLegendDirection] = useState("row");
  const [legendShape, setLegendShape] = useState("auto");
  const [snapTooltipToDataX, setSnapTooltipToDataX] = useState(true);
  const [snapTooltipToDataY, setSnapTooltipToDataY] = useState(true);
  const [dataMultiplier, setDataMultiplier] = useState(1);
  // const [renderTooltipInPortal, setRenderTooltipInPortal] = useState(false);
  const [visibleSeries, setVisibleSeries] = useState(["bar"]);
  const canSnapTooltipToDataX =
    (visibleSeries.includes("groupedbar") && renderHorizontally) ||
    (visibleSeries.includes("stackedbar") && !renderHorizontally) ||
    visibleSeries.includes("bar");

  const canSnapTooltipToDataY =
    (visibleSeries.includes("groupedbar") && !renderHorizontally) ||
    (visibleSeries.includes("stackedbar") && renderHorizontally) ||
    visibleSeries.includes("bar");

  const dateScaleConfig = useMemo(() => ({ type: "band", padding: 0.2 }), []);
  const temperatureScaleConfig = useMemo(
    () => ({
      type: "linear",
      clamp: true,
      nice: true,
      domain: useCustomDomain
        ? negativeValues
          ? [-100, 50]
          : [-50, 100]
        : undefined,
      includeZero,
    }),
    [useCustomDomain, includeZero, negativeValues]
  );
  const colorScaleConfig = useMemo(
    () => ({
      domain:
        visibleSeries.includes("bar") && !visibleSeries.includes("line")
          ? ["austin"]
          : ["austin", "sf", "ny"],
    }),
    [visibleSeries]
  );
  const austinAccessors = useAccessors(
    getAustinTemperature,
    dataMultiplier,
    renderHorizontally,
    negativeValues
  );
  const sfAccessors = useAccessors(
    getSfTemperature,
    1,
    renderHorizontally,
    false
  );
  const nyAccessors = useAccessors(
    getNyTemperature,
    dataMultiplier,
    renderHorizontally,
    negativeValues
  );
  const themeObj = useMemo(
    () =>
      theme === "light"
        ? { ...defaultTheme, colors: ["#fbd46d", "#ff9c71", "#654062"] }
        : theme === "dark"
        ? { ...darkTheme, colors: ["#916dd5", "#f8615a", "#ffd868"] }
        : // @ts-ignore {} is not a valid theme
          { colors: ["#222", "#767676", "#bbb"] },
    [theme]
  );

  const AxisComponent = useAnimatedAxes ? AnimatedAxis : Axis;

  const legend = (
    <Legend
      labelFormat={legendLabelFormat}
      alignLeft={legendLeftRight === "left"}
      direction={legendDirection}
      shape={
        legendShape === "auto"
          ? undefined
          : legendShape === "custom"
          ? CustomLegendShape
          : legendShape
      }
    />
  );

  return (
    <div className="container">
      {/** @ts-ignore */}
      <ChartProvider
        theme={themeObj}
        xScale={renderHorizontally ? temperatureScaleConfig : dateScaleConfig}
        yScale={renderHorizontally ? dateScaleConfig : temperatureScaleConfig}
        colorScale={colorScaleConfig}
      >
        <EventProvider>
          {legendTopBottom === "top" && legend}
          <div className="container">
            <XYChart
              height={400}
              width={autoWidth ? undefined : 800}
              margin={
                xAxisOrientation === "top" ? axisTopMargin : axisBottomMargin
              }
            >
              <ChartBackground />

              {visibleSeries.includes("bar") && (
                <BarSeries
                  horizontal={renderHorizontally}
                  dataKey="austin"
                  data={currData}
                  {...austinAccessors}
                />
              )}
              {visibleSeries.includes("stackedbar") && (
                <Stack horizontal={renderHorizontally}>
                  <BarSeries
                    dataKey="austin"
                    data={currData}
                    {...austinAccessors}
                  />
                  <BarSeries dataKey="sf" data={currData} {...sfAccessors} />
                  <BarSeries dataKey="ny" data={currData} {...nyAccessors} />
                </Stack>
              )}
              {visibleSeries.includes("groupedbar") && (
                <Group horizontal={renderHorizontally}>
                  <BarSeries
                    dataKey="austin"
                    data={currData}
                    {...austinAccessors}
                  />
                  <BarSeries dataKey="sf" data={currData} {...sfAccessors} />
                  <BarSeries dataKey="ny" data={currData} {...nyAccessors} />
                </Group>
              )}

              {visibleSeries.includes("line") && (
                <>
                  <LineSeries
                    dataKey="sf"
                    data={currData}
                    {...sfAccessors}
                    strokeWidth={1.5}
                  />
                  <LineSeries
                    dataKey="ny"
                    data={currData}
                    {...nyAccessors}
                    strokeWidth={1.5}
                    strokeDasharray="5,3"
                  />
                </>
              )}

              {/** Temperature axis */}
              <AxisComponent
                label="Temperature (°F)"
                orientation={
                  renderHorizontally ? xAxisOrientation : yAxisOrientation
                }
                numTicks={5}
              />
              {/** Date axis */}
              <AxisComponent
                orientation={
                  renderHorizontally ? yAxisOrientation : xAxisOrientation
                }
                tickValues={currData
                  .filter(
                    (d, i, arr) =>
                      i % Math.round((arr.length - 1) / numDateTicks) === 0
                  )
                  .map((d) => new Date(d.date))}
                tickFormat={(d) =>
                  d.toISOString?.().split?.("T")[0] ?? d.toString()
                }
              />
            </XYChart>
            <Tooltip
              snapToDataX={snapTooltipToDataX && canSnapTooltipToDataX}
              snapToDataY={snapTooltipToDataY && canSnapTooltipToDataY}
              renderTooltip={renderTooltip}
              // renderInPortal={renderTooltipInPortal}
            />
            {legendTopBottom === "bottom" && legend}
          </div>
        </EventProvider>
      </ChartProvider>
      <br />
      <div className="controls">
        <div>
          <strong>data</strong>
          &nbsp;&nbsp;&nbsp;
          <button
            onClick={() => {
              setDataMultiplier(5 * Math.random());
            }}
          >
            Update data
          </button>
          &nbsp;&nbsp;&nbsp;
          <label>
            <input
              type="checkbox"
              checked={useCustomDomain}
              onChange={() => setUseCustomDomain(!useCustomDomain)}
            />
            Custom y-axis range
          </label>
          &nbsp;&nbsp;&nbsp;
          {!useCustomDomain && (
            <label>
              <input
                type="checkbox"
                checked={includeZero}
                onChange={() => setIncludeZero(!includeZero)}
              />
              Include zero&nbsp;&nbsp;&nbsp;
            </label>
          )}
          <label>
            <input
              type="checkbox"
              checked={renderHorizontally}
              onChange={() => setRenderHorizontally(!renderHorizontally)}
            />
            Render horizontally
          </label>
          &nbsp;&nbsp;&nbsp;
          <label>
            <input
              type="checkbox"
              checked={negativeValues}
              onChange={() => setNegativeValues(!negativeValues)}
            />
            Negative values&nbsp;
          </label>
        </div>
        <div>
          <strong>theme</strong>
          <label>
            <input
              type="radio"
              onChange={() => setTheme("light")}
              checked={theme === "light"}
            />{" "}
            light
          </label>
          <label>
            <input
              type="radio"
              onChange={() => setTheme("dark")}
              checked={theme === "dark"}
            />{" "}
            dark
          </label>
          <label>
            <input
              type="radio"
              onChange={() => setTheme("none")}
              checked={theme === "none"}
            />{" "}
            none
          </label>
        </div>

        <div>
          <strong>tooltip</strong>&nbsp;&nbsp;&nbsp;
          {/* <label>
            <input
              type="checkbox"
              checked={renderTooltipInPortal}
              onChange={() => setRenderTooltipInPortal(!renderTooltipInPortal)}
            />
            Render tooltip in portal&nbsp;&nbsp;&nbsp;
          </label> */}
          <label>
            <input
              type="checkbox"
              disabled={!canSnapTooltipToDataX}
              checked={snapTooltipToDataX}
              onChange={() => setSnapTooltipToDataX(!snapTooltipToDataX)}
            />
            Snap tooltip to data <code>x</code>&nbsp;&nbsp;&nbsp;
          </label>
          <label>
            <input
              type="checkbox"
              disabled={!canSnapTooltipToDataY}
              checked={snapTooltipToDataY}
              onChange={() => setSnapTooltipToDataY(!snapTooltipToDataY)}
            />
            Snap tooltip to data <code>y</code>&nbsp;
          </label>
        </div>
        <div>
          <strong>legend</strong>
          <label>
            <input
              type="radio"
              onChange={() => setLegendLeftRight("left")}
              checked={legendLeftRight === "left"}
            />{" "}
            left
          </label>
          <label>
            <input
              type="radio"
              onChange={() => setLegendLeftRight("right")}
              checked={legendLeftRight === "right"}
            />{" "}
            right
          </label>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <label>
            <input
              type="radio"
              onChange={() => setLegendTopBottom("top")}
              checked={legendTopBottom === "top"}
            />{" "}
            top
          </label>
          <label>
            <input
              type="radio"
              onChange={() => setLegendTopBottom("bottom")}
              checked={legendTopBottom === "bottom"}
            />{" "}
            bottom
          </label>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <label>
            <input
              type="radio"
              onChange={() => setLegendDirection("row")}
              checked={legendDirection === "row"}
            />{" "}
            horizontal
          </label>
          <label>
            <input
              type="radio"
              onChange={() => setLegendDirection("column")}
              checked={legendDirection === "column"}
            />{" "}
            vertical
          </label>
        </div>
        <div>
          <strong>legend shape</strong>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <label>
            <input
              type="radio"
              onChange={() => setLegendShape("auto")}
              checked={legendShape === "auto"}
            />{" "}
            auto
          </label>
          <label>
            <input
              type="radio"
              onChange={() => setLegendShape("rect")}
              checked={legendShape === "rect"}
            />{" "}
            rect
          </label>
          <label>
            <input
              type="radio"
              onChange={() => setLegendShape("line")}
              checked={legendShape === "line"}
            />{" "}
            line
          </label>
          <label>
            <input
              type="radio"
              onChange={() => setLegendShape("circle")}
              checked={legendShape === "circle"}
            />{" "}
            circle
          </label>
          <label>
            <input
              type="radio"
              onChange={() => setLegendShape("custom")}
              checked={legendShape === "custom"}
            />{" "}
            custom
          </label>
        </div>
        <div>
          <strong>axis</strong>
          &nbsp;&nbsp;&nbsp;
          <label>
            <input
              type="checkbox"
              checked={useAnimatedAxes}
              onChange={() => setUseAnimatedAxes(!useAnimatedAxes)}
            />
            animated axes
          </label>
          &nbsp;&nbsp;
          <label>
            <input
              type="radio"
              onChange={() => setXAxisOrientation("bottom")}
              checked={xAxisOrientation === "bottom"}
            />{" "}
            bottom
          </label>
          <label>
            <input
              type="radio"
              onChange={() => setXAxisOrientation("top")}
              checked={xAxisOrientation === "top"}
            />{" "}
            top
          </label>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <label>
            <input
              type="radio"
              onChange={() => setYAxisOrientation("left")}
              checked={yAxisOrientation === "left"}
            />{" "}
            left
          </label>
          <label>
            <input
              type="radio"
              onChange={() => setYAxisOrientation("right")}
              checked={yAxisOrientation === "right"}
            />{" "}
            right
          </label>
          <br />
          <label>
            <input
              type="checkbox"
              onChange={() => setAutoWidth(!autoWidth)}
              checked={autoWidth}
            />{" "}
            responsive width
          </label>
        </div>
        <div>
          <strong>series</strong>
          &nbsp;&nbsp;&nbsp;
          <label>
            <input
              type="checkbox"
              checked={visibleSeries.includes("line")}
              onChange={() =>
                setVisibleSeries(
                  visibleSeries.includes("line")
                    ? visibleSeries.filter((s) => s !== "line")
                    : [...visibleSeries, "line"]
                )
              }
            />
            line
          </label>
          &nbsp;&nbsp;
          {/** bar types are mutually exclusive */}
          <label>
            <input
              type="radio"
              checked={visibleSeries.includes("bar")}
              onChange={() =>
                setVisibleSeries([
                  ...visibleSeries.filter((s) => !s.includes("bar")),
                  "bar",
                ])
              }
            />
            bar
          </label>
          &nbsp;&nbsp;
          <label>
            <input
              type="radio"
              checked={visibleSeries.includes("groupedbar")}
              onChange={() =>
                setVisibleSeries([
                  ...visibleSeries.filter((s) => !s.includes("bar")),
                  "groupedbar",
                ])
              }
            />
            grouped bar
          </label>
          &nbsp;&nbsp;
          <label>
            <input
              type="radio"
              checked={visibleSeries.includes("stackedbar")}
              onChange={() =>
                setVisibleSeries([
                  ...visibleSeries.filter((s) => !s.includes("bar")),
                  "stackedbar",
                ])
              }
            />
            stacked bar
          </label>
        </div>
      </div>
      {/* <style jsx>{`
        .container {
          position: relative;
          width: 100%;
          display: flex;
          flex-direction: column;
        }
        .controls {
          font-size: 14px;
        }
      `}</style> */}
    </div>
  );
}
