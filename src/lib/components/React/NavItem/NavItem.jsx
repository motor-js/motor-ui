import React, { useContext } from "react";
import PropTypes from "prop-types";
import { ThemeContext } from "styled-components";
import defaultTheme from "../../../themes/defaultTheme";
import { useLocation } from "react-router-dom";

import { StyledNavItem } from "./NavItemTheme";
import { Link } from "react-router-dom";

const NavItem = (props) => {
  const theme = useContext(ThemeContext) || defaultTheme;

  let location = useLocation();

  return (
    <StyledNavItem
      theme={theme}
      active={location.pathname === props.path}
      border={props.border}
    >
      <Link to={props.path} className={props.css}>
        {props.children}
        {props.name}
      </Link>
    </StyledNavItem>
  );
};

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

NavItem.propTypes = {
  children: PropTypes.node,
  size: PropTypes.oneOf(["tiny", "small", "medium", "large", "xlarge"]),
  responsive: PropTypes.bool,
  border: PropTypes.string,
  color: PropTypes.object,
  background: PropTypes.object,
  textAlign: PropTypes.string,
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
};

NavItem.defaultProps = {
  children: undefined,
  size: "small",
  responsive: true,
  color: null,
  background: null,
  textAlign: null,
  border: false,
};

export default NavItem;
