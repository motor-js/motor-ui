import React, { useContext, useCallback } from "react";
// import BaseBrush from "@vx/brush/lib/Brush";
import BaseBrush from "./BaseBrush";
import ChartContext from "../../context/ChartContext";
import useRegisteredData from "../../hooks/useRegisteredData";
import isValidNumber from "../../typeguards/isValidNumber";

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
  onChange,
  onClick,
  resizeTriggerAreas,
  selectedBoxStyle,
  xAxisOrientation,
  yAxisOrientation,
}) {
  const { xScale, yScale, measureInfo, margin, dataRegistry } = useContext(
    ChartContext
  );

  const dataKey = measureInfo[0].qFallbackTitle;

  const { data, xAccessor, yAccessor, elAccessor } =
    useRegisteredData(dataKey) || {};

  // console.log(dataRegistry);

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

  const getElemNumber = useCallback((d) => elAccessor(d), [elAccessor]);
  //  const { orientation } = props;

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

  const onBrushChange = (domain) => {
    if (!domain) return;
    const { x0, x1, y0, y1 } = domain.extent;
    // console.log(domain, x0);
    // console.log("start");
    const stockCopy = data
      .filter((datum) => {
        const x = getScaledX(datum);
        const y = getScaledY(datum);
        // return x > x0 && x < x1 && y > y0 && y < y1;
        return brushDirection === "horizontal"
          ? x > x0 + leftOffset && x < x1 + leftOffset
          : y > y0 + topOffset && y < y1 + topOffset;
      })
      .map((obj) => {
        return getElemNumber(obj);
      });
    // setFilteredStock(stockCopy);
    console.log(stockCopy);
  };

  // const handleBrushChange = (domain) => {
  //   // const { brushDirection } = this.state;
  //   let pointData;
  //   return;
  //   if (domain) {
  //     if (brushDirection === "horizontal") {
  //       pointData = timeSeriesData.filter(
  //         (point) => point.x > domain.x0 && point.x < domain.x1
  //       );
  //     } else if (brushDirection === "vertical") {
  //       pointData = timeSeriesData.filter(
  //         (point) => point.y > domain.y0 && point.y < domain.y1
  //       );
  //     } else {
  //       pointData = timeSeriesData.filter(
  //         (point) =>
  //           point.x > domain.x0 &&
  //           point.x < domain.x1 &&
  //           point.y > domain.y0 &&
  //           point.y < domain.y1
  //       );
  //     }
  //   } else {
  //     pointData = [...timeSeriesData];
  //   }
  //   this.setState(() => ({
  //     pointData,
  //   }));
  // };

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
      onChange={onBrushChange}
      onClick={onClick}
      selectedBoxStyle={selectedBoxStyle}
      brushRegion={brushRegion}
      // xAxisOrientation={xAxisOrientation}
      // yAxisOrientation={yAxisOrientation}
    />
  );
}
