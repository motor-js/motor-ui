import { allColors, grayColors } from "../colors";
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
      fill: grayColors[2],
    },
    labelStyles: {
      // OS
      fill: grayColors[0],
    },
    gridColor: grayColors[4], // OS
    gridColorDark: grayColors[1], // OS
    chart: theme.global.chart, // OS
    // colorTheme: theme.global.colorTheme, // OS
    scatter: theme.scatter, // OS
    bar: theme.bar, // OS
    points: theme.points, // OS
    stackedArea: theme.stackedArea, // OS
  });
};
