import React, { useRef, useEffect, useState } from "react";
import UseHyperCube from "../../../hooks/useHyperCube";
import useOutsideClick from "../../../hooks/useOutsideClick";
import SelectionModal from "../SelectionModal";
import BarTheme, {
  BarWrapper,
  BarWrapperNoData,
  BarNoDataContent,
} from "./BarTheme";
import TooltipTheme from "../../D3/Tooltip/TooltipTheme";
import TitleTheme from "../../D3/Title/TitleTheme";
import LegendTheme from "../../D3/Legend/LegendTheme";
import {
  numericSortDirection,
  validData,
  calcDisplayOption,
  legendPosition,
} from "../../../utils";
import CreateBar from "./CreateBar";
import Spinner from "../Spinner";

function StyledBar(props) {
  // Ref for d3 object
  const d3Container = useRef(null);
  const ref = useRef();
  const [isSelectionBarVisible, setSelectionBarVisible] = useState(false);
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
    chartColor,
    showLegend,
    allowSelections,
    showAxis,
    maxAxisLength,
    sortDirection,
    columnSortOrder,
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
  const { BarThemes } = BarTheme(theme, size, fontColor, chartColor);
  const { ToolTipThemes } = TooltipTheme(theme, size);
  const { TitleThemes } = TitleTheme(theme, size);
  const { LegendThemes } = LegendTheme(theme, backgroundColor);
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
    qSortByNumeric: numericSortDirection(sortDirection, -1),
    qSortByAscii: numericSortDirection(sortDirection, 1),
    qIntercolumnSortOrder: columnSortOrder,
    qCalcCondition: calcCondition,
    qSuppressZero: suppressZero || BarDefault.suppressZero,
    qOtherTotalSpec: otherTotalSpec || BarDefault.otherTotalSpec,
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
      CreateBar({ ...chartSettings, screenWidth: ref.current.offsetWidth });
    }
  };

  // const buildSelections = (s) => {
  //   setSel(...sel, s);
  // };

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

    if (qData && isValid && d3Container.current && refreshChart) {
      chartSettings = {
        qLayout,
        qData,
        // propsWidth: width,
        propsHeight: height,
        d3Container,
        screenWidth: ref.current.offsetWidth,
        useSelectionColours,
        setRefreshChart,
        beginSelections,
        setSelectionBarVisible,
        // buildSelections,
        maxAxisLength: maxAxisLength || BarDefault.maxAxisLength,
        BarThemes,
        ToolTipThemes,
        TitleThemes,
        LegendThemes,
        allowSlantedYAxis:
          allowSlantedYAxis === undefined
            ? BarDefault.allowSlantedYAxis
            : allowSlantedYAxis,
        tickSpacing: tickSpacing || BarDefault.tickSpacing,
        allowSelections:
          allowSelections === undefined
            ? BarDefault.allowSelections
            : allowSelections,
        showLabels:
          showLabels === undefined ? BarDefault.showLabels : showLabels,
        showLegend: legendPosition(showLegend, BarDefault.showLegend),
        showAxis: calcDisplayOption(
          showAxis === undefined ? BarDefault.showAxis : showAxis
        ),
        textOnAxis: calcDisplayOption(
          textOnAxis === undefined ? BarDefault.textOnAxis : textOnAxis
        ),
        showGridlines: calcDisplayOption(
          showGridlines === undefined
            ? BarDefault.showGridlines
            : showGridlines,
          true
        ),
        selections,
        select,
        ...rest,
      };

      CreateBar(chartSettings);
    }

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [qLayout, qData, d3Container.current]);

  return (
    <>
      {qData && qLayout && !dataError ? (
        <BarWrapper
          border={border}
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
              />
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

export default StyledBar;
