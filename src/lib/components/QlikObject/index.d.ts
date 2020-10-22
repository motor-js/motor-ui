import * as React from "react";

export interface QlikObjectProps {
  id?: string;
  type: string;
  cols: string;
  options: string;
  noSelections: string;
  noInteraction: string;
  width?: string;
  height?: string;
  border?: string
  minWidth: string;
  minHeight: string;
  exportData: string;
  exportDataTitle: string;
  exportDataOptions: string;
  exportImg: string;
  exportImgTitle: string;
  exportImgOptions: string;
  exportPdf: string;
  exportPdfTitle: string;
  exportPdfOptions: string;
}

declare const QlikObject: React.FC<QlikObjectProps>;

export type QlikObjectType = QlikObjectProps;

export default QlikObject;