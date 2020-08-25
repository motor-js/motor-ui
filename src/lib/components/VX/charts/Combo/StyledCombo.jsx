import React, { useRef, useEffect, useState } from "react";
import UseHyperCube from "../../../../hooks/useHyperCube";
import useOutsideClick from "../../../../hooks/useOutsideClick";
import SelectionModal from "../../../React/SelectionModal";
import BarTheme, {
  BarWrapper,
  BarWrapperNoData,
  BarNoDataContent,
} from "./ComboTheme";
import Spinner from "../../../React/Spinner";
import CreateCombo from "./CreateCombo";
// import WithTooltip from "../../VX/old/composer/WithTooltip";

function StyledCombo(props) {
  // Ref for d3 object
  const d3Container = useRef(null);
  const ref = useRef();
  const [isSelectionBarVisible, setSelectionBarVisible] = useState(false);
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
    chartColor,
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

  // styles
  const { BarThemes } = BarTheme(
    theme,
    size,
    fontColor,
    chartColor,
    setSelectionBarVisible
  );
  // const { ToolTipThemes } = TooltipTheme(theme, size);
  // const { TitleThemes } = TitleTheme(theme, size);
  // const { LegendThemes } = LegendTheme(theme, backgroundColor);
  const { BarDefault } = BarThemes;

  // retrieve Bar data from HyperCube
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
    // qSuppressZero: suppressZero || BarDefault.suppressZero,
    // qOtherTotalSpec: otherTotalSpec || BarDefault.otherTotalSpec,
    qSuppressZero: true,
  });

  const cancelCallback = () => {
    endSelections(false);
    setSelectionBarVisible(false);
    setRefreshChart(true);
    useSelectionColours = false;
    // setSel([]);
  };

  const confirmCallback = async () => {
    // sel === [] ? '' : await select(0, sel);
    await endSelections(true);
    setSelectionBarVisible(false);
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
    if (isSelectionBarVisible) {
      const outsideClick = !ref.current.contains(event.target);
      if (outsideClick && selections) confirmCallback();
    }
  });

  const handleResize = () => {
    if (typeof calcCond === "undefined" && dataError.length === 0) {
      // CreateBar({ ...chartSettings, screenWidth: ref.current.offsetWidth });
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
  //     //   setSelectionBarVisible,
  //     //   // buildSelections,
  //     //   maxAxisLength: maxAxisLength || BarDefault.maxAxisLength,
  //     //   BarThemes,
  //     //   ToolTipThemes,
  //     //   TitleThemes,
  //     //   LegendThemes,
  //     //   allowSlantedYAxis:
  //     //     allowSlantedYAxis === null
  //     //       ? BarDefault.allowSlantedYAxis
  //     //       : allowSlantedYAxis,
  //     //   tickSpacing: tickSpacing || BarDefault.tickSpacing,
  //     //   allowSelections:
  //     //     allowSelections === null
  //     //       ? BarDefault.allowSelections
  //     //       : allowSelections,
  //     //   showLabels: showLabels === null ? BarDefault.showLabels : showLabels,
  //     //   showLegend: legendPosition(showLegend, BarDefault.showLegend),
  //     //   showAxis: calcDisplayOption(
  //     //     showAxis === null ? BarDefault.showAxis : showAxis
  //     //   ),
  //     //   textOnAxis: calcDisplayOption(
  //     //     textOnAxis === null ? BarDefault.textOnAxis : textOnAxis
  //     //   ),
  //     //   showGridlines: calcDisplayOption(
  //     //     showGridlines === null ? BarDefault.showGridlines : showGridlines,
  //     //     true
  //     //   ),
  //     //   selections,
  //     //   select,
  //     //   ...rest,
  //     // };
  //     // CreateBar(chartSettings);
  //   }

  //   window.addEventListener("resize", handleResize);

  //   return () => {
  //     window.removeEventListener("resize", handleResize);
  //   };
  // }, [qLayout, qData, d3Container.current]);

  return (
    <>
      {qData && qLayout && !dataError ? (
        <BarWrapper
          border={border}
          backgroundColor={backgroundColor}
          borderRadius={borderRadius}
          margin={margin}
          width={width}
        >
          <div
            ref={ref}
            style={{
              position: "relative",
              height,
              margin: "10px",
            }}
          >
            <div
              style={{
                border: isSelectionBarVisible ? "1px solid #CCCCCC" : "none",
                overflowX: isSelectionBarVisible ? "hidden" : "auto",
                overflowY: isSelectionBarVisible ? "hidden" : "auto",
              }}
            >
              <div
                className="d3-component"
                height={height}
                ref={d3Container}
                onClick={(e) => e.stopPropagation()}
              >
                {qData && qLayout && (
                  // <WithTooltip
                  //   // renderTooltip={({ datum }) => datum.y}
                  //   renderTooltip={({ datum }) => {
                  //     console.log(datum);
                  //   }}
                  //   tooltipProps={{
                  //     offsetTop: 0,
                  //     style: {
                  //       backgroundColor: "pink",
                  //       opacity: 0.9,
                  //     },
                  //   }}
                  // >
                  <CreateCombo
                    width={width}
                    height={height}
                    events={events}
                    qLayout={qLayout}
                    qData={qData}
                    beginSelections={beginSelections}
                    select={select}
                    setRefreshChart={setRefreshChart}
                    setSelectionBarVisible={setSelectionBarVisible}
                    useSelectionColours={useSelectionColours}
                    pendingSelections={pendingSelections}
                    SetPendingSelections={SetPendingSelections}
                  />
                  // </WithTooltip>
                )}
              </div>
            </div>
            <SelectionModal
              isOpen={isSelectionBarVisible}
              cancelCallback={cancelCallback}
              confirmCallback={confirmCallback}
              // width={width}
            />
          </div>
        </BarWrapper>
      ) : (
        <BarWrapperNoData
          border={border}
          size={size}
          width={width}
          margin={margin}
        >
          <BarNoDataContent height={height}>
            {calcCond || dataError || engineError || <Spinner />}
          </BarNoDataContent>
        </BarWrapperNoData>
      )}
    </>
  );
}

export default StyledCombo;
