import React from 'react'
import SelectionObject from '../../../hooks/useSelectionObject'
import {
  SelectionsWrapper,
  SelectionItem,
  NoSelections,
  SelectedTitle,
  SelectedValue,
  SelectionsX,
  XStyled,
} from './SelectionsTheme'

function StyledSelections({
  engine,
  size,
  width,
  margin,
  maxHeight,
  minHeight,
  selectionsLimit,
  overflow,
  flex,
}) {
  const { qLayout, clearSelections } = SelectionObject({ engine })

  let selections = []

  if (qLayout) {
    const selectedFields = qLayout.qSelectionObject.qSelections
    if (selectedFields.length) {
      selections = selectedFields.map(value => {
        if (value.qSelectedCount >= 1 && value.qSelectedCount <= selectionsLimit) {
          return {
            field: value.qField,
            selected: value.qSelectedFieldSelectionInfo.map(valueInner => valueInner.qName),
            total: value.qTotal,
          }
        } if (value.qSelectedCount > selectionsLimit || value.qSelectedCount > 6) {
          return {
            field: value.qField,
            selected: [`${value.qSelectedCount} of ${value.qTotal}`],
          }
        }

        return null
      })
    }
  }

  return (
    <SelectionsWrapper
      maxHeight={maxHeight}
      minHeight={minHeight}
      margin={margin}
      width={width}
      size={size}
      overflow={overflow}
      flex={flex}
    >
      {selections.length === 0
      && <NoSelections data-testid="selections">No current selections</NoSelections>}
      {selections.length >= 1
          && selections.map((item, i) => (
            // eslint-disable-next-line react/jsx-key
            // eslint-disable-next-line react/no-array-index-key
            <SelectionItem key={i}>
              <SelectedTitle data-testid="selectTitle">
                {item.field}
                {': '}
                &nbsp;
              </SelectedTitle>
              { item.selected.map((sel, i) => (
                <SelectedValue data-testid="selectValue" key={i}>{ (i ? ', ' : '') + sel }</SelectedValue>
              ))}
              <SelectionsX data-testid="selectClear" onClick={() => clearSelections(item.field)}>
                <XStyled height={15} />
              </SelectionsX>
            </SelectionItem>
          ))}
    </SelectionsWrapper>
  )
}

export default StyledSelections
