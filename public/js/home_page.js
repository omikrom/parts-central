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
    console.log("res.data", res.data);
    let user = res.data;
    let usernameField = document.getElementById("index--username");
    usernameField.innerHTML = user.username;
  });

  // create a new div and row to hold the data 
  let dbStatsContainer = document.createElement("div");
  dbStatsContainer.classList.add("container-fluid");
  let newRow = document.createElement("div");
  newRow.classList.add("row");
  let indexContainer = document.getElementsByClassName("index--section")[0];

  axios.get(`/parts/totalParts/${supplierId}`).then((res) => {
    console.log("res.data", res.data);
    let totalParts = res.data;
    let newCol = document.createElement("div");
    newCol.classList.add("col-12");
    newCol.classList.add("col-md-3");
    let newCard = document.createElement("div");
    newCard.classList.add("card");
    let newCardBody = document.createElement("div");
    newCardBody.classList.add("card-body");
    let newCardTitle = document.createElement("h5");
    newCardTitle.classList.add("card-title");
    newCardTitle.innerHTML = "Total Parts";
    let newCardText = document.createElement("p");
    newCardText.classList.add("card-text");
    newCardText.innerHTML = totalParts;
    newCardBody.appendChild(newCardTitle);
    newCardBody.appendChild(newCardText);
    newCard.appendChild(newCardBody);
    newCol.appendChild(newCard);
    newRow.appendChild(newCol);
    dbStatsContainer.appendChild(newRow);
  });

  axios.get(`/parts/totalFittings/${supplierId}`).then((res) => {
    console.log("res.data", res.data);
    let totalFittings = res.data;
    let newCol = document.createElement("div");
    newCol.classList.add("col-12");
    newCol.classList.add("col-md-3");
    let newCard = document.createElement("div");
    newCard.classList.add("card");
    let newCardBody = document.createElement("div");
    newCardBody.classList.add("card-body");
    let newCardTitle = document.createElement("h5");
    newCardTitle.classList.add("card-title");
    newCardTitle.innerHTML = "Total Fittings";
    let newCardText = document.createElement("p");
    newCardText.classList.add("card-text");
    newCardText.innerHTML = totalFittings;
    newCardBody.appendChild(newCardTitle);
    newCardBody.appendChild(newCardText);
    newCard.appendChild(newCardBody);
    newCol.appendChild(newCard);
    newRow.appendChild(newCol);
    dbStatsContainer.appendChild(newRow);
  });

  axios.get(`/parts/avgFittings/${supplierId}`).then((res) => {
    console.log("res.data", res.data);
    let averageFittings = res.data;
    let newCol = document.createElement("div");
    newCol.classList.add("col-12");
    newCol.classList.add("col-md-3");
    let newCard = document.createElement("div");
    newCard.classList.add("card");
    let newCardBody = document.createElement("div");
    newCardBody.classList.add("card-body");
    let newCardTitle = document.createElement("h5");
    newCardTitle.classList.add("card-title");
    newCardTitle.innerHTML = "Average amount fittings per part";
    let newCardText = document.createElement("p");
    newCardText.classList.add("card-text");
    newCardText.innerHTML = averageFittings;
    newCardBody.appendChild(newCardTitle);
    newCardBody.appendChild(newCardText);
    newCard.appendChild(newCardBody);
    newCol.appendChild(newCard);
    newRow.appendChild(newCol);
    dbStatsContainer.appendChild(newRow);
  });

  axios.get(`/parts/commonCC/${supplierId}`).then((res) => {
    console.log("res.data", res.data);
    let commonCC = res.data;
    let newCol = document.createElement("div");
    newCol.classList.add("col-12");
    newCol.classList.add("col-md-3");
    let newCard = document.createElement("div");
    newCard.classList.add("card");
    let newCardBody = document.createElement("div");
    newCardBody.classList.add("card-body");
    let newCardTitle = document.createElement("h5");
    newCardTitle.classList.add("card-title");
    newCardTitle.innerHTML = "Most common engine size";
    let newCardText = document.createElement("p");
    newCardText.classList.add("card-text");
    newCardText.innerHTML = commonCC + `<small class="text-muted">cc</small>`;
    newCardBody.appendChild(newCardTitle);
    newCardBody.appendChild(newCardText);
    newCard.appendChild(newCardBody);
    newCol.appendChild(newCard);
    newRow.appendChild(newCol);
    dbStatsContainer.appendChild(newRow);
  }).finally(() => {
    indexContainer.appendChild(dbStatsContainer);
  })

}
