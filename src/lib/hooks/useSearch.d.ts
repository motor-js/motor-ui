import * as React from "react";

export interface useSearchProps {
  engine: object,
  searchValue: string,
  dimensions: Array<string>,
  qCount: number,
  qGroupItemCount: number,
}

declare const useSearch: React.FC<useSearchProps>;

export type useSearchType = useSearchProps

export default useSearch
