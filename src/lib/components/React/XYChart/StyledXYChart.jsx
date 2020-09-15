import React, { useRef, useEffect, useState } from "react";
import useHyperCube from "../../../hooks/useHyperCube";
import useOutsideClick from "../../../hooks/useOutsideClick";
import SelectionModal from "../SelectionModal";
import {
  XYChartWrapper,
  XYChartWrapperNoData,
  XYChartNoDataContent,
} from "./XYChartTheme";
import Spinner from "../Spinner";
import CreateXYChart from "./CreateXYChart";
import { createColorArray } from "../../../utils/colors";

import {
  numericSortDirection,
  isEmpty,
  validData,
  isNull,
} from "../../../utils";

import { valueIfUndefined } from "./xy-chart/util/chartUtils";

let measureCount = null;
let dimensionCount = null;
let singleDimension = null;
let singleMeasure = null;
let dataKeys = null;
let keys = [];

function StyledXYChart(props) {
  // Ref for d3 object
  const d3Container = useRef(null);
  const ref = useRef();
  const [currentSelectionIds, setCurrentSelectionIds] = useState([]);
  const [calcCond, setCalcCond] = useState(null);
  const [dataError, setDataError] = useState(null);
  const [isValid, setIsValid] = useState(null);
  const [data, setData] = useState(null);

  const [showBrush, setShowBrush] = useState(false);
  const enableBrush = () => setShowBrush(true);

  // props
  const {
    engine,
    engineError,
    theme,
    cols,
    width,
    height,
    events,
    margin,
    size,
    border,
    borderRadius,
    backgroundColor,
    colorTheme,
    showLegend,
    selectionMethod,
    sortDirection,
    sortOrder,
    calcCondition,
    suppressZero,
    otherTotalSpec,
    // tickSpacing,
    gridArea,
    type,
    padding,
    useAnimatedAxes,
    autoWidth,
    renderHorizontally,
    includeZero,
    xAxisOrientation,
    yAxisOrientation,
    legendLeftRight,
    legendTopBottom,
    legendDirection,
    legendShape,
    snapTooltipToDataX,
    snapTooltipToDataY,
    backgroundPattern,
    backgroundStyle,
    multiColor,
    fillStyle,
    showVerticalCrosshair,
    showBoxShadow,
    ...rest
  } = props;

  const {
    global: { colorTheme: globalColorTheme },
    xyChart,
  } = theme;

  // if the prop is undefined, use the base theme
  const colorPalette = createColorArray(colorTheme || globalColorTheme, theme);

  const refMargin = "10px";

  // retrieve XYChart data from HyperCube
  const {
    beginSelections,
    endSelections,
    qLayout,
    qData,
    selections,
    select,
  } = useHyperCube({
    engine,
    cols,
    qSortByNumeric: numericSortDirection(sortDirection, -1),
    qSortByAscii: numericSortDirection(sortDirection, 1),
    qInterColumnSortOrder: sortOrder,
    qCalcCondition: calcCondition,
    qSuppressZero: suppressZero || xyChart.suppressZero,
    qOtherTotalSpec: otherTotalSpec || xyChart.otherTotalSpec,
    qSuppressZero: true,
  });

  const cancelCallback = () => {
    endSelections(false);
    setCurrentSelectionIds([]);
    setShowBrush(false);
  };

  const confirmCallback = async () => {
    await endSelections(true);
    setCurrentSelectionIds([]);
    setShowBrush(false);
  };

  useOutsideClick(ref, () => {
    if (
      event.target.classList.contains("cancelSelections") ||
      event.target.parentNode.classList.contains("cancelSelections")
    )
      return;
    if (!isEmpty(currentSelectionIds)) {
      const outsideClick = !ref.current.contains(event.target);
      if (outsideClick && selections) confirmCallback();
    }
  });

  const handleResize = () => {
    if (typeof calcCond === "undefined" && dataError.length === 0) {
      // CreateXYChart({ ...chartSettings, screenWidth: ref.current.offsetWidth });
    }
  };

  // const buildSelections = (s) => {
  //   setSel(...sel, s);
  // };

  // let keys = [];

  useEffect(() => {
    let valid;
    if (qLayout) {
      // setObjId(qLayout.qInfo.qId);
      setCalcCond(qLayout.qHyperCube.qCalcCondMsg);
      valid = validData(qLayout, theme);
      if (valid) {
        setIsValid(valid.isValid);
        setDataError(valid.dataError);
      }
    }

    // window.addEventListener("resize", handleResize);

    // return () => {
    //   window.removeEventListener("resize", handleResize);
    // qData && data && console.log(qData.qMatrix.length, data.length);
    // qData && setData(qData);

    if (
      (qData && data === null) ||
      (qData && data && qData.qMatrix.length !== data.length && isValid)
    ) {
      dimensionCount = qLayout.qHyperCube.qDimensionInfo.length;
      measureCount = qLayout.qHyperCube.qMeasureInfo.length;
      singleDimension = dimensionCount === 1;
      singleMeasure = measureCount === 1;

      let series = [];
      let dimID = null;
      let items = [];
      // let keys = [];

      if (!singleDimension && !type.includes("scatter")) {
        qData.qMatrix.forEach((d, i) => {
          if (isNull(dimID)) {
            dimID = d[0].qText;
            series.push(d[0]);
          }

          if (dimID !== d[0].qText) {
            items.push(series);
            series = [];
            series.push(d[0]);
            dimID = d[0].qText;
          }
          const measure = d[1];
          measure.qNum = d[2].qNum;
          if (!keys.includes(measure.qText)) {
            keys.push(measure.qText);
          }
          series.push(measure);
        });

        items.push(series);
      }

      dataKeys =
        singleDimension && singleMeasure && type === "bar"
          ? qData.qMatrix.map((d) => d[0].qText)
          : !singleDimension
          ? keys
          : null;

      setData(singleDimension ? qData.qMatrix : items);
    }
  }, [qData]);

  return (
    <>
      {data && qLayout && !dataError ? (
        <XYChartWrapper
          border={border}
          backgroundColor={backgroundColor}
          borderRadius={borderRadius}
          margin={margin || xyChart.margin}
          gridArea={gridArea}
          width={width}
          showBoxShadow={valueIfUndefined(
            showBoxShadow,
            xyChart.wrapper.showBoxShadow
          )}
          ref={ref}
        >
          <div
          // style={{
          //   position: "relative",
          //   height,
          //   // margin: "10px",
          //   margin: refMargin,
          // }}
          >
            {/* <div
                className="d3-component"
                height={height}
                ref={d3Container}
                onClick={(e) => e.stopPropagation()}
              > */}
            {/* {qData && qLayout && ( */}
            <CreateXYChart
              // width={width}
              // height={height}
              width={
                gridArea
                  ? ref.current.offsetWidth
                  : parseInt(width, 10) - parseInt(refMargin, 10) * 2 // Adjust for outside padding
              }
              height={
                gridArea
                  ? ref.current.offsetHeight -
                    parseInt(margin || xyChart.margin, 10)
                  : parseInt(height, 10)
              }
              events={events || xyChart.events}
              qLayout={qLayout}
              // qData={data}
              theme={theme}
              singleDimension={singleDimension}
              singleMeasure={singleMeasure}
              measureCount={measureCount}
              dimensionCount={dimensionCount}
              data={data}
              keys={keys}
              dataKeys={dataKeys}
              beginSelections={beginSelections}
              select={select}
              // refreshChart={refreshChart}
              // setRefreshChart={setRefreshChart}
              setCurrentSelectionIds={setCurrentSelectionIds}
              currentSelectionIds={currentSelectionIds}
              // useSelectionColours={useSelectionColours}
              colorPalette={colorPalette}
              type={type}
              padding={padding || xyChart.padding}
              useAnimatedAxes={useAnimatedAxes || xyChart.useAnimatedAxes}
              autoWidth={autoWidth || xyChart.autoWidth}
              renderHorizontally={
                renderHorizontally || xyChart.renderHorizontally
              }
              includeZero={includeZero || xyChart.includeZero}
              xAxisOrientation={xAxisOrientation}
              yAxisOrientation={yAxisOrientation}
              legendLeftRight={legendLeftRight}
              showLegend={
                // showLegend === undefined ? xyChart.showLegend : showLegend
                valueIfUndefined(showLegend, xyChart.showLegend)
              }
              legendTopBottom={legendTopBottom}
              legendDirection={legendDirection}
              legendShape={legendShape}
              snapTooltipToDataX={snapTooltipToDataX}
              snapTooltipToDataY={snapTooltipToDataY}
              backgroundPattern={
                backgroundPattern || xyChart.backgroundStyles.pattern
              }
              backgroundStyle={backgroundStyle || xyChart.backgroundStyles}
              fillStyle={fillStyle || xyChart.fillStyles}
              multiColor={valueIfUndefined(multiColor, xyChart.multiColor)}
              showVerticalCrosshair={valueIfUndefined(
                showVerticalCrosshair,
                xyChart.showVerticalCrosshair
              )}
              selectionMethod={valueIfUndefined(
                selectionMethod,
                xyChart.selectionMethod
              )}
              enableBrush={enableBrush}
              showBrush={showBrush}
              {...rest}
            />
            <SelectionModal
              isOpen={!isEmpty(currentSelectionIds)}
              cancelCallback={cancelCallback}
              confirmCallback={confirmCallback}
              offsetX={0}
              // width={width}
            />
          </div>
        </XYChartWrapper>
      ) : (
        <XYChartWrapperNoData
          border={border}
          size={size}
          margin={margin || xyChart.margin}
          // height={
          //   gridArea
          //     ? ref.current.offsetHeight -
          //       parseInt(margin || xyChart.margin, 10)
          //     : parseInt(height, 10)
          // }
          gridArea={gridArea}
          width={width}
        >
          <XYChartNoDataContent height={height}>
            {calcCond || dataError || engineError || <Spinner />}
          </XYChartNoDataContent>
        </XYChartWrapperNoData>
      )}
    </>
  );
}

export default StyledXYChart;
