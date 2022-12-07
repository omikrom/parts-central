import checkSession from "./session/checkSession.js";

let loggedIn = checkSession();
let userId = sessionStorage.getItem("userId");
let supplierId = sessionStorage.getItem("supplierId");

let newUserContent = document.getElementById("index--new_user");
let existingUserContent = document.getElementById("index--logged_in_user");
let loginBtn = document.getElementById("index_login_btn");
let registerBtn = document.getElementById("index_register_btn");
let addPartBtn = document.getElementById("index_add_part--btn");
let viewPartsBtn = document.getElementById("index_view_all--btn");
let uploadCSVBtn = document.getElementById("index_upload_csv--btn");
let searchPartBtn = document.getElementById("index_search--btn");

if (loggedIn) {
  newUserContent.style.display = "none";
  existingUserContent.style.display = "flex";
  existingUserContent.classList.remove("hidden");
  addPartBtn.addEventListener("click", function (e) {
    e.preventDefault();
    window.location.href = "/create_part";
  });
  viewPartsBtn.addEventListener("click", function (e) {
    e.preventDefault();
    window.location.href = "/user_parts";
  });
  uploadCSVBtn.addEventListener("click", function (e) {
    e.preventDefault();
    window.location.href = "/csv_upload";
  });
  searchPartBtn.addEventListener("click", function (e) {
    e.preventDefault();
    window.location.href = "/part_search";
  });
} else {
  newUserContent.style.display = "flex";
  newUserContent.classList.remove("hidden");
  existingUserContent.style.display = "none";
  loginBtn.addEventListener("click", function (e) {
    e.preventDefault();
    window.location.href = "/login";
  });
  registerBtn.addEventListener("click", function (e) {
    e.preventDefault();
    window.location.href = "/register";
  });
}

if (loggedIn) {
  axios.get(`/api/user/${userId}`).then((res) => {
    //axios.get(`http://localhost:3000/api/user/${userId}`).then((res) => {
    console.log("res.data", res.data);
    let user = res.data;
    let usernameField = document.getElementById("index--username");
    usernameField.innerHTML = user.username;
  });
}
