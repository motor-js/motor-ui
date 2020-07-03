import React, { useRef, useEffect, useState, useContext } from "react";
import UseHyperCube from "../../../hooks/useHyperCube";
import useOutsideClick from "../../../hooks/useOutsideClick";
import SelectionModal from "../SelectionModal";
import BarPlotTheme, {
  BarPlotWrapper,
  BarPlotWrapperNoData,
  BarPlotNoDataContent,
} from "./BarPlotTheme";
import TooltipTheme from "../../D3/Tooltip/TooltipTheme";
import TitleTheme from "../../D3/Title/TitleTheme";
import LegendTheme from "../../D3/Legend/LegendTheme";
import CreateBarPlot from "./CreateBarPlot";
import { validData, legendPosition } from "../../../utils";
import Spinner from "../Spinner";

function StyledBarPlot(props) {
  // Ref for d3 object
  const d3Container = useRef(null);
  const ref = useRef();
  const [isSelectionBarPlotVisible, setSelectionBarPlotVisible] = useState(
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
    chartColor,
    showLegend,
    allowSelections,
    calcCondition,
    suppressZero,
    otherTotalSpec,
    ...rest
  } = props;

  // styles
  const { BarPlotThemes } = BarPlotTheme(theme, size, fontColor, chartColor);
  const { BarPlotDefault } = BarPlotThemes;

  const { ToolTipThemes } = TooltipTheme(theme, size);
  const { TitleThemes } = TitleTheme(theme, size);
  const { LegendThemes } = LegendTheme(theme, backgroundColor);

  // retrieve BarPlot data from HyperCube
  const {
    beginSelections,
    endSelections,
    qData,
    selections,
    qLayout,
    select,
  } = UseHyperCube({
    engine,
    cols,
    qCalcCondition: calcCondition,
    qSuppressZero: suppressZero || BarPlotDefault.suppressZero,
    qOtherTotalSpec: otherTotalSpec || BarPlotDefault.otherTotalSpec,
  });

  const cancelCallback = () => {
    endSelections(false);
    setSelectionBarPlotVisible(false);
    setRefreshChart(true);
    useSelectionColours = false;
    // setSel([]);
  };

  const confirmCallback = async () => {
    // sel === [] ? '' : await select(0, sel);
    await endSelections(true);
    setSelectionBarPlotVisible(false);
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
    if (isSelectionBarPlotVisible) {
      const outsideClick = !ref.current.contains(event.target);
      if (outsideClick && selections) confirmCallback();
    }
  });

  const handleResize = () => {
    if (typeof calcCond === "undefined" && dataError.length === 0) {
      CreateBarPlot({ ...chartSettings, screenWidth: ref.current.offsetWidth });
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
        setSelectionBarPlotVisible,
        // buildSelections,
        selections,
        select,
        showLegend: legendPosition(showLegend, BarPlotDefault.showLegend),
        allowSelections:
          allowSelections === undefined
            ? BarPlotDefault.allowSelections
            : allowSelections,
        BarPlotThemes,
        ToolTipThemes,
        TitleThemes,
        LegendThemes,
        ...rest,
      };
      CreateBarPlot(chartSettings);
    }

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [qData, d3Container.current]);

  return (
    <>
      {qData && qLayout && !dataError ? (
        <BarPlotWrapper
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
                border: isSelectionBarPlotVisible
                  ? "1px solid #CCCCCC"
                  : "none",
                overflowX: isSelectionBarPlotVisible ? "hidden" : "auto",
                overflowY: isSelectionBarPlotVisible ? "hidden" : "auto",
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
              isOpen={isSelectionBarPlotVisible}
              cancelCallback={cancelCallback}
              confirmCallback={confirmCallback}
              // width={width}
            />
          </div>
        </BarPlotWrapper>
      ) : (
        <BarPlotWrapperNoData
          border={border}
          size={size}
          width={width}
          margin={margin}
        >
          <BarPlotNoDataContent height={height}>
            {calcCond || dataError || engineError || <Spinner />}
          </BarPlotNoDataContent>
        </BarPlotWrapperNoData>
      )}
    </>
  );
}

export default StyledBarPlot;
