const form = document.getElementById('todo-form')
const input = document.getElementById('todo-input')
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
    const todo = {
        id: Date.now(),
        text,
        done: false,
        createdAt: new Date().toISOString(),
    }
    todos.push(todo)

    saveTodos()
    renderTodos()
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
          <span>${todo.text}</span>
          <div>
            <button class="done-btn">✔</button>
            <button class="delete-btn">✖</button>
          </div>
        `

        li.querySelector('.done-btn').addEventListener('click', () =>
            toggleDone(todo.id)
        )

        li.querySelector('.delete-btn').addEventListener('click', () =>
            deleteTodo(todo.id)
        )

        list.appendChild(li)
    })
}

renderTodos()
