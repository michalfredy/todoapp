const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://Fredy:Crikvenica@clusterfredy.bdqixna.mongodb.net/test";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

let db;

client.connect(err => {
  if (err) {
    console.error('Error connecting to MongoDB:', err);
    return;
  }
  console.log('Connected to MongoDB');
  db = client.db('todo-app');
});

app.use(express.json());

// Get all tasks
app.get('/api/tasks', (req, res) => {
  db.collection('tasks').find({}).toArray((err, tasks) => {
    if (err) {
      res.status(500).json({ error: 'Error fetching tasks' });
      return;
    }
    res.json(tasks);
  });
});

// Add a new task
app.post('/api/tasks', (req, res) => {
  const task = req.body;

  db.collection('tasks').insertOne(task, (err, result) => {
    if (err) {
      res.status(500).json({ error: 'Error adding task' });
      return;
    }
    res.json(result.ops[0]);
  });
});

// Delete a task
app.delete('/api/tasks/:id', (req, res) => {
  const taskId = req.params.id;
  const objectId = new require('mongodb').ObjectID(taskId);

  db.collection('tasks').deleteOne({ _id: objectId }, (err, result) => {
    if (err) {
      res.status(500).json({ error: 'Error deleting task' });
      return;
    }
    res.json({ success: true });
  });
});
