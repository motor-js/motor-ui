import React, { useRef, useEffect, useState, useContext } from "react";
import UseHyperCube from "../../../hooks/useHyperCube";
import useOutsideClick from "../../../hooks/useOutsideClick";
import SelectionModal from "../SelectionModal";
import LineTheme, {
  LineWrapper,
  LineWrapperNoData,
  LineNoDataContent,
} from "./LineTheme";
import TooltipTheme from "../../D3/Tooltip/TooltipTheme";
import TitleTheme from "../../D3/Title/TitleTheme";
import LegendTheme from "../../D3/Legend/LegendTheme";
import {
  numericSortDirection,
  validData,
  calcDisplayOption,
  legendPosition,
} from "../../../utils";
import CreateLine from "./CreateLine";
import Spinner from "../Spinner";

function StyledLine(props) {
  // Ref for d3 object
  const d3Container = useRef(null);
  const ref = useRef();
  const [isSelectionLineVisible, setSelectionLineVisible] = useState(false);
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
    cols,
    theme,
    width,
    height,
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
    columnSortOrder,
    calcCondition,
    suppressZero,
    showLabels,
    textOnAxis,
    showGridlines,
    otherTotalSpec,
    tickSpacing,
    symbol,
    ...rest
  } = props;

  // styles
  const { LineThemes } = LineTheme(theme, size, fontColor, colorTheme);
  const { ToolTipThemes } = TooltipTheme(theme, size);
  const { TitleThemes } = TitleTheme(theme, size);
  const { LegendThemes } = LegendTheme(theme, backgroundColor);
  const { LineDefault } = LineThemes;

  // retrieve Line data from HyperCube
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
    qInterLineSortOrder: columnSortOrder,
    qCalcCondition: calcCondition,
    qSuppressZero: suppressZero || LineDefault.suppressZero,
    qOtherTotalSpec: otherTotalSpec || LineDefault.otherTotalSpec,
  });

  const cancelCallback = () => {
    endSelections(false);
    setSelectionLineVisible(false);
    setRefreshChart(true);
    useSelectionColours = false;
    // setSel([]);
  };

  const confirmCallback = async () => {
    // sel === [] ? '' : await select(0, sel);
    await endSelections(true);
    setSelectionLineVisible(false);
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
    if (isSelectionLineVisible) {
      const outsideClick = !ref.current.contains(event.target);
      if (outsideClick && selections) confirmCallback();
    }
  });

  const handleResize = () => {
    if (typeof calcCond === "undefined" && dataError.length === 0) {
      CreateLine({ ...chartSettings, screenWidth: ref.current.offsetWidth });
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
        // chartWidth: width,
        chartHeight: height,
        d3Container,
        screenWidth: ref.current.offsetWidth,
        useSelectionColours,
        setRefreshChart,
        beginSelections,
        setSelectionLineVisible,
        // buildSelections,
        selections,
        select,
        showLegend: legendPosition(showLegend, LineDefault.showLegend),
        allowSelections:
          allowSelections === null
            ? LineDefault.allowSelections
            : allowSelections,
        symbol: symbol === null ? LineDefault.symbol : symbol,
        maxAxisLength: maxAxisLength || LineDefault.maxAxisLength,
        LineThemes,
        ToolTipThemes,
        TitleThemes,
        LegendThemes,
        tickSpacing: tickSpacing || LineDefault.tickSpacing,
        showLabels: showLabels === null ? LineDefault.showLabels : showLabels,
        showAxis: calcDisplayOption(
          showAxis === null ? LineDefault.showAxis : showAxis
        ),
        textOnAxis: calcDisplayOption(
          textOnAxis === null ? LineDefault.textOnAxis : textOnAxis
        ),
        showGridlines: calcDisplayOption(
          showGridlines === null ? LineDefault.showGridlines : showGridlines,
          true
        ),
        ...rest,
      };

      CreateLine(chartSettings);
    }

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [qLayout, qData, d3Container.current]);

  return (
    <>
      {qData && qLayout && !dataError ? (
        <LineWrapper
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
                border: isSelectionLineVisible ? "1px solid #CCCCCC" : "none",
                overflowX: isSelectionLineVisible ? "hidden" : "auto",
                overflowY: isSelectionLineVisible ? "hidden" : "auto",
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
              isOpen={isSelectionLineVisible}
              cancelCallback={cancelCallback}
              confirmCallback={confirmCallback}
              // width={width}
            />
          </div>
        </LineWrapper>
      ) : (
        <LineWrapperNoData
          border={border}
          borderRadius={borderRadius}
          size={size}
          width={width}
          margin={margin}
        >
          <LineNoDataContent height={height}>
            {calcCond || dataError || engineError || <Spinner />}
          </LineNoDataContent>
        </LineWrapperNoData>
      )}
    </>
  );
}

export default StyledLine;
