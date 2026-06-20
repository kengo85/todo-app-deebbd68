// Todoデータの管理
let todos = JSON.parse(localStorage.getItem('todos')) || [];
let currentFilter = 'all';

// 初期化
document.addEventListener('DOMContentLoaded', () => {
    renderTodos();
    document.getElementById('todoInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTodo();
    });
});

// Todo追加
function addTodo() {
    const input = document.getElementById('todoInput');
    const text = input.value.trim();
    if (!text) {
        input.focus();
        input.style.borderColor = '#e74c3c';
        setTimeout(() => input.style.borderColor = '', 500);
        return;
    }

    todos.push({
        id: Date.now(),
        text: text,
        completed: false,
        createdAt: new Date().toISOString()
    });

    input.value = '';
    input.focus();
    saveTodos();
    renderTodos();
}

// Todo完了/未完了の切り替え
function toggleTodo(id) {
    const todo = todos.find(t => t.id === id);
    if (todo) {
        todo.completed = !todo.completed;
        saveTodos();
        renderTodos();
    }
}

// Todo削除
function deleteTodo(id) {
    const li = document.querySelector(`[data-id="${id}"]`);
    if (li) {
        li.style.transform = 'translateX(100px)';
        li.style.opacity = '0';
        setTimeout(() => {
            todos = todos.filter(t => t.id !== id);
            saveTodos();
            renderTodos();
        }, 300);
    }
}

// フィルター切り替え
function filterTodos(filter) {
    currentFilter = filter;
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.filter === filter);
    });
    renderTodos();
}

// 完了済み削除
function clearCompleted() {
    todos = todos.filter(t => !t.completed);
    saveTodos();
    renderTodos();
}

// 描画
function renderTodos() {
    const list = document.getElementById('todoList');
    const emptyMessage = document.getElementById('emptyMessage');
    const stats = document.getElementById('stats');

    let filteredTodos = todos;
    if (currentFilter === 'active') {
        filteredTodos = todos.filter(t => !t.completed);
    } else if (currentFilter === 'completed') {
        filteredTodos = todos.filter(t => t.completed);
    }

    list.innerHTML = '';

    filteredTodos.forEach(todo => {
        const li = document.createElement('li');
        li.dataset.id = todo.id;
        li.className = todo.completed ? 'completed' : '';
        li.style.transition = 'transform 0.3s, opacity 0.3s';
        li.innerHTML = `
            <div class="todo-checkbox" onclick="toggleTodo(${todo.id})"></div>
            <span class="todo-text">${escapeHtml(todo.text)}</span>
            <button class="delete-btn" onclick="deleteTodo(${todo.id})" title="削除">✕</button>
        `;
        list.appendChild(li);
    });

    // 統計
    const activeCount = todos.filter(t => !t.completed).length;
    const completedCount = todos.filter(t => t.completed).length;
    stats.textContent = `残り ${activeCount} 件 / 完了 ${completedCount} 件`;

    // 空メッセージ
    emptyMessage.classList.toggle('show', filteredTodos.length === 0);
}

// LocalStorageに保存
function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

// XSS対策
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
