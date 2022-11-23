import checkSession from "./session/checkSession.js";

window.onload = function () {
  let registerForm = document.getElementById("register_form");
  let company = document.getElementById("company");
  let username = document.getElementById("uname");
  let password = document.getElementById("pword");
  let email = document.getElementById("email");
  let registerBtn = document.getElementById("register_submit");
  let registerAuthMessage = document.getElementById("register_auth");
  let registerResMessage = document.getElementById("register_res_message");

  let isLoggedIn = checkSession();
  if (isLoggedIn) {
    registerForm.style.display = "none";
    username.value = "";
    password.value = "";
    registerAuthMessage.innerHTML = "You are already logged in.";
    registerResMessage.style.display = "none";
  } else {
    registerForm.style.display = "block";
    registerAuthMessage.style.display = "none";
  }

  registerBtn.addEventListener("click", function (e) {
    e.preventDefault();
    let body = {
      company: company.value,
      email: email.value,
      username: username.value,
      password: password.value,
    };
    axios.post("https://partscentral.online/api/register", body).then((res) => {
      //axios.post("http://localhost:3000/api/register", body).then((res) => {
      console.log(res.data);
      if (res.data.message === "Registration successful") {
        if (res.data.token) {
          sessionStorage.setItem("token", res.data.token);
          sessionStorage.setItem("role", res.data.role);
          sessionStorage.setItem("userId", res.data.userId);
          registerResMessage.innerHTML = "Registered successfully.";
          setTimeout(() => {
            window.location.href = "https://partscentral.online";
            //window.location.href = "http://localhost:3000/";
          }, 3000);
        }
      } else {
        registerResMessage.style.display = "block";
        registerResMessage.innerHTML = res.data.message;
      }
    });
  });
};
