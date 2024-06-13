const express = require("express");
const argon2 = require("argon2");

const app = express();

const port = 3000;

// Middleware pour parser le JSON
app.use(express.json());

let users = [];

const initializeUsers = async () => {
  users = [
    { id: 1, name: "Alice", password: await argon2.hash("password1") },
    { id: 2, name: "Bob", password: await argon2.hash("password2") },
    { id: 3, name: "Charlie", password: await argon2.hash("password3") },
  ];
};

// Route pour récupérer tous les utilisateurs
app.get("/users", (req, res) => {
  res.json(users);
});

// Route pour récupérer un utilisateur spécifique par ID
app.get("/users/:id", (req, res) => {
  const userId = parseInt(req.params.id);
  const user = users.find((u) => u.id === userId);
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ message: "User not found" });
  }
});

// Route pour créer un nouvel utilisateur
app.post("/users", async (req, res) => {
  try {
    const hashedPassword = await argon2.hash(req.body.password);
    const newUser = {
      id: users.length + 1, // Normalement en AUTO-INCREMENT
      name: req.body.name,
      password: hashedPassword,
    };
    users.push(newUser);
    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json("Error creating user");
  }
});

// Route pour mettre à jour un utilisateur existant
app.put("/users/:id", async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const user = users.find((u) => u.id === userId);
    if (user) {
      user.name = req.body.name;
      user.password = await argon2.hash(req.body.password);
      res.json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    res.status(500).json("Error updating user");
  }
});

// Route pour supprimer un utilisateur existant
app.delete("/users/:id", (req, res) => {
  const userId = parseInt(req.params.id);
  const userIndex = users.findIndex((u) => u.id === userId);
  if (userIndex !== -1) {
    users.splice(userIndex, 1);
    res.status(204).send();
  } else {
    res.status(404).json({ message: "User not found" });
  }
});

const startServer = async () => {
  await initializeUsers();
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
};

// Lancer le serveur
startServer();
