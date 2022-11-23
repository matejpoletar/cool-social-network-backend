const { Follow } = require("../models/Follow");
const userService = require("../services/userService");

exports.addFollow = function (username, currentUser) {
  return new Promise(async (resolve, reject) => {
    const userToFollow = await userService.findByUsername({ username: username });
    if (userToFollow.equals(currentUser)) {
      reject("You cannot follow yourself.");
    }
    const doesFollowExist = await Follow.findOne({ userId: currentUser, followedUser: userToFollow._id });
    if (doesFollowExist) {
      reject("You are already following this user.");
    }

    await Follow.create({ userId: currentUser, followedUser: userToFollow._id });
    resolve();
  });
};

exports.removeFollow = function (username, currentUser) {
  return new Promise(async (resolve, reject) => {
    const userToUnfollow = await userService.findByUsername({ username: username });

    const follow = await Follow.findOne({ userId: currentUser, followedUser: userToUnfollow._id });
    if (!follow) {
      reject("You are not following this user!");
    }
    await Follow.deleteOne(follow);
    resolve();
  });
};
