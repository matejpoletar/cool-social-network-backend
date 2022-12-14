const { User } = require("../models/User");
const crypto = require("crypto");
const validator = require("validator");

const prepareUserData = (userData) => {
  if (userData.username) {
    userData.username = userData.username.trim();
  }
  if (userData.email) {
    userData.email = userData.email.trim().toLowerCase();
  }
  return userData;
};

const validateRegistrationData = (userData) => {
  errors = [];
  if (userData.username == "") {
    errors.push("You need to provide an username.");
  }
  if (userData.username != "" && !validator.isAlphanumeric(userData.username)) {
    errors.push("Username can only contain letters and numbers.");
  }
  if (userData.username.length < 3) {
    errors.push("Username must be at least 3 characters long.");
  }
  if (userData.username.length > 30) {
    errors.push("Username cannot exceed 30 characters.");
  }
  if (userData.password.trim() == "") {
    errors.push("You need to provide a password.");
  }
  if (userData.password.length > 0 && userData.password.length < 8) {
    errors.push("Password must be at least 8 characters.");
  }
  if (!validator.isEmail(userData.email)) {
    errors.push("Provided email is not a valid email address.");
  }

  return errors;
};

exports.register = function (userData) {
  return new Promise(async (resolve, reject) => {
    userData = prepareUserData(userData);
    const errors = validateRegistrationData(userData);
    if (!errors.length) {
      // Check if username is taken
      const usernameFound = await User.findOne({ username: userData.username });
      if (usernameFound) {
        reject("Username " + userData.username + " is already taken.");
      }
      // Check if email is already registered
      const emailFound = await User.findOne({ email: userData.email });
      if (emailFound) {
        reject("User with email " + userData.email + " already exists.");
      }

      const hash = crypto.createHash("sha512");
      hash.update(userData.password);
      const passwordHash = hash.digest("hex").toUpperCase();

      user = new User({
        username: userData.username,
        email: userData.email,
        password: passwordHash,
      });

      await User.create(user);
      resolve(user);
    } else {
      reject(errors);
    }
  });
};

exports.login = function (userData) {
  return new Promise(async (resolve, reject) => {
    userData = prepareUserData(userData);
    User.findOne({ username: userData.username })
      .then((attemptedUser) => {
        if (attemptedUser) {
          const hash = crypto.createHash("sha512");
          hash.update(userData.password);
          const passwordHash = hash.digest("hex").toUpperCase();
          if (passwordHash !== attemptedUser.password) {
            resolve({ user: null, message: "Invalid password." });
          }
          resolve({ user: attemptedUser, message: "Successful login." });
        } else {
          resolve({ user: null, message: "Invalid username." });
        }
      })
      .catch((e) => {
        reject("Failed login attempt.");
      });
  });
};

exports.findById = function (id) {
  return new Promise(async (resolve, reject) => {
    User.findOne({ _id: id })
      .then((foundUser) => {
        resolve(foundUser);
      })
      .catch((e) => {
        reject("Error in finding user by username.");
      });
  });
};

exports.findByUsername = function (userData) {
  return new Promise(async (resolve, reject) => {
    userData = prepareUserData(userData);
    User.findOne({ username: userData.username })
      .then((foundUser) => {
        resolve(foundUser);
      })
      .catch((e) => {
        reject("Error in finding user by username.");
      });
  });
};

exports.findByEmail = function (userData) {
  return new Promise(async (resolve, reject) => {
    userData = prepareUserData(userData);
    User.findOne({ email: userData.email })
      .then((foundUser) => {
        resolve(foundUser);
      })
      .catch((e) => {
        reject("Error in finding user by email.");
      });
  });
};

exports.deleteAccount = function (id) {
  return new Promise(async (resolve, reject) => {
    User.findByIdAndDelete({ _id: id })
      .then(() => {
        resolve("Account has been removed.");
      })
      .catch((e) => {
        reject("Error in deleting user.");
      });
  });
};

const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");

exports.setProfileImage = function (filename) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  return new Promise(async (resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream((err, res) => {
      if (res) {
        resolve(res);
      } else {
        reject(err);
      }
    });
    streamifier.createReadStream(filename.buffer).pipe(stream);
  });
};

exports.updateImgUrl = function (id, imgFile) {
  return new Promise(async (resolve, reject) => {
    User.findByIdAndUpdate({ _id: id }, { profileImgUrl: imgFile.secure_url })
      .then((user) => {
        resolve(user);
      })
      .catch(() => {
        reject("Error in uploading new profile image.");
      });
  });
};
