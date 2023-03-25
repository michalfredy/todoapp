const express = require('express');
const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const Task = require('../models/task');

const app = express();

app.use(express.json());

// Get all tasks
app.get('/api/tasks', async (req, res) => {
  try {
    const tasks = await Task.find({});
    res.status(200).send(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
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
    console.error('Error creating task:', error);
    res.status(500).send({ message: 'Failed to create task' });
  }
});

// Export as a serverless function
module.exports = (req, res) => {
  const parsedUrl = parse(req.url, true);
  const { pathname, query } = parsedUrl;

  if (pathname.startsWith('/api/tasks')) {
    app(req, res, parsedUrl);
  } else {
    res.status(404).send({ message: 'Not found' });
  }
};
