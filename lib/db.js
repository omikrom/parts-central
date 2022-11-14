const mariadb = require("mariadb");

const pool = mariadb.createPool({
  host: "localhost",
  port: 3307,
  user: "parts_admin",
  password: "8~vlb632S",
  database: "parts_central_db",
  connectionLimit: 5,
});

let conn;
conn = pool.getConnection();
conn.then((conn) => {
  conn.query("SELECT * FROM `user`").then((rows) => {
    console.log(rows);
  });
});

module.exports = pool;
