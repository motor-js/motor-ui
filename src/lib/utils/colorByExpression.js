export const colorByExpression = (
  qHyperCube,
  qMatrix,
  colorPalette,
  useFillColors = true
) => {
  const {
    qDimensionInfo: dimensionInfo,
    qMeasureInfo: measureInfo,
  } = qHyperCube;

  const dimensionCount = dimensionInfo.length;
  const measureCount = measureInfo.length;

  let colorSettings = [];
  let conditionalColors = [];
  let colorBy = null;

  dimensionInfo.map((d, i) => {
    if (d.qAttrExprInfo.length === 0) return;
    d.qAttrExprInfo.map((attr, idx) => {
      if (
        attr.id === "colorTheme" &&
        typeof attr.qFallbackTitle !== "undefined" &&
        colorSettings.length === 0 // if multiple dimensions have formula, use first
      ) {
        colorBy = "dimension";
        return (colorSettings[i] = [i, idx]);
      }
    });
  });

  if (colorSettings.length === 0) {
    measureInfo.map((m, i) => {
      if (m.qAttrExprInfo.length === 0) return;
      m.qAttrExprInfo.forEach((attr, idx) => {
        if (
          attr.id === "colorTheme" &&
          typeof attr.qFallbackTitle !== "undefined"
        ) {
          colorBy = "expression";
          colorSettings.push([dimensionCount + i, idx]);
        }
      });
    });
  }

  if (colorSettings.length !== 0) {
    if (
      colorBy === "dimension" ||
      (colorBy === "expression" &&
        colorSettings.length === measureCount &&
        measureCount === 1)
    ) {
      conditionalColors = qMatrix.map((d) => {
        return d[colorSettings[0][0]].qAttrExps.qValues[colorSettings[0][1]]
          .qText;
      });
    } else if (
      colorBy === "expression" &&
      colorSettings.length === measureCount
    ) {
      qMatrix.map((d, i) => {
        colorSettings.forEach((item, index) => {
          conditionalColors.push(
            d[dimensionCount + index].qAttrExps.qValues[item[1]].qText
          );
        });
      });
    } else if (
      colorBy === "expression" &&
      colorSettings.length !== measureCount
    ) {
      qMatrix.map((d, i) => {
        measureInfo.map((measure, index) => {
          let colorToUse = null;

          colorSettings.forEach((item) => {
            if (index === item[0] - dimensionCount) {
              colorToUse =
                d[dimensionCount + index].qAttrExps.qValues[item[1]].qText;
              conditionalColors.push(colorToUse);
            }
          });

          if (colorToUse === null && useFillColors) {
            colorToUse = colorPalette[index - colorSettings.length + 1];
            conditionalColors.push(colorToUse);
          }
        });
      });
    }

    // showLegend = 'none';
  }
  return conditionalColors;
};
