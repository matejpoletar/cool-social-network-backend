const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");

const Follow = mongoose.model(
  "Follow",
  new mongoose.Schema({
    userId: ObjectId,
    followedUser: ObjectId,
  }),
  "follows"
);

module.exports.Follow = Follow;
