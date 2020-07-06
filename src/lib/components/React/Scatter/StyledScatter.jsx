import React, { useRef, useEffect, useState } from "react";
import UseHyperCube from "../../../hooks/useHyperCube";
import useOutsideClick from "../../../hooks/useOutsideClick";
import SelectionModal from "../SelectionModal";
import ScatterTheme, {
  ScatterWrapper,
  ScatterWrapperNoData,
  ScatterNoDataContent,
} from "./ScatterTheme";
import TooltipTheme from "../../D3/Tooltip/TooltipTheme";
import TitleTheme from "../../D3/Title/TitleTheme";
import LegendTheme from "../../D3/Legend/LegendTheme";
import {
  numericSortDirection,
  validData,
  calcDisplayOption,
  legendPosition,
} from "../../../utils";
import CreateScatter from "./CreateScatter";
import Spinner from "../Spinner";

function StyledScatter(props) {
  // Ref for d3 object
  const d3Container = useRef(null);
  const ref = useRef();
  const [isSelectionScatterVisible, setSelectionScatterVisible] = useState(
    false
  );
  const [refreshChart, setRefreshChart] = useState(true);
  const [calcCond, setCalcCond] = useState(null);
  const [dataError, setDataError] = useState(null);
  const [isValid, setIsValid] = useState(null);
  // const [sel, setSel] = useState([]);

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
    margin,
    size,
    fontColor,
    border,
    backgroundColor,
    borderRadius,
    chartColor,
    showLegend,
    allowSelections,
    showAxis,
    sortDirection,
    columnSortOrder,
    calcCondition,
    suppressZero,
    showLabels,
    showGridlines,
    textOnAxis,
    otherTotalSpec,
    tickSpacing,
    ...rest
  } = props;

  // styles
  const {
    ScatterThemes,
    ScatterThemes: { ScatterDefault },
  } = ScatterTheme(theme, size, fontColor, chartColor);
  const { ToolTipThemes } = TooltipTheme(theme, size);
  const { TitleThemes } = TitleTheme(theme, size);
  const { LegendThemes } = LegendTheme(theme, backgroundColor);
  // const { ScatterDefault } = ScatterThemes;

  // retrieve Scatter data from HyperCube
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
    qSortByNumeric: numericSortDirection(sortDirection, -1),
    qSortByAscii: numericSortDirection(sortDirection, 1),
    qInterScatterSortOrder: columnSortOrder,
    qCalcCondition: calcCondition,
    qSuppressZero: suppressZero || ScatterDefault.suppressZero,
    qOtherTotalSpec: otherTotalSpec || ScatterDefault.otherTotalSpec,
  });

  const cancelCallback = () => {
    endSelections(false);
    setSelectionScatterVisible(false);
    setRefreshChart(true);
    useSelectionColours = false;
    // setSel([]);
  };

  const confirmCallback = async () => {
    // sel === [] ? '' : await select(0, sel);
    await endSelections(true);
    setSelectionScatterVisible(false);
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
    if (isSelectionScatterVisible) {
      const outsideClick = !ref.current.contains(event.target);
      if (outsideClick && selections) confirmCallback();
    }
  });

  const handleResize = () => {
    if (typeof calcCond === "undefined" && dataError.length === 0) {
      CreateScatter({ ...chartSettings, screenWidth: ref.current.offsetWidth });
    }
  };

  // const buildSelections = (s) => {
  //   setSel(...sel, s);
  // };

  useEffect(() => {
    let valid;
    if (qLayout) {
      //  setObjId(qLayout.qInfo.qId);
      setCalcCond(qLayout.qHyperCube.qCalcCondMsg);
      valid = validData(qLayout, theme);
      if (valid) {
        setIsValid(valid.isValid);
        setDataError(valid.dataError);
      }
    }
    if (qData && isValid && d3Container.current && refreshChart) {
      chartSettings = {
        qLayout,
        qData,
        // chartWidth: width,
        chartHeight: height,
        d3Container,
        screenWidth: ref.current.offsetWidth,
        useSelectionColours,
        setRefreshChart,
        beginSelections,
        setSelectionScatterVisible,
        // buildSelections,
        selections,
        select,
        showLegend: legendPosition(showLegend, ScatterDefault.showLegend),
        ScatterThemes,
        ToolTipThemes,
        TitleThemes,
        LegendThemes,
        tickSpacing: tickSpacing || ScatterDefault.tickSpacing,
        allowSelections:
          allowSelections === undefined
            ? ScatterDefault.allowSelections
            : allowSelections,
        showLabels:
          showLabels === undefined ? ScatterDefault.showLabels : showLabels,
        showAxis: calcDisplayOption(
          showAxis === undefined ? ScatterDefault.showAxis : showAxis
        ),
        textOnAxis: calcDisplayOption(
          textOnAxis === undefined ? ScatterDefault.textOnAxis : textOnAxis
        ),
        showGridlines: calcDisplayOption(
          showGridlines === undefined
            ? ScatterDefault.showGridlines
            : showGridlines,
          true
        ),
        ...rest,
      };
      CreateScatter(chartSettings);
    }

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [qData, d3Container.current]);

  return (
    <>
      {qData && qLayout && !dataError ? (
        <ScatterWrapper
          border={border}
          borderRadius={borderRadius}
          backgroundColor={backgroundColor}
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
                border: isSelectionScatterVisible
                  ? "1px solid #CCCCCC"
                  : "none",
                overflowX: isSelectionScatterVisible ? "hidden" : "auto",
                overflowY: isSelectionScatterVisible ? "hidden" : "visible",
              }}
            >
              <div
                className="d3-component"
                height={height}
                ref={d3Container}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
            <SelectionModal
              isOpen={isSelectionScatterVisible}
              cancelCallback={cancelCallback}
              confirmCallback={confirmCallback}
              // width={width}
            />
          </div>
        </ScatterWrapper>
      ) : (
        <ScatterWrapperNoData
          border={border}
          borderRadius={borderRadius}
          size={size}
          width={width}
          margin={margin}
        >
          <ScatterNoDataContent height={height}>
            {calcCond || dataError || engineError || <Spinner />}
          </ScatterNoDataContent>
        </ScatterWrapperNoData>
      )}
    </>
  );
}

export default StyledScatter;
