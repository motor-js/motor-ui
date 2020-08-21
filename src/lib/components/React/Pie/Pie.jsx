import React, { useContext } from "react";
import PropTypes from "prop-types";
import { ThemeContext } from "styled-components";
import StyledPie from "./StyledPie";
import { ConfigContext } from "../../../contexts/ConfigProvider";
import defaultTheme from "../../../themes/defaultTheme";
import { EngineContext } from "../../../contexts/EngineProvider";
import useEngine from "../../../hooks/useEngine";

function Pie({ config, ...rest }) {
  const myConfig = config || useContext(ConfigContext);
  const theme = useContext(ThemeContext) || defaultTheme;
  const { engine, engineError } =
    useContext(EngineContext) || useEngine(myConfig);

  return (
    <StyledPie
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

Pie.propTypes = {
  /** Configuration object to connect to the Qlik Engine. Must include Qlik site URL and an App name */
  config: PropTypes.object,
  /** cols from Qlik Data Model to render in the Pie  */
  cols: PropTypes.array.isRequired,
  /** Calc condition for the chart  */
  calcCondition: PropTypes.object,
  /** Supress zeo vlaues in the the chart  */
  suppressZero: PropTypes.bool,
  /** Pie width */
  width: PropTypes.string,
  /** The height of the Pie */
  height: PropTypes.string,
  /** The amount of margin around the component */
  margin: PropTypes.string,
  /** Size of the Pie */
  size: PropTypes.oneOf(["tiny", "small", "medium", "large", "xlarge"]),
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
  /** Border Radius on the Pie */
  borderRadius: PropTypes.string,
  /** Color of the Labels on the Pie */
  fontColor: PropTypes.string,
  /** Background Color of the chart */
  backgroundColor: PropTypes.string,
  /** color scheme of the chart */
  colorTheme: PropTypes.oneOfType([
    PropTypes.oneOf([
      "motor",
      "divergent9",
      "divergent13",
      "eco",
      "bio",
      "red",
      "blue",
      "gray",
      "pink",
      "grape",
      "violet",
      "indigo",
      "blue",
      "cyan",
      "teal",
      "green",
      "lime",
      "yellow",
      "orange",
      "base",
    ]),
    PropTypes.array,
  ]),
  /** RoundNum of the Pie */
  roundNum: PropTypes.bool,
  /** Title of the Pie */
  title: PropTypes.string,
  /** Sub Title of the Pie */
  subTitle: PropTypes.string,
  /** Legend of the Pie */
  showLegend: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.oneOf(["right", "bottom"]),
  ]),
  /** Allow Selections */
  allowSelections: PropTypes.bool,
  /** Display as Donut chart */
  innerRadius: PropTypes.number,
  /** Display as Donut chart */
  cornerRadius: PropTypes.number,
  /** Display as Donut chart */
  padAngle: PropTypes.number,
  /** Error messgae to display when invalid dimension */
  dimensionErrMsg: PropTypes.string,
  /** Error messgae to display when invalid measure */
  measureErrMsg: PropTypes.string,
  /** Show values as Other */
  otherTotalSpec: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.shape({
      qOtherLabel: PropTypes.string,
      qOtherCount: PropTypes.string,
    }),
  ]),
  /** Show chart values */
  showLabels: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.oneOf(["inside", "outside", "altStyle", "none"]),
  ]) /** Name of the parent grid area to place the box */,
  gridArea: PropTypes.string,
};

Pie.defaultProps = {
  config: null,
  calcCondition: undefined,
  suppressZero: false,
  width: "100%",
  height: "100%",
  margin: null,
  size: "medium",
  allowSelections: null,
  fontColor: null,
  border: true,
  backgroundColor: null,
  colorTheme: null,
  roundNum: true,
  title: null,
  subTitle: null,
  showLegend: true,
  innerRadius: 0,
  cornerRadius: 0,
  padAngle: 0,
  showLabels: null,
  gridArea: null,
};

export default Pie;
