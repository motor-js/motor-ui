import React from 'react'
import {
  render,
  cleanup,
  fireEvent,
} from '@testing-library/react'
import '@testing-library/jest-dom'
import StyledTable from '../StyledTable'
import Table from '../Table'
import useHyperCube from '../../../../hooks/useHyperCube'

jest.mock('../../../../hooks/useHyperCube')
const { hypercube } = require('qix-faker')

afterEach(cleanup)

const hc = hypercube({
  numRows: 80,
  dimensions: [
    {
      value: f => f.address.country(),
      maxCardinalRatio: 0.1,
    },
    {
      value: f => f.address.city(),
    },
  ],
})

describe('Table test', () => {
  useHyperCube.mockReturnValue({
    qLayout: {
      qHyperCube:
        hc,
      qInfo: {
        qId: 'testid',
      },
    },
    qData: {
      qMatrix: [
        [{
          qAttrExps: {
            qValues: [
              { qNum: 'NaN' },
              { qNum: 'NaN' },
            ],
          },
          qElemenNumber: 22,
          qText: 'Item 1',
          qState: '0',
        },
        {
          qAttrExps: {
            qValues: [
              { qNum: 'NaN' },
              { qNum: 'NaN' },
            ],
          },
          qElemenNumber: 22,
          qText: 'Item 2',
          qState: '0',
        },
        {
          qAttrExps: {
            qValues: [
              { qNum: 'NaN' },
              { qNum: 'NaN' },
            ],
          },
          qElemenNumber: 22,
          qText: 'Item 1',
          qState: '0',
        },
        {
          qAttrExps: {
            qValues: [
              { qNum: 'NaN' },
              { qNum: 'NaN' },
            ],
          },
          qElemenNumber: 22,
          qText: 'Item 2',
          qState: '0',
        }],
        [{
          qAttrExps: {
            qValues: [
              { qNum: 'NaN' },
              { qNum: 'NaN' },
            ],
          },
          qElemenNumber: 22,
          qText: 'Item 1',
          qState: '0',
        },
        {
          qAttrExps: {
            qValues: [
              { qNum: 'NaN' },
              { qNum: 'NaN' },
            ],
          },
          qElemenNumber: 22,
          qText: 'Item 2',
          qState: '0',
        },
        {
          qAttrExps: {
            qValues: [
              { qNum: 'NaN' },
              { qNum: 'NaN' },
            ],
          },
          qElemenNumber: 22,
          qText: 'Item 1',
          qState: '0',
        },
        {
          qAttrExps: {
            qValues: [
              { qNum: 'NaN' },
              { qNum: 'NaN' },
            ],
          },
          qElemenNumber: 22,
          qText: 'Item 2',
          qState: '0',
        }],
      ],
    },
    mergedCols: [{ qField: 'Dim 1', qLabel: 'Dim 1' }, { qField: 'Dim 2', qLabel: 'Dim 2' }],
  })

  it('Styled Table renders', async () => {
    const { debug, getByTestId, container } = render(
      <StyledTable
        columns={[{
          dimensions: [{
            qField: 'Dim 1',
            qLabel: 'Dim 1',
          },
          {
            qField: 'Dim 2',
            qLabel: 'Dim 2',
          }],
        }]}
        columnOrder={[0, 1]}
      />,
    )

    expect(getByTestId('tableRef')).toHaveTextContent('Item 1')
  })

  it('Table renders', async () => {
    const { debug, getByTestId, container } = render(
      <Table
        columns={[{
          dimensions: [{
            qField: 'Dim 1',
            qLabel: 'Dim 1',
          },
          {
            qField: 'Dim 2',
            qLabel: 'Dim 2',
          }],
        }]}
      />,
    )
  })
})
