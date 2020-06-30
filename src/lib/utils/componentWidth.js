export const componentWidth = ({ width, margin }) => {
  return /^\d+(\.\d+)?%$/.test(width)
    ? `calc(${width} - ${+parseInt(margin, 10) * 2}px)`
    : `${+parseInt(width, 10)}px`;
};
