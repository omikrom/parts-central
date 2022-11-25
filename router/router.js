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

// register a new user
router.post("/register", async (req, res) => {
  let task = req.body;
  let uname = task.username;
  let pword = task.password;
  let supplier = task.supplier;
  let supplierId = 0;
  let role = 0;
  let hashedPassword = {};
  let email = task.email;

  console.log(supplier);

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
      res.status(403).send({
        message: "Username already exists",
      });
    } else {
      // get supplier id
      const supplierQuery = await db.pool.query(
        "SELECT id FROM `supplier` WHERE supplier_name = ?",
        [supplier]
      );
      if (supplierQuery.length > 0) {
        console.log("supplier exists");
        supplierId = supplierQuery[0].id;
      } else {
        res.status(403).send({
          message: "Supplier does not exist",
        });
      }

      console.log("supplierId: " + supplierId);

      const result = await db.pool.query(
        "INSERT INTO `user` (username, password, email, supplier_id, role) VALUES (?, ?, ?, ?, ?)",
        [uname, hashedPassword, email, supplierId, role]
      );
      let userId = parseInt(result.insertId);

      const token = jwt.sign(
        {
          user_id: userId,
          email,
        },
        process.env.JWT_KEY || "SECRETKEY",
        {
          expiresIn: "2h",
        }
      );
      updateDBToken(userId, token);
      res
        .status(200)
        .send({
          message: "Registration successful",
          token: token,
          role: role,
          userId: userId,
          supplierId: supplierId,
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

// get username by id
router.get("/user/:id", async (req, res) => {
  console.log(req.params.id);
  let id = req.params.id;
  let responseBody = {};
  try {
    const result = await db.pool.query(
      "SELECT username FROM `user` WHERE id = ?",
      [id]
    );
    responseBody = result[0];
    console.log(responseBody);
    res.send(responseBody);
  } catch (err) {
    console.log(err);
  }
});

// login
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
      "SELECT password, id, role FROM `user` WHERE username = ?",
      [task.username]
    );
    let uId = check[0].id;
    let role = check[0].role;

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
        res.status(200).send({
          message: "Login successful",
          token: token,
          role: role,
          userId: uId,
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

/*     db.pool.query(
      "INSERT INTO `user` (username, password, email) VALUES (?, ?, ?)",
      [req.body.username, req.body.password, req.body.email],
    );

    */

module.exports = router;
