import * as React from "react";
import { borderType } from "../../../utils";

export interface BurgerMenuProps {
  backgroundColor?: string;
  border?: borderType;
  padding?: string;
}

declare const BurgerMenu: React.FC<BurgerMenuProps>;

export type BurgerMenuType = BurgerMenuProps;

export default BurgerMenu;
