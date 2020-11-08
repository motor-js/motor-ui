export const createColorArray = (color: any, theme: any) => {
  // if array
  if (Array.isArray(color)) {
    return color;
  }
  if (theme.global.chart[`${theme}Theme`] !== undefined) {
    // if string and string matches a theme name

    return theme.global.chart[`${theme}Theme`].color;
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
