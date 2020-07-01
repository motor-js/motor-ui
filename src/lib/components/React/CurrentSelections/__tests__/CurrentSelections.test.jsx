import React from 'react'
import {
  render,
  cleanup,
  fireEvent,
} from '@testing-library/react'
import '@testing-library/jest-dom'
import CurrentSelections from '../CurrentSelections'
import SelectionObject from '../../../../hooks/useSelectionObject'

jest.mock('../../../../hooks/useSelectionObject')

afterEach(cleanup)

describe('Current Selections test', () => {
  it('renders with default text', () => {
    SelectionObject.mockReturnValue({
      qLayout: {
        qSelectionInfo: {},
        qSelectionObject: {
          qBackCount: 0,
          qForwardCount: 0,
          qSelections: [],
        },
      },
    })

    const { getByTestId } = render(<CurrentSelections />)
    expect(getByTestId('selections')).toHaveTextContent('No current selections')
  })

  it('renders with one selection', async () => {
    const clearSelections = jest.fn()
    SelectionObject.mockReturnValue({
      qLayout: {
        qSelectionInfo: {},
        qSelectionObject: {
          qBackCount: 0,
          qForwardCount: 0,
          qSelections: [{
            qField: 'Dim',
            qSelected: 'Value',
            qSelectedFieldSelectionInfo: [{
              qName: 'Value',
            }],
            qSelectedCount: 1,
            qTotal: 457,
          }],
        },
      },
    })

    const { getByTestId } = render(<CurrentSelections onClick={clearSelections} />)
    expect(getByTestId('selectTitle')).toHaveTextContent('Dim:')
    expect(getByTestId('selectValue')).toHaveTextContent('Value')
  })
})
