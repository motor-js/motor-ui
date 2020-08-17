/* eslint react/prop-types: 0 */
import React from "react";
import {
  WithTooltip,
  BarSeries,
  PatternLines,
  LinearGradient,
} from "../../VX/xy-chart";

import { color } from "../../VX/theme";
import ResponsiveXYChart, { formatYear } from "./ResponsiveXYChart";

import { timeSeriesData } from "./data";

class VaerticalBarChartExample extends React.PureComponent {
  renderTooltip({ datum, series }) {
    // const { programmaticTrigger, trigger } = this.state;

    return (
      <div>
        <div>
          <strong>{formatYear(datum.x)}</strong>
          {(!series || Object.keys(series).length === 0) && (
            <div>${datum.y.toFixed(2)}</div>
          )}
        </div>
        {/* {trigger === CONTAINER_TRIGGER && <br />} */}
        {/* {seriesProps.map(
          ({ seriesKey, stroke: color, dashType }) =>
            series &&
            series[seriesKey] && (
              <div key={seriesKey}>
                <span
                  style={{
                    color,
                    textDecoration:
                      // !programmaticTrigger && series[seriesKey] === datum
                      series[seriesKey] === datum
                        ? `underline ${dashType} ${color}`
                        : null,
                    fontWeight: series[seriesKey] === datum ? 600 : 200,
                  }}
                >
                  {`${seriesKey} `}
                </span>
                ${series[seriesKey].y.toFixed(2)}
              </div>
            )
        )} */}
      </div>
    );
  }

  render() {
    //     const tooltipStyles = {
    //   ...defaultStyles,
    //   background,
    //   border: '1px solid white',
    //   color: 'white',
    // };
    return (
      <div className="vertical-bar-demo">
        <WithTooltip renderTooltip={this.renderTooltip}>
          {/* <WithTooltip
          renderTooltip={({ datum }) => datum.y}
          tooltipProps={{
            offsetTop: 0,
            style: {
              backgroundColor: "pink",
              opacity: 0.9,
            },
          }} 
        >*/}
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
