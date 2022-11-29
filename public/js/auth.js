import checkSession from "./session/checkSession.js";
import checkAdmin from "./session/checkRole.js";

let footerDate = document.getElementById("footer_date");
footerDate.innerHTML = new Date().getFullYear();
let loginBtn = document.getElementById("login_btn");
let registerBtn = document.getElementById("register_btn");
let userDetailsBtn = document.getElementById("user_details_btn");
let logoutBtn = document.getElementById("logout_btn");

logoutBtn.addEventListener("click", function (e) {
  e.preventDefault();
  sessionStorage.clear();
  window.location.href = "/";
});

let loggedIn = checkSession();
if (loggedIn) {
  loginBtn.style.display = "none";
  registerBtn.style.display = "none";
  userDetailsBtn.style.display = "block";
  logoutBtn.style.display = "block";
} else {
  loginBtn.style.display = "block";
  registerBtn.style.display = "block";
  logoutBtn.style.display = "none";
  userDetailsBtn.style.display = "none";
}

let globalPartsList = document.getElementById("admin_parts_list");
let massUploadBtn = document.getElementById("admin_mass_upload_parts");
let isAdmin = checkAdmin();
if (isAdmin) {
  globalPartsList.style.display = "block";
  massUploadBtn.style.display = "block";
} else {
  globalPartsList.style.display = "none";
  massUploadBtn.style.display = "none";
}

let addPartBtn = document.getElementById("user_create_part_btn");
let viewPartBtn = document.getElementById("user_view_part_btn");
let userMassUploadBtn = document.getElementById("user_mass_create_part_btn");
let userPartSearchBtn = document.getElementById("user_search_part_btn");

if (loggedIn) {
  let supplier_id = sessionStorage.getItem("supplierId");
  console.log(supplier_id);
  addPartBtn.style.display = "block";
  viewPartBtn.style.display = "block";
  userMassUploadBtn.style.display = "block";
  userPartSearchBtn.style.display = "block";
} else {
  addPartBtn.style.display = "none";
  viewPartBtn.style.display = "none";
  userMassUploadBtn.style.display = "none";
  userPartSearchBtn.style.display = "none";
}
