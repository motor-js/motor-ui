import React, { useContext, useCallback, useRef, useEffect } from "react";
import BaseBrush from "./BaseBrush";
import DataContext from "../context/DataContext";
// import { isValidNumber } from "../../utils/chartUtils";
import isValidNumber from "../typeguards/isValidNumber";

import { isEmpty } from "../utils";

const leftRightResizeTriggers = ["left", "right"];
const topBottomResizeTriggers = ["top", "bottom"];
const allResizeTriggers = [
  "left",
  "right",
  "top",
  "bottom",
  "topLeft",
  "topRight",
  "bottomLeft",
  "bottomRight",
];

export default function Brush({
  brushDirection = "horizontal",
  brushRegion = "chart",
  handleSize = 8,
  initialBrushPosition,
  // onChange,
  onClick,
  resizeTriggerAreas,
  selectedBoxStyle,
  xAxisOrientation,
  yAxisOrientation,
}) {
  const {
    xScale,
    yScale,
    measureInfo,
    margin,
    dataRegistry,
    handleClick,
    currentSelectionIds,
    dataKeys,
    singleDimension,
    chartType,
  } = useContext(DataContext);

  const childRef = useRef();

  let xAccessor = null;
  let yAccessor = null;

  useEffect(() => {
    if (isEmpty(currentSelectionIds) && childRef.current)
      childRef.current.reset();
  }, [currentSelectionIds]);

  const getScaledX = useCallback(
    (d) => {
      const x = xScale(xAccessor?.(d));
      return isValidNumber(x) ? x + (xScale.bandwidth?.() ?? 0) / 2 : null;
    },
    [xScale, xAccessor]
  );

  const getScaledY = useCallback(
    (d) => {
      const y = yScale(yAccessor?.(d));
      return isValidNumber(y) ? y + (yScale.bandwidth?.() ?? 0) / 2 : null;
    },
    [yScale, yAccessor]
  );

  // not yet available in context
  if (!xScale || !yScale) return null;

  // @TODO make a util for this
  const xRange = xScale.range();
  const yRange = yScale.range();
  const width = Math.abs(xRange[1] - xRange[0]);
  const height = Math.abs(yRange[1] - yRange[0]);

  const topOffset =
    xAxisOrientation === "top"
      ? height - margin.bottom
      : xAxisOrientation === "bottom"
      ? margin.top
      : 0;

  const leftOffset =
    yAxisOrientation === "left"
      ? margin.left
      : yAxisOrientation === "right"
      ? width - margin.right
      : 0;

  // const [filteredStock, setFilteredStock] = useState(stock);
  let selectionIds = [];

  const onChange = (domain) => {
    if (!domain) return;

    const { x0, x1, y0, y1 } = domain.extent;

    {
      const data = chartType.includes("scatter")
        ? [measureInfo[0]]
        : measureInfo;
      singleDimension
        ? data.map((m, i) => {
            const registeredData = dataRegistry[m.qFallbackTitle];
            xAccessor = registeredData.xAccessor;
            yAccessor = registeredData.yAccessor;

            const stockCopy = registeredData.data
              .filter((datum) => {
                const x = getScaledX(datum);
                const y = getScaledY(datum);
                // return x > x0 && x < x1 && y > y0 && y < y1;
                return brushDirection === "horizontal"
                  ? x > x0 + leftOffset && x < x1 + leftOffset
                  : y > y0 + topOffset && y < y1 + topOffset;
              })
              .map((obj) => {
                return registeredData.elAccessor(obj);
              });
            // setFilteredStock(stockCopy);
            selectionIds = [...selectionIds, ...stockCopy];
          })
        : dataKeys.map((m, i) => {
            const registeredData = dataRegistry[m];
            xAccessor = registeredData.xAccessor;
            yAccessor = registeredData.yAccessor;

            const stockCopy = registeredData.data
              .filter((datum) => {
                const x = getScaledX(datum);
                const y = getScaledY(datum);
                // return x > x0 && x < x1 && y > y0 && y < y1;
                return brushDirection === "horizontal"
                  ? x > x0 + leftOffset && x < x1 + leftOffset
                  : y > y0 + topOffset && y < y1 + topOffset;
              })
              .map((obj) => {
                return registeredData.elAccessor(obj);
              });
            selectionIds = [...selectionIds, ...stockCopy];
          });
    }
    if (!isEmpty(selectionIds)) handleClick(selectionIds);
  };

  // const onMouseUp = () => handleClick(selectionIds);

  return (
    <BaseBrush
      // force clear the brush if any of these change
      top={topOffset}
      left={leftOffset}
      key={`${brushRegion}-${xAxisOrientation}-${yAxisOrientation}`}
      xScale={xScale}
      yScale={yScale}
      width={width}
      height={height}
      margin={margin}
      handleSize={handleSize}
      resizeTriggerAreas={
        resizeTriggerAreas ||
        (brushDirection === "horizontal"
          ? leftRightResizeTriggers
          : brushDirection === "vertical"
          ? topBottomResizeTriggers
          : allResizeTriggers)
      }
      brushDirection={brushDirection}
      initialBrushPosition={
        initialBrushPosition
          ? initialBrushPosition({ xScale, yScale })
          : undefined
      }
      onChange={onChange}
      // onMouseUp={onMouseUp}
      onClick={onClick}
      selectedBoxStyle={selectedBoxStyle}
      brushRegion={brushRegion}
      ref={childRef}
    />
  );
}
