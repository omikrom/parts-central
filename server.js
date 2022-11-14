const express = require("express");
const bodyParser = require("body-parser");
const db = require("./db/db");
const app = express();
const port = process.env.PORT || 3000;
const router = require("./router/router.js");
const partsRouter = require("./router/partRouter.js");
const uploadRouter = require("./router/uploadRouter.js");

const cors = require("cors");

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static("public"));
app.use(express.json());

app.get("/users", async (req, res) => {
  try {
    const result = await db.pool.query("SELECT * FROM `user` ");
    res.send(result);
  } catch (err) {
    console.log(err);
  }
});

app.use("/api", router);
app.use("/parts", partsRouter);
app.use("/upload", uploadRouter);

app.listen(port, () => console.log(`Server running on port ${port}`));

/*const mariadb = require("mariadb");
const pool = mariadb.createPool({
  host: "localhost",
  port: 3307,
  user: "parts_admin",
  password: "8~vlb632S",
  database: "parts_central_db",
  connectionLimit: 5,
});

console.log("test");

app.get("/", (req, res) => {
  res.send("index of app");
});

app.get("/test", async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    //const rows = await conn.query("SELECT * FROM db.customers");
    const rows = await conn.query("SELECT * FROM user");
    res.send("a test query" + rows);
  } catch (err) {
    throw err;
  } finally {
    if (conn) return conn.end();
  }
});*/
