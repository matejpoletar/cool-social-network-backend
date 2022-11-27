const postService = require("../services/postService");

exports.createPost = function (req, res) {
  postService
    .createPost(req.body, req.apiUser.id)
    .then((post) => {
      res.json(post);
    })
    .catch((err) => {
      res.json(err);
    });
};

exports.updatePost = function (req, res) {
  postService
    .updatePost(req.body, req.params.id)
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
  try {
    let post = await postService.findSinglePostById(req.params.id);
    res.json(post);
  } catch (err) {
    res.json(err);
  }
};
