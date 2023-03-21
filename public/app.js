const taskInput = document.getElementById('taskInput');
const addTaskForm = document.getElementById('addTaskForm');
const taskList = document.getElementById('taskList');

// Fetch tasks from the API
function fetchTasks() {
  fetch('/api/tasks')
    .then(response => response.json())
    .then(tasks => {
      taskList.innerHTML = '';
      tasks.forEach(task => {
        const li = document.createElement('li');
        li.textContent = task.description;

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', () => {
          deleteTask(task._id);
        });

        li.appendChild(deleteButton);
        taskList.appendChild(li);
      });
    });
}

// Add a new task
addTaskForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const taskDescription = taskInput.value.trim();
  if (!taskDescription) return;

  const newTask = { description: taskDescription };

  fetch('/api/tasks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newTask)
  })
    .then(response => response.json())
    .then(task => {
      taskInput.value = '';
      fetchTasks();
    });
});

// Delete a task
function deleteTask(taskId) {
  fetch(`/api/tasks/${taskId}`, { method: 'DELETE' })
    .then(response => response.json())
    .then(result => {
      if (result.success) {
        fetchTasks();
      }
    });
}

// Fetch tasks initially
fetchTasks();
