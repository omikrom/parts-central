import checkSession from "./session/checkSession.js";

window.onload = function () {
  let registerForm = document.getElementById("register_form");
  let supplier = document.getElementById("supplier");
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
    email.value = "";
    supplier.value = "";
    registerAuthMessage.innerHTML = "You are already logged in.";
    registerResMessage.style.display = "none";
  } else {
    registerForm.style.display = "block";
    registerAuthMessage.style.display = "none";
  }

  registerBtn.addEventListener("click", function (e) {
    e.preventDefault();
    let body = {
      email: email.value,
      username: username.value,
      password: password.value,
      supplier: supplier.value,
    };

    axios.post("/api/register", body).then((res) => {
      console.log(res.data);
      if (res.data.message === "Registration successful") {
        if (res.data.token) {
          sessionStorage.setItem("token", res.data.token);
          sessionStorage.setItem("role", res.data.role);
          sessionStorage.setItem("userId", res.data.userId);
          sessionStorage.setItem("supplierId", res.data.supplierId);
          registerResMessage.innerHTML = "Registered successfully.";
          setTimeout(() => {
            window.location.href = "/";
          }, 3000);
        }
      } else {
        registerResMessage.style.display = "block";
        registerResMessage.innerHTML = res.data.message;
      }
    });
  });
};
