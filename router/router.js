const express = require("express");
const router = express.Router();

const db = require("../db/db.js");
const bcrypt = require("../middleware/bcrypt.js");

// test body input
router.post("/input", (req, res) => {
  console.log(req.body);
  console.log(req.body.username);
  res.send("POST request to the homepage");
  res.end();
});

// register a new user
router.post("/register", async (req, res) => {
  let task = req.body;
  let uname = task.username;
  let pword = task.password;
  let hashedPassword = {};
  bcrypt.hashPassword(pword).then((hash) => {
    hashedPassword = hash;
  });
  let email = task.email;
  try {
    const check = await db.pool.query(
      "SELECT * FROM `user` WHERE username = ?",
      [uname]
    );
    if (check.length > 0) {
      res.status(403).send({
        message: "Username already exists",
      });
    } else {
      const result = await db.pool.query(
        "INSERT INTO `user` (username, password, email) VALUES (?, ?, ?)",
        [uname, hashedPassword, email]
      );
      console.log("original Hashed Pword:", hashedPassword);
      res
        .status(200)
        .send({
          message: "User registered successfully",
        })
        .end();
    }
  } catch (err) {
    throw err;
  }
});

// show all registered users
router.get("/users", async (req, res) => {
  let responseBody = [];
  try {
    const result = await db.pool.query("SELECT * FROM `user` ");
    result.forEach((element) => {
      responseBody.push(element);
    });
    console.log(responseBody);
    res.send(responseBody);
  } catch (err) {
    console.log(err);
  }
});

router.post("/login", async (req, res) => {
  let task = req.body;
  let pword = task.password;
  let hashedPassword = {};
  try {
    await bcrypt.hashPassword(pword).then((hash) => {
      hashedPassword = hash;
    });
  } catch (err) {
    console.log(err);
  }

  try {
    let check = await db.pool.query(
      "SELECT password FROM `user` WHERE username = ?",
      [task.username]
    );

    await bcrypt.comparePassword(pword, check[0].password).then((result) => {
      if (result) {
        res.status(200).send({
          message: "Login successful",
        });
      } else {
        res.status(403).send({
          message: "Login failed",
        });
      }
    });
  } catch (err) {
    console.log(err);
  }

  try {
    /*let result = await db.pool.query(
      "SELECT * FROM `user` WHERE username = ? AND password = ?",
      [task.username, hashedPassword]
    );
    console.log(result);
    res.status(200).send(result);*/
  } catch (err) {
    throw err;
  }
});

/*     db.pool.query(
      "INSERT INTO `user` (username, password, email) VALUES (?, ?, ?)",
      [req.body.username, req.body.password, req.body.email],
    );

    */

module.exports = router;
