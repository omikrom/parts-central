window.onload = function () {
  console.log("window.onload");
  init();
};

function init() {
  let partList = document.getElementById("part_list");
  let data = [];
  let tr = document.createElement("tr");
  let th = document.createElement("th");
  axios.get("/parts/show_all").then((res) => {
    data = res.data;
    createTable(data);
  });
}

function createTable(data) {
  let partList = document.getElementById("part_list");
  let table = document.createElement("table");
  let tr = document.createElement("tr");
  let th = document.createElement("th");
  /* Create table header */
  th.innerHTML = "id";
  tr.appendChild(th);
  th = document.createElement("th");
  th.innerHTML = "Item No";
  tr.appendChild(th);
  th = document.createElement("th");
  th.innerHTML = "Vendor No";
  tr.appendChild(th);
  th = document.createElement("th");
  th.innerHTML = "Barcode No";
  tr.appendChild(th);
  th = document.createElement("th");
  th.innerHTML = "Bike Producer";
  tr.appendChild(th);
  th = document.createElement("th");
  th.innerHTML = "Bike Model";
  tr.appendChild(th);
  th = document.createElement("th");
  th.innerHTML = "CC";
  tr.appendChild(th);
  th = document.createElement("th");
  th.innerHTML = "Date From";
  tr.appendChild(th);
  th = document.createElement("th");
  th.innerHTML = "Date To";
  tr.appendChild(th);
  th = document.createElement("th");
  th.innerHTML = "Date On";
  tr.appendChild(th);
  th = document.createElement("th");
  th.innerHTML = "Country";
  tr.appendChild(th);
  th = document.createElement("th");
  th.innerHTML = "Update";
  tr.appendChild(th);
  th = document.createElement("th");
  th.innerHTML = "Delete";
  tr.appendChild(th);
  table.appendChild(tr);
  /*end of table header */

  /* Create table body */
  for (let i = 0; i < data.length; i++) {
    tr = document.createElement("tr");
    let td = document.createElement("td");
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
    td.innerHTML = data[i].barcodeNo;
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
    td.contentEditable = true;
    td.innerHTML = data[i].country;
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

  createUpdateListeners();
}

function createUpdateListeners() {
  let updateButtons = document.querySelectorAll(".updateBtn");
  updateButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      let id = e.target.value;
      let row = e.target.parentNode.parentNode;
      let itemNo = row.children[1].innerHTML;
      let vendorNo = row.children[2].innerHTML;
      let barcodeNo = row.children[3].innerHTML;
      let bikeProducer = row.children[4].innerHTML;
      let bikeModel = row.children[5].innerHTML;
      let cc = row.children[6].innerHTML;
      let date_from = row.children[7].innerHTML;
      let date_to = row.children[8].innerHTML;
      let date_on = row.children[9].innerHTML;
      let country = row.children[10].innerHTML;
      let data = {
        id: id,
        itemNo: itemNo,
        vendorNo: vendorNo,
        barcodeNo: barcodeNo,
        bikeProducer: bikeProducer,
        bikeModel: bikeModel,
        cc: cc,
        date_from: date_from,
        date_to: date_to,
        date_on: date_on,
        country: country,
      };
      axios.post("/parts/update", data).then((res) => {
        console.log(res.data);
      });
    });
  });
}
