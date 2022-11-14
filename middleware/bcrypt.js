var bcrypt = require("bcryptjs");
var saltRounds = 10;

let hashPassword = (password) => {
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, saltRounds, function (err, hash) {
      if (err) {
        reject(err);
      }
      resolve(hash);
    });
  });
};

let comparePassword = (password, hash) => {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, hash, function (err, result) {
      if (err) {
        reject(err);
      }
      resolve(result);
    });
  });
};

module.exports = { hashPassword, comparePassword };
