// export function hyperCubeTransform(qData, qHyperCube) {
export function hyperCubeTransform(
  qData,
  qHyperCube,
  useNumonFirstDim = false
) {
  const qNoOfDiemnsions =
    qHyperCube !== undefined ? qHyperCube.qDimensionInfo.length : 1;
  const qNoOfMeasures =
    qHyperCube !== undefined ? qHyperCube.qMeasureInfo.length : 1;

  const measureNames = getMeasureNames(qHyperCube);
  const dimensionNames = getDimensionNames(qHyperCube);

  const transformedData = qData.qMatrix.map((d) => {
    let data = {};
    d.forEach((item, index) => {
      // check if more than 2 dimensions
      const pair =
        index < qNoOfDiemnsions
          ? {
              [dimensionNames[index]]:
                // d[index].qText === undefined ? 'undefined' : d[index].qText,
                d[index].qText === undefined
                  ? "undefined"
                  : index === 0 && useNumonFirstDim
                  ? d[index].qNum
                  : d[index].qText,
              [`elemNumber${index !== 0 ? index : ""}`]: d[index].qElemNumber,
            }
          : {
              [measureNames[index - qNoOfDiemnsions]]:
                d[index].qNum !== "NaN" ? d[index].qNum : 0,
            };
      data = { ...data, ...pair };
    });

    return data;
  });

  return transformedData;
}

export function groupHyperCubeData(qData) {
  const data = [];
  let currentItem = null;
  const rangeBands = [];
  let paddingShift = 0;

  currentItem = qData[0][Object.keys(qData[0])[0]];

  qData.forEach((d, i) => {
    if (currentItem !== d[Object.keys(d)[0]]) {
      currentItem = d[Object.keys(d)[0]];
    } else if (i !== 0) {
      paddingShift += 1;
    }

    d.band = `${d[Object.keys(d)[0]]}|${d[Object.keys(d)[2]]}`;
    rangeBands.push(d.band);

    d.paddingShift = +paddingShift;
    data.push(d);
  });

  return [data, rangeBands, paddingShift];
}

export function stackHyperCubeData(qData, asPercentage = false) {
  const data = [];
  let currentObj = {};
  let parentObject = {};
  let cummulative = 0;
  let currentItem = qData[0][Object.keys(qData[0])[0]];
  let dimIndex = 0;

  qData.forEach((d, i) => {
    if (currentItem !== d[Object.keys(d)[0]]) {
      if (asPercentage) {
        Object.keys(currentObj).forEach((key) => {
          currentObj[key] = currentObj[key] / cummulative;
          currentObj[key] = isNaN(currentObj[key]) ? 0 : currentObj[key];
        });
      }

      parentObject = {
        ...parentObject,
        ...currentObj,
        total: asPercentage ? 1 : cummulative,
        dimIndex,
      };
      dimIndex++;
      data.push(parentObject);
      currentItem = d[Object.keys(d)[0]];
      cummulative = 0;
      currentObj = {};
    }

    parentObject = {
      [Object.keys(d)[0]]: d[Object.keys(d)[0]],
      [Object.keys(d)[1]]: d[Object.keys(d)[1]],
    };

    currentObj = {
      ...currentObj,
      [d[Object.keys(d)[2]]]: d[Object.keys(d)[4]],
    };

    cummulative += d[Object.keys(d)[4]];
  });

  if (asPercentage) {
    Object.keys(currentObj).forEach((key) => {
      currentObj[key] = currentObj[key] / cummulative;
    });
  }

  parentObject = {
    ...parentObject,
    ...currentObj,
    total: asPercentage ? 1 : cummulative,
    dimIndex,
  };

  data.push(parentObject);

  const rangeBands = [...new Set(qData.map((d) => d[Object.keys(d)[2]]))];

  return [data, rangeBands];
}

export const getMeasureNames = (qHyperCube) =>
  qHyperCube.qMeasureInfo.map((d, i) => {
    const qMeasurePosition = i !== 0 ? i : "";

    return d.qFallbackTitle.startsWith("=")
      ? `value${qMeasurePosition}`
      : d.qFallbackTitle;
  });

export const getDimensionNames = (qHyperCube) =>
  qHyperCube.qDimensionInfo.map((d, i) => d.qFallbackTitle);

export const getDimensionCategories = (data) => [
  ...new Set(
    Array.prototype.concat(
      ...data.map((d) => d[Object.keys(d)[2]].map((d) => d[Object.keys(d)[0]]))
    )
  ),
];

export const validData = (qLayout, theme) => {
  let isValid = true;
  let dataError = "";
  const { qDimensionInfo, qMeasureInfo } =
    qLayout.qHyperCube || qLayout.qListObject;
  const { dimensionErrMsg, measureErrMsg } = theme.global.chart.error;

  const DimCheck = () => {
    //check if an array, to work with HyperCube & ListObject
    let _qDimensionInfo = Array.isArray(qDimensionInfo)
      ? qDimensionInfo
      : [qDimensionInfo];
    _qDimensionInfo.forEach((qData) => {
      if (qData.qError) {
        isValid = false;
        dataError = dimensionErrMsg;
      }
    });
  };

  const MeasCheck = () => {
    qMeasureInfo.forEach((qData) => {
      if (
        (isNaN(qData.qMax) && isNaN(qData.qMin)) ||
        (qData.qMax === 0 && qData.qMin === 0)
      ) {
        isValid = false;
        dataError = measureErrMsg;
      }
    });
  };

  if (qDimensionInfo && qMeasureInfo) {
    DimCheck();
    MeasCheck();
  } else if (qDimensionInfo && !qMeasureInfo) {
    DimCheck();
  } else if (!qDimensionInfo && qMeasureInfo) {
    MeasCheck();
  } else {
  }

  return { isValid, dataError };
};

export const numericSortDirection = (sortDirection, defaultSetting = 0) => {
  let direction;
  switch (sortDirection.toUpperCase()) {
    case "ASC" || "ASCENDING":
      direction = 1;
      break;
    case "DESC" || "DESCENDING":
      direction = -1;
      break;
    default:
      direction = defaultSetting;
  }

  return direction;
};

export default hyperCubeTransform;
