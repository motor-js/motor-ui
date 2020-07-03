import defaultTheme from './base';
import { deepMerge } from '../../utils/object';

const base = [
  'var(--oc-gray-4)',
  'var(--oc-gray-9)',
  'var(--oc-gray-0)',
  'var(--oc-gray-2)',
  'var(--oc-gray-3)',
  'var(--oc-gray-5)',
  'var(--oc-gray-6)',
  'var(--oc-gray-7)',
  'var(--oc-gray-8)',
];

const color = {
  brand: 'var(--oc-gray-4)',
  brandPrimary: '#ced4da',
  brandSecondary: '#212529',
  gauge: 'var(--oc-gray-4)',
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
      stroke: 'var(--oc-gray-4)',
    },
    color: {
      selectionBackground: 'var(--oc-gray-4)',
    },
    colorTheme: base,
  },
  scatter: {
    scatters: {
      stroke: 'var(--oc-gray-4)',
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
    color: 'var(--oc-gray-6)',
  },
  title: {
    mainTitle: {
      fontColor: 'var(--oc-gray-4)',
    },
    subTitle: {
      fontColor: 'var(--oc-gray-7)',
    },
  },
  legend: {
    arrowStyle: {
      fill: 'var(--oc-gray-5)',
      stroke: 'var(--oc-gray-5)',
    },
    arrowDisabledStyle: {
      fill: 'var(--oc-gray-1)',
      stroke: 'var(--oc-gray-1)',
    },
  },
};

export default deepMerge(defaultTheme, theme);
