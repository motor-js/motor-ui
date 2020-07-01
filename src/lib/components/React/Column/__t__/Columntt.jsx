/*
import React from 'react'
import {
  render,
  cleanup,
  fireEvent,
} from '@testing-library/react'
import '@testing-library/jest-dom'
import matchMediaMock from '../../../../../../config/matchMediaMock'
import Column from '../Column'
import useHyperCube from '../../../../hooks/useHyperCube'

jest.mock('../../../../hooks/useHyperCube')
const { hypercube } = require('qix-faker');

afterEach(cleanup)

const hc = hypercube({
  dimensions: [f => f.commerce.product()],
  measures: [f => f.commerce.price(100, 100, 0)],
  numRows: 1,
});

//console.log(lo.qDataPages[0].qMatrix)
describe('Column Chart test',  () => {

  useHyperCube.mockReturnValue({
    qLayout: { qHyperCube: hc },
    qData: hc.qDataPages[0],
    d3Container: null
  })

  it('renders with a label',() => {
    const { getByTestId } = render(<Column />)

  })

})

*/
