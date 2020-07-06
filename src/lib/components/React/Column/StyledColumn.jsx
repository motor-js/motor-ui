import React, { useRef, useEffect, useState } from "react";
import UseHyperCube from "../../../hooks/useHyperCube";
import useOutsideClick from "../../../hooks/useOutsideClick";
import SelectionModal from "../SelectionModal";
import ColumnTheme, {
  ColumnWrapper,
  ColumnWrapperNoData,
  ColumnNoDataContent,
} from "./ColumnTheme";
import TooltipTheme from "../../D3/Tooltip/TooltipTheme";
import TitleTheme from "../../D3/Title/TitleTheme";
import LegendTheme from "../../D3/Legend/LegendTheme";
import {
  numericSortDirection,
  validData,
  calcDisplayOption,
  legendPosition,
} from "../../../utils";
import CreateColumn from "./CreateColumn";
import Spinner from "../Spinner";

function StyledColumn({
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
  borderRadius,
  backgroundColor,
  chartColor,
  stacked,
  percentStacked,
  title,
  subTitle,
  showLegend,
  allowSelections,
  maxWidth,
  showAxis,
  maxAxisLength,
  roundNum,
  sortDirection,
  columnSortOrder,
  calcCondition,
  suppressZero,
  showLabels,
  allowZoom,
  suppressScroll,
  columnPadding,
  textOnAxis,
  tickSpacing,
  showGridlines,
  otherTotalSpec,
}) {
  // Ref for d3 object
  const d3Container = useRef(null);
  const ref = useRef();
  const [isSelectionColumnVisible, setSelectionColumnVisible] = useState(false);
  const [refreshChart, setRefreshChart] = useState(true);
  const [calcCond, setCalcCond] = useState(null);
  const [dataError, setDataError] = useState(null);
  const [isValid, setIsValid] = useState(null);
  // const [sel, setSel] = useState([]);

  let useSelectionColours = false;
  let chartSettings = {};

  // styles
  const { ColumnThemes } = ColumnTheme(theme, size, fontColor, chartColor);
  const { ToolTipThemes } = TooltipTheme(theme, size);
  const { TitleThemes } = TitleTheme(theme, size);
  const { LegendThemes } = LegendTheme(theme, backgroundColor);
  const { ColumnDefault } = ColumnThemes;

  // retrieve Column data from HyperCube
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
    qInterColumnSortOrder: columnSortOrder,
    qCalcCondition: calcCondition,
    qSuppressZero: suppressZero || ColumnDefault.suppressZero,
    qOtherTotalSpec: otherTotalSpec || ColumnDefault.otherTotalSpec,
  });

  const cancelCallback = () => {
    endSelections(false);
    setSelectionColumnVisible(false);
    setRefreshChart(true);
    useSelectionColours = false;
    // setSel([]);
  };

  const confirmCallback = async () => {
    // sel === [] ? '' : await select(0, sel);
    await endSelections(true);
    setSelectionColumnVisible(false);
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
    if (isSelectionColumnVisible) {
      const outsideClick = !ref.current.contains(event.target);
      if (outsideClick && selections) confirmCallback();
    }
  });

  const handleResize = () => {
    if (typeof calcCond === "undefined" && dataError.length === 0) {
      CreateColumn({ ...chartSettings, screenWidth: ref.current.offsetWidth });
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
      const screenWidth = ref.current.offsetWidth;

      chartSettings = {
        qLayout,
        qData,
        // propsWidth: width,
        propsHeight: height,
        d3Container,
        screenWidth,
        useSelectionColours,
        setRefreshChart,
        beginSelections,
        setSelectionColumnVisible,
        // buildSelections,
        selections,
        select,
        stacked,
        percentStacked,
        title,
        subTitle,
        showLegend: legendPosition(showLegend, ColumnDefault.showLegend),
        maxWidth,
        maxAxisLength: maxAxisLength || ColumnDefault.maxAxisLength,
        ColumnThemes,
        ToolTipThemes,
        TitleThemes,
        LegendThemes,
        roundNum,
        showLabels:
          showLabels === undefined ? ColumnDefault.showLabels : showLabels,
        allowZoom,
        suppressScroll,
        columnPadding,
        tickSpacing: tickSpacing || ColumnDefault.tickSpacing,
        allowSelections:
          allowSelections === undefined
            ? ColumnDefault.allowSelections
            : allowSelections,
        showAxis: calcDisplayOption(
          showAxis === undefined ? ColumnDefault.showAxis : showAxis
        ),
        textOnAxis: calcDisplayOption(
          textOnAxis === undefined ? ColumnDefault.textOnAxis : textOnAxis
        ),
        showGridlines: calcDisplayOption(
          showGridlines === undefined
            ? ColumnDefault.showGridlines
            : showGridlines,
          true
        ),
      };

      CreateColumn(chartSettings);
    }

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [qLayout, qData, d3Container.current]);

  return (
    <>
      {qData && qLayout && !dataError ? (
        <ColumnWrapper
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
                border: isSelectionColumnVisible ? "1px solid #CCCCCC" : "none",
                overflowX: isSelectionColumnVisible ? "hidden" : "auto",
                overflowY: isSelectionColumnVisible ? "hidden" : "visible",
                // width,
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
              isOpen={isSelectionColumnVisible}
              cancelCallback={cancelCallback}
              confirmCallback={confirmCallback}
              // width={width}
            />
          </div>
        </ColumnWrapper>
      ) : (
        <ColumnWrapperNoData
          border={border}
          borderRadius={borderRadius}
          size={size}
          width={width}
          margin={margin}
        >
          <ColumnNoDataContent height={height}>
            {calcCond || dataError || engineError || <Spinner />}
          </ColumnNoDataContent>
        </ColumnWrapperNoData>
      )}
    </>
  );
}

export default StyledColumn;
