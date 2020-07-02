import * as React from "react";

export interface SidebarProps {
  children: React.ReactNode
  collapsable: boolean
}

declare const Sidebar: React.FC<SidebarProps>;

export type SidebarType = SidebarProps

export default Sidebar
