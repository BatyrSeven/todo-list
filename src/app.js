const form = document.getElementById('todo-form')
const input = document.getElementById('todo-input')
const deadlineInput = document.getElementById('todo-deadline')
const list = document.getElementById('todo-list')
const filterSelect = document.getElementById('todo-filter')
const sortSelect = document.getElementById('todo-sort')

let todos = JSON.parse(localStorage.getItem('todos')) || []

form.addEventListener('submit', (e) => {
    e.preventDefault()

    addTodo(input.value.trim())
    input.value = ''
})

filterSelect.addEventListener('change', renderTodos)
sortSelect.addEventListener('change', renderTodos)

function addTodo(text) {
    if (!text) return

    const deadline = deadlineInput.value || null

    const todo = {
        id: Date.now(),
        text,
        done: false,
        createdAt: new Date().toISOString(),
        deadline,
    }

    todos.push(todo)
    saveTodos()
    renderTodos()
    deadlineInput.value = ''
}

function toggleDone(id) {
    const todo = todos.find((todo) => todo.id === id)
    todo.done = !todo.done

    saveTodos()
    renderTodos()
}

function deleteTodo(id) {
    todos = todos.filter((todo) => todo.id !== id)

    saveTodos()
    renderTodos()
}

function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos))
}

function getFilteredTodos() {
    let filtered = [...todos]

    const filter = filterSelect.value

    if (filter === 'done') {
        filtered = filtered.filter((todo) => todo.done)
    } else if (filter === 'not-done') {
        filtered = filtered.filter((todo) => !todo.done)
    }

    const sort = sortSelect.value
    if (sort === 'created') {
        filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    } else if (sort === 'status') {
        filtered.sort((a, b) => a.done - b.done)
    } else if (sort === 'deadline') {
        filtered.sort((a, b) => {
            if (!a.deadline) return 1
            if (!b.deadline) return -1
            return new Date(a.deadline) - new Date(b.deadline)
        })
    }

    return filtered
}

function renderTodos() {
    list.innerHTML = ''

    const filteredTodos = getFilteredTodos()

    filteredTodos.forEach((todo) => {
        const li = document.createElement('li')
        li.className = todo.done ? 'done' : ''

        li.innerHTML = `
          <div class="todo-content">
            <span>${todo.text}</span>
            ${todo.deadline ? `<div class="deadline">${todo.deadline}</div>` : ''}
          </div>
          <div class="todo-controls">
            <button class="btn btn-done">✔</button>
            <button class="btn btn-delete">✖</button>
          </div>
        `

        li.querySelector('.btn-done').addEventListener('click', () =>
            toggleDone(todo.id)
        )

        li.querySelector('.btn-delete').addEventListener('click', () =>
            deleteTodo(todo.id)
        )

        list.appendChild(li)
    })
}

renderTodos()
