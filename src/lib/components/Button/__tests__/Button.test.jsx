import React from 'react'
import {
  render,
  fireEvent,
  cleanup,
  waitForElement,
  waitForDomChange,
} from '@testing-library/react'
import '@testing-library/jest-dom'
// import { renderHook, act } from '@testing-library/react-hooks'
import Button from '../Button'

afterEach(cleanup)

describe('Button test', () => {
  it('renders with title', () => {
    const { getByRole } = render(<Button>Test</Button>)
    expect(getByRole('button')).toHaveTextContent('Test')
  })

  it('captures clicks', done => {
    function handleClick() {
      done()
    }
    const { getByText } = render(
      <Button type="noAction" onClick={handleClick}>Test</Button>,
    )
    const node = getByText('Test')
    fireEvent.click(node)
  })
})

