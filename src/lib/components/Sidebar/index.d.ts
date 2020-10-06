import * as React from "react";
import { borderType } from "../../../utils";

export interface SidebarProps {
  backgroundColor?: string;
  border?: borderType;
  padding?: string;
}

declare const Sidebar: React.FC<SidebarProps>;

export type SidebarType = SidebarProps;

export default Sidebar;
