const express = require("express");
const { findById } = require("./user-model");
const User = require("./user-model");
const server = express();

server.use(express.json());

server.post("/api/users", async (req, res) => {
  const user = req.body;

  if (!user.name || !user.bio) {
    res
      .status(400)
      .json({ message: "Please provide name and bio for the user." });
  } else {
    //save user to the database
    try {
      const createdUser = await User.create(user);
      res.status(201).json(createdUser);
    } catch (err) {
      res.status(500).json({
        errorMessage:
          "There was an error while saving the user to the database",
      });
    }
  }
});

server.get("/api/users", async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(201).json(users);
  } catch (err) {
    res.status(500).json({
      errorMessage: "The users information could not be retrieved.",
    });
  }
});

server.get("/api/users/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) {
      res
        .status(404)
        .json({ message: "The user with the specified ID does not exist." });
    } else {
      res.status(200).json(user);
    }
  } catch (err) {
    res.status(500).json({
      errorMessage: "The users information could not be retrieved.",
    });
  }
});

server.delete("/api/users/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.delete(id);
    if (!user) {
      res
        .status(404)
        .json({ message: "The user with the specified ID does not exist." });
    } else {
      res.status(200).json(user);
    }
  } catch (err) {
    res.status(500).json({
      errorMessage: "The user could not be removed",
    });
  }
});

server.put("/api/users/:id", async (req, res) => {
  const { id } = req.params;
  const changes = req.body;

  if (!changes.name || !changes.bio) {
    res
      .status(400)
      .json({ message: "Please provide name and bio for the user." });
  } else {
    //save user to the database
    try {
      const updatedUser = await User.update(id, changes);
      if (!updatedUser) {
        res
          .status(404)
          .json({ message: "The user with the specified ID does not exist." });
      } else {
        res.status(200).json(updatedUser);
      }
    } catch (err) {
      res.status(500).json({
        errorMessage: "The user information could not be modified.",
      });
    }
  }
});

module.exports = server;
