import * as React from "react";

export interface BurgerMenuSideBarProps {
  pageWrapId?: string;
  outerContainerId?: string;
}

declare const BurgerMenuSideBar: React.FC<BurgerMenuSideBarProps>;

export type BurgerMenuSideBarType = BurgerMenuSideBarProps;

export default BurgerMenuSideBar;
