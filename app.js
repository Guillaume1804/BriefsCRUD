const express = require('express');

const app = express();

const port = 3000;


// Middleware pour parser le JSON
app.use(express.json());


let users = [
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' },
    { id: 3, name: 'Charlie' }
];



// Route pour récupérer tous les utilisateurs
app.get('/users', (req, res) => {
    res.json(users);
});

// Route pour récupérer un utilisateur spécifique par ID
app.get("/users/:id", (req, res) => {
    const userId = parseInt(req.params.id);
    const user = users.find(u => u.id === userId);
    if(user) {
        res.json(user);
    }
    else {
        res.status(404).json({ message: "User not found" });
    }
});

// Route pour créer un nouvel utilisateur
app.post("/users", (req, res) => {
    const newUser = {
        id: users.length + 1, // Normalement en AUTO-INCREMENT
        name: req.body.name
    };
    users.push(newUser);
    res.status(201).json(newUser);
});

// Route pour mettre à jour un utilisateur existant
app.put("/users/:id", (req, res) => {
    const userId = parseInt(req.params.id);
    const user = users.find(u => u.id === userId);
    if (user) {
        user.name = req.body.name;
        res.json(user);
    }
    else {
        res.status(404).json({ message: "User not found" });
    }
});


// Route pour supprimer un utilisateur existant
app.delete("/users/:id", (req, res) => {
    const userId = parseInt(req.params.id);
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex !== -1) {
        users.splice(userIndex, 1);
        res.status(204).send();
    }
    else {
        res.status(404).json({ message: "User not found" });
    }
});


// Lancer le serveur
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
