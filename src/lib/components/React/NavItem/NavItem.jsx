import React, { useContext } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import { ThemeContext } from "styled-components";
import defaultTheme from "../../../themes/defaultTheme";
import Box from "../box";
import useOutsideClick from "../../../hooks/useOutsideClick";
import { useLocation } from "react-router-dom";

import { StyledNavItem } from "./NavItemTheme";
import {
  BrowserRouter as Router,
  Route,
  Link,
  withRouter,
} from "react-router-dom";

const NavItem = (props) => {
  const theme = useContext(ThemeContext) || defaultTheme;
  console.log(props);

  let location = useLocation();

  // const NavItem {
  // const handleClick = (e) => {
  //   // const { path, onItemClick } = this.props;
  //   // onItemClick(path);
  //   console.log(e.target);
  // };

  // const { active } = this.props;

  return (
    <StyledNavItem theme={theme} active={location.pathname === props.path}>
      {/* <StyledNavItem active={active}> */}
      <Link to={props.path} className={props.css}>
        {/* <Link to={props.path} className={props.css} onClick={handleClick}> */}
        {/* <NavIcon></NavIcon> */}
        {props.name}
      </Link>
    </StyledNavItem>
  );
};

NavItem.propTypes = {
  // children: PropTypes.node,
  // footer: PropTypes.node,
  // header: PropTypes.node,
  // zIndex: PropTypes.string,
  size: PropTypes.oneOf(["tiny", "small", "medium", "large", "xlarge"]),
  responsive: PropTypes.bool,
  border: PropTypes.string,
  color: PropTypes.object,
  background: PropTypes.object,
};

NavItem.defaultProps = {
  // children: undefined,
  // footer: undefined,
  // header: undefined,
  // width: "70vw",
  // top: "30%",
  // zIndex: "1050",
  size: "small",
  responsive: true,
  color: null,
  background: null,
  // border: null,
};

export default NavItem;
