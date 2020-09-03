export const hexToRgb = (bkgColor, opacity = 1) => {
  if (bkgColor.substr(0, 4) === "rgba") return bkgColor;
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(bkgColor);
  return result
    ? `rgba(${parseInt(result[1], 16)},${parseInt(result[2], 16)},${parseInt(
        result[3],
        16
      )},${opacity})`
    : `rgba(${bkgColor}, ${opacity})`;
};
