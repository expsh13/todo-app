import { test, expect } from '@playwright/test'

test.describe('Todo App E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should display the main heading', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /todo app/i })).toBeVisible()
  })

  test('should display add todo form', async ({ page }) => {
    await expect(page.getByPlaceholder(/add a new todo/i)).toBeVisible()
    await expect(page.getByRole('button', { name: /add/i })).toBeVisible()
  })

  test('should display empty state initially', async ({ page }) => {
    await expect(page.getByText(/no todos yet/i)).toBeVisible()
  })

  test('should add a new todo', async ({ page }) => {
    const input = page.getByPlaceholder(/add a new todo/i)
    const addButton = page.getByRole('button', { name: /add/i })

    await input.fill('Buy groceries')
    await addButton.click()

    await expect(page.getByText('Buy groceries')).toBeVisible()
    await expect(page.getByText(/no todos yet/i)).not.toBeVisible()
    await expect(input).toHaveValue('')
  })

  test('should add multiple todos', async ({ page }) => {
    const input = page.getByPlaceholder(/add a new todo/i)
    const addButton = page.getByRole('button', { name: /add/i })

    const todos = ['Buy groceries', 'Walk the dog', 'Read a book']

    for (const todo of todos) {
      await input.fill(todo)
      await addButton.click()
    }

    for (const todo of todos) {
      await expect(page.getByText(todo)).toBeVisible()
    }

    await expect(page.getByRole('checkbox')).toHaveCount(3)
  })

  test('should add todo with Enter key', async ({ page }) => {
    const input = page.getByPlaceholder(/add a new todo/i)

    await input.fill('Learn Playwright')
    await input.press('Enter')

    await expect(page.getByText('Learn Playwright')).toBeVisible()
    await expect(input).toHaveValue('')
  })

  test('should not add empty todo', async ({ page }) => {
    const addButton = page.getByRole('button', { name: /add/i })

    await addButton.click()

    await expect(page.getByText(/no todos yet/i)).toBeVisible()
  })

  test('should not add todo with only whitespace', async ({ page }) => {
    const input = page.getByPlaceholder(/add a new todo/i)
    const addButton = page.getByRole('button', { name: /add/i })

    await input.fill('   ')
    await addButton.click()

    await expect(page.getByText(/no todos yet/i)).toBeVisible()
  })

  test('should toggle todo completion', async ({ page }) => {
    const input = page.getByPlaceholder(/add a new todo/i)
    const addButton = page.getByRole('button', { name: /add/i })

    await input.fill('Complete this task')
    await addButton.click()

    const checkbox = page.getByRole('checkbox')
    const todoText = page.getByText('Complete this task')

    await expect(checkbox).not.toBeChecked()
    await expect(todoText).not.toHaveClass(/line-through/)

    await checkbox.click()

    await expect(checkbox).toBeChecked()
    await expect(todoText).toHaveClass(/line-through/)

    await checkbox.click()

    await expect(checkbox).not.toBeChecked()
    await expect(todoText).not.toHaveClass(/line-through/)
  })

  test('should delete a todo', async ({ page }) => {
    const input = page.getByPlaceholder(/add a new todo/i)
    const addButton = page.getByRole('button', { name: /add/i })

    await input.fill('Delete me')
    await addButton.click()

    await expect(page.getByText('Delete me')).toBeVisible()

    const deleteButton = page.getByRole('button', { name: /delete/i })
    await deleteButton.click()

    await expect(page.getByText('Delete me')).not.toBeVisible()
    await expect(page.getByText(/no todos yet/i)).toBeVisible()
  })

  test('should manage multiple todos independently', async ({ page }) => {
    const input = page.getByPlaceholder(/add a new todo/i)
    const addButton = page.getByRole('button', { name: /add/i })

    await input.fill('First todo')
    await addButton.click()

    await input.fill('Second todo')
    await addButton.click()

    await input.fill('Third todo')
    await addButton.click()

    const checkboxes = page.getByRole('checkbox')
    const deleteButtons = page.getByRole('button', { name: /delete/i })

    await checkboxes.nth(1).click()

    await expect(checkboxes.nth(0)).not.toBeChecked()
    await expect(checkboxes.nth(1)).toBeChecked()
    await expect(checkboxes.nth(2)).not.toBeChecked()

    await deleteButtons.nth(0).click()

    await expect(page.getByText('First todo')).not.toBeVisible()
    await expect(page.getByText('Second todo')).toBeVisible()
    await expect(page.getByText('Third todo')).toBeVisible()

    await expect(page.getByRole('checkbox')).toHaveCount(2)
  })

  test('should preserve state during user interactions', async ({ page }) => {
    const input = page.getByPlaceholder(/add a new todo/i)
    const addButton = page.getByRole('button', { name: /add/i })

    await input.fill('Persistent todo')
    await addButton.click()

    const checkbox = page.getByRole('checkbox')
    await checkbox.click()

    await expect(checkbox).toBeChecked()
    await expect(page.getByText('Persistent todo')).toHaveClass(/line-through/)

    await input.fill('Another todo')
    await addButton.click()

    await expect(page.getByRole('checkbox').nth(0)).toBeChecked()
    await expect(page.getByRole('checkbox').nth(1)).not.toBeChecked()
    await expect(page.getByText('Persistent todo')).toHaveClass(/line-through/)
    await expect(page.getByText('Another todo')).not.toHaveClass(/line-through/)
  })
})