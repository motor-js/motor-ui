import defaultTheme from './base';
import { deepMerge } from '../../utils/object';

const base = [
  '#99ca3b',
  '#999999',
  '#454545',
  '#B3B3B3',
  '#CCCCCC',
  '#8AD4EB',
  '#FE9666',
  '#A66999',
  '#3599B8',
  '#DFBFBF',
  '#4AC5BB',
  '#454545',
  '#FB8280',
];

const color = {
  brand: '#99ca3b',
  brandPrimary: '#99ca3b',
  brandSecondary: '#999999',
  gauge: '#99ca3b',
  base,
};
const theme = {
  global: { color },
  column: {
    colorTheme: base,
  },
  bar: {
    colorTheme: base,
  },
  line: {
    lines: {
      stroke: '#99ca3b',
    },
    color: {
      selectionBackground: '#99ca3b',
    },
    colorTheme: base,
  },
  scatter: {
    scatters: {
      stroke: '#99ca3b',
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
    color: '#99ca3b',
  },
  title: {
    mainTitle: {
      fontColor: '#99ca3b',
    },
    subTitle: {
      fontColor: 'var(--oc-gray-7)',
    },
  },
  legend: {
    arrowStyle: {
      fill: '#8AD4EB',
      stroke: '#8AD4EB',
    },
    arrowDisabledStyle: {
      fill: 'var(--oc-pink-1)',
      stroke: 'var(--oc-pink-1)',
    },
  },
};

export default deepMerge(defaultTheme, theme);
