import defaultTheme from './base';
import { deepMerge } from '../../utils/object';

const base = [
  '#3366CC',
  '#DC3912',
  '#FF9900',
  '#109618',
  '#990099',
  '#3B3EAC',
  '#0099C6',
  '#DD4477',
  '#66AA00',
  '#B82E2E',
  '#316395',
  '#994499',
  '#22AA99',
  '#AAAA11',
  '#6633CC',
  '#E67300',
  '#8B0707',
  '#329262',
  '#5574A6',
  '#3B3EAC',
];

const color = {
  brand: '#3366CC',
  brandPrimary: '#3366CC',
  brandSecondary: '#DC3912',
  gauge: '#3366CC',
  base,
};

const theme = {
  global: {
    color,
  },
  button: {
    radius: '5px',
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
    colorTheme: base,
  },
  bar: {
    colorTheme: base,
  },
  line: {
    lines: {
      stroke: '#3366CC',
    },
    color: {
      selectionBackground: '#3366CC',
    },
    colorTheme: base,
  },
  scatter: {
    scatters: {
      stroke: '#3366CC',
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
    color: '#3366CC',
  },
  title: {
    mainTitle: {
      fontColor: '#3366CC',
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
