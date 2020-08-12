import React from "react";
import { LegendOrdinal } from "@vx/legend";
import { scaleOrdinal } from "@vx/scale";

import { color as colors, allColors } from "../../VX/theme";
import {
  AreaSeries,
  AreaDifferenceSeries,
  CrossHair,
  PatternLines,
  XAxis,
  YAxis,
  BarSeries,
  LinearGradient,
  WithTooltip,
} from "../../VX/xy-chart";

import ResponsiveXYChart, { formatYear } from "./ResponsiveXYChart";
import { timeSeriesData } from "./data";

const COLOR_1 = allColors.grape[5];
const COLOR_2 = allColors.pink[5];
const PATTERN_ID = "threshold-pattern-id";

const legendScale = scaleOrdinal({
  range: [`url(#${PATTERN_ID})`, COLOR_2],
  domain: ["Purple", "Pink"],
});

function AreaTest(props) {
  PatternLines.displayName = "PatternLines";
  LinearGradient.displayName = "LinearGradient";
  return (
    <WithTooltip
      renderTooltip={({ datum }) => datum.y}
      tooltipProps={{
        offsetTop: 0,
        style: {
          backgroundColor: "pink",
          opacity: 0.9,
        },
      }}
    >
      <ResponsiveXYChart
        ariaLabel="Required label"
        xScale={{ type: "band", paddingInner: 0.25 }}
        yScale={{ type: "linear" }}
        renderTooltip={null}
        showXGrid
        showYGrid
      >
        <LinearGradient id="gradient" from={colors.default} to={colors.dark} />
        <PatternLines
          id="lines"
          height={8}
          width={8}
          stroke={colors.categories[2]}
          background="#fff"
          strokeWidth={1}
          orientation={["horizontal", "vertical"]}
        />
        <BarSeries
          data={timeSeriesData.map((d, i) => ({
            ...d,
            y: -d.y,
            fill: `url(#${i === 2 ? "lines" : "gradient"})`,
          }))}
          fill="url(#aqua_lightaqua_gradient)"
        />
      </ResponsiveXYChart>
    </WithTooltip>
  );
}

export default AreaTest;
