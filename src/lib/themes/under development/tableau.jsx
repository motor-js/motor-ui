import defaultTheme from './base';
import { deepMerge } from '../../utils/object';

const base = [
  '#4E79A8',
  '#A0CBE8',
  '#F28E2B',
  '#FFBE7D',
  '#59A14F',
  '#8CD17D',
  '#B6992D',
  '#F1CE63',
  '#499894',
  '#86BCB6',
  '#E15759',
  '#FF9D9A',
  '#79706E',
  '#BAB0AD',
  '#D47295',
  '#FABFD2',
  '#B07AA2',
  '#D4A6C9',
  '#946B51',
  '#D7B5A6',
];

const color = {
  brand: '#4E79A8',
  brandPrimary: '#4E79A8',
  brandSecondary: '#A0CBE8',
  gauge: '#4E79A8',
  colorTheme: base,
};

const theme = {
  global: {
    color,
  },
  column: {
    colorTheme: base,
  },
  bar: {
    colorTheme: base,
  },
  line: {
    lines: {
      stroke: '#4E79A8',
    },
    color: {
      selectionBackground: '#4E79A8',
    },
    colorTheme: base,
  },
  scatter: {
    scatters: {
      stroke: '#4E79A8',
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
  tooltip: {
    color: '#4E79A8',
  },
  title: {
    mainTitle: {
      fontColor: '#4E79A8',
    },
    subTitle: {
      fontColor: 'var(--oc-gray-7)',
    },
  },
  legend: {
    arrowStyle: {
      fill: '#8CD17D',
      stroke: '#8CD17D',
    },
    arrowDisabledStyle: {
      fill: 'var(--oc-pink-1)',
      stroke: 'var(--oc-pink-1)',
    },
  },
};

export default deepMerge(defaultTheme, theme);
