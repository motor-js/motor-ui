// KPI multiple data example
// openbase.io/
// openbase.io/js/neon-colors

import React, { useRef, useEffect, useState } from "react";
import UseHyperCube from "../../hooks/useHyperCube";
import { roundNumber, validData } from "../../utils";
import useScreenSize from "../../hooks/useScreenSize";
import {
  KPIWrapper,
  KPIWrapperNoData,
  KPILabel,
  KPIValueWrapper,
  KPIValue,
  KPIGroup,
} from "./KPITheme";
import Spinner from "../Spinner";

function StyledKPI({
  engine,
  engineError,
  theme,
  cols,
  calcCondition,
  label,
  margin,
  width,
  border,
  justifyContent,
  textAlign,
  size,
  roundNum,
  color,
  precision,
  maxWidth,
  responsive,
  onClick,
  cursor,
  labelColor,
  alignSelf,
  padding,
  backgroundColor,
  autoSizeValue,
  gridArea,
}) {
  const [calcCond, setCalcCond] = useState(null);
  const [dataError, setDataError] = useState(null);
  const [isValid, setIsValid] = useState(null);
  const [originalFontSize, setOriginalFontSize] = useState(null);

  const qCalcCondition = calcCondition;

  // retrieve KPI data from ListObject
  const { qLayout, qData } = UseHyperCube({
    engine,
    cols,
    qCalcCondition,
  });
  const { screen } = useScreenSize();

  const kpiValueWrapperRef = useRef(null);

  const formatValue = (val, precision, sign) => {
    const formattedValue = roundNum
      ? roundNumber(Math.abs(val), precision)
      : Math.abs(val);

    return val < 0 ? `-${formattedValue}` : formattedValue;
  };

  useEffect(() => {
    let valid;
    if (qLayout) {
      setCalcCond(qLayout.qHyperCube.qCalcCondMsg);
      valid = validData(qLayout, theme);
      if (valid) {
        setIsValid(valid.isValid);
        setDataError(valid.dataError);
      }
    }

    if (kpiValueWrapperRef.current && qData && autoSizeValue) {
      const valueFontSize =
        originalFontSize ||
        parseInt(
          getComputedStyle(
            kpiValueWrapperRef.current.children[0]
          ).getPropertyValue("font-size"),
          10
        );

      setOriginalFontSize(valueFontSize);
      const kpiWrapperWidth =
        kpiValueWrapperRef.current.parentNode.parentNode.offsetWidth;

      kpiValueWrapperRef.current.children[0].style.fontSize = `${originalFontSize}px`;
      const kpiValueWidth = kpiValueWrapperRef.current.children[0].offsetWidth;

      const childrenHeight =
        kpiValueWrapperRef.current.children[0].offsetHeight;

      if (kpiValueWidth > kpiWrapperWidth) {
        const newSize =
          ((valueFontSize * kpiWrapperWidth) / kpiValueWidth) * 0.9; // take 90% of vlaue so that it fits into parent

        kpiValueWrapperRef.current.children[0].style.fontSize = `${newSize}px`;

        // resize parent so that it still takes thr same amount of space as
        // other KPIs of the same size.
        kpiValueWrapperRef.current.style.height = `${childrenHeight}px`;
      }
    }
  }, [kpiValueWrapperRef, qData]);

  return (
    <>
      {qData && qLayout ? (
        <KPIWrapper
          data-testid="kpiWrapper"
          onClick={() => onClick()}
          margin={margin}
          border={border}
          cursor={cursor}
          maxWidth={maxWidth}
          width={width}
          justifyContent={justifyContent}
          textAlign={textAlign}
          backgroundColor={backgroundColor}
          size={size}
          padding={padding}
          gridArea={gridArea}
        >
          <KPIGroup>
            <KPILabel
              data-testid="kpiLabel"
              labelColor={labelColor}
              alignSelf={alignSelf}
              screen={screen}
              size={size}
              responsive={responsive}
            >
              {label}
            </KPILabel>
            <KPIValueWrapper ref={kpiValueWrapperRef}>
              <KPIValue
                data-testid="kpiValue"
                color={color}
                screen={screen}
                size={size}
                responsive={responsive}
              >
                {roundNum &&
                  (isValid
                    ? formatValue(qData.qMatrix[0][0].qNum, precision)
                    : 0)}
                {!roundNum && (isValid ? qData.qMatrix[0][0].qText : 0)}
              </KPIValue>
            </KPIValueWrapper>
          </KPIGroup>
        </KPIWrapper>
      ) : (
        <KPIWrapperNoData
          screen={screen}
          size={size}
          maxWidth={maxWidth}
          margin={margin}
          width={width}
          border={border}
          gridArea={gridArea}
          backgroundColor={backgroundColor}
        >
          {calcCond || dataError || engineError || <Spinner />}
        </KPIWrapperNoData>
      )}
    </>
  );
}

export default StyledKPI;
