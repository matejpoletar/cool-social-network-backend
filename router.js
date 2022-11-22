const express = require("express");

const apiRouter = express.Router();

const userController = require("./controllers/userController");
const postController = require("./controllers/postController");

apiRouter.get("/", (req, res) => res.send("Welcome to the Cool Social Network!"));

apiRouter.post("/register", userController.register);
apiRouter.post("/login", userController.login);
apiRouter.post("/check-token", userController.checkToken);
apiRouter.post("/check-username", userController.checkIfUsernameExists);
apiRouter.post("/check-email", userController.checkIfEmailExists);
apiRouter.delete("/delete-account", userController.isLoggedIn, userController.deleteAccount);

apiRouter.post("/post", userController.isLoggedIn, postController.createPost);
apiRouter.post("/post/:id/update", userController.isLoggedIn, postController.updatePost);
apiRouter.delete("/post/:id/delete", userController.isLoggedIn, postController.deletePost);
apiRouter.get("/post/:id", postController.getPostById);

module.exports = apiRouter;
