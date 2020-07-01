import React from 'react'
import {
  render,
  cleanup,
  fireEvent,
} from '@testing-library/react'
import '@testing-library/jest-dom'
import Filter from '../Filter'
import useListObject from '../../../../hooks/useListObject'

jest.mock('../../../../hooks/useListObject')
const { listobject } = require('qix-faker')

// No testing currently for search box or select & drag

afterEach(cleanup)

const lo = listobject({
  numRows: 10,
  dimension: d => d.name.firstName(),
})

describe('Dropdown test', () => {
  useListObject.mockReturnValue({
    qLayout: { qListObject: lo },
    qData: lo.qDataPages[0],
    selections: [],
    beginSelections: jest.fn(),
    select: jest.fn(),
    searchListObjectFor: jest.fn(),
    acceptListObjectSearch: jest.fn(),
    endSelections: jest.fn(),
    changePage: jest.fn(),
  })

  it('renders dropdown & handles selections', async () => {
    const {
      debug,
      container,
      getByText,
      getByTestId,
      findAllByTestId,
    } = render(
      <Filter
        label="Province"
        dimension="TEST"
        selectionsTitle={false}
        dropHeight="500px"
      />,
    )

    // dropdown toggle
    fireEvent.click(getByText('Province'))
    const items = await findAllByTestId('items')
    expect(items).toHaveLength(10)

    // selections
    const dropdown = await getByTestId('dropdown')
    const selectable = await container.querySelector('#selectableItem-0')
    fireEvent.click(dropdown)
    fireEvent.click(selectable)

    // search
    const search = getByTestId('dd-search')
    expect(search.value).toBe('')

    // close listbox & end selections
    fireEvent.click(document)
    // const noItems = findAllByTestId('items')
    //  expect(noItems).toBe({})
  })
})

