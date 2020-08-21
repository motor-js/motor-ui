import * as React from "react";
import { borderType } from "../../../utils";

export interface SidebarNextProps {
  backgroundColor?: string;
  border?: borderType;
  padding?: string;
}

declare const SidebarNext: React.FC<SidebarNextProps>;

export type SidebarNextType = SidebarNextProps;

export default SidebarNext;
