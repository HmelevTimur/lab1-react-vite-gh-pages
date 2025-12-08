import { render, screen, fireEvent } from '@testing-library/react'
import { describe, test, beforeEach, vi } from 'vitest'
import UserTable from './UserTable'

declare const global: {
  fetch: typeof fetch
}

describe('UserTable', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  test('renders button and does not show table initially', () => {
    render(<UserTable />)
    expect(screen.getByText(/загрузить пользователей/i)).toBeInTheDocument()
    expect(screen.queryByText(/иван/i)).not.toBeInTheDocument()
  })

  test('loads users and displays them when button is clicked', async () => {
    const mockUsers = [
      {
        id: 1,
        name: 'Иван Иванов',
        email: 'ivan@example.com',
        phone: '+7 (999) 123-45-67',
        website: 'example.com',
      },
    ]

    vi.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => mockUsers,
    } as Response)

    render(<UserTable />)
    fireEvent.click(screen.getByText(/загрузить пользователей/i))

    expect(await screen.findByText(/иван иванов/i)).toBeInTheDocument()
    expect(screen.getByText(/ivan@example.com/i)).toBeInTheDocument()
  })

  test('shows error when fetch fails', async () => {
    vi.spyOn(global, 'fetch').mockRejectedValueOnce(new Error('Network error'))

    render(<UserTable />)
    fireEvent.click(screen.getByText(/загрузить пользователей/i))

    expect(await screen.findByText(/network error/i)).toBeInTheDocument()
  })

  test('filters users by email when typing "ap"', async () => {
    const mockUsers = [
      {
        id: 1,
        name: 'Иван Иванов',
        email: 'ivan@example.com',
        phone: '+7 (999) 123-45-67',
        website: 'example.com',
      },
      {
        id: 2,
        name: 'Петр Петров',
        email: 'petr@gmail.com',
        phone: '+7 (999) 765-43-21',
        website: 'test.com',
      },
      {
        id: 3,
        name: 'Анна Смирнова',
        email: 'anna@yahoo.com',
        phone: '+7 (999) 111-22-33',
        website: 'sample.com',
      },
    ]

    vi.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => mockUsers,
    } as Response)

    render(<UserTable />)
    fireEvent.click(screen.getByText(/загрузить пользователей/i))

    await screen.findByText(/иван иванов/i)

    const searchInput = screen.getByPlaceholderText(/поиск по email/i)
    
    fireEvent.change(searchInput, { target: { value: 'example' } })
    
    expect(screen.getByText(/иван иванов/i)).toBeInTheDocument()
    expect(screen.getByText(/ivan@example.com/i)).toBeInTheDocument()
    expect(screen.queryByText(/petr@gmail.com/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/anna@yahoo.com/i)).not.toBeInTheDocument()
  })

  test('shows "Ничего не найдено" when no users match search', async () => {
    const mockUsers = [
      {
        id: 1,
        name: 'Иван Иванов',
        email: 'ivan@example.com',
        phone: '+7 (999) 123-45-67',
        website: 'example.com',
      },
      {
        id: 2,
        name: 'Петр Петров',
        email: 'petr@gmail.com',
        phone: '+7 (999) 765-43-21',
        website: 'test.com',
      },
    ]

    vi.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => mockUsers,
    } as Response)

    render(<UserTable />)
    fireEvent.click(screen.getByText(/загрузить пользователей/i))

    await screen.findByText(/иван иванов/i)

    const searchInput = screen.getByPlaceholderText(/поиск по email/i)
    
    fireEvent.change(searchInput, { target: { value: 'nonexistent' } })
    
    expect(screen.getByText(/ничего не найдено/i)).toBeInTheDocument()
    expect(screen.queryByText(/иван иванов/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/petr@gmail.com/i)).not.toBeInTheDocument()
  })
})