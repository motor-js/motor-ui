export const selectColor = (color, theme) => {
  const colors = theme.global !== undefined ? theme.global.color : theme.color; // added for xyChart
  const result = colors[color] !== undefined ? colors[color] : color;
  // theme.global.color[color] !== undefined ? theme.global.color[color] : color;

  return result;
};

export const openColorArray = (color) => [
  `var(--oc-${color}-0)`,
  `var(--oc-${color}-1)`,
  `var(--oc-${color}-2)`,
  `var(--oc-${color}-3)`,
  `var(--oc-${color}-4)`,
  `var(--oc-${color}-5)`,
  `var(--oc-${color}-6)`,
  `var(--oc-${color}-7)`,
  `var(--oc-${color}-8)`,
  `var(--oc-${color}-9)`,
];

export const createColorArray = (color, theme) => {
  // if array
  if (Array.isArray(color)) {
    return color;
  }
  if (theme.global.color[color] !== undefined) {
    // if string and string matches a theme name

    return theme.global.color[color];
  }
  // if string and doesn't match a theme name, it is an open color array
  return [
    `var(--oc-${color}-0)`,
    `var(--oc-${color}-1)`,
    `var(--oc-${color}-2)`,
    `var(--oc-${color}-3)`,
    `var(--oc-${color}-4)`,
    `var(--oc-${color}-5)`,
    `var(--oc-${color}-6)`,
    `var(--oc-${color}-7)`,
    `var(--oc-${color}-8)`,
    `var(--oc-${color}-9)`,
  ];
};
