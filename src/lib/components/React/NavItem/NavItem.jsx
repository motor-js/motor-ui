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
    <StyledNavItem theme={theme} active={location.pathname === props.path}>
      <Link to={props.path} className={props.css}>
        {props.children}
        {props.name}
      </Link>
    </StyledNavItem>
  );
};

NavItem.propTypes = {
  children: PropTypes.node,
  // footer: PropTypes.node,
  // header: PropTypes.node,
  // zIndex: PropTypes.string,
  size: PropTypes.oneOf(["tiny", "small", "medium", "large", "xlarge"]),
  responsive: PropTypes.bool,
  border: PropTypes.string,
  color: PropTypes.object,
  background: PropTypes.object,
  textAlign: PropTypes.string,
};

NavItem.defaultProps = {
  children: undefined,
  // footer: undefined,
  // header: undefined,
  // width: "70vw",
  // top: "30%",
  // zIndex: "1050",
  size: "small",
  responsive: true,
  color: null,
  background: null,
  textAlign: null,
  // border: null,
};

export default NavItem;
