const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));

/*const mariadb = require("mariadb");
const pool = mariadb.createPool({
  host: "localhost",
  user: "parts_admin",
  password: "8~vlb632S",
  database: "parts_central_new",
  connectionLimit: 5,
});*/

console.log("test");

app.get("/", (req, res) => {
  res.send("index of app");
});

/*app.get("/test", async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    //const rows = await conn.query("SELECT * FROM db.customers");
    const rows = await conn.query("SELECT * FROM customers");
    res.send("a test query" + rows);
  } catch (err) {
    throw err;
  } finally {
    if (conn) return conn.end();
  }
});*/

app.listen(port, () => console.log(`Server running on port ${port}`));
