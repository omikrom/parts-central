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

    axios.post("/api/login", body).then((res) => {
      console.log(res.data);
      console.log('message', res.data.message);
      if (res.data.message === "Login successful") {
        if (res.data.token) {
          sessionStorage.setItem("token", res.data.token);
          sessionStorage.setItem("role", res.data.role);
          sessionStorage.setItem("userId", res.data.userId);
          sessionStorage.setItem("supplierId", res.data.supplierId);
          document.cookie = `x-access-token=${res.data.token}`;
          loginResMessage.innerHTML = "Login successful.";
          setTimeout(() => {
            window.location.href = "/";
          }, 1000);
        }
      } else {
        loginResMessage.style.display = "block";
        loginResMessage.innerHTML = res.data.message;
      }
    }).catch((err) => {
      console.log(err);
      loginResMessage.style.display = "block";
      loginResMessage.innerHTML = err.response.data.message;
    });
  });
};
