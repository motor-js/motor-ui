/* eslint react/prop-types: 0 */
import React from "react";
import { timeParse, timeFormat } from "d3-time-format";
import { XAxis, YAxis, StackedBarSeries } from "../../VX/xy-chart";
import ResponsiveXYChart from "./ResponsiveXYChart";

import { stackedData, groupKeys } from "./data";

export const parseDate = timeParse("%Y%m%d");
export const formatYear = timeFormat("%Y");
export const dateFormatter = (date) => formatYear(parseDate(date));

class StackedBarChartExample extends React.PureComponent {
  render() {
    return (
      <ResponsiveXYChart
        ariaLabel="Required label"
        xScale={{ type: "band", paddingInner: 0.05 }}
        yScale={{ type: "linear" }}
      >
        <YAxis label="Temperature (°F)" numTicks={4} />
        <StackedBarSeries data={stackedData} stackKeys={groupKeys} />
        <XAxis tickFormat={dateFormatter} />
      </ResponsiveXYChart>
    );
  }
}

export default StackedBarChartExample;
