const taskInput = document.getElementById('taskInput');
const addTaskForm = document.getElementById('addTaskForm');
const taskList = document.getElementById('taskList');

// Fetch tasks from the API
function fetchTasks() {
  console.log('Fetching tasks...');
  fetch('/api/tasks')
    .then(response => {
      if (!response.ok) {
        return response.json().then(error => {
          throw new Error(error.error);
        });
      }
      return response.json();
    })
    .then(tasks => {
      console.log('Fetched tasks:', tasks);
      taskList.innerHTML = '';
      tasks.forEach(task => {
        const li = document.createElement('li');

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = task.completed;
        checkbox.addEventListener('click', () => {
          toggleTaskCompleted(task._id, !task.completed);
        });
        li.appendChild(checkbox);

        const span = document.createElement('span');
        span.textContent = task.title;
        li.appendChild(span);

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', () => {
          deleteTask(task._id);
        });

        li.appendChild(deleteButton);
        taskList.appendChild(li);
      });
    })
    .catch(error => {
      console.error('Error fetching tasks:', error.message);
      console.error('Error details:', error);
    });
}

// Add a new task
addTaskForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const taskDescription = taskInput.value.trim();
  if (!taskDescription) return;

  const newTask = { title: taskDescription };

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
  fetch(`/api/tasks/${taskId}`, {
    method: 'DELETE',
  })
    .then(response => {
      if (!response.ok) {
        return response.json().then(error => {
          throw new Error(error.error);
        });
      }
      return response.json();
    })
    .then(() => {
      fetchTasks(); // Fetch tasks after successfully deleting a task
    })
    .catch(error => {
      console.error('Error deleting task:', error.message);
      console.error('Error details:', error);
    });
}

// Toggle a task's completed status
function toggleTaskCompleted(taskId, completed) {
  fetch(`/api/tasks/${taskId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ completed })
  })
    .then(response => {
      if (!response.ok) {
        return response.json().then(error => {
          throw new Error(error.error);
        });
      }
      return response.json();
    })
    .then(() => {
      fetchTasks(); // Fetch tasks after successfully updating a task
    })
    .catch(error => {
      console.error('Error updating task:', error.message);
      console.error('Error details:', error);
    });
}

// Fetch tasks initially
fetchTasks();
