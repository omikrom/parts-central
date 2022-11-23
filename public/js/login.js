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
    console.log("login button clicked");
    let body = {
      username: username.value,
      password: password.value,
    };
    //axios.post("https://localhost:3000/api/login", body).then((res) => {
    axios.post("https://partscentral.online/api/login", body).then((res) => {
      console.log(res.data);
      if (res.data.message === "Login successful") {
        if (res.data.token) {
          sessionStorage.setItem("token", res.data.token);
          sessionStorage.setItem("role", res.data.role);
          sessionStorage.setItem("userId", res.data.userId);
          document.cookie = `x-access-token=${res.data.token}`;
          loginResMessage.innerHTML = "Login successful.";
          setTimeout(() => {
            window.location.href = "https://partscentral.online/";
            //window.location.href = "http://localhost:3000/";
          }, 1500);
        }
      } else {
        loginResMessage.style.display = "block";
        loginResMessage.innerHTML = res.data.message;
      }
    });
  });
};
