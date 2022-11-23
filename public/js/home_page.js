import checkSession from "./session/checkSession.js";

let loggedIn = checkSession();
let userId = sessionStorage.getItem("userId");
console.log("userId", userId);

let newUserContent = document.getElementById("index--new_user");
let existingUserContent = document.getElementById("index--logged_in_user");
let loginBtn = document.getElementById("index_login_btn");
let registerBtn = document.getElementById("index_register_btn");
let addPartBtn = document.getElementById("index_add_part--btn");
let viewPartsBtn = document.getElementById("index_view_all--btn");

if (loggedIn) {
  newUserContent.style.display = "none";
  existingUserContent.style.display = "flex";
  addPartBtn.addEventListener("click", function (e) {
    e.preventDefault();
    window.location.href = "https://partscentral.online/new_part";
  });
  viewPartsBtn.addEventListener("click", function (e) {
    e.preventDefault();
    window.location.href = "https://partscentral.online/user_parts";
  });
} else {
  newUserContent.style.display = "flex";
  existingUserContent.style.display = "none";
  loginBtn.addEventListener("click", function (e) {
    e.preventDefault();
    window.location.href = "https://partscentral.online/login";
  });
  registerBtn.addEventListener("click", function (e) {
    e.preventDefault();
    window.location.href = "https://partscentral.online/register";
  });
}

if (loggedIn) {
  axios.get(`https://partscentral.online/api/user/${userId}`).then((res) => {
    //axios.get(`http://localhost:3000/api/user/${userId}`).then((res) => {
    console.log("res.data", res.data);
    let user = res.data;
    let usernameField = document.getElementById("index--username");
    usernameField.innerHTML = user.username;
  });
}
