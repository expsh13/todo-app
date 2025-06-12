'use client'

import { useState } from 'react'
import { AddTodo } from '@/components/AddTodo'
import { TodoList } from '@/components/TodoList'
import type { Todo } from '@/types/todo'

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([])

  const addTodo = (text: string) => {
    const newTodo: Todo = {
      id: crypto.randomUUID(),
      text,
      completed: false,
      createdAt: new Date()
    }
    setTodos(prev => [...prev, newTodo])
  }

  const toggleTodo = (id: string) => {
    setTodos(prev =>
      prev.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    )
  }

  const deleteTodo = (id: string) => {
    setTodos(prev => prev.filter(todo => todo.id !== id))
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Todo App
        </h1>
        
        <AddTodo onAdd={addTodo} />
        
        <TodoList
          todos={todos}
          onToggle={toggleTodo}
          onDelete={deleteTodo}
        />
      </div>
    </div>
  )
}