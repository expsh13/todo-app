import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AddTodo } from '../AddTodo'

describe('AddTodo', () => {
  it('should render input field and add button', () => {
    const mockOnAdd = vi.fn()
    
    render(<AddTodo onAdd={mockOnAdd} />)
    
    expect(screen.getByPlaceholderText(/add a new todo/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /add/i })).toBeInTheDocument()
  })

  it('should call onAdd with input value when form is submitted', async () => {
    const mockOnAdd = vi.fn()
    const user = userEvent.setup()
    
    render(<AddTodo onAdd={mockOnAdd} />)
    
    const input = screen.getByPlaceholderText(/add a new todo/i)
    const button = screen.getByRole('button', { name: /add/i })
    
    await user.type(input, 'New todo item')
    await user.click(button)
    
    expect(mockOnAdd).toHaveBeenCalledWith('New todo item')
  })

  it('should clear input after successful submission', async () => {
    const mockOnAdd = vi.fn()
    const user = userEvent.setup()
    
    render(<AddTodo onAdd={mockOnAdd} />)
    
    const input = screen.getByPlaceholderText(/add a new todo/i) as HTMLInputElement
    const button = screen.getByRole('button', { name: /add/i })
    
    await user.type(input, 'New todo item')
    await user.click(button)
    
    expect(input.value).toBe('')
  })

  it('should submit form when Enter key is pressed', async () => {
    const mockOnAdd = vi.fn()
    const user = userEvent.setup()
    
    render(<AddTodo onAdd={mockOnAdd} />)
    
    const input = screen.getByPlaceholderText(/add a new todo/i)
    
    await user.type(input, 'New todo item')
    await user.keyboard('{Enter}')
    
    expect(mockOnAdd).toHaveBeenCalledWith('New todo item')
  })

  it('should not submit when input is empty', async () => {
    const mockOnAdd = vi.fn()
    const user = userEvent.setup()
    
    render(<AddTodo onAdd={mockOnAdd} />)
    
    const button = screen.getByRole('button', { name: /add/i })
    
    await user.click(button)
    
    expect(mockOnAdd).not.toHaveBeenCalled()
  })

  it('should not submit when input contains only whitespace', async () => {
    const mockOnAdd = vi.fn()
    const user = userEvent.setup()
    
    render(<AddTodo onAdd={mockOnAdd} />)
    
    const input = screen.getByPlaceholderText(/add a new todo/i)
    const button = screen.getByRole('button', { name: /add/i })
    
    await user.type(input, '   ')
    await user.click(button)
    
    expect(mockOnAdd).not.toHaveBeenCalled()
  })

  it('should trim whitespace from input before submitting', async () => {
    const mockOnAdd = vi.fn()
    const user = userEvent.setup()
    
    render(<AddTodo onAdd={mockOnAdd} />)
    
    const input = screen.getByPlaceholderText(/add a new todo/i)
    const button = screen.getByRole('button', { name: /add/i })
    
    await user.type(input, '  New todo item  ')
    await user.click(button)
    
    expect(mockOnAdd).toHaveBeenCalledWith('New todo item')
  })
})