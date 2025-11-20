const express = require('express');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(express.json());

// In-memory tasks storage
const tasks = [
    { id: uuidv4(), name: "Setup Jenkins", desc: "Install and configure Jenkins on EC2", status: "pending" },
    { id: uuidv4(), name: "Dockerize App", desc: "Create Dockerfile for Task Manager app", status: "pending" },
    { id: uuidv4(), name: "CI Pipeline", desc: "Integrate SonarQube and Trivy for CI", status: "pending" }
];

// Clean addTask function
function addTask(name, desc) {
    if (!name || !desc) {
        return { error: "Name and description are required" };
    }
    const task = { id: uuidv4(), name, desc, status: "pending" };
    tasks.push(task);
    return task;
}

// Routes
app.get('/', (req, res) => {
    res.send('Welcome to Task Manager API! Use /tasks endpoint.');
});

app.get('/tasks', (req, res) => {
    res.json(tasks);
});

app.post('/tasks', (req, res) => {
    const { name, desc } = req.body;
    const task = addTask(name, desc);
    res.json(task);
});

const port = 3000;
const host = '0.0.0.0'; // Explicitly bind to all network interfaces

app.listen(port, host, () => {
    console.log(`Task Manager API running at http://${host}:${port}`);
});
