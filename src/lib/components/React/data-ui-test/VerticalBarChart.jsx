/* eslint react/prop-types: 0 */
import React from "react";
import { timeParse, timeFormat } from "d3-time-format";
import {
  CrossHair,
  XAxis,
  YAxis,
  BarSeries,
  PatternLines,
  LinearGradient,
} from "../../VX/xy-chart";
import WithTooltip from "../../VX/old/composer/WithTooltip";
import { color as colors, allColors } from "../../VX/theme";
import { xTickStyles, yTickStyles } from "../../VX/theme/chartTheme";
import ResponsiveXYChart from "./ResponsiveXYChart";

import { timeSeriesData } from "./data";

const categoryHorizontalData = timeSeriesData.map((d, i) => ({
  x: d.y,
  y: i + 1,
  selected: false,
  label: i === 3 ? "Long long label" : (i === 5 && "Label") || "",
}));

class HorizontalBarChartExample extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      direction: "vertical",
      data: categoryHorizontalData,
    };
  }

  render() {
    const { direction, data } = this.state;
    const categoryScale = { type: "band", paddingInner: 0.1 };
    const valueScale = { type: "linear" };
    const horizontal = direction === "horizontal";

    return (
      <div className="vertical-bar-demo">
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
            <LinearGradient
              id="gradient"
              from={colors.default}
              to={colors.dark}
            />
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
      </div>
    );
  }
}

export default HorizontalBarChartExample;
