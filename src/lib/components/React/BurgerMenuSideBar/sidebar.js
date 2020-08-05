import React from "react";
// import { slide as Menu } from "react-burger-menu";
import { slide as Menu } from "../BurgerMenu";
import "./styles.css";

export default (props) => {
  const theme = "slide";
  // const Menu = require("./menus/slide");
  // const [Menu] = require("../BurgerMenu/menus/slide");
  return (
    // Pass on our props
    <Menu {...props}>
      <a className="menu-item" href="/">
        Home
      </a>

      <a className="menu-item" href="/sidebar">
        Burgers
      </a>

      <a className="menu-item" href="/pizzas">
        Pizzas
      </a>

      <a className="menu-item" href="/desserts">
        Desserts
      </a>
    </Menu>
  );
};
