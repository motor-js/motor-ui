import defaultTheme from './base';
import { deepMerge } from '../../utils/object';

const base = [
  '#D81C23',
  '#4FA8C2',
  '#D97441',
  '#D29849',
  'var(--oc-pink-3)',
  'var(--oc-pink-5)',
  'var(--oc-pink-6)',
  'var(--oc-pink-7)',
  'var(--oc-pink-8)',
];

const color = {
  brand: '#D81C23',
  brandPrimary: '#D81C23',
  brandSecondary: '#4FA8C2',
  gauge: '#D81C23',
  colorTheme: base,
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
      stroke: '#D81C23',
    },
    color: {
      selectionBackground: '#D81C23',
    },
    colorTheme: base,
  },
  scatter: {
    scatters: {
      stroke: '#D81C23',
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
    color: '#D81C23',
  },
  title: {
    mainTitle: {
      fontColor: '#D81C23',
    },
    subTitle: {
      fontColor: 'var(--oc-gray-7)',
    },
  },
  legend: {
    arrowStyle: {
      fill: 'var(--oc-pink-5)',
      stroke: 'var(--oc-pink-5)',
    },
    arrowDisabledStyle: {
      fill: 'var(--oc-pink-1)',
      stroke: 'var(--oc-pink-1)',
    },
  },
};

export default deepMerge(defaultTheme, theme);
