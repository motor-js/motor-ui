export const legendPosition = (showLegend, defaultLegend) => {
  switch (showLegend) {
    case null:
    case undefined:
      return defaultLegend ? "right" : "none";
    case true:
    case "right":
      return "right";
    case false:
    case "none":
      return "none";
    case "bottom":
      return "bottom";
    default:
      return "right";
  }
};
