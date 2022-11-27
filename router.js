const express = require("express");

const apiRouter = express.Router();

const cors = require("cors");
apiRouter.use(cors());

const userController = require("./controllers/userController");
const postController = require("./controllers/postController");
const followController = require("./controllers/followController");

apiRouter.get("/", (req, res) => res.send("Welcome to the Cool Social Network!"));

apiRouter.post("/register", userController.register);
apiRouter.post("/login", userController.login);
apiRouter.post("/check-token", userController.checkToken);
apiRouter.post("/check-username", userController.checkIfUsernameExists);
apiRouter.post("/check-email", userController.checkIfEmailExists);
apiRouter.delete("/delete-account", userController.isLoggedIn, userController.deleteAccount);

apiRouter.post("/post", userController.isLoggedIn, postController.createPost);
apiRouter.get("/post/:id", postController.getPostById);
apiRouter.post("/post/:id/update", userController.isLoggedIn, postController.updatePost);
apiRouter.delete("/post/:id/delete", userController.isLoggedIn, postController.deletePost);

apiRouter.post("/home", userController.isLoggedIn, userController.getAllFollowingPosts);
apiRouter.post("/profile/:username", userController.isLoggedIn, userController.ifUserExists, userController.getUserData);
apiRouter.post("/profile/:username/posts", userController.isLoggedIn, userController.ifUserExists, userController.getAllUserPosts);
apiRouter.post("/profile/:username/follow", userController.isLoggedIn, userController.ifUserExists, followController.addFollow);
apiRouter.delete("/profile/:username/unfollow", userController.isLoggedIn, userController.ifUserExists, followController.removeFollow);
apiRouter.get("/profile/:username/followers", userController.ifUserExists, userController.getFollowers);
apiRouter.get("/profile/:username/following", userController.ifUserExists, userController.getFollowing);

module.exports = apiRouter;
