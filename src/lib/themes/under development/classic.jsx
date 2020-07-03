import defaultTheme from './base';
import { deepMerge } from '../../utils/object';

const base = [
  'var(--oc-blue-4)',
  'var(--oc-blue-9)',
  'var(--oc-blue-0)',
  'var(--oc-blue-2)',
  'var(--oc-blue-3)',
  'var(--oc-blue-5)',
  'var(--oc-blue-6)',
  'var(--oc-blue-7)',
  'var(--oc-blue-8)',
];

const color = {
  brand: 'var(--oc-blue-4)',
  brandPrimary: '#4dabf7',
  brandSecondary: '#1864ab',
  fontLight: 'var(--oc-blue-1)',
  gauge: 'var(--oc-blue-4)',
  base,
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
      stroke: 'var(--oc-blue-4)',
    },
    color: {
      selectionBackground: 'var(--oc-blue-4)',
    },
    colorTheme: base,
  },
  scatter: {
    scatters: {
      stroke: 'var(--oc-blue-4)',
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
    color: 'var(--oc-blue-6)',
  },
  title: {
    mainTitle: {
      fontColor: 'var(--oc-blue-4)',
    },
    subTitle: {
      fontColor: 'var(--oc-gray-7)',
    },
  },
  legend: {
    arrowStyle: {
      fill: 'var(--oc-blue-5)',
      stroke: 'var(--oc-blue-5)',
    },
    arrowDisabledStyle: {
      fill: 'var(--oc-blue-1)',
      stroke: 'var(--oc-blue-1)',
    },
  },
};

export default deepMerge(defaultTheme, theme);
