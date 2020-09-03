import * as React from "react";

export interface SidebarLegacyProps {
  children: React.ReactNode
  collapsable: boolean
}

declare const SidebarLegacy: React.FC<SidebarLegacyProps>;

export type SidebarLegacyType = SidebarLegacyProps

export default SidebarLegacy
