function toggleTheme() {
    const body = document.body;
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) {
    const themeButton = document.querySelector('[onclick="toggleTheme()"]');
    if (themeButton) {
        const svg = themeButton.querySelector('svg');
        if (theme === 'dark') {
            svg.innerHTML = `<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>`;
        } else {
            svg.innerHTML = `
                <circle cx="12" cy="12" r="5"/>
                <line x1="12" y1="1" x2="12" y2="3"/>
                <line x1="12" y1="21" x2="12" y2="23"/>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                <line x1="1" y1="12" x2="3" y2="12"/>
                <line x1="21" y1="12" x2="23" y2="12"/>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
            `;
        }
    }
}

function initializeTheme() {
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = savedTheme || (systemPrefersDark ? 'dark' : 'light');

    document.body.setAttribute('data-theme', theme);
    updateThemeIcon(theme);

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            const newTheme = e.matches ? 'dark' : 'light';
            document.body.setAttribute('data-theme', newTheme);
            updateThemeIcon(newTheme);
        }
    });
}

function toggleMobileNav() {
    const toggle = document.querySelector('.mobile-nav-toggle');
    const sidebar = document.querySelector('.sidebar');

    if (toggle && sidebar) {
        toggle.classList.toggle('active');
        sidebar.classList.toggle('show');

        if (sidebar.classList.contains('show')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }
}

let taskList = [
    "Review Sarah's design mockups",
    "Update project timeline",
    "Send client feedback email",
    "Prepare presentation slides",
    "Review Q3 campaign metrics"
];

let completedTasks = [];
let visibleStartIndex = 0;

function initializeTaskManager() {
    updateTaskDisplay();
}

function addNewTask() {
    const newTask = prompt("Enter a new task:");
    if (newTask && newTask.trim()) {
        taskList.push(newTask.trim());
        updateTaskDisplay();
    }
}

function completeTask(taskIndex) {
    const actualIndex = visibleStartIndex + taskIndex;
    const task = taskList[actualIndex];

    completedTasks.push(task);
    taskList.splice(actualIndex, 1);
    updateTaskDisplay();
    showTaskCompleteMessage(task);
}

function updateTaskDisplay() {
    const tasksList = document.getElementById('tasksList');
    if (!tasksList) return;

    tasksList.innerHTML = '';
    const visibleTasks = taskList.slice(visibleStartIndex, visibleStartIndex + 3);

    visibleTasks.forEach((task, index) => {
        const taskElement = document.createElement('div');
        taskElement.className = 'win-item';
        taskElement.setAttribute('data-task', index);

        taskElement.innerHTML = `
            <input type="checkbox" id="win${index}" onchange="completeTask(${index})">
            <label for="win${index}">${task}</label>
        `;

        tasksList.appendChild(taskElement);
    });

    while (tasksList.children.length < 3 && taskList.length > visibleStartIndex + tasksList.children.length) {
        const taskElement = document.createElement('div');
        taskElement.className = 'win-item empty';
        taskElement.innerHTML = '<span class="empty-slot">+ Add more tasks</span>';
        tasksList.appendChild(taskElement);
    }
}

function showTaskCompleteMessage(taskName) {
    const notification = document.createElement('div');
    notification.className = 'task-complete-notification';
    notification.innerHTML = `<span>✓ Completed: ${taskName}</span>`;

    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--success);
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 600;
        z-index: 9999;
        animation: slideIn 0.3s ease, slideOut 0.3s ease 2.7s;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 3000);
}

const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    .empty-slot {
        color: var(--text-secondary);
        font-style: italic;
        font-size: 13px;
    }
`;
document.head.appendChild(style);

window.addNewTask = addNewTask;
window.completeTask = completeTask;
window.toggleTheme = toggleTheme;

document.addEventListener('DOMContentLoaded', function () {
    initializeTheme();
    initializeTaskManager();

    const mobileToggle = document.querySelector('.mobile-nav-toggle');
    if (mobileToggle) {
        mobileToggle.addEventListener('click', toggleMobileNav);
    }

    document.addEventListener('click', function (e) {
        const sidebar = document.querySelector('.sidebar');
        const toggle = document.querySelector('.mobile-nav-toggle');

        if (sidebar && toggle &&
            !sidebar.contains(e.target) &&
            !toggle.contains(e.target) &&
            sidebar.classList.contains('show')) {
            toggleMobileNav();
        }
    });

    window.addEventListener('resize', function () {
        if (window.innerWidth > 768) {
            const sidebar = document.querySelector('.sidebar');
            const toggle = document.querySelector('.mobile-nav-toggle');

            if (sidebar && toggle) {
                sidebar.classList.remove('show');
                toggle.classList.remove('active');
                document.body.style.overflow = '';
            }
        }
    });
});
