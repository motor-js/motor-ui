import * as React from "react";

export interface QlikSelectionsProps {
  width?: string;
  height?: string;
  border?: string
}

declare const QlikSelections: React.FC<QlikSelectionsProps>;

export type QlikSelectionsType = QlikSelectionsProps;

export default QlikSelections;