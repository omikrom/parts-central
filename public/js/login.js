import checkSession from "./session/checkSession.js";

window.onload = function () {
  let loginForm = document.getElementById("login_form");
  let username = document.getElementById("uname");
  let password = document.getElementById("pword");
  let loginBtn = document.getElementById("login_submit");
  let loginAuthMessage = document.getElementById("login_auth");
  let loginResMessage = document.getElementById("login_res_message");

  let isLoggedIn = checkSession();
  if (isLoggedIn) {
    loginForm.style.display = "none";
    username.value = "";
    password.value = "";
    loginAuthMessage.innerHTML = "You are already logged in.";
    loginResMessage.style.display = "none";
  } else {
    loginForm.style.display = "block";
    loginAuthMessage.style.display = "none";
  }

  loginBtn.addEventListener("click", function (e) {
    e.preventDefault();
    let body = {
      username: username.value,
      password: password.value,
    };
    axios.post("http://localhost:3000/api/login", body).then((res) => {
      console.log(res.data);
      if (res.data.token) {
        sessionStorage.setItem("token", res.data.token);
        window.location.href = "http://localhost:3000/";
      }
    });
  });
};
