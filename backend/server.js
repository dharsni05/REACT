const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const TodoModel = require("./models/todoList");
const UserModel = require("./models/user");

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://localhost:27017/todo");

mongoose.connection.on("error", (error) => {
  console.error("MongoDB connection error:", error);
});

app.get("/", (req, res) => {
  res.send("Backend server is running!");
});

// Signup 
app.post("/signup", (req, res) => {
  const { username, password } = req.body;

 
  UserModel.findOne({ username })
    .then(user => {
      if (user) {
    
        return res.status(400).json({ message: 'Username already exists' });
      } else {
       
        return UserModel.create({ username, password });
      }
    })
    .then(newUser => {
      if(newUser){
    
      return res.status(201).json({ message: 'Signup successful!', redirect: '/login' });
      }
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: 'Signup failed. Please try again later.' });
    });
});


// Login 
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  
  UserModel.findOne({ username, password })
    .then(user => {
      if (user) {
        
        res.json({ message: 'Login successful!', redirect: '/todo' });
      } else {
       
        res.status(401).json({ message: 'Login failed. Please check your credentials and try again.' });
      }
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: 'Login failed. Please try again later.' });
    });
});


app.get("/getTodoList", (req, res) => {
  TodoModel.find({})
    .then((todoList) => res.json(todoList))
    .catch((err) => res.json(err));
});

 
app.post("/addTodoList", async (req, res) => {
  try {
    const { task, status, deadline, priority } = req.body;
    const newTodo = new TodoModel({
      task,
      status,
      deadline,
      priority
    });
    await newTodo.save();
    res.json({ message: 'Task added successfully' });
  } catch (error) {
    console.error('Error adding task:', error);
    res.status(500).json({ error: 'Error adding task. Please try again.' });
  }
});


app.post("/updateTodoList/:id", (req, res) => {
  const id = req.params.id;
  const updateData = {
    task: req.body.task,
    status: req.body.status,
    deadline: req.body.deadline,
  };
  TodoModel.findByIdAndUpdate(id, updateData)
    .then((todo) => res.json(todo))
    .catch((err) => res.json(err));
});


app.delete("/deleteTodoList/:id", (req, res) => {
  const id = req.params.id;
  TodoModel.findByIdAndDelete(id)
    .then((todo) => res.json(todo))
    .catch((err) => res.json(err));
});

app.listen(3001, () => {
  console.log('Server running on port 3001');
});
