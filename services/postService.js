const { Post } = require("../models/Post");

exports.createPost = function (data, userId) {
  return new Promise(async (resolve, reject) => {
    const errors = [];
    if (!errors.length) {
      post = new Post({
        title: data.title,
        content: data.content,
        author: userId,
      });

      await Post.create(post);
      resolve(post);
    } else {
      reject(errors);
    }
  });
};

exports.updatePost = function (data, postId) {
  return new Promise(async (resolve, reject) => {
    const errors = [];
    if (!errors.length) {
      await Post.findByIdAndUpdate(postId, { $set: { title: data.title, body: data.body } });
      resolve("Successfully updated post!");
    } else {
      resolve("Error in updating post.");
    }
  });
};

exports.deletePost = function (postId, currentUserId) {
  return new Promise(async (resolve, reject) => {
    try {
      let post = await Post.findById(postId);
      if (post.author.equals(currentUserId)) {
        await Post.deleteOne({ _id: postId });
        resolve("Post deleted.");
      } else {
        reject("You don't have permission to delete that post.");
      }
    } catch {
      reject("Error in deleting post.");
    }
  });
};

exports.findSinglePostById = function (postId) {
  return new Promise(async (resolve, reject) => {
    try {
      const post = await Post.findById(postId);
      resolve(post);
    } catch {
      resolve("Error in finding post by id.");
    }
  });
};
