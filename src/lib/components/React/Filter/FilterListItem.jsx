import React from 'react'
import { StyledFilterListItem } from './FilterTheme'

const FilterListItem = ({
  data,
  selectMultipleCallback,
  selectableKey,
  rowHeight,
  i,
  size,
  itemHeight,
}) => (
  <StyledFilterListItem
    id={`selectableItem-${selectableKey}`}
    data-testid="items"
    onClick={() => (selectMultipleCallback(data[0]))}
    rowHeight={rowHeight}
    i={i}
    size={size}
    itemHeight={itemHeight}
    selected={data[0].qState}
  >
    {data[0].qText}
  </StyledFilterListItem>
)

export default FilterListItem
