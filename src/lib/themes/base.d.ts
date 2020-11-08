import { CSSProperties } from "react";

export interface Theme {
  name: string;
  global: {
    chart: {
      hover?: CSSProperties;
      selection?: CSSProperties;
      nonSelection?: CSSProperties;
      noSelections?: CSSProperties;
    };
  };
  points?: CSSProperties;
  scatter?: CSSProperties;
  bar?: CSSProperties;
  stackedArea?: CSSProperties;
}

export declare const base: Theme;

export default base;
