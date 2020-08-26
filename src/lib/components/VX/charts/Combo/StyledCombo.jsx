import React, { useRef, useEffect, useState } from "react";
import UseHyperCube from "../../../../hooks/useHyperCube";
import useOutsideClick from "../../../../hooks/useOutsideClick";
import SelectionModal from "../../../React/SelectionModal";
import ComboTheme, {
  ComboWrapper,
  ComboWrapperNoData,
  ComboNoDataContent,
} from "./ComboTheme";
import Spinner from "../../../React/Spinner";
import CreateCombo from "./CreateCombo";
// import WithTooltip from "../../VX/old/composer/WithTooltip";

function StyledCombo(props) {
  // Ref for d3 object
  const d3Container = useRef(null);
  const ref = useRef();
  const [isSelectionComboVisible, setSelectionComboVisible] = useState(false);
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

  // styles
  // styles
  const { ComboThemes } = ComboTheme(theme, size, fontColor, colorTheme);
  // const { ToolTipThemes } = TooltipTheme(theme, size);
  // const { TitleThemes } = TitleTheme(theme, size);
  // const { LegendThemes } = LegendTheme(theme, backgroundColor);
  const { ComboDefault } = ComboThemes;

  // const { ComboThemes } = ComboTheme(
  //   theme,
  //   size,
  //   fontColor,
  //   chartColor,
  //   setSelectionComboVisible
  // );
  // const { ToolTipThemes } = TooltipTheme(theme, size);
  // const { TitleThemes } = TitleTheme(theme, size);
  // const { LegendThemes } = LegendTheme(theme, backgroundColor);
  // const { ComboDefault } = ComboThemes;

  // retrieve Combo data from HyperCube
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
    // qSuppressZero: suppressZero || ComboDefault.suppressZero,
    // qOtherTotalSpec: otherTotalSpec || ComboDefault.otherTotalSpec,
    qSuppressZero: true,
  });

  const cancelCallback = () => {
    endSelections(false);
    setSelectionComboVisible(false);
    setRefreshChart(true);
    useSelectionColours = false;
    // setSel([]);
  };

  const confirmCallback = async () => {
    // sel === [] ? '' : await select(0, sel);
    await endSelections(true);
    setSelectionComboVisible(false);
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
    if (isSelectionComboVisible) {
      const outsideClick = !ref.current.contains(event.target);
      if (outsideClick && selections) confirmCallback();
    }
  });

  const handleResize = () => {
    if (typeof calcCond === "undefined" && dataError.length === 0) {
      // CreateCombo({ ...chartSettings, screenWidth: ref.current.offsetWidth });
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
  //     //   setSelectionComboVisible,
  //     //   // buildSelections,
  //     //   maxAxisLength: maxAxisLength || ComboDefault.maxAxisLength,
  //     //   ComboThemes,
  //     //   ToolTipThemes,
  //     //   TitleThemes,
  //     //   LegendThemes,
  //     //   allowSlantedYAxis:
  //     //     allowSlantedYAxis === null
  //     //       ? ComboDefault.allowSlantedYAxis
  //     //       : allowSlantedYAxis,
  //     //   tickSpacing: tickSpacing || ComboDefault.tickSpacing,
  //     //   allowSelections:
  //     //     allowSelections === null
  //     //       ? ComboDefault.allowSelections
  //     //       : allowSelections,
  //     //   showLabels: showLabels === null ? ComboDefault.showLabels : showLabels,
  //     //   showLegend: legendPosition(showLegend, ComboDefault.showLegend),
  //     //   showAxis: calcDisplayOption(
  //     //     showAxis === null ? ComboDefault.showAxis : showAxis
  //     //   ),
  //     //   textOnAxis: calcDisplayOption(
  //     //     textOnAxis === null ? ComboDefault.textOnAxis : textOnAxis
  //     //   ),
  //     //   showGridlines: calcDisplayOption(
  //     //     showGridlines === null ? ComboDefault.showGridlines : showGridlines,
  //     //     true
  //     //   ),
  //     //   selections,
  //     //   select,
  //     //   ...rest,
  //     // };
  //     // CreateCombo(chartSettings);
  //   }

  //   window.addEventListener("resize", handleResize);

  //   return () => {
  //     window.removeEventListener("resize", handleResize);
  //   };
  // }, [qLayout, qData, d3Container.current]);

  return (
    <>
      {qData && qLayout && !dataError ? (
        <ComboWrapper
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
              border: isSelectionComboVisible ? "1px solid #CCCCCC" : "none",
              overflowX: isSelectionComboVisible ? "hidden" : "auto",
              overflowY: isSelectionComboVisible ? "hidden" : "auto",
            }}
          >
            {/* <div
                className="d3-component"
                height={height}
                ref={d3Container}
                onClick={(e) => e.stopPropagation()}
              > */}
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
                setSelectionComboVisible={setSelectionComboVisible}
                useSelectionColours={useSelectionColours}
                pendingSelections={pendingSelections}
                SetPendingSelections={SetPendingSelections}
                ComboThemes={ComboThemes}
              />
              // </WithTooltip>
            )}
          </div>
          {/* </div> */}
          <SelectionModal
            isOpen={isSelectionComboVisible}
            cancelCallback={cancelCallback}
            confirmCallback={confirmCallback}
            // width={width}
          />
          {/* </div> */}
        </ComboWrapper>
      ) : (
        <ComboWrapperNoData
          border={border}
          size={size}
          width={width}
          margin={margin}
        >
          <ComboNoDataContent height={height}>
            {calcCond || dataError || engineError || <Spinner />}
          </ComboNoDataContent>
        </ComboWrapperNoData>
      )}
    </>
  );
}

export default StyledCombo;
