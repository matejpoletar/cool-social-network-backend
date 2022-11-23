const { Post } = require("../models/Post");
const { ObjectId } = require("mongodb");

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
      let posts = await Post.aggregate()
        .match({ _id: new ObjectId(postId) })
        .lookup({ from: "users", localField: "author", foreignField: "_id", as: "authorDocument" })
        .project({ title: 1, content: 1, createdDate: 1, authorId: "$author", author: { $arrayElemAt: ["$authorDocument", 0] } });

      if (posts.length == 1) {
        resolve(posts[0]);
      } else {
        reject("Post has not been found");
      }
    } catch {
      reject("Error in finding post by id.");
    }
  });
};
