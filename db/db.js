var mariadb = require("mariadb");
var pool = mariadb.createPool({
  host: "127.0.0.1",
  port: 3306, //<-- live server port
  user: "parts_admin", // <-- live user
  password: "8~vlb632S", // <-- live password
  database: "parts_central_new", // <-- live database
  //port: 3307, // <-- local server port
  //user: "app_user", // <- dev user
  //password: "8~vlb632S",
  // -- rich home 
  //password: "P4ssw0rd##",
  //password: "p4ssw0rd##", // <-- local machine
  //database: "parts_central_db",
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
