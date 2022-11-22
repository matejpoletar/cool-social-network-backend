const express = require("express");

const apiRouter = express.Router();

const userController = require("./controllers/userController");

apiRouter.get("/", (req, res) => res.send("Welcome to the Cool Social Network!"));

apiRouter.post("/register", userController.register);
apiRouter.post("/login", userController.login);
apiRouter.post("/checkToken", userController.checkToken);
apiRouter.post("/checkUsername", userController.checkIfUsernameExists);
apiRouter.post("/checkEmail", userController.checkIfEmailExists);
apiRouter.delete("/deleteAccount", userController.isLoggedIn, userController.deleteAccount);

module.exports = apiRouter;
