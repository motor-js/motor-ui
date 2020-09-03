import React, { useRef, useEffect, useState, useContext } from "react";
import UseHyperCube from "../../../hooks/useHyperCube";
import useOutsideClick from "../../../hooks/useOutsideClick";
import SelectionModal from "../SelectionModal";
import WordCloudTheme, {
  WordCloudWrapper,
  WordCloudWrapperNoData,
  WordCloudNoDataContent,
} from "./WordCloudTheme";
import TooltipTheme from "../../D3/Tooltip/TooltipTheme";
import TitleTheme from "../../D3/Title/TitleTheme";
import CreateWordCloud from "./CreateWordCloud";
import { validData } from "../../../utils";
import Spinner from "../Spinner";

function StyledWordCloud(props) {
  // Ref for d3 object
  const d3Container = useRef(null);
  const ref = useRef();
  const [isSelectionWordCloudVisible, setSelectionWordCloudVisible] = useState(
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
    allowSelections,
    border,
    backgroundColor,
    borderRadius,
    colorTheme,
    calcCondition,
    suppressZero,
    otherTotalSpec,
    gridArea,
    ...rest
  } = props;

  // styles
  const { WordCloudThemes } = WordCloudTheme(theme, size, colorTheme);
  const { WordCloudDefault } = WordCloudThemes;
  const { ToolTipThemes } = TooltipTheme(theme, size);
  const { TitleThemes } = TitleTheme(theme, size);

  // retrieve WordCloud data from HyperCube
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
    qSuppressZero: suppressZero || WordCloudDefault.suppressZero,
    qOtherTotalSpec: otherTotalSpec || WordCloudDefault.qOtherTotalSpec,
  });

  const cancelCallback = () => {
    endSelections(false);
    setSelectionWordCloudVisible(false);
    setRefreshChart(true);
    useSelectionColours = false;
    // setSel([]);
  };

  const confirmCallback = async () => {
    // sel === [] ? '' : await select(0, sel);
    await endSelections(true);
    setSelectionWordCloudVisible(false);
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
    if (isSelectionWordCloudVisible) {
      const outsideClick = !ref.current.contains(event.target);
      if (outsideClick && selections) confirmCallback();
    }
  });

  const handleResize = () => {
    if (typeof calcCond === "undefined" && dataError.length === 0) {
      CreateWordCloud({
        ...chartSettings,
        screenWidth: ref.current.offsetWidth,
      });
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
      (chartSettings = {
        qLayout,
        qData,
        chartHeight: gridArea
          ? ref.current.offsetHeight -
            parseInt(margin || theme.global.chart.margin, 10)
          : height,
        d3Container,
        screenWidth: ref.current.offsetWidth,
        useSelectionColours,
        setRefreshChart,
        beginSelections,
        setSelectionWordCloudVisible,
        allowSelections:
          allowSelections === null
            ? WordCloudDefault.allowSelections
            : allowSelections,
        // buildSelections,
        selections,
        select,
        WordCloudThemes,
        ToolTipThemes,
        TitleThemes,
        ...rest,
      }),
        CreateWordCloud(chartSettings);
    }

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [qData, d3Container.current]);

  return (
    <>
      {qData && qLayout && !dataError ? (
        <WordCloudWrapper
          border={border}
          borderRadius={borderRadius}
          backgroundColor={backgroundColor}
          margin={margin || theme.global.chart.margin}
          gridArea={gridArea}
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
                border: isSelectionWordCloudVisible
                  ? "1px solid #CCCCCC"
                  : "none",
                overflowX: isSelectionWordCloudVisible ? "hidden" : "auto",
                overflowY: isSelectionWordCloudVisible ? "hidden" : "auto",
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
              isOpen={isSelectionWordCloudVisible}
              cancelCallback={cancelCallback}
              confirmCallback={confirmCallback}
              // width={width}
            />
          </div>
        </WordCloudWrapper>
      ) : (
        <WordCloudWrapperNoData
          border={border}
          borderRadius={borderRadius}
          size={size}
          margin={margin || theme.global.chart.margin}
          gridArea={gridArea}
          width={width}
        >
          <WordCloudNoDataContent height={height}>
            {calcCond || dataError || engineError || <Spinner />}
          </WordCloudNoDataContent>
        </WordCloudWrapperNoData>
      )}
    </>
  );
}

export default StyledWordCloud;
