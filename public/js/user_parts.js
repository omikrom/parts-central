window.onload = function () {
  console.log("window.onload");
  init();
};

function init() {
  let body = {
    token: sessionStorage.getItem("token"),
    userId: parseInt(sessionStorage.getItem("userId")),
  };

  console.log("body", body);

  axios.post("http://localhost:3000/user/user_parts", body).then((res) => {
    console.log("res.data", res.data);
    createTable(res.data);
  });

  function createTable(data) {
    let partList = document.getElementById("part_list");
    let table = document.createElement("table");
    table.classList.add("table");
    let tr = document.createElement("tr");
    let th = document.createElement("th");
    th.scope = "col";
    /* Create table header */
    th.innerHTML = "id";
    tr.appendChild(th);
    th = document.createElement("th");
    th.scope = "col";
    th.innerHTML = "Item No";
    tr.appendChild(th);
    th = document.createElement("th");
    th.scope = "col";
    th.innerHTML = "Vendor No";
    tr.appendChild(th);
    th = document.createElement("th");
    th.scope = "col";
    th.innerHTML = "Bike Producer";
    tr.appendChild(th);
    th = document.createElement("th");
    th.scope = "col";
    th.innerHTML = "Bike Model";
    tr.appendChild(th);
    th = document.createElement("th");
    th.scope = "col";
    th.innerHTML = "CC";
    tr.appendChild(th);
    th = document.createElement("th");
    th.scope = "col";
    th.innerHTML = "Date From";
    tr.appendChild(th);
    th = document.createElement("th");
    th.scope = "col";
    th.innerHTML = "Date To";
    tr.appendChild(th);
    th = document.createElement("th");
    th.scope = "col";
    th.innerHTML = "Date On";
    tr.appendChild(th);
    th = document.createElement("th");
    th.scope = "col";
    th.innerHTML = "Update";
    tr.appendChild(th);
    th = document.createElement("th");
    th.scope = "col";
    th.innerHTML = "Delete";
    tr.appendChild(th);
    table.appendChild(tr);
    /*end of table header */

    /* Create table body */
    for (let i = 0; i < data.length; i++) {
      tr = document.createElement("tr");
      let td = document.createElement("td");
      td.scope = "row";
      td.innerHTML = data[i].id;
      tr.appendChild(td);
      td = document.createElement("td");
      td.contentEditable = true;
      td.innerHTML = data[i].itemNo;
      tr.appendChild(td);
      td = document.createElement("td");
      td.contentEditable = true;
      td.innerHTML = data[i].vendorNo;
      tr.appendChild(td);
      td = document.createElement("td");
      td.contentEditable = true;
      td.innerHTML = data[i].bikeProducer;
      tr.appendChild(td);
      td = document.createElement("td");
      td.contentEditable = true;
      td.innerHTML = data[i].bikeModel;
      tr.appendChild(td);
      td = document.createElement("td");
      td.contentEditable = true;
      td.innerHTML = data[i].cc;
      tr.appendChild(td);
      td = document.createElement("td");
      td.contentEditable = true;
      td.innerHTML = data[i].date_from;
      tr.appendChild(td);
      td = document.createElement("td");
      td.contentEditable = true;
      td.innerHTML = data[i].date_to;
      tr.appendChild(td);
      td = document.createElement("td");
      td.contentEditable = true;
      td.innerHTML = data[i].date_on;
      tr.appendChild(td);
      td = document.createElement("td");
      td.innerHTML = `<button class="updateBtn" value="${data[i].id}">Update</button>`;
      tr.appendChild(td);
      td = document.createElement("td");
      td.innerHTML = `<button class="deleteBtn" value="${data[i].id}">Delete</button>`;
      tr.appendChild(td);
      table.appendChild(tr);
    }
    partList.appendChild(table);

    // add class to all td elements
    let tdata = document.getElementsByTagName("td");
    for (let i = 0; i < tdata.length; i++) {
      tdata[i].classList.add("table_row--element");
    }
    let theading = document.getElementsByTagName("th");
    for (let i = 0; i < theading.length; i++) {
      theading[i].classList.add("table_row--headings");
    }

    createUpdateListeners();
    createDeleteListeners();
  }

  function createUpdateListeners() {
    let updateButtons = document.querySelectorAll(".updateBtn");
    updateButtons.forEach((button) => {
      console.log("button", button);
      button.addEventListener("click", (e) => {
        console.log("click");
        let id = e.target.value;
        let row = e.target.parentNode.parentNode;
        let itemNo = row.children[1].innerHTML;
        let vendorNo = row.children[2].innerHTML;
        let bikeProducer = row.children[3].innerHTML;
        let bikeModel = row.children[4].innerHTML;
        let cc = row.children[5].innerHTML;
        let date_from = row.children[6].innerHTML;
        let date_to = row.children[7].innerHTML;
        let date_on = row.children[8].innerHTML;
        let data = {
          id: id,
          itemNo: itemNo,
          vendorNo: vendorNo,
          bikeProducer: bikeProducer,
          bikeModel: bikeModel,
          cc: cc,
          date_from: date_from,
          date_to: date_to,
          date_on: date_on,
        };
        axios.post("/user/update_part", data).then((res) => {
          console.log("res", res);
        });
        console.log(data);
      });
    });
  }

  function createDeleteListeners() {
    let deleteButtons = document.querySelectorAll(".deleteBtn");
    deleteButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        let id = e.target.value;
        let data = {
          id: id,
        };
        axios
          .delete("/user/delete_part", {
            data: data,
            headers: {
              "Content-Type": "application/json",
            },
          })
          .then((res) => {
            // update form
            console.log("res", res);
            init();
          });
      });
    });
  }
}
