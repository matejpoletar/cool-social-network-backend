const mongoose = require("mongoose");

const User = mongoose.model(
  "User",
  new mongoose.Schema({
    username: String,
    password: String,
    email: String,
    createdAt: {
      type: Date,
      default: Date.now,
    },
  })
);

module.exports.User = User;
