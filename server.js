require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const Task = require('./models/task');
const path = require('path');

app.use((req, res, next) => {
    if (req.url.endsWith('.css')) {
      res.setHeader('Content-Type', 'text/css');
    }
    next();
  });
  
app.use(express.static(path.join(__dirname, 'public')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.use(express.static('public'));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  

mongoose.connection.on('error', err => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('connected', () => {
  console.log('MongoDB connected');
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});


app.use(express.json());

// Get all tasks
app.get('/api/tasks', async (req, res) => {
    try {
      const tasks = await Task.find({});
      res.status(200).send(tasks);
    } catch (error) {
      console.error('Error fetching tasks:', error); // Add this line
      res.status(500).send({ message: 'Failed to fetch tasks' });
    }
  });
  
// Add a new task
app.post('/api/tasks', async (req, res) => {
    try {
      const newTask = new Task(req.body);
      await newTask.save();
      res.status(201).send(newTask);
    } catch (error) {
      console.error('Error creating task:', error); // Add this line
      res.status(500).send({ message: 'Failed to create task' });
    }
  });
  

// Delete a task
app.delete('/api/tasks/:id', async (req, res) => {
    try {
      await Task.findByIdAndDelete(req.params.id);
      res.status(200).send({ message: 'Task deleted' });
    } catch (error) {
      res.status(500).send({ message: 'Failed to delete task' });
    }
  });

  // PUT: Update a task
app.put('/api/tasks/:id', async (req, res) => {
    try {
      const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.status(200).send(updatedTask);
    } catch (error) {
      res.status(500).send({ message: 'Failed to update task' });
    }
  });