const mongoose = require("mongoose");

const User = mongoose.model(
  "User",
  new mongoose.Schema({
    username: String,
    password: String,
    email: String,
    profileImgUrl: String,
    createdAt: {
      type: Date,
      default: Date.now,
    },
  }),
  "users"
);

module.exports.User = User;
