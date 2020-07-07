import * as React from "react";

export interface useListObjectProps {
  qPage: { qTop: number, qLeft: number, qWidth: number, qHeight: number },
  engine: object,
  dimension: Array<string>
  label: string
}

declare const useListObject: React.FC<useListObjectProps>;

export type useListObjectType = useListObjectProps

export default useListObject
