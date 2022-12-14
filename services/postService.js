const { Post } = require("../models/Post");
const { ObjectId } = require("mongodb");
const followService = require("../services/followService");

exports.createPost = function (data, user) {
  return new Promise(async (resolve, reject) => {
    const errors = [];
    if (!errors.length) {
      post = new Post({
        title: data.title,
        content: data.content,
        authorId: user._id,
        author: user.username,
      });

      await Post.create(post);
      resolve(post);
    } else {
      reject(errors);
    }
  });
};

exports.updatePost = function (data, currentUserId, postId) {
  return new Promise(async (resolve, reject) => {
    const errors = [];
    if (!errors.length) {
      let post = await Post.findById(postId);
      if (post.authorId.equals(currentUserId)) {
        await Post.findByIdAndUpdate(postId, { $set: { title: data.title, content: data.content } });
        resolve("Successfully updated post!");
      } else {
        reject("You don't have permission to update that post.");
      }
    } else {
      reject("Error in updating post.");
    }
  });
};

exports.deletePost = function (postId, currentUserId) {
  return new Promise(async (resolve, reject) => {
    try {
      let post = await Post.findById(postId);
      if (post.authorId.equals(currentUserId)) {
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
      const posts = await Post.aggregate()
        .match({ _id: new ObjectId(postId) })
        .lookup({ from: "users", localField: "authorId", foreignField: "_id", as: "authorDocument" })
        .project({
          _id: 0,
          id: "$_id",
          title: 1,
          content: 1,
          createdAt: 1,
          author: {
            authorId: "$authorId",
            username: { $arrayElemAt: ["$authorDocument.username", 0] },
            email: { $arrayElemAt: ["$authorDocument.email", 0] },
            avatar: { $arrayElemAt: ["$authorDocument.profileImgUrl", 0] },
          },
        });

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

exports.countPostsByAuthor = function (authorId) {
  return new Promise(async (resolve, reject) => {
    const postCount = await Post.countDocuments({ authorId: authorId });
    resolve(postCount);
  });
};

exports.getAllPostsByAuthorId = function (authorId) {
  return new Promise(async (resolve, reject) => {
    try {
      const posts = await Post.find({ authorId: new ObjectId(authorId) }).sort({ createdAt: -1 });
      resolve(posts);
    } catch {
      reject("Error in fetching posts.");
    }
  });
};

exports.getAllFollowingPosts = async function (userId) {
  return new Promise(async (resolve, reject) => {
    try {
      let followedUsers = await followService.getFollowingById(userId);
      followedUsers = followedUsers.map((followDoc) => {
        return followDoc.id;
      });
      let posts = await Post.aggregate()
        .match({ authorId: { $in: followedUsers } })
        .lookup({ from: "users", localField: "authorId", foreignField: "_id", as: "authorDocument" })
        .project({
          _id: 0,
          id: "$_id",
          title: 1,
          content: 1,
          createdAt: 1,
          author: {
            id: { $arrayElemAt: ["$authorDocument._id", 0] },
            username: { $arrayElemAt: ["$authorDocument.username", 0] },
            createdAt: { $arrayElemAt: ["$authorDocument.createdAt", 0] },
            avatar: { $arrayElemAt: ["$authorDocument.profileImgUrl", 0] },
          },
        })
        .sort({ createdAt: -1 });
      resolve(posts);
    } catch {
      reject("Error in fetching feed.");
    }
  });
};

exports.search = function (body) {
  return new Promise(async (resolve, reject) => {
    if (typeof body.keyword == "string") {
      try {
        const posts = await Post.aggregate([
          { $match: { $text: { $search: body.keyword } } },
          { $lookup: { from: "users", localField: "authorId", foreignField: "_id", as: "authorDocument" } },
          {
            $project: {
              _id: 0,
              id: "$_id",
              title: 1,
              content: 1,
              createdAt: 1,
              author: {
                authorId: "$authorId",
                username: { $arrayElemAt: ["$authorDocument.username", 0] },
                email: { $arrayElemAt: ["$authorDocument.email", 0] },
                avatar: { $arrayElemAt: ["$authorDocument.profileImgUrl", 0] },
              },
            },
          },
          { $sort: { score: { $meta: "textScore" } } },
        ]);
        resolve(posts);
      } catch {
        reject("Error in search.");
      }
    } else {
      reject();
    }
  });
};
