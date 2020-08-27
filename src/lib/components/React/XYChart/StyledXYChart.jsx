import React, { useRef, useEffect, useState } from "react";
import UseHyperCube from "../../../hooks/useHyperCube";
import useOutsideClick from "../../../hooks/useOutsideClick";
import SelectionModal from "../SelectionModal";
import XYChartTheme, {
  XYChartWrapper,
  XYChartWrapperNoData,
  XYChartNoDataContent,
} from "./XYChartTheme";
import Spinner from "../Spinner";
import CreateXYChart from "./CreateXYChart";
import { createColorArray } from "../../../utils/colors";

function StyledXYChart(props) {
  // Ref for d3 object
  const d3Container = useRef(null);
  const ref = useRef();
  const [isSelectionXYChartVisible, setSelectionXYChartVisible] = useState(
    false
  );
  const [refreshChart, setRefreshChart] = useState(true);
  const [calcCond, setCalcCond] = useState(null);
  const [dataError, setDataError] = useState(null);
  const [isValid, setIsValid] = useState(null);
  // const [sel, setSel] = useState([]);
  const [pendingSelections, SetPendingSelections] = useState([]);

  let useSelectionColours = false;
  let chartSettings = {};

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
    fontColor,
    border,
    borderRadius,
    backgroundColor,
    colorTheme,
    showLegend,
    allowSelections,
    showAxis,
    maxAxisLength,
    sortDirection,
    barSortOrder,
    calcCondition,
    suppressZero,
    showLabels,
    textOnAxis,
    showGridlines,
    otherTotalSpec,
    tickSpacing,
    allowSlantedYAxis,
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
    ...rest
  } = props;

  const {
    global: { colorTheme: globalColorTheme },
  } = theme;

  // if the prop is undefined, use the base theme
  // const color = colorTheme || globalColorTheme;
  const colorPalette = createColorArray(colorTheme || globalColorTheme, theme);

  // retrieve XYChart data from HyperCube
  const {
    beginSelections,
    endSelections,
    qLayout,
    qData,
    selections,
    select,
  } = UseHyperCube({
    engine,
    cols,
    // qSortByNumeric: numericSortDirection(sortDirection, -1),
    // qSortByAscii: numericSortDirection(sortDirection, 1),
    // qInterColumnSortOrder: barSortOrder,
    // qCalcCondition: calcCondition,
    // qSuppressZero: suppressZero || XYChartDefault.suppressZero,
    // qOtherTotalSpec: otherTotalSpec || XYChartDefault.otherTotalSpec,
    qSuppressZero: true,
  });

  const cancelCallback = () => {
    endSelections(false);
    setSelectionXYChartVisible(false);
    setRefreshChart(true);
    useSelectionColours = false;
    // setSel([]);
  };

  const confirmCallback = async () => {
    // sel === [] ? '' : await select(0, sel);
    await endSelections(true);
    setSelectionXYChartVisible(false);
    setRefreshChart(true);
    useSelectionColours = false;
    // setSel([]);
  };

  useOutsideClick(ref, () => {
    if (
      event.target.classList.contains("cancelSelections") ||
      event.target.parentNode.classList.contains("cancelSelections")
    )
      return;
    if (isSelectionXYChartVisible) {
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

  // useEffect(() => {
  //   let valid;
  //   if (qLayout) {
  //     // setObjId(qLayout.qInfo.qId);
  //     setCalcCond(qLayout.qHyperCube.qCalcCondMsg);
  //     valid = validData(qLayout, theme);
  //     if (valid) {
  //       setIsValid(valid.isValid);
  //       setDataError(valid.dataError);
  //     }
  //   }

  //   if (qData && isValid && d3Container.current && refreshChart) {
  //     // chartSettings = {
  //     //   qLayout,
  //     //   qData,
  //     //   // propsWidth: width,
  //     //   propsHeight: height,
  //     //   d3Container,
  //     //   screenWidth: ref.current.offsetWidth,
  //     //   useSelectionColours,
  //     //   setRefreshChart,
  //     //   beginSelections,
  //     //   setSelectionXYChartVisible,
  //     //   // buildSelections,
  //     //   maxAxisLength: maxAxisLength || XYChartDefault.maxAxisLength,
  //     //   XYChartThemes,
  //     //   ToolTipThemes,
  //     //   TitleThemes,
  //     //   LegendThemes,
  //     //   allowSlantedYAxis:
  //     //     allowSlantedYAxis === null
  //     //       ? XYChartDefault.allowSlantedYAxis
  //     //       : allowSlantedYAxis,
  //     //   tickSpacing: tickSpacing || XYChartDefault.tickSpacing,
  //     //   allowSelections:
  //     //     allowSelections === null
  //     //       ? XYChartDefault.allowSelections
  //     //       : allowSelections,
  //     //   showLabels: showLabels === null ? XYChartDefault.showLabels : showLabels,
  //     //   showLegend: legendPosition(showLegend, XYChartDefault.showLegend),
  //     //   showAxis: calcDisplayOption(
  //     //     showAxis === null ? XYChartDefault.showAxis : showAxis
  //     //   ),
  //     //   textOnAxis: calcDisplayOption(
  //     //     textOnAxis === null ? XYChartDefault.textOnAxis : textOnAxis
  //     //   ),
  //     //   showGridlines: calcDisplayOption(
  //     //     showGridlines === null ? XYChartDefault.showGridlines : showGridlines,
  //     //     true
  //     //   ),
  //     //   selections,
  //     //   select,
  //     //   ...rest,
  //     // };
  //     // CreateXYChart(chartSettings);
  //   }

  //   window.addEventListener("resize", handleResize);

  //   return () => {
  //     window.removeEventListener("resize", handleResize);
  //   };
  // }, [qLayout, qData, d3Container.current]);

  return (
    <>
      {qData && qLayout && !dataError ? (
        <XYChartWrapper
          border={border}
          backgroundColor={backgroundColor}
          borderRadius={borderRadius}
          margin={margin || theme.global.chart.margin}
          gridArea={gridArea}
          width={width}
        >
          {/* <div
            ref={ref}
            style={{
              position: "relative",
              height,
              margin: "10px",
            }}
          > */}
          <div
            style={{
              border: isSelectionXYChartVisible ? "1px solid #CCCCCC" : "none",
              overflowX: isSelectionXYChartVisible ? "hidden" : "auto",
              overflowY: isSelectionXYChartVisible ? "hidden" : "auto",
            }}
          >
            {/* <div
                className="d3-component"
                height={height}
                ref={d3Container}
                onClick={(e) => e.stopPropagation()}
              > */}
            {qData && qLayout && (
              <CreateXYChart
                // width={width}
                // height={height}
                width={gridArea ? ref.current.offsetWidth : parseInt(width, 10)}
                height={
                  gridArea
                    ? ref.current.offsetHeight -
                      parseInt(margin || theme.global.chart.margin, 10)
                    : parseInt(height, 10)
                }
                events={events}
                qLayout={qLayout}
                qData={qData}
                beginSelections={beginSelections}
                select={select}
                setRefreshChart={setRefreshChart}
                setSelectionXYChartVisible={setSelectionXYChartVisible}
                useSelectionColours={useSelectionColours}
                pendingSelections={pendingSelections}
                SetPendingSelections={SetPendingSelections}
                // XYChartThemes={XYChartThemes}
                colorPalette={colorPalette}
                type={type}
                padding={padding}
                useAnimatedAxes={useAnimatedAxes}
                autoWidth={autoWidth}
                renderHorizontally={renderHorizontally}
                includeZero={includeZero}
                xAxisOrientation={xAxisOrientation}
                yAxisOrientation={yAxisOrientation}
                legendLeftRight={legendLeftRight}
                legendTopBottom={legendTopBottom}
                legendDirection={legendDirection}
                legendShape={legendShape}
                snapTooltipToDataX={snapTooltipToDataX}
                snapTooltipToDataY={snapTooltipToDataY}
                backgroundPattern={backgroundPattern}
              />
            )}
          </div>
          {/* </div> */}
          <SelectionModal
            isOpen={isSelectionXYChartVisible}
            cancelCallback={cancelCallback}
            confirmCallback={confirmCallback}
            // width={width}
          />
          {/* </div> */}
        </XYChartWrapper>
      ) : (
        <XYChartWrapperNoData
          border={border}
          size={size}
          margin={margin || theme.global.chart.margin}
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
