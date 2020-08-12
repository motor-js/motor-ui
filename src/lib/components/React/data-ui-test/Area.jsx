import React, { useContext } from "react";
// import PropTypes from "prop-types";
// import { ThemeContext } from "styled-components";
// import StyledArea from "./StyledArea";
// import { ConfigContext } from "../../../contexts/ConfigProvider";
// import defaultTheme from "../../../themes/defaultTheme";
// import { EngineContext } from "../../../contexts/EngineProvider";
// import useEngine from "../../../hooks/useEngine";

// import {
//   WithTooltip,
//   ResponsiveXYChart,
//   LinearGradient,
//   PatternLines,
//   BarSeries,
// } from "../../VX/xy-chart/src";

// import colors from "../../VX/data-ui-theme/color";

// import { timeSeriesData } from "./data";
import BrushableLinkedLineCharts from "./BrushableLinkedLineCharts";
import AreaDifferenceSeriesExample from "./AreaDifferenceSeriesExample";
import CirclePackWithCallback from "./CirclePackWithCallback";

function Area(props) {
  // const myConfig = config || useContext(ConfigContext);
  // const theme = useContext(ThemeContext) || defaultTheme;
  // const { engine, engineError } =
  //   useContext(EngineContext) || useEngine(myConfig);

  return (
    <>
      <BrushableLinkedLineCharts />
      <AreaDifferenceSeriesExample />
      <CirclePackWithCallback />
    </>
  );
}

export default Area;
