import checkSession from "./session/checkSession.js";

window.onload = function () {
  let loginBtn = document.getElementById("login_btn");
  let registerBtn = document.getElementById("register_btn");
  let userDetailsBtn = document.getElementById("user_details_btn");

  let loggedIn = checkSession();
  if (loggedIn) {
    loginBtn.style.display = "none";
    registerBtn.style.display = "none";
    userDetailsBtn.style.display = "block";
  } else {
    loginBtn.style.display = "block";
    registerBtn.style.display = "block";
    userDetailsBtn.style.display = "none";
  }
};
