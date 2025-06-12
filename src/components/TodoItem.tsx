import type { Todo } from '@/types/todo'

interface TodoItemProps {
  todo: Todo
  onToggle: (id: string) => void
  onDelete: (id: string) => void
}

export function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
  return (
    <div className="flex items-center gap-3 p-3 border rounded-lg bg-white shadow-sm">
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
      />
      <span
        className={`flex-1 ${
          todo.completed ? 'line-through text-gray-500' : 'text-gray-900'
        }`}
      >
        {todo.text}
      </span>
      <button
        onClick={() => onDelete(todo.id)}
        className="px-3 py-1 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
        aria-label="Delete todo"
      >
        Delete
      </button>
    </div>
  )
}