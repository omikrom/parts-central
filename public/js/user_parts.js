window.onload = function () {
  console.log("window.onload");
  init();
};

function init() {
  let partsList = document.getElementById("part_list");
  partsList.innerHTML = "";

  let body = {
    token: sessionStorage.getItem("token"),
    userId: parseInt(sessionStorage.getItem("userId")),
    supplierId: parseInt(sessionStorage.getItem("supplierId")),
  };

  console.log("body", body);

  axios
    .post("/user/user_parts", body)
    .then((res) => {
      //axios.post("http://localhost:3000/user/user_parts", body).then((res) => {
      console.log("res.data", res.data);
      createTable(res.data);
    });

  async function createTable(data) {
    let tableHeadings = [
      " ",
      "#",
      "sku",
      "alt_sku",
      "part_name",
      "part #",
      "vendor #",
      "Fitting",
      "Edit",
      "Delete",
    ];


    function createTableHeader(tr, heading) {
      let th = document.createElement("th");
      th.scope = "col"
      th.innerHTML = heading;
      tr.appendChild(th);
    }
    let partList = document.getElementById("part_list");
    let table = document.createElement("table");
    table.classList.add("table");
    table.classList.add("table-dark");
    table.classList.add("table-bordered");
    table.setAttribute("id", "part_table");

    let tr = document.createElement("tr");
    /* Create table header */
    for (let i = 0; i < tableHeadings.length; i++) {
      createTableHeader(tr, tableHeadings[i]);
    }

    table.appendChild(tr);
    /*end of table header */

    console.log("data", data);

    /* Create table body */
    for (let i = 0; i < data.length; i++) {
      tr = document.createElement("tr");
      let td = document.createElement("td");
      td.scope = "row";
      td.innerHTML = "<input type='checkbox' class='form-check'></input>";
      tr.appendChild(td);
      td = document.createElement("td");
      td.innerHTML = data[i].id;
      tr.appendChild(td);
      td = document.createElement("td");
      td.contentEditable = true;
      td.innerHTML = data[i].sku;
      tr.appendChild(td);
      td = document.createElement("td");
      td.contentEditable = true;
      td.innerHTML = data[i].alt_sku;
      tr.appendChild(td);
      td = document.createElement("td");
      td.contentEditable = true;
      td.innerHTML = data[i].part_name;
      tr.appendChild(td);

      td = document.createElement("td");
      td.contentEditable = true;
      td.innerHTML = data[i].partNo;
      tr.appendChild(td);
      td = document.createElement("td");
      td.contentEditable = true;
      td.innerHTML = data[i].vendorNo;
      tr.appendChild(td);

      td = document.createElement("td");
      td.innerHTML = `<button class="fittingBtn" value="${data[i].id}">Fitting</button>`;
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
    createFittingListeners();
    closeFitment();
    addFitmentButton();


  }

  function addFitmentButton() {
    let addFitment = document.getElementById("add_fitment_btn");
    addFitment.addEventListener("click", () => {
      console.log('add row');

      let table = document.getElementById("fitment_table");
      let tr = document.createElement("tr");
      let td = document.createElement("td");
      td.contentEditable = true;
      td.innerHTML = "";
      tr.appendChild(td);
      td = document.createElement("td");
      td.contentEditable = true;
      td.innerHTML = "";
      tr.appendChild(td);
      td = document.createElement("td");
      td.contentEditable = true;
      td.innerHTML = "";
      tr.appendChild(td);
      td = document.createElement("td");
      td.contentEditable = true;
      td.innerHTML = "";
      tr.appendChild(td);
      td = document.createElement("td");
      td.contentEditable = true;
      td.innerHTML = "";
      tr.appendChild(td);
      td = document.createElement("td");
      td.contentEditable = true;
      td.innerHTML = "";
      tr.appendChild(td);
      td = document.createElement("td");
      td.contentEditable = true;
      td.innerHTML = "";
      tr.appendChild(td);
      td = document.createElement("td");
      td.innerHTML = `<button class="fitmentBtn" value="">Save</button>`;
      tr.appendChild(td);
      td = document.createElement("td");
      td.innerHTML = `<button class="fitmentBtn" value="">Delete</button>`;
      tr.appendChild(td);
      table.appendChild(tr);



    });
  }

  function createUpdateListeners() {
    let updateButtons = document.querySelectorAll(".updateBtn");
    updateButtons.forEach((button) => {
      console.log("button", button);
      button.addEventListener("click", (e) => {
        console.log("click");
        let id = e.target.value;
        let row = e.target.parentNode.parentNode;
        let sku = row.children[2].innerHTML;
        let alt_sku = row.children[3].innerHTML;
        let part_name = row.children[4].innerHTML;
        let partNo = row.children[5].innerHTML;
        let vendorNo = row.children[6].innerHTML;

        let data = {
          id: id,
          partSKU: sku,
          partAltSKU: alt_sku,
          partName: part_name,
          partNo: partNo,
          vendorNo: vendorNo,
          userId: sessionStorage.getItem("userId"),
          supplierId: sessionStorage.getItem("supplierId"),
          token: sessionStorage.getItem("token"),
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
        let displayBikeId =
          e.target.parentNode.parentNode.children[4].innerHTML;
        let data = {
          id: id,
          displayBikeId: displayBikeId,
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

  function createFittingListeners() {
    let fittingButtons = document.querySelectorAll(".fittingBtn");
    fittingButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        let fitmentSection = document.getElementById("fitment_section");
        fitmentSection.style.display = "block";
        let partId = e.target.value;
        let supplierId = sessionStorage.getItem("supplierId");
        let fitmentDisplay = document.getElementById("fitment_table");
        fitmentDisplay.innerHTML = "";
        console.log("partId", partId);
        console.log("supplierId", supplierId);
        axios.get(`/user/get_fitment/${supplierId}/${partId}`).then((res) => {
          createTable(res.data, fitmentDisplay, partId);
        });


        function createTable(data, fitmentDisplay, partId) {
          console.log("data", data);

          let fitment_part_display = document.getElementById("fitment_partNo");
          fitment_part_display.innerHTML = partId
          let fitment_sku_display = document.getElementById("fitment_part_sku");
          fitment_sku_display.innerHTML = data[0].sku;

          // create columns for fitment table
          let table = fitmentDisplay;
          table.classList.add("table");
          table.classList.add("table-striped");
          table.classList.add("table-bordered");
          table.classList.add("table-hover");
          table.classList.add("table-sm");
          table.classList.add("table-responsive");
          table.classList.add("table-fitment");
          let tr = document.createElement("tr");
          let th = document.createElement("th");
          th.innerHTML = "Type";
          tr.appendChild(th);
          th = document.createElement("th");
          th.innerHTML = "Make";
          tr.appendChild(th);
          th = document.createElement("th");
          th.innerHTML = "Model";
          tr.appendChild(th);
          th = document.createElement("th");
          th.innerHTML = "CC";
          tr.appendChild(th);
          th = document.createElement("th");
          th.innerHTML = "Year From";
          tr.appendChild(th);
          th = document.createElement("th");
          th.innerHTML = "Year To";
          tr.appendChild(th);
          th = document.createElement("th");
          th.innerHTML = "Year On";
          tr.appendChild(th);
          th = document.createElement("th");
          th.innerHTML = "Action";
          tr.appendChild(th);
          table.appendChild(tr);

          // create rows for fitment table
          for (let i = 0; i < data.length; i++) {
            tr = document.createElement("tr");
            let td = document.createElement("td");
            td.contentEditable = true;
            td.innerHTML = data[i].type;
            tr.appendChild(td);
            td = document.createElement("td");
            td.contentEditable = true;
            td.innerHTML = data[i].manufacturer;
            tr.appendChild(td);
            td = document.createElement("td");
            td.contentEditable = true;
            td.innerHTML = data[i].model;
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
            td.innerHTML = `<button class="fitmentBtn" value="${data[i].id}">Update</button>`;
            tr.appendChild(td);
            td = document.createElement("td");
            td.innerHTML = `<button class="fitmentBtn" value="${data[i].id}">Delete</button>`;
            tr.appendChild(td);
            table.appendChild(tr);
          }
        }


      });

    });
  }

  function closeFitment() {
    let close = document.getElementById("close_fitment");
    close.addEventListener("click", function (e) {
      e.preventDefault();
      let fitment = document.getElementById("fitment_section");
      fitment.style.display = "none";
    });
  }
}
