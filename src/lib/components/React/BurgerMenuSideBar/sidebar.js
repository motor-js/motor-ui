import React, { Children } from "react";
// import { slide as Menu } from "react-burger-menu";
import { slide as Menu } from "../BurgerMenu";
import "./styles.css";
// import { Home, X } from "react-feather";

export default (props) => {
  const theme = "slide";
  // const Menu = require("./menus/slide");
  // const [Menu] = require("../BurgerMenu/menus/slide");
  return (
    // Pass on our props
    <Menu {...props}>{props.children}</Menu>
  );
};
