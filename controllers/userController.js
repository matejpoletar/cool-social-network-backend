const userService = require("../services/userService");
const followService = require("../services/followService");
const postService = require("../services/postService");
const jwt = require("jsonwebtoken");

// Token lasts for 2 weeks
const tokenExpiresIn = "14d";

exports.register = async (req, res) => {
  userService
    .register(req.body)
    .then((user) => {
      res.json({
        token: jwt.sign({ id: user._id, username: user.username }, process.env.JWTSECRET, { expiresIn: tokenExpiresIn }),
        data: user,
        status: "success",
      });
    })
    .catch((err) => {
      res.status(500).send(err);
    });
};

exports.login = async (req, res) => {
  userService
    .login(req.body)
    .then((user) => {
      res.json({
        token: jwt.sign({ id: user._id, username: user.username }, process.env.JWTSECRET, { expiresIn: tokenExpiresIn }),
        data: user,
        status: "success",
      });
    })
    .catch((err) => {
      res.status(500).send(err);
    });
};

exports.checkToken = async (req, res) => {
  try {
    req.apiUser = jwt.verify(req.body.token, process.env.JWTSECRET);
    res.json(true);
  } catch {
    res.json(false);
  }
};

exports.checkIfUsernameExists = async (req, res) => {
  userService
    .findByUsername(req.body)
    .then((isFound) => {
      res.json({ usernameExists: isFound });
    })
    .catch((err) => {
      res.status(500).send(err);
    });
};

exports.checkIfEmailExists = async (req, res) => {
  userService
    .findByEmail(req.body)
    .then((isFound) => {
      res.json({ emailExists: isFound });
    })
    .catch((err) => {
      res.status(500).send(err);
    });
};

exports.ifUserExists = function (req, res, next) {
  userService
    .findByUsername(req.params)
    .then((userExists) => {
      if (userExists) {
        next();
      } else {
        res.status(400).send("User does not exist.");
      }
    })
    .catch((err) => {
      res.json(err);
    });
};

exports.isLoggedIn = function (req, res, next) {
  try {
    req.apiUser = jwt.verify(req.body.token, process.env.JWTSECRET);
    next();
  } catch (e) {
    res.status(400).send("Sorry, you must provide a valid token.");
  }
};

exports.deleteAccount = async (req, res) => {
  userService
    .deleteAccount(req.body.id)
    .then((res) => {
      res.json(res);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
};

exports.getFollowers = async function (req, res) {
  try {
    const user = await userService.findByUsername(req.params);
    const followers = await followService.getFollowersById(user._id);
    res.json(followers);
  } catch (err) {
    res.status(500).send(err);
  }
};

exports.getFollowing = async function (req, res) {
  try {
    const user = await userService.findByUsername(req.params);
    const following = await followService.getFollowingById(user._id);
    res.json(following);
  } catch (err) {
    res.status(500).send(err);
  }
};

exports.getUserData = async function (req, res) {
  try {
    const user = await userService.findByUsername(req.params);
    const postsCountPromise = postService.countPostsByAuthor(user._id);
    console.log(req.apiUser);
    const isFollowingPromise = followService.isFollowing(user._id, req.apiUser.id);
    const followersCountPromise = followService.getNumberFollowers(user._id);
    const followingCountPromise = followService.getNumberFollowing(user._id);
    const [postsCount, isFollowing, followersCount, followingCount] = await Promise.all([postsCountPromise, isFollowingPromise, followersCountPromise, followingCountPromise]);
    res.json({
      data: {
        username: user.username,
        email: user.email,
        isFollowing: isFollowing,
        counts: {
          postsCount: postsCount,
          followersCount: followersCount,
          followingCount: followingCount,
        },
      },
      status: "success",
    });
  } catch (err) {
    res.status(500).send(err);
  }
};

exports.getAllUserPosts = async function (req, res) {
  try {
    const author = await userService.findByUsername(req.params);
    const posts = await postService.getAllPostsByAuthorId(author._id);
    res.json({
      data: posts,
      status: "success",
    });
  } catch (err) {
    res.status(500).send(err);
  }
};
