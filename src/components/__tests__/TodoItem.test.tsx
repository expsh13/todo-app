import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TodoItem } from '../TodoItem'
import type { Todo } from '@/types/todo'

const mockTodo: Todo = {
  id: '1',
  text: 'Test todo',
  completed: false,
  createdAt: new Date('2023-01-01')
}

describe('TodoItem', () => {
  it('should render todo text', () => {
    const mockOnToggle = vi.fn()
    const mockOnDelete = vi.fn()
    
    render(
      <TodoItem 
        todo={mockTodo} 
        onToggle={mockOnToggle} 
        onDelete={mockOnDelete} 
      />
    )
    
    expect(screen.getByText('Test todo')).toBeInTheDocument()
  })

  it('should call onToggle when checkbox is clicked', async () => {
    const mockOnToggle = vi.fn()
    const mockOnDelete = vi.fn()
    const user = userEvent.setup()
    
    render(
      <TodoItem 
        todo={mockTodo} 
        onToggle={mockOnToggle} 
        onDelete={mockOnDelete} 
      />
    )
    
    const checkbox = screen.getByRole('checkbox')
    await user.click(checkbox)
    
    expect(mockOnToggle).toHaveBeenCalledWith('1')
  })

  it('should call onDelete when delete button is clicked', async () => {
    const mockOnToggle = vi.fn()
    const mockOnDelete = vi.fn()
    const user = userEvent.setup()
    
    render(
      <TodoItem 
        todo={mockTodo} 
        onToggle={mockOnToggle} 
        onDelete={mockOnDelete} 
      />
    )
    
    const deleteButton = screen.getByRole('button', { name: /delete/i })
    await user.click(deleteButton)
    
    expect(mockOnDelete).toHaveBeenCalledWith('1')
  })

  it('should display completed state correctly', () => {
    const completedTodo: Todo = { ...mockTodo, completed: true }
    const mockOnToggle = vi.fn()
    const mockOnDelete = vi.fn()
    
    render(
      <TodoItem 
        todo={completedTodo} 
        onToggle={mockOnToggle} 
        onDelete={mockOnDelete} 
      />
    )
    
    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).toBeChecked()
    
    const text = screen.getByText('Test todo')
    expect(text).toHaveClass('line-through')
  })

  it('should display active state correctly', () => {
    const mockOnToggle = vi.fn()
    const mockOnDelete = vi.fn()
    
    render(
      <TodoItem 
        todo={mockTodo} 
        onToggle={mockOnToggle} 
        onDelete={mockOnDelete} 
      />
    )
    
    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).not.toBeChecked()
    
    const text = screen.getByText('Test todo')
    expect(text).not.toHaveClass('line-through')
  })
})