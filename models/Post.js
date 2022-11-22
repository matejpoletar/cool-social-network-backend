const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");

const Post = mongoose.model(
  "Post",
  new mongoose.Schema({
    title: String,
    content: String,
    author: ObjectId,
    createdAt: {
      type: Date,
      default: Date.now,
    },
  }),
  "posts"
);

module.exports.Post = Post;
