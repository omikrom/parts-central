import checkSession from "./session/checkSession.js";

let loggedIn = checkSession();
let userId = sessionStorage.getItem("userId");
console.log("userId", userId);

let newUserContent = document.getElementById("index--new_user");
let existingUserContent = document.getElementById("index--logged_in_user");

if (loggedIn) {
  newUserContent.style.display = "none";
  existingUserContent.style.display = "flex";
} else {
  newUserContent.style.display = "flex";
  existingUserContent.style.display = "none";
}

if (loggedIn) {
  axios.get(`http://localhost:3000/api/user/${userId}`).then((res) => {
    console.log("res.data", res.data);
    let user = res.data;
    let usernameField = document.getElementById("index--username");
    usernameField.innerHTML = user.username;
  });
}
