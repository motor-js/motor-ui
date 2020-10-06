import React, { useState, useMemo } from "react";
import PropTypes from "prop-types";
import StyledBox from "./StyledBox";

/*
 *  REVISIT:
 *  1. BORDER STYLES
 *  2. TEST on click
 *  3. Test styled components extend
 *  3. padding breakpoints for small, medium, large - and same for any other props????
 */

const Box = ({
  children,
  height,
  width,
  focusable,
  onFocus,
  onBlur,
  wrap,
  ...rest
}) => {
  const [focus, setFocus] = useState();

  const clickProps = useMemo(() => {
    if (focusable) {
      return {
        onFocus: (event) => {
          setFocus(true);
          if (onFocus) onFocus(event);
        },
        onBlur: (event) => {
          setFocus(false);
          if (onBlur) onBlur(event);
        },
      };
    }
  }, [onFocus, onBlur]);

  const adjustedTabIndex = useMemo(() => {
    if (focusable) return 0;
    return undefined;
  }, [focusable]);

  return (
    <StyledBox
      heightProp={height}
      widthProp={width}
      focus={focus}
      tabIndex={adjustedTabIndex}
      wrapProp={wrap}
      {...clickProps}
      {...rest}
    >
      {children}
    </StyledBox>
  );
};

export default Box;

const OVERFLOW_VALUES = ["auto", "hidden", "scroll", "visible"];

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

Box.propTypes = {
  /** box height, set either a string, min or max */
  height: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({
      min: PropTypes.string,
      max: PropTypes.string,
    }),
  ]),
  /** box width, set either a string, min or max */
  width: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({
      min: PropTypes.string,
      max: PropTypes.string,
    }),
  ]),
  /** box margin */
  margin: PropTypes.string,
  /** overflow properties */
  overflow: PropTypes.oneOfType([
    PropTypes.oneOf(OVERFLOW_VALUES),
    PropTypes.shape({
      horizontal: PropTypes.oneOf(OVERFLOW_VALUES),
      vertical: PropTypes.oneOf(OVERFLOW_VALUES),
    }),
    PropTypes.string,
  ]),
  /** background color */
  backgroundColor: PropTypes.string,
  /** background color */
  color: PropTypes.string,
  /** border */
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
  /** border radius */
  borderRadius: PropTypes.string,
  /** padding */
  padding: PropTypes.string,
  /** How to align the contents along the cross axis */
  align: PropTypes.oneOf(["start", "center", "end", "baseline", "stretch"]),
  /** How to align the contents when there is extra space in the cross axis */
  alignContent: PropTypes.oneOf([
    "start",
    "center",
    "end",
    "between",
    "around",
    "stretch",
  ]),
  justify: PropTypes.oneOf([
    "around",
    "between",
    "center",
    "end",
    "evenly",
    "start",
    "stretch",
  ]),
  justifyContent: PropTypes.oneOf([
    "around",
    "between",
    "center",
    "end",
    "start",
    "stretch",
  ]),
  /** sets flex-direction. The direction to layout child components */
  direction: PropTypes.oneOf([
    "row",
    "column",
    "row-responsive",
    "row-reverse",
    "column-reverse",
  ]),
  /** Whether flex-grow and/or flex-shrink is true and at a desired factor */
  flex: PropTypes.oneOfType([
    PropTypes.oneOf(["grow", "shrink"]),
    PropTypes.bool,
    PropTypes.shape({
      grow: PropTypes.number,
      shrink: PropTypes.number,
    }),
  ]),
  /** whether focus should be applied to the box */
  focusable: PropTypes.bool,
  /** A fixed or relative size along its container's main axis */
  basis: PropTypes.string,
  /** whether children are wrapped in the box container */
  wrapProp: PropTypes.oneOfType([PropTypes.bool, PropTypes.oneOf(["reverse"])]),
  /** Setting the box shadow css property */
  elevation: PropTypes.string,
  /** OnClick callback function */
  onClick: PropTypes.func,
  /** Name of the parent grid area to place the box */
  gridArea: PropTypes.string,
};

Box.defaultProps = {
  height: null,
  width: null,
  margin: null,
  overflow: "visible",
  backgroundColor: null,
  color: null,
  border: null,
  padding: null,
  align: null,
  alignContent: null,
  justify: null,
  justifyContent: null,
  direction: "row",
  flex: false,
  focusable: false,
  basis: null,
  wrapProp: false,
  elevation: "",
  onClick: null,
  gridArea: null,
};
