const express = require('express');
const fs = require('fs');

const users = [{
    id: 1,
    name: "Jane Doe",
    age: "22",
},
{
    id: 2,
    name: "John Doe",
    age: "31",
}];

// Create a service (the app object is just a callback).
const app = express();

app.listen(3000, () => {
    console.log(`Server running on port 3000`);
});

app.post('/create', (req, res) =>{
    if (!Object.keys(req.body).length) {
        return res.status(400).json({
            message: "Request body cannot be empty",
        });
    }
    const{ name, age } = req.body;
    if (!name || !age) {
        res.status(400).json({
            message: "Ensure you sent both name and age",
        });

    }
    const newUser = {
        id: users.length + 1,
        name,
        age,
    };
    try {
        users.push(newUser);
        res.status(201).json({
            message: "Successfully created a new user",
        });
    }catch(error){
        res.status(500).json({
            message: "Failed to create user",
        });
    }
});
app.get('/users', (req, res) => {
    try{
        res.status(200).json({
            users
        });
    }catch(error){
        res.status(500).json({
            message: "Failed to retrieve all users",
        });
    }
});
app.get('/user/:userID', (req, res) => {
    // Returns a user by ID
});
app.put('/user/:userID', (req, res) => {
    // Update a user by ID
});
app.delete('/delete/:userID', (req, res) => {
    // Delete a user by ID
});
app.delete('/users', (req, res) => {
    // Delete all users
});
