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

import { numericSortDirection, isEmpty, validData } from "../../../utils";

function StyledXYChart(props) {
  // Ref for d3 object
  const d3Container = useRef(null);
  const ref = useRef();
  const [currentSelectionIds, setCurrentSelectionIds] = useState([]);
  // const [refreshChart, setRefreshChart] = useState(true);
  const [calcCond, setCalcCond] = useState(null);
  const [dataError, setDataError] = useState(null);
  const [isValid, setIsValid] = useState(null);
  const [data, setData] = useState(null);
  // const [sel, setSel] = useState([]);

  const [showBrush, setShowBrush] = useState(false);
  const enableBrush = () => setShowBrush(true);
  // const disableBrush = () => setShowBrush(false);

  // console.log(currentSelectionIds, "1");

  // let useSelectionColours = false;

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
    // fontColor,
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
    // showLabels,
    // textOnAxis,
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

  useEffect(
    () => {
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
        setData(qData.qMatrix);
        setCurrentSelectionIds([]);
      }
      // };
    },
    [qData]
    // refreshChart
  );

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
        >
          <div
            ref={ref}
            style={{
              position: "relative",
              height,
              // margin: "10px",
              margin: refMargin,
            }}
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
              qMatrix={data}
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
                showLegend === undefined ? xyChart.showLegend : showLegend
              }
              legendTopBottom={legendTopBottom}
              legendDirection={legendDirection}
              legendShape={legendShape}
              snapTooltipToDataX={snapTooltipToDataX}
              snapTooltipToDataY={snapTooltipToDataY}
              backgroundPattern={
                backgroundPattern ||
                xyChart.defaultTheme.backgroundStyles.pattern
              }
              backgroundStyle={
                backgroundStyle || xyChart.defaultTheme.backgroundStyles
              }
              fillStyle={fillStyle || xyChart.defaultTheme.fillStyles}
              multiColor={
                multiColor === undefined ? xyChart.multiColor : multiColor
              }
              showVerticalCrosshair={
                showVerticalCrosshair === undefined
                  ? xyChart.showVerticalCrosshair
                  : showVerticalCrosshair
              }
              selectionMethod={
                selectionMethod === undefined
                  ? xyChart.selectionMethod
                  : selectionMethod
              }
              enableBrush={enableBrush}
              showBrush={showBrush}
              {...rest}
            />
            <SelectionModal
              isOpen={!isEmpty(currentSelectionIds)}
              cancelCallback={cancelCallback}
              confirmCallback={confirmCallback}
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
