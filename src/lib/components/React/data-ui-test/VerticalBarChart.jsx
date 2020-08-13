/* eslint react/prop-types: 0 */
import React from "react";
import { BarSeries, PatternLines, LinearGradient } from "../../VX/xy-chart";
import WithTooltip from "../../VX/old/composer/WithTooltip";
import { color } from "../../VX/theme";
import ResponsiveXYChart from "./ResponsiveXYChart";

import { timeSeriesData } from "./data";

class VaerticalBarChartExample extends React.PureComponent {
  render() {
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
              from={color.default}
              to={color.dark}
            />
            <PatternLines
              id="lines"
              height={8}
              width={8}
              stroke={color.categories[2]}
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

export default VaerticalBarChartExample;
