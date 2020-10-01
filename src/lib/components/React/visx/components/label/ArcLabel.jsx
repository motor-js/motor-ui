import React from "react";
import PropTypes from "prop-types";

// import additionalProps from "../../utils/additionalProps";

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

export default function ArcLabel({
  x,
  y,
  theme: { valueLabelStyles },
  stroke,
  fill,
  fontSize,
  paintOrder,
  children,
  arc,
  ...rest
}) {
  //  const { valueLabelStyles } = theme;

  return (
    // <text x={x} y={y} {...valueLabelStyles} {...additionalProps(rest, arc)}>
    <text
      x={x}
      y={y}
      {...valueLabelStyles}
      stroke={stroke}
      fill={fill}
      fontSize={fontSize}
      paintOrder={paintOrder}
    >
      {children}
    </text>
  );
}

ArcLabel.propTypes = propTypes;
ArcLabel.defaultProps = defaultProps;
