const express = require("express");
const bodyParser = require("body-parser");
const db = require("./db/db");
const app = express();
const port = process.env.PORT || 3000;
const router = require("./router/router.js");
const partRouter = require("./router/partRouter.js");
const uploadRouter = require("./router/uploadRouter.js");
const userPartRouter = require("./router/userPartRouter.js");
const partSearchRouter = require("./router/partSearchRouter.js");

const path = require("path");

const auth = require("./middleware/auth.js");

const cors = require("cors");

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());
//app.use(express.static("public"));

/* ------------------- */
/*  Frontend Routes    */
/* ------------------- */

// include js files
app.use("/js", express.static(path.join(__dirname, "public/js")));
app.use(
  "/css",
  express.static(path.join(__dirname, "node_modules/bootstrap/dist/css"))
);
app.use(
  "/js",
  express.static(path.join(__dirname, "node_modules/bootstrap/dist/js"))
);
app.use(
  "/js",
  express.static(path.join(__dirname, "node_modules/jquery/dist"))
);

// include css files for static pages
app.use("/css", express.static(path.join(__dirname, "public/css")));

// include images
app.use("/img", express.static(path.join(__dirname, "public/img")));


//include download folder
app.use("/downloads", express.static(path.join(__dirname, "public/downloads")));
// include html files
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});
app.use("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "login.html"));
});
app.use("/register", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "register.html"));
});

/*app.use("/all_parts", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "all_parts.html"));
});*/

app.use("/new_part", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "new_part.html"));
});

app.use("/create_part", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "create_part.html"));
});

/*app.use("/upload", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "upload.html"));
});*/

app.use("/user_parts", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "user_parts.html"));
});

app.use("/part_search", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "part_search.html"));
});

app.use("/csv_upload", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "user_upload.html"));
});

/* admin views*/

app.use("/new_supplier", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "new_supplier.html"));
});

/* ------------------- */
/*  Backend Routes     */
/* ------------------- */

app.post("/welcome", auth, (req, res) => {
  res.status(200).send("Welcome to the API");
});



app.use("/api", router);
app.use("/parts", partRouter);
app.use("/upload", uploadRouter);
app.use("/user", userPartRouter);
app.use("/search", partSearchRouter);

app.listen(port, () => console.log(`Server running on port ${port}`));
