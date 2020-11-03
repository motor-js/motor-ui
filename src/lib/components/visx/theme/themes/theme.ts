import buildChartTheme from "../buildChartTheme";

import { createColorArray } from "../createColorArray";

export const chartTheme = (theme: any, colorTheme: string) => {
  const colorPalette = createColorArray(colorTheme, theme);

  const {
    global: { chart },
  } = theme;

  return buildChartTheme({
    backgroundColor:
      chart[`${colorTheme}Theme`] !== undefined
        ? chart[`${colorTheme}Theme`].backgroundColor
        : theme.backgroundColor,
    colors: colorPalette,
    tickLength: 4, // OS
    tickLabelStyles: {
      fill:
        chart[`${colorTheme}Theme`] !== undefined
          ? chart[`${colorTheme}Theme`].tickLabelStyles
          : theme.tickLabelStyles,
    },
    labelStyles: {
      fill:
        chart[`${colorTheme}Theme`] !== undefined
          ? chart[`${colorTheme}Theme`].labelStyles
          : theme.labelStyles,
    },
    gridColor:
      chart[`${colorTheme}Theme`] !== undefined
        ? chart[`${colorTheme}Theme`].gridColor
        : theme.gridColor,
    chart: theme.global.chart,
    gridStyles: theme.global.chart.gridStyles,
    scatter: theme.scatter,
    bar: theme.bar,
    points: theme.points,
    stackedArea: theme.stackedArea,
  });
};
