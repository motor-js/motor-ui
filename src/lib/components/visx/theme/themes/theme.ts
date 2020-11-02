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

  const tickLabelStyles =
    chart.tickLabelStyles !== undefined
      ? chart.tickLabelStyles[colorTheme]
      : theme.tickLabelStyles;
  const labelStyles =
    chart.labelStyles !== undefined
      ? chart.labelStyles[colorTheme]
      : theme.labelStyles;

  console.log(grayColors[0], grayColors[9]);

  return buildChartTheme({
    backgroundColor:
      chart.backgroundColor !== undefined
        ? chart.backgroundColor[colorTheme]
        : theme.backgroundColor,
    colors: colorPalette,
    tickLength: 4, // OS
    tickLabelStyles: {
      fill:
        chart.tickLabelStyles !== undefined
          ? chart.tickLabelStyles[colorTheme]
          : theme.tickLabelStyles,
    },
    labelStyles: {
      fill:
        chart.labelStyles !== undefined
          ? chart.labelStyles[colorTheme]
          : theme.labelStyles,
    },
    // gridColor: "#ced4da", // OS
    // gridColorDark: "#f1f3f5", // OS
    // gridColor: grayColors[5],
    // gridColorDark: grayColors[9],
    //dark
    gridColor: grayColors[4],
    gridColorDark: grayColors[1],

    chart: theme.global.chart, // OS
    gridStyles: theme.global.chart.gridStyles, // OS
    // colorTheme: theme.global.colorTheme, // OS
    scatter: theme.scatter, // OS
    bar: theme.bar, // OS
    points: theme.points, // OS
    stackedArea: theme.stackedArea, // OS
  });
};
