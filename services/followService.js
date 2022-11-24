const { Follow } = require("../models/Follow");
const userService = require("../services/userService");
const { ObjectId } = require("mongodb");

exports.addFollow = function (username, currentUser) {
  return new Promise(async (resolve, reject) => {
    const userToFollow = await userService.findByUsername({ username: username });
    if (userToFollow.equals(currentUser)) {
      reject("You cannot follow yourself.");
    } else {
      const doesFollowExist = await Follow.findOne({ userId: currentUser, followedUser: userToFollow._id });
      if (doesFollowExist) {
        reject("You are already following this user.");
      } else {
        await Follow.create({ userId: currentUser, followedUser: userToFollow._id });
        resolve();
      }
    }
  });
};

exports.removeFollow = function (username, currentUser) {
  return new Promise(async (resolve, reject) => {
    const userToUnfollow = await userService.findByUsername({ username: username });

    const follow = await Follow.findOne({ userId: currentUser, followedUser: userToUnfollow._id });
    if (!follow) {
      reject("You are not following this user!");
    } else {
      await Follow.deleteOne(follow);
      resolve();
    }
  });
};

exports.getFollowersById = function (userId) {
  return new Promise(async (resolve, reject) => {
    try {
      const followers = await Follow.aggregate([
        { $match: { followedUser: new ObjectId(userId) } },
        { $lookup: { from: "users", localField: "userId", foreignField: "_id", as: "userDoc" } },
        {
          $project: {
            _id: 0,
            id: { $arrayElemAt: ["$userDoc._id", 0] },
            username: { $arrayElemAt: ["$userDoc.username", 0] },
            email: { $arrayElemAt: ["$userDoc.email", 0] },
          },
        },
      ]);
      resolve(followers);
    } catch (e) {
      reject();
    }
  });
};

exports.getFollowingById = function (userId) {
  return new Promise(async (resolve, reject) => {
    try {
      const following = await Follow.aggregate([
        { $match: { userId: new ObjectId(userId) } },
        { $lookup: { from: "users", localField: "followedUser", foreignField: "_id", as: "userDoc" } },
        {
          $project: {
            _id: 0,
            id: { $arrayElemAt: ["$userDoc._id", 0] },
            username: { $arrayElemAt: ["$userDoc.username", 0] },
            email: { $arrayElemAt: ["$userDoc.email", 0] },
          },
        },
      ]);
      resolve(following);
    } catch (e) {
      reject();
    }
  });
};

exports.getNumberFollowers = function (userId) {
  return new Promise(async (resolve, reject) => {
    const followerCount = await Follow.countDocuments({ followedUser: userId });
    resolve(followerCount);
  });
};

exports.getNumberFollowing = function (userId) {
  return new Promise(async (resolve, reject) => {
    const followingCount = await Follow.countDocuments({ userId: userId });
    resolve(followingCount);
  });
};

exports.isFollowing = function (followingId, userId) {
  return new Promise(async (resolve, reject) => {
    const follow = await Follow.findOne({ followedUser: followingId, userId: userId });
    if (follow) {
      resolve(true);
    } else {
      resolve(false);
    }
  });
};
