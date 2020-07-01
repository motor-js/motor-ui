import React from 'react'
import PropTypes from 'prop-types'
import StyledGrid from './StyledGrid'

const Grid = ({
  rows,
  fill,
  ...rest
}) => {

  return (
    <StyledGrid
      rows={rows}
      fillContainer={fill}
      {...rest}
    />
  )

}

export default Grid

const OVERFLOW_VALUES = ['auto', 'hidden', 'scroll', 'visible'];

Grid.propTypes = {
  /** grid-template-areas CSS property to specify named grid areas.
   * Passed either as an array of arrays or an array of objects.
  */
  areas: PropTypes.oneOfType([
    PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string,
        start: PropTypes.arrayOf(PropTypes.number),
        end: PropTypes.arrayOf(PropTypes.number),
      }),
    ),
    PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)),
  ]),
  /**
   * Row sizes. If an array value is an array, the inner array indicates the minimum and maximum sizes for the row.
   * Specifying a single string will cause automatically added rows to be the specified size.
   */
  rows: PropTypes.array,
  /**Column sizes. If an array value is an array, the inner array indicates the minimum and maximum sizes for the column. 
   * Specifying a single string will repeat multiple columns of that size, as long as there is room for more. 
   * Specifying an object allows indicating how the columns stretch to fit the available space. */
  columns: PropTypes.array,
  /** Whether the width and/or height should fill the container. */
  fill: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.oneOf(['horizontal', 'vertical'])
  ]),
  /** overflow properties */
  overflow: PropTypes.oneOfType([
    PropTypes.oneOf(OVERFLOW_VALUES),
    PropTypes.shape({
      horizontal: PropTypes.oneOf(OVERFLOW_VALUES),
      vertical: PropTypes.oneOf(OVERFLOW_VALUES),
    }),
    PropTypes.string,
  ]),
  /** sets the gaps (gutters) between rows and columns. */
  gap: PropTypes.string,
  /** color of the grid */
  backgroundColor: PropTypes.string,
  /** alignment of the individual items inside the grid when there is extra space in the row axis. */
  justify: PropTypes.oneOf(['start', 'center', 'end', 'stretch']),
  /** alignment the contents along the row axis. */
  justifyContent: PropTypes.oneOf([
    'start',
    'center',
    'end',
    'between',
    'around',
    'stretch',
  ]),
  /** alignment of the individual items inside the grid when there is extra space in the column axis. */
  align: PropTypes.oneOf(['start', 'center', 'end', 'stretch']),
  /** alignment the contents along the column axis. */
  alignContent: PropTypes.oneOf([
    'start',
    'center',
    'end',
    'between',
    'around',
    'stretch',
  ]),
}

Grid.defaultProps = {
  areas: [],
  rows: [],
  columns: [],
  fill: true,
  overflow: 'auto',
  gap: '',
  backgroundColor: 'white',
  justify: 'stretch',
  justifyContent: 'stretch',
  align: 'stretch',
  alignContent: 'stretch',
}
