const userService = require("../services/userService");
const jwt = require("jsonwebtoken");

// Token lasts for 2 weeks
const tokenExpiresIn = "14d";

exports.register = async (req, res) => {
  userService
    .register(req.body)
    .then((user) => {
      res.json({
        token: jwt.sign({ id: user._id, username: user.username }, process.env.JWTSECRET, { expiresIn: tokenExpiresIn }),
        data: user,
        status: "success",
      });
    })
    .catch((err) => {
      res.status(500).send(err);
    });
};

exports.login = async (req, res) => {
  userService
    .login(req.body)
    .then((user) => {
      res.json({
        token: jwt.sign({ id: user._id, username: user.username }, process.env.JWTSECRET, { expiresIn: tokenExpiresIn }),
        data: user,
        status: "success",
      });
    })
    .catch((err) => {
      res.status(500).send(err);
    });
};
