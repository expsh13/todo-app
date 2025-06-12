import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TodoList } from '../TodoList'
import type { Todo } from '@/types/todo'

const mockTodos: Todo[] = [
  {
    id: '1',
    text: 'First todo',
    completed: false,
    createdAt: new Date('2023-01-01')
  },
  {
    id: '2',
    text: 'Second todo',
    completed: true,
    createdAt: new Date('2023-01-02')
  },
  {
    id: '3',
    text: 'Third todo',
    completed: false,
    createdAt: new Date('2023-01-03')
  }
]

describe('TodoList', () => {
  it('should render all todos', () => {
    const mockOnToggle = vi.fn()
    const mockOnDelete = vi.fn()
    
    render(
      <TodoList 
        todos={mockTodos} 
        onToggle={mockOnToggle} 
        onDelete={mockOnDelete} 
      />
    )
    
    expect(screen.getByText('First todo')).toBeInTheDocument()
    expect(screen.getByText('Second todo')).toBeInTheDocument()
    expect(screen.getByText('Third todo')).toBeInTheDocument()
  })

  it('should display empty state when no todos', () => {
    const mockOnToggle = vi.fn()
    const mockOnDelete = vi.fn()
    
    render(
      <TodoList 
        todos={[]} 
        onToggle={mockOnToggle} 
        onDelete={mockOnDelete} 
      />
    )
    
    expect(screen.getByText(/no todos yet/i)).toBeInTheDocument()
  })

  it('should call onToggle when todo is toggled', async () => {
    const mockOnToggle = vi.fn()
    const mockOnDelete = vi.fn()
    const user = userEvent.setup()
    
    render(
      <TodoList 
        todos={mockTodos} 
        onToggle={mockOnToggle} 
        onDelete={mockOnDelete} 
      />
    )
    
    const checkboxes = screen.getAllByRole('checkbox')
    await user.click(checkboxes[0])
    
    expect(mockOnToggle).toHaveBeenCalledWith('1')
  })

  it('should call onDelete when todo is deleted', async () => {
    const mockOnToggle = vi.fn()
    const mockOnDelete = vi.fn()
    const user = userEvent.setup()
    
    render(
      <TodoList 
        todos={mockTodos} 
        onToggle={mockOnToggle} 
        onDelete={mockOnDelete} 
      />
    )
    
    const deleteButtons = screen.getAllByRole('button', { name: /delete/i })
    await user.click(deleteButtons[0])
    
    expect(mockOnDelete).toHaveBeenCalledWith('1')
  })

  it('should display correct completed state for each todo', () => {
    const mockOnToggle = vi.fn()
    const mockOnDelete = vi.fn()
    
    render(
      <TodoList 
        todos={mockTodos} 
        onToggle={mockOnToggle} 
        onDelete={mockOnDelete} 
      />
    )
    
    const checkboxes = screen.getAllByRole('checkbox')
    expect(checkboxes[0]).not.toBeChecked() // First todo
    expect(checkboxes[1]).toBeChecked()     // Second todo (completed)
    expect(checkboxes[2]).not.toBeChecked() // Third todo
  })
})