const express = require("express");
const router = express.Router();

const db = require("../db/db.js");
const bcrypt = require("../middleware/bcrypt.js");
const jwt = require("jsonwebtoken");

// test body input
router.post("/input", (req, res) => {
  console.log(req.body);
  console.log(req.body.username);
  res.send("POST request to the homepage");
  res.end();
});

router.get("/test", (req, res) => {
  res.send("test");
});

// register a new user
router.post("/register", async (req, res) => {
  console.log('registering user');
  let task = req.body;
  let uname = task.username;
  let pword = task.password;
  let email = task.email;
  let userId = 0;
  let supplier = task.supplier;
  let supplierId = 0;
  let role = 0;
  let hashedPassword = {};

  let passedTests = true;

  // hash password
  bcrypt.hashPassword(pword).then((hash) => {
    hashedPassword = hash;
  });
  try {
    const check = await db.pool.query(
      "SELECT * FROM `user` WHERE username = ?",
      [uname]
    );
    if (check.length > 0) {
      console.log("username exists")
      passedTests = false;
      res.status(403).send({
        message: "Username already exists",
      });
    }
  } catch (err) {

    res.status(500).send({
      message: "Error registering user",
    });
  }

  // check if supplier exists
  try {

    const supplierQuery = await db.pool.query(
      "SELECT id FROM `supplier` WHERE supplier_name = ?",
      [supplier]
    );
    if (supplierQuery.length > 0) {
      console.log("supplier exists");
      supplierId = parseInt(supplierQuery[0].id);
      console.log(supplierId);
    } else {
      console.log("supplier does not exist");
      passedTests = false;
      res.status(403).send({
        message: "Supplier does not exist",
      });
    }
  } catch (err) {
    console.log('second catch:', err);
    res.status(500).send({
      message: "Error registering user",
    });
  }

  console.log('passedTests:', passedTests);

  if (passedTests) {
    var token = {};

    // create user
    try {
      console.log('trying to create user');
      console.log('uname:', uname);
      console.log('hashedPassword:',
        hashedPassword);
      console.log('email:', email);
      console.log('supplierId:', supplierId);
      console.log('role:', role);

      const result = await db.pool.query(
        "INSERT INTO `user` (username, password, email, supplier_id, role) VALUES (?, ?, ?, ?, ?)",
        [uname, hashedPassword, email, supplierId, role]
      );

      userId = parseInt(result.insertId);

      token = jwt.sign(
        {
          user_id: userId,
          email,
        },
        process.env.JWT_KEY || "SECRETKEY",
        {
          expiresIn: "2h",
        }
      );

      console.log('token');
      console.log('uId:', userId);

      //updateDBToken(userId, token);
    } catch (err) {
      console.log('third catch:', err);
      res.status(500).send({
        message: "Error registering user",
      });
    }
    finally {
      res
        .status(200)
        .send({
          message: "Registration successful",
          token: token,
          role: role,
          userId: userId,
          supplierId: supplierId,
        });
    }
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
    res.send(responseBody);
  } catch (err) {
    throw err;
  }
});

// get username by id
router.get("/user/:id", async (req, res) => {
  let id = req.params.id;
  let responseBody = {};
  try {
    const result = await db.pool.query(
      "SELECT username FROM `user` WHERE id = ?",
      [id]
    );
    responseBody = result[0];
    res.send(responseBody);
  } catch (err) {
    throw err;
  }
});

// login
router.post("/login", async (req, res) => {
  let task = req.body;
  let pword = task.password;
  var hashedPassword = {};
  try {
    await bcrypt.hashPassword(pword).then((hash) => {
      hashedPassword = hash;
    });
  } catch (err) {
    throw err;
  }

  try {
    let check = await db.pool.query(
      "SELECT password, id, role FROM `user` WHERE username = ?",
      [task.username]
    );
    if (check.length > 0) {

      let uId = check[0].id;
      let role = check[0].role;
      let sId = await getSupplierId(uId);

      let supplierId = await db.pool.query(
        "SELECT supplier_id FROM `user` WHERE id = ?",
        [uId]
      );
      sId = supplierId[0].supplier_id;

      await bcrypt.comparePassword(pword, check[0].password).then((result) => {
        if (result) {
          const token = jwt.sign(
            {
              user_id: uId,
              email: check[0].email,
            },
            "SECRETKEY",
            {
              expiresIn: "2h",
            }
          );

          updateDBToken(uId, token);
          //let supplierId = getSupplierId(uId);
          res.status(200).send({
            message: "Login successful",
            token: token,
            role: role,
            userId: uId,
            supplierId: sId,
          });
        } else {
          res.status(403).send({
            message: "Login failed",
          });
        }
      });
    } else {
      res.status(403).send({
        message: "Username or password was incorrect",
      });
    }
  } catch (err) {
    throw err;
  }
});

async function updateDBToken(id, token) {
  try {
    let result = await db.pool.query(
      "UPDATE `user` SET token = ? WHERE id = ?",
      [token, id]
    );
  } catch (err) {
    throw err;
  }
}

async function getSupplierId(id) {
  try {
    let result = await db.pool.query(
      "SELECT supplier_id FROM `user` WHERE id = ?",
      [id]
    );
    return parseInt(result[0].supplier_id);
  } catch (err) {
    throw err;
  }
}

module.exports = router;
