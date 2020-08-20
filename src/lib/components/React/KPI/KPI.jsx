import React, { useContext } from "react";
import PropTypes from "prop-types";
import { ThemeContext } from "styled-components";
import StyledKPI from "./StyledKPI";
import { ConfigContext } from "../../../contexts/ConfigProvider";
import defaultTheme from "../../../themes/defaultTheme";
import { EngineContext } from "../../../contexts/EngineProvider";
import useEngine from "../../../hooks/useEngine";

function KPI({ config, ...rest }) {
  const myConfig = config || useContext(ConfigContext);
  const theme = useContext(ThemeContext) || defaultTheme;
  const { engine, engineError } =
    useContext(EngineContext) || useEngine(myConfig);

  return (
    <StyledKPI
      engine={engine}
      theme={theme}
      engineError={engineError}
      {...rest}
    />
  );
}

const BORDER_SHAPE = PropTypes.shape({
  color: PropTypes.oneOfType([PropTypes.string]),
  side: PropTypes.oneOf([
    "top",
    "left",
    "bottom",
    "right",
    "start",
    "end",
    "horizontal",
    "vertical",
    "all",
    "between",
  ]),
  size: PropTypes.oneOfType([PropTypes.string]),
  style: PropTypes.oneOf([
    "solid",
    "dashed",
    "dotted",
    "double",
    "groove",
    "ridge",
    "inset",
    "outset",
    "hidden",
  ]),
});

KPI.propTypes = {
  /** Configuration object to connect to the Qlik Engine. Must include Qlik site URL and an App name */
  config: PropTypes.object,
  /** KPI label  */
  label: PropTypes.string,
  /** Calculation Condition */
  calcCondition: PropTypes.shape({
    qCond: PropTypes.string,
    qMsg: PropTypes.string,
  }),
  /** cols from Qlik Data Model to render in the KPI  */
  cols: PropTypes.array.isRequired,
  /** The amount of margin around the component */
  margin: PropTypes.string,
  /** The amount of width of the component */
  width: PropTypes.string,
  /** Border of the Pie Chart, need desc */
  border: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.oneOf([
      "top",
      "left",
      "bottom",
      "right",
      "start",
      "end",
      "horizontal",
      "vertical",
      "all",
      "between",
      "none",
    ]),
    PropTypes.shape({
      color: PropTypes.oneOfType([PropTypes.string]),
      side: PropTypes.oneOf([
        "top",
        "left",
        "bottom",
        "right",
        "start",
        "end",
        "horizontal",
        "vertical",
        "all",
        "between",
      ]),
      size: PropTypes.oneOfType([PropTypes.string]),
      style: PropTypes.oneOf([
        "solid",
        "dashed",
        "dotted",
        "double",
        "groove",
        "ridge",
        "inset",
        "outset",
        "hidden",
      ]),
    }),
    PropTypes.arrayOf(BORDER_SHAPE),
  ]),
  /** The alignment of the text within the component */
  justifyContent: PropTypes.oneOf(["flex-start", "center", "flex-end"]),
  /** Alignment of KPI label and Value relative to their container */
  textAlign: PropTypes.oneOf(["left", "center", "right"]),
  /** Size of the KPI */
  size: PropTypes.oneOf(["tiny", "small", "medium", "large", "xlarge"]),
  /** RoundNum of the KPI */
  roundNum: PropTypes.bool,
  /** Color of the KPI Value */
  color: PropTypes.string,
  /** Precision if RoundNum set to true. True equals 2 deciamls places, false equals none */
  precision: PropTypes.bool,
  /** Color of the KPI Label */
  labelColor: PropTypes.string,
  /** Alignment of the KPI Label */
  alignSelf: PropTypes.oneOf(["flex-start", "center", "flex-end"]),
  /** Padding of the KPI  */
  padding: PropTypes.string,
  /** Color of the KPI background */
  backgroundColor: PropTypes.string,
  /** Max width of the KPI, text will be wrapped */
  maxWidth: PropTypes.string,
  /** Whether the KPI size should scale for tablet and mobile */
  responsive: PropTypes.bool,
  /** OnClick event */
  onClick: PropTypes.func,
  /** Cursor style on hover */
  cursor: PropTypes.string,
  /** Automatically resize the label if it is too large for the min wrapper*/
  autoSizeValue: PropTypes.bool,
};

KPI.defaultProps = {
  config: null,
  label: null,
  calcCondition: undefined,
  // margin: null,
  width: "100%",
  border: true,
  justifyContent: "center",
  textAlign: null,
  size: "medium",
  roundNum: true,
  color: null,
  precision: true,
  labelColor: null,
  alignSelf: null,
  padding: null,
  backgroundColor: null,
  maxWidth: null,
  responsive: true,
  onClick: () => {},
  cursor: "default",
  autoSizeValue: true,
};

export default KPI;
