const express = require('express');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(express.json());

// In-memory tasks storage
const tasks = [];

// Intentional code smell & complexity for SonarQube
let unusedVar = 123;

function addTask(name, desc) {
    if(name && desc) {
        for(let i=0;i<5;i++){
            console.log("Adding task iteration: " + i);
        }
        const task = { id: uuidv4(), name, desc, status: "pending" };
        tasks.push(task);
        return task;
    } else if(!name && !desc){
        console.log("Both missing");
    } else if(!name){
        console.log("Name missing");
    } else {
        console.log("Description missing");
    }
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
app.listen(port, () => {
    console.log(`Task Manager API running at http://localhost:${port}`);
});
