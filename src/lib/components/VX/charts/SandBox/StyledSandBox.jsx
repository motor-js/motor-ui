import React, { useRef, useEffect, useState } from "react";
import UseHyperCube from "../../../../hooks/useHyperCube";
import useOutsideClick from "../../../../hooks/useOutsideClick";
import SelectionModal from "../../../React/SelectionModal";
import SandBoxTheme, {
  SandBoxWrapper,
  SandBoxWrapperNoData,
  SandBoxNoDataContent,
} from "./SandBoxTheme";
import Spinner from "../../../React/Spinner";
import CreateSandBox from "./CreateSandBox";
import { createColorArray } from "../../../../utils/colors";
// import WithTooltip from "../../VX/old/composer/WithTooltip";

function StyledSandBox(props) {
  // Ref for d3 object
  const d3Container = useRef(null);
  const ref = useRef();
  const [isSelectionSandBoxVisible, setSelectionSandBoxVisible] = useState(
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
    ...rest
  } = props;

  const {
    global: { colorTheme: globalColorTheme },
  } = theme;

  // if the prop is undefined, use the base theme
  // const color = colorTheme || globalColorTheme;
  const colorPalette = createColorArray(colorTheme || globalColorTheme, theme);

  // retrieve SandBox data from HyperCube
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
    // qSuppressZero: suppressZero || SandBoxDefault.suppressZero,
    // qOtherTotalSpec: otherTotalSpec || SandBoxDefault.otherTotalSpec,
    qSuppressZero: true,
  });

  const cancelCallback = () => {
    endSelections(false);
    setSelectionSandBoxVisible(false);
    setRefreshChart(true);
    useSelectionColours = false;
    // setSel([]);
  };

  const confirmCallback = async () => {
    // sel === [] ? '' : await select(0, sel);
    await endSelections(true);
    setSelectionSandBoxVisible(false);
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
    if (isSelectionSandBoxVisible) {
      const outsideClick = !ref.current.contains(event.target);
      if (outsideClick && selections) confirmCallback();
    }
  });

  const handleResize = () => {
    if (typeof calcCond === "undefined" && dataError.length === 0) {
      // CreateSandBox({ ...chartSettings, screenWidth: ref.current.offsetWidth });
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
  //     //   setSelectionSandBoxVisible,
  //     //   // buildSelections,
  //     //   maxAxisLength: maxAxisLength || SandBoxDefault.maxAxisLength,
  //     //   SandBoxThemes,
  //     //   ToolTipThemes,
  //     //   TitleThemes,
  //     //   LegendThemes,
  //     //   allowSlantedYAxis:
  //     //     allowSlantedYAxis === null
  //     //       ? SandBoxDefault.allowSlantedYAxis
  //     //       : allowSlantedYAxis,
  //     //   tickSpacing: tickSpacing || SandBoxDefault.tickSpacing,
  //     //   allowSelections:
  //     //     allowSelections === null
  //     //       ? SandBoxDefault.allowSelections
  //     //       : allowSelections,
  //     //   showLabels: showLabels === null ? SandBoxDefault.showLabels : showLabels,
  //     //   showLegend: legendPosition(showLegend, SandBoxDefault.showLegend),
  //     //   showAxis: calcDisplayOption(
  //     //     showAxis === null ? SandBoxDefault.showAxis : showAxis
  //     //   ),
  //     //   textOnAxis: calcDisplayOption(
  //     //     textOnAxis === null ? SandBoxDefault.textOnAxis : textOnAxis
  //     //   ),
  //     //   showGridlines: calcDisplayOption(
  //     //     showGridlines === null ? SandBoxDefault.showGridlines : showGridlines,
  //     //     true
  //     //   ),
  //     //   selections,
  //     //   select,
  //     //   ...rest,
  //     // };
  //     // CreateSandBox(chartSettings);
  //   }

  //   window.addEventListener("resize", handleResize);

  //   return () => {
  //     window.removeEventListener("resize", handleResize);
  //   };
  // }, [qLayout, qData, d3Container.current]);

  return (
    <>
      {qData && qLayout && !dataError ? (
        <SandBoxWrapper
          border={border}
          backgroundColor={backgroundColor}
          borderRadius={borderRadius}
          margin={margin}
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
              border: isSelectionSandBoxVisible ? "1px solid #CCCCCC" : "none",
              overflowX: isSelectionSandBoxVisible ? "hidden" : "auto",
              overflowY: isSelectionSandBoxVisible ? "hidden" : "auto",
            }}
          >
            {/* <div
                className="d3-component"
                height={height}
                ref={d3Container}
                onClick={(e) => e.stopPropagation()}
              > */}
            {qData && qLayout && (
              <CreateSandBox
                width={width}
                height={height}
                events={events}
                qLayout={qLayout}
                qData={qData}
                beginSelections={beginSelections}
                select={select}
                setRefreshChart={setRefreshChart}
                setSelectionSandBoxVisible={setSelectionSandBoxVisible}
                useSelectionColours={useSelectionColours}
                pendingSelections={pendingSelections}
                SetPendingSelections={SetPendingSelections}
                // SandBoxThemes={SandBoxThemes}
                colorPalette={colorPalette}
              />
            )}
          </div>
          {/* </div> */}
          <SelectionModal
            isOpen={isSelectionSandBoxVisible}
            cancelCallback={cancelCallback}
            confirmCallback={confirmCallback}
            // width={width}
          />
          {/* </div> */}
        </SandBoxWrapper>
      ) : (
        <SandBoxWrapperNoData
          border={border}
          size={size}
          width={width}
          margin={margin}
        >
          <SandBoxNoDataContent height={height}>
            {calcCond || dataError || engineError || <Spinner />}
          </SandBoxNoDataContent>
        </SandBoxWrapperNoData>
      )}
    </>
  );
}

export default StyledSandBox;
