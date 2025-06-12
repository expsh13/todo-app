import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Home from '../page'

describe('Home Page', () => {
  it('should render the main heading', () => {
    render(<Home />)
    
    expect(screen.getByRole('heading', { name: /todo app/i })).toBeInTheDocument()
  })

  it('should render the add todo form', () => {
    render(<Home />)
    
    expect(screen.getByPlaceholderText(/add a new todo/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /add/i })).toBeInTheDocument()
  })

  it('should display empty state initially', () => {
    render(<Home />)
    
    expect(screen.getByText(/no todos yet/i)).toBeInTheDocument()
  })

  it('should add a new todo when form is submitted', async () => {
    const user = userEvent.setup()
    render(<Home />)
    
    const input = screen.getByPlaceholderText(/add a new todo/i)
    const button = screen.getByRole('button', { name: /add/i })
    
    await user.type(input, 'Test todo')
    await user.click(button)
    
    expect(screen.getByText('Test todo')).toBeInTheDocument()
    expect(screen.queryByText(/no todos yet/i)).not.toBeInTheDocument()
  })

  it('should toggle todo completion status', async () => {
    const user = userEvent.setup()
    render(<Home />)
    
    const input = screen.getByPlaceholderText(/add a new todo/i)
    const button = screen.getByRole('button', { name: /add/i })
    
    await user.type(input, 'Test todo')
    await user.click(button)
    
    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).not.toBeChecked()
    
    await user.click(checkbox)
    expect(checkbox).toBeChecked()
    
    const todoText = screen.getByText('Test todo')
    expect(todoText).toHaveClass('line-through')
  })

  it('should delete a todo', async () => {
    const user = userEvent.setup()
    render(<Home />)
    
    const input = screen.getByPlaceholderText(/add a new todo/i)
    const addButton = screen.getByRole('button', { name: /add/i })
    
    await user.type(input, 'Test todo')
    await user.click(addButton)
    
    expect(screen.getByText('Test todo')).toBeInTheDocument()
    
    const deleteButton = screen.getByRole('button', { name: /delete/i })
    await user.click(deleteButton)
    
    expect(screen.queryByText('Test todo')).not.toBeInTheDocument()
    expect(screen.getByText(/no todos yet/i)).toBeInTheDocument()
  })

  it('should handle multiple todos', async () => {
    const user = userEvent.setup()
    render(<Home />)
    
    const input = screen.getByPlaceholderText(/add a new todo/i)
    const button = screen.getByRole('button', { name: /add/i })
    
    await user.type(input, 'First todo')
    await user.click(button)
    
    await user.type(input, 'Second todo')
    await user.click(button)
    
    await user.type(input, 'Third todo')
    await user.click(button)
    
    expect(screen.getByText('First todo')).toBeInTheDocument()
    expect(screen.getByText('Second todo')).toBeInTheDocument()
    expect(screen.getByText('Third todo')).toBeInTheDocument()
    
    const checkboxes = screen.getAllByRole('checkbox')
    expect(checkboxes).toHaveLength(3)
  })
})