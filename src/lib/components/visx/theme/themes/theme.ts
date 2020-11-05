import buildChartTheme from "../buildChartTheme";

import { createColorArray } from "../createColorArray";

export const chartTheme = (theme: any, colorTheme: string, size: string) => {
  const colorPalette = createColorArray(colorTheme, theme);

  const {
    global: { chart },
  } = theme;

  return buildChartTheme({
    size,
    backgroundColor:
      chart[`${colorTheme}Theme`] !== undefined
        ? chart[`${colorTheme}Theme`].backgroundColor
        : theme.backgroundColor,
    colors: colorPalette,
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
    gridColor: {
      stroke:
        chart[`${colorTheme}Theme`] !== undefined
          ? chart[`${colorTheme}Theme`].gridColor
          : theme.gridColor,
    },
    chart: theme.global.chart,
    tooltiplLabelStyles: chart.tooltip.tooltiplLabelStyles,
    gridStyles: chart.gridStyles,
    xAxisStyles: chart.xAxisStyles,
    yAxisStyles: chart.yAxisStyles,
    scatter: theme.scatter,
    bar: theme.bar,
    points: theme.points,
    stackedArea: theme.stackedArea,
  });
};
