const express = require("express");

const apiRouter = express.Router();

apiRouter.get("/", (req, res) => res.send("Welcome to the Cool Social Network!"));

module.exports = apiRouter;
