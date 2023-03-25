const express = require('express');
const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const Task = require('../models/task');

const app = express();

app.use(express.json());

// Delete a task
app.delete('/api/tasks/:id', async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.status(200).send({ message: 'Task deleted' });
  } catch (error) {
    res.status(500).send({ message: 'Failed to delete task' });
  }
});

// Update a task
app.put('/api/tasks/:id', async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).send(updatedTask);
  } catch (error) {
    res.status(500).send({ message: 'Failed to update task' });
  }
});

// Export as a serverless function
module.exports = (req, res) => {
  const parsedUrl = parse(req.url, true);
  const { pathname, query } = parsedUrl;

  if (pathname.startsWith('/api/tasks/')) {
    app(req, res, parsedUrl);
  } else {
    res.status(404).send({ message: 'Not found' });
  }
};
