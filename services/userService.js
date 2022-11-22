const { User } = require("../models/User");
const crypto = require("crypto");
const validator = require("validator");

const prepareUserData = (userData) => {
  userData.username = userData.username.trim();
  userData.email = userData.email.trim().toLowerCase();
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
    User.findOne({ username: userData.username })
      .then((attemptedUser) => {
        if (attemptedUser) {
          const hash = crypto.createHash("sha512");
          hash.update(userData.password);
          const passwordHash = hash.digest("hex").toUpperCase();
          if (passwordHash !== attemptedUser.password) {
            reject("Invalid password.");
          }
          resolve(attemptedUser);
        } else {
          reject("Invalid username.");
        }
      })
      .catch((e) => {
        reject("Failed login attempt.");
      });
  });
};
