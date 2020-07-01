export const setStyle = (item, style) => {
  Object.entries(style).forEach(([prop, val]) => item.style(prop, val))
}
