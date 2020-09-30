import React, { useContext } from "react";
import PropTypes from "prop-types";
import ChartContext from "../../context/ChartContext";
// import { svgLabel } from "@data-ui/theme";

// import additionalProps from "../util/additionalProps";
import additionalProps from "../../utils/additionalProps";

// const { baseLabel } = svgLabel;

const propTypes = {
  x: PropTypes.number,
  y: PropTypes.number,
  paintOrder: PropTypes.string,
  // eslint-disable-next-line react/forbid-prop-types
  arc: PropTypes.object, // if passed, will be passed to any restprops
  children: PropTypes.node,
};

const defaultProps = {
  x: 0,
  y: 0,
  paintOrder: "stroke",
  arc: null,
  children: null,
};

export default function ArcLabel({ x, y, children, arc, ...rest }) {
  const {
    xScale,
    yScale,
    colorScale,
    showPoints,
    showLabels,
    theme,
    size,
    formatValue,
    valueLabelStyle,
    findNearestData,
    handleClick,
    measureInfo,
    dimensionInfo,
    singleDimension,
    currentSelectionIds,
  } = useContext(ChartContext);

  const { valueLabelStyles } = theme;
  return (
    // <text x={x} y={y} {...baseLabel} {...additionalProps(rest, arc)}>
    <text x={x} y={y} {...valueLabelStyles} {...additionalProps(rest, arc)}>
      {children}
    </text>
  );
}

ArcLabel.propTypes = propTypes;
ArcLabel.defaultProps = defaultProps;
