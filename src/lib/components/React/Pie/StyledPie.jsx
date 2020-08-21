import React, { useRef, useEffect, useState } from "react";
import UseHyperCube from "../../../hooks/useHyperCube";
import useOutsideClick from "../../../hooks/useOutsideClick";
import { validData, legendPosition } from "../../../utils";
import SelectionModal from "../SelectionModal";
import PieTheme, {
  PieWrapper,
  PieWrapperNoData,
  PieNoDataContent,
} from "./PieTheme";
import TooltipTheme from "../../D3/Tooltip/TooltipTheme";
import TitleTheme from "../../D3/Title/TitleTheme";
import LegendTheme from "../../D3/Legend/LegendTheme";
import CreatePie from "./CreatePie";
import Spinner from "../Spinner";

function StyledPie({
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
  colorTheme,
  showLegend,
  allowSelections,
  calcCondition,
  suppressZero,
  otherTotalSpec,
  showLabels,
  ...rest
}) {
  // Ref for d3 object
  const d3Container = useRef(null);
  const ref = useRef();
  const [isSelectionVisible, setSelectionVisible] = useState(false);
  const [refreshChart, setRefreshChart] = useState(true);
  const [calcCond, setCalcCond] = useState(null);
  const [dataError, setDataError] = useState(null);
  const [isValid, setIsValid] = useState(null);
  // const [sel, setSel] = useState([]);

  let useSelectionColours = false;
  let chartSettings = {};

  // styles
  const { PieThemes } = PieTheme(theme, size, fontColor, colorTheme);
  const { PieDefault } = PieThemes;
  const { ToolTipThemes } = TooltipTheme(theme, size);
  const { TitleThemes } = TitleTheme(theme, size);
  const { LegendThemes } = LegendTheme(theme, backgroundColor);

  // retrieve Pie data from HyperCube
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
    qSuppressZero: suppressZero || PieDefault.suppressZero,
    qOtherTotalSpec: otherTotalSpec || PieDefault.otherTotalSpec,
  });

  const cancelCallback = () => {
    endSelections(false);
    setSelectionVisible(false);
    setRefreshChart(true);
    useSelectionColours = false;
    // setSel([]);
  };

  const confirmCallback = async () => {
    // sel === [] ? '' : await select(0, sel);
    await endSelections(true);
    setSelectionVisible(false);
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
    if (isSelectionVisible) {
      const outsideClick = !ref.current.contains(event.target);
      if (outsideClick && selections) confirmCallback();
    }
  });

  const handleResize = () => {
    if (typeof calcCond === "undefined" && dataError.length === 0) {
      CreatePie({ ...chartSettings, screenWidth: ref.current.offsetWidth });
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
        setSelectionVisible,
        selections,
        select,
        // buildSelections,
        showLegend: legendPosition(showLegend, PieDefault.showLegend),
        allowSelections:
          allowSelections === null
            ? PieDefault.allowSelections
            : allowSelections,
        PieThemes,
        ToolTipThemes,
        TitleThemes,
        LegendThemes,
        showLabels: showLabels || PieDefault.showLabels,
        ...rest,
      };
      CreatePie(chartSettings);
    }

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [qData, d3Container.current]);

  return (
    <>
      {qData && qLayout && !dataError ? (
        <PieWrapper
          border={border}
          borderRadius={borderRadius}
          backgroundColor={backgroundColor}
          margin={margin}
          width={width}
          size={size}
        >
          <div
            ref={ref}
            style={{
              position: "relative",
              height,
              margin: "10px",
            }}
          >
            <SelectionModal
              isOpen={isSelectionVisible}
              cancelCallback={cancelCallback}
              confirmCallback={confirmCallback}
              // width={width}
            />
            <div
              style={{
                border: isSelectionVisible ? "1px solid #CCCCCC" : "none",
                overflowX: isSelectionVisible ? "hidden" : "auto",
                overflowY: isSelectionVisible ? "hidden" : "auto",
                // width,
              }}
            >
              <div
                className="d3-component"
                height={height}
                ref={d3Container}
                onClick={(e) => e.stopPropagation()}
              ></div>
            </div>
          </div>
        </PieWrapper>
      ) : (
        <PieWrapperNoData
          border={border}
          borderRadius={borderRadius}
          size={size}
          width={width}
          margin={margin}
        >
          <PieNoDataContent height={height}>
            {calcCond || dataError || engineError || <Spinner />}
          </PieNoDataContent>
        </PieWrapperNoData>
      )}
    </>
  );
}

export default StyledPie;
