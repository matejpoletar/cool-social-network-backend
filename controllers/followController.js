const followService = require("../services/followService");

exports.addFollow = function (req, res) {
  followService
    .addFollow(req.params.username, req.apiUser.id)
    .then(() => {
      res.json(true);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
};

exports.removeFollow = function (req, res) {
  followService
    .removeFollow(req.params.username, req.apiUser.id)
    .then(() => {
      res.json(true);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
};
