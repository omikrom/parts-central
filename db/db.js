var mariadb = require("mariadb");
var pool = mariadb.createPool({
  host: "127.0.0.1",
  //port: 3306,
  //user: "parts_admin",
  //password: "8~vlb632S",
  //database: "parts_central_new",
  port: 3307,
  user: "app_user",
  password: "8~vlb632S",
  //password: "P4ssw0rd##",
  password: "p4ssw0rd##",
  database: "parts_central_db",
  connectionLimit: 5,
  allowPublicKeyRetrieval: true,
});

/*var pool = mariadb.createPool({
  host: "127.0.0.1",
  port: 3306,
  user: "part_admin",
  password: "8~vlb632S",
  database: "parts_central_new",
  connectionLimit: 5,
});*/

module.exports = Object.freeze({
  pool: pool,
});
