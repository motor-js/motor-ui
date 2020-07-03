import defaultTheme from './base';
import { deepMerge } from '../../utils/object';

const base = [
  '#03B8AA',
  '#374649',
  '#FD625E',
  '#F2C80F',
  '#5F6B6D',
  '#8ad4eb',
  '#fe9666',
  '#a66999',
  '#3599b8',
  '#dfbfbf',
  '#4ac5bb',
  '#5f6b6d',
  '#fb8281',
  '#f4d25a',
  '#7f898a',
  '#a4ddee',
  '#fdab89',
  '#b687ac',
  '#28738a',
  '#a78f8f',
  '#168980',
  '#293537',
  '#bb4a4a',
  '#b59525',
  '#475052',
];

const color = {
  brand: '#03B8AA',
  brandPrimary: '#03B8AA',
  brandSecondary: '#374649',
  gauge: '#03B8AA',
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
      stroke: '#03B8AA',
    },
    color: {
      selectionBackground: '#03B8AA',
    },
    colorTheme: base,
  },
  scatter: {
    scatters: {
      stroke: '#03B8AA',
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
    color: '#03B8AA',
  },
  title: {
    mainTitle: {
      fontColor: '#03B8AA',
    },
    subTitle: {
      fontColor: 'var(--oc-gray-7)',
    },
  },
  legend: {
    arrowStyle: {
      fill: '#8ad4eb',
      stroke: '#8ad4eb',
    },
    arrowDisabledStyle: {
      fill: 'var(--oc-pink-1)',
      stroke: 'var(--oc-pink-1)',
    },
  },
};

export default deepMerge(defaultTheme, theme);
