const express = require("express");

const apiRouter = express.Router();

const userController = require("./controllers/userController");

apiRouter.get("/", (req, res) => res.send("Welcome to the Cool Social Network!"));

apiRouter.post("/register", userController.register);
apiRouter.post("/login", userController.login);

module.exports = apiRouter;
