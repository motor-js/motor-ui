// https://htmlcolorcodes.com/color-chart/material-design-color-chart/

import defaultTheme from './base';
import { deepMerge } from '../../utils/object';
// import "../colors/material-ui.css";

const base = [
  '#1A76D2',
  '#DC004E',
  '#F44335',
  '#FF9801',
  '#2296F3',
  '#4CAF50',
  '#212121',
  '#757575',
  '#9E9E9E',
];

const reversed = [
  '#9E9E9E',
  '#757575',
  '#212121',
  '#4CAF50',
  '#2296F3',
  '#FF9801',
  '#F44335',
  '#DC004E',
  '#1A76D2',
];

const color = {
  brand: '#1976d2',
  brandPrimary: '#1976d2',
  brandSecondary: '#dc004e',
  fontLight: '#3f51b5',
  gauge: '#1976d2',
  base,
  reversed,
};

const theme = {
  global: {
    fontFamily:
      'Roboto,-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica Neue,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji',
    // color: {
    //   brand: '#1976d2',
    //   brandPrimary: '#1976d2',
    //   brandSecondary: '#dc004e',
    //   fontLight: '#3f51b5',
    //   gauge: '#1976d2',
    //   colorTheme: base,
    // },
    color,
  },
  button: {
    radius: '0px',
    transition: 'background 0.8s',
    hover: {
      background:
        '#47a7f5 radial-gradient(circle, transparent 1%, #47a7f5 1%) center/15000%',
    },
    active: {
      transform: null,
      backgroundColor: '#93ecf7',
      backgroundSize: '100%',
      transition: 'background 0s',
    },
  },
  column: {
    columns: {
      stroke: '#757575',
    },
    colorTheme: base,
  },
  bar: {
    bars: {
      stroke: '#757575',
    },
    colorTheme: base,
  },
  scatter: {
    scatters: {
      stroke: '#f50057',
    },
    colorTheme: base,
  },
  pie: {
    colorTheme: base,
  },
  barplot: {
    colorTheme: base,
  },
  wordcloud: {
    colorTheme: base,
  },
  line: {
    lines: {
      stroke: '#3f51b5',
    },
    color: {
      selectionBackground: '#1976d2',
    },
    colorTheme: base,
  },
  tooltip: {
    color: '#3f51b5',
  },
  title: {
    textPostion: 'middle',
    mainTitle: {
      fontColor: '#3f51b5',
    },
    subTitle: {
      fontColor: '#757575',
    },
  },
  legend: {
    arrowStyle: {
      fill: '#1976d2',
      stroke: '#1976d2',
    },
    arrowDisabledStyle: {
      fill: '#3f51b5',
      stroke: '#3f51b5',
    },
  },
};

export default deepMerge(defaultTheme, theme);
