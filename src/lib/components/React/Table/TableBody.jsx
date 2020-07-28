import React, { useRef } from 'react'
import Button from '../Button'
import { TableBodyStyle, TableRowStyle, TableCellStyle } from './TableTheme'

const TableBody = ({
  qData,
  columns,
  handleSelCallback,
  handlePagingCallback,
  page,
  pageHeight,
  selectionsActive,
  gridPxl,
  bandedRows,
  handleScrollCallback,
  highlightOnSelection,
  pendingSel,
  selCol
}) => {
  const rowRef = useRef()

  const handle = (keys, col) => handleSelCallback(keys, col)

  const incrementPage = () => {
    const nextPage = page + 1
    handlePagingCallback(nextPage)
    handleScrollCallback()
  }

  const decrementPage = () => {
    let prevPage
    if (page === 0) {
      prevPage = page
    } else {
      prevPage = page - 1
      handlePagingCallback(prevPage)
      handleScrollCallback()
    }
  }

  let items
  if (qData) {
    const data = qData.qMatrix
    items = data.map((val, i) => (
      <TableRowStyle
        ref={i === (pageHeight - 1) ? rowRef : null}
        key={i}
        i={i}
        gridPxl={gridPxl}
        bandedRows={bandedRows}
      >
        {columns.map((col, c) => (
          <TableCellStyle
            id={`cell-${i + c}`}
            key={c}
            item={data[i][c]}
            col={col}
            selectionsActive={selectionsActive}
            highlightOnSelection={highlightOnSelection}
            pendingSel={pendingSel}
            selCol={selCol}
            onClick={() => { handle(data[i][c].qElemNumber, col) }}
          >
            {col.qColumnType === 'dim' ? data[i][c].qText : data[i][c].qText}
          </TableCellStyle>
        ))}
      </TableRowStyle>
    ))
  }

  return (
    <TableBodyStyle gridPxl={gridPxl}>
      {page > 0 && <tr><td><Button size="small" type="default" onClick={decrementPage}>Load Previous</Button></td></tr> }
      {items}
      {qData.qMatrix.length >= pageHeight && <tr><td><Button size="small" type="default" onClick={incrementPage}>Load Next</Button></td></tr> }
    </TableBodyStyle>
  )
}

export default TableBody

