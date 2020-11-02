// import { allColors, grayColors } from "../colors";
import buildChartTheme from "../buildChartTheme";

import { createColorArray } from "../../../../utils";

export const chartTheme = (theme, colorTheme) => {
  const colorPalette = createColorArray(colorTheme, theme);

  const {
    global: { chart },
  } = theme;

  const backgroundColor =
    chart.backgroundColor !== undefined
      ? chart.backgroundColor[colorTheme]
      : theme.backgroundColor;

  return buildChartTheme({
    backgroundColor,
    colors: colorPalette,
    tickLength: 4, // OS
    tickLabelStyles: {
      // OS
      fill: "#e9ecef",
    },
    labelStyles: {
      // OS
      fill: "#f8f9fa",
    },
    // gridColor: "#ced4da", // OS
    // gridColorDark: "#f1f3f5", // OS
    chart: theme.global.chart, // OS
    gridStyles: theme.global.chart.gridStyles, // OS
    // colorTheme: theme.global.colorTheme, // OS
    scatter: theme.scatter, // OS
    bar: theme.bar, // OS
    points: theme.points, // OS
    stackedArea: theme.stackedArea, // OS
  });
};
