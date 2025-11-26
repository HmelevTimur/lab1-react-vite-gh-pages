import { render, screen, fireEvent } from '@testing-library/react'
import { expect, test } from 'vitest'
import App from './App'

test('renders counter with initial value 0', () => {
  render(<App />)

  const button = screen.getByRole('button', { name: /count is 0/i })
  expect(button).toBeInTheDocument()
})

test('increments counter when button is clicked', () => {
  render(<App />)

  const button = screen.getByRole('button')

  fireEvent.click(button)
  expect(button.textContent).toMatch(/count is 1/i)

  fireEvent.click(button)
  expect(button.textContent).toMatch(/count is 2/i)
})
