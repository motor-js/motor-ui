import * as React from "react";
import {
  configType,
  sizeType,
} from '../../../utils'

export interface SearchProps {
  config?: configType
  dimensions: Array<string>
  size: sizeType
  width: string
  margin: string
  dropHeight: string
}

declare const Search: React.FC<SearchProps>;

export type SearchType = SearchProps

export default Search
