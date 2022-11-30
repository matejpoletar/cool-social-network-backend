const postService = require("../services/postService");
const userService = require("../services/userService");

exports.createPost = async function (req, res) {
  const user = await userService.findById(req.apiUser.id);
  postService
    .createPost(req.body, user)
    .then((post) => {
      res.json(post);
    })
    .catch((err) => {
      res.json(err);
    });
};

exports.updatePost = function (req, res) {
  postService
    .updatePost(req.body, req.apiUser.id, req.params.id)
    .then((updateSuccess) => {
      res.json(updateSuccess);
    })
    .catch((err) => {
      res.json(err);
    });
};

exports.deletePost = function (req, res) {
  postService
    .deletePost(req.params.id, req.apiUser.id)
    .then(() => {
      res.json("Success");
    })
    .catch(() => {
      res.json("You do not have permission to perform that action.");
    });
};

exports.getPostById = async function (req, res) {
  postService
    .findSinglePostById(req.params.id)
    .then((post) => {
      res.json(post);
    })
    .catch((err) => {
      res.json(err);
    });
};

exports.search = async function (req, res) {
  postService
    .search(req.body)
    .then((results) => {
      res.json(results);
    })
    .catch((err) => {
      res.json(err);
    });
};
