/* eslint react/prop-types: 0 */
import React from "react";
import { timeParse, timeFormat } from "d3-time-format";
import { median } from "d3-array";
import {
  BarSeries,
  PatternLines,
  LinearGradient,
  WithTooltip,
} from "../../VX/xy-chart";

import { color as colors, allColors } from "../../VX/theme";

import { appleStockData as timeSeriesData } from "./data";
import ResponsiveXYChart from "./ResponsiveXYChart";

// const avgPrice = median(timeSeriesData, (d) => d.y);
// export const parseDate = timeParse("%Y%m%d");
// export const formatDate = timeFormat("%b %d");
// export const formatYear = timeFormat("%Y");
// export const dateFormatter = (date) => formatDate(parseDate(date));

// const COLOR = "blue";
// const BRIGHTNESS = 4;

function BarSeriesExample(props) {
  return (
    <div className="brush-demo">
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
    </div>
  );
}

export default BarSeriesExample;
