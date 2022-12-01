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

  axios.post("/user/user_parts", body).then((res) => {
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
      "alt part #",
      "alt vendor #",
      "Fitting",
      "Edit",
      "Delete",
    ];

    function createTableHeader(tr, heading) {
      let th = document.createElement("th");
      th.scope = "col";
      th.innerHTML = heading;
      tr.appendChild(th);
    }
    let partList = document.getElementById("part_list");
    let table = document.createElement("table");
    table.classList.add("table");
    table.classList.add("table-light");
    table.classList.add("table-bordered");
    table.classList.add("table-hover");
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
      td.innerHTML = `<button class="fittingBtn text-dark" value="${data[i].id}"><i class="fa-solid fa-gears"></i></button>`;
      tr.appendChild(td);

      td = document.createElement("td");
      td.innerHTML = `<button class="updateBtn text-dark" value="${data[i].id}"><i class="fa-solid fa-floppy-disk"></i></button>`;
      tr.appendChild(td);
      td = document.createElement("td");
      td.innerHTML = `<button class="deleteBtn text-dark" value="${data[i].id}"><i class="fa-solid fa-trash"></i></button>`;
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
    closeAddFitment();
  }

  function addFitmentButton() {
    let addFitment = document.getElementById("add_fitment_btn");
    addFitment.addEventListener("click", () => {
      let sId = sessionStorage.getItem("supplierId");
      let partId = sessionStorage.getItem("partId");
      let partSku = document.getElementById("fitment_add--sku");
      let addFittingContainer = document.getElementsByClassName(
        "fitment_add_fitting"
      );
      console.log("addFittingContainer", addFittingContainer);
      addFittingContainer[0].style.display = "block";
      partSku.innerHTML = sessionStorage.getItem("sku");
      createNewFitmentListener(sId, partId);
    });
  }

  function createNewFitmentListener(sId, partId) {
    let newFitmentSubmitBtn = document.getElementById("add_fitment_submit");
    newFitmentSubmitBtn.addEventListener("click", (e) => {
      e.preventDefault();
      let type = document.getElementById("add_fitting_type");
      let make = document.getElementById("add_fitting_make");
      let model = document.getElementById("add_fitting_model");
      let display_name = document.getElementById("add_fitting_display_name");
      let cc = document.getElementById("add_fitting_cc");
      let year_from = document.getElementById("add_fitting_year_from");
      let year_to = document.getElementById("add_fitting_year_to");
      let year_on = document.getElementById("add_fitting_year_on");
      let year_on_value = 0;
      if (year_on.checked == true) {
        year_on_value = 1;
      } else {
        year_on_value = 0;
      }
      let body = {
        supplierId: sId,
        partId: partId,
        type: type.value,
        manufacturer: make.value,
        model: model.value,
        display_name: display_name.value,
        cc: cc.value,
        date_from: year_from.value,
        date_to: year_to.value,
        date_on: year_on_value,
      };
      console.log("body", body);
      console.log("submit");
      axios.post("/user/add_fitment", body).then((res) => {
        console.log("res:", res);
      });
    });
  }

  function closeAddFitment() {
    let closeBtn = document.getElementById("addFitting--close_btn");
    closeBtn.addEventListener("click", () => {
      let addFittingContainer = document.getElementsByClassName(
        "fitment_add_fitting"
      );
      addFittingContainer[0].style.display = "none";
    });
  }

  function createUpdateListeners() {
    let updateButtons = document.querySelectorAll(".updateBtn");
    updateButtons.forEach((button) => {
      console.log("button", button);
      button.addEventListener("click", (e) => {
        console.log("click");
        let button = e.currentTarget;
        let id = button.value;
        sessionStorage.setItem("partId", id);
        let row = e.currentTarget.parentNode.parentNode;
        let sku = row.children[2].innerHTML;
        sessionStorage.setItem("sku", sku);
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
          supplierId: sessionStorage.getItem("supplierId"),
          token: sessionStorage.getItem("token"),
        };
        axios.post("/user/update_part", data).then((res) => {
          console.log("res", res);
        });
      });
    });
  }

  function createDeleteListeners() {
    let deleteButtons = document.querySelectorAll(".deleteBtn");
    deleteButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        let button = e.currentTarget;
        let id = button.value;
        let data = {
          id: id,
          sId: sessionStorage.getItem("supplierId"),
        };
        axios
          .delete("/user/delete_part", {
            data: data,
            headers: {
              "Content-Type": "application/json",
            },
          })
          .then((res) => {
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
        let id = e.currentTarget.value;
        console.log("id", id);
        sessionStorage.setItem("partId", id);
        console.log("id", id);
        let partId = id;
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

          if (data.length == 0) {
            let tr = document.createElement("tr");
            let td = document.createElement("td");
            td.innerHTML = "No Fitment Data";
            tr.appendChild(td);
            fitmentDisplay.appendChild(tr);
          }

          if (data.length > 0 && data.length != 0) {
            let fitment_part_display =
              document.getElementById("fitment_partNo");
            fitment_part_display.innerHTML = partId;
            let fitment_sku_display =
              document.getElementById("fitment_part_sku");
            fitment_sku_display.innerHTML = data[0].sku;
            sessionStorage.setItem("sku", data[0].sku);

            // create columns for fitment table
            let table = fitmentDisplay;
            table.classList.add("table");
            table.classList.add("table-striped");
            table.classList.add("table-bordered");
            table.classList.add("table-hover");
            table.classList.add("table-sm");
            table.classList.add("table-fitment");
            table.classList.add("text-dark");
            let tr = document.createElement("tr");
            let th = document.createElement("th");
            th.innerHTML = "#";
            tr.appendChild(th);
            th = document.createElement("th");
            th.innerHTML = "Type";
            tr.appendChild(th);
            th = document.createElement("th");
            th.innerHTML = "Make";
            tr.appendChild(th);
            th = document.createElement("th");
            th.innerHTML = "Model";
            tr.appendChild(th);
            th = document.createElement("th");
            th.innerHTML = "Display name";
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
            th.innerHTML = "Update";
            tr.appendChild(th);
            th = document.createElement("th");
            th.innerHTML = "Delete";
            tr.appendChild(th);
            table.appendChild(tr);

            // create rows for fitment table
            for (let i = 0; i < data.length; i++) {
              tr = document.createElement("tr");
              let td = document.createElement("td");
              td.contentEditable = false;
              td.innerHTML = data[i].fitting_id;
              tr.appendChild(td);
              td = document.createElement("td");
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
              td.innerHTML = data[i].display_name;
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
              td.contentEditable = false;
              td.innerHTML =
                "<input type='checkbox' name='myTextEditBox' value='checked' />";
              let child = td.childNodes;
              if (data[i].date_on == 1) {
                child[0].checked = true;
              } else {
                child[0].checked = false;
              } //td.innerHTML = data[i].date_on;
              tr.appendChild(td);
              td = document.createElement("td");
              td.innerHTML = `<button class="fitmentBtnUpd" value="${data[i].fitting_id}"><i class="fa-solid fa-floppy-disk"></i></button>`;
              tr.appendChild(td);
              td = document.createElement("td");
              td.innerHTML = `<button class="fitmentBtnDel" value="${data[i].fitting_id}"><i class="fa-solid fa-trash"></i></button>`;
              tr.appendChild(td);
              table.appendChild(tr);
            }
            fitmentUpdateBtns();
            fitmentDeleteBtns();
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

function fitmentUpdateBtns() {
  let fitmentBtns = document.querySelectorAll(".fitmentBtnUpd");
  fitmentBtns.forEach((btn) => {
    btn.addEventListener("click", function (e) {
      let fitting_id = e.currentTarget.value;
      let row = e.currentTarget.parentElement.parentElement;
      let type = row.children[1].innerHTML;
      let manufacturer = row.children[2].innerHTML;
      let model = row.children[3].innerHTML;
      let display_name = row.children[4].innerHTML;
      let cc = row.children[5].innerHTML;
      let date_from = row.children[6].innerHTML;
      let date_to = row.children[7].innerHTML;
      let date_on = row.children[8].children[0].checked;
      let partId = sessionStorage.getItem("partId");

      if (date_on == true) {
        date_on = 1;
      } else {
        date_on = 0;
      }

      let data = {
        fitting_id: fitting_id,
        type: type,
        manufacturer: manufacturer,
        model: model,
        display_name: display_name,
        cc: cc,
        date_from: date_from,
        date_to: date_to,
        date_on: date_on,
        partId: partId,
      };

      axios.post("/user/update_fitment", data).then((res) => {
        console.log(res.data);
        if (res.data.message == "Fitment updated successfully") {
          alert("Fitment updated successfully");
        } else {
          alert("Fitment update failed");
        }
      });
    });
  });
}

function fitmentDeleteBtns() {
  let fitmentBtns = document.querySelectorAll(".fitmentBtnDel");
  fitmentBtns.forEach((btn) => {
    btn.addEventListener("click", function (e) {
      let fitting_id = e.currentTarget.value;
      let partId = sessionStorage.getItem("partId");

      let data = {
        fitting_id: fitting_id,
        partId: partId,
        sId: sessionStorage.getItem("supplierId"),
      };

      axios.post("/user/delete_fitment", data).then((res) => {
        console.log(res.data);
        if (res.data.message == "Fitment deleted successfully") {
          alert("Fitment deleted successfully");
          updateFitmentTable();
        } else {
          alert("Fitment delete failed");
        }
      });
    });
  });
}

function updateFitmentTable() {
  let fitmentDisplay = document.getElementById("fitment_table");
  fitmentDisplay.innerHTML = "";
  let partId = sessionStorage.getItem("partId");
  let supplierId = sessionStorage.getItem("supplierId");

  axios.get(`/user/get_fitment/${supplierId}/${partId}`).then((res) => {
    createFitmentTable(res.data, fitmentDisplay, partId);
  });

  function createFitmentTable(data, fitmentDisplay, partId) {
    if (data.length == 0) {
      let tr = document.createElement("tr");
      let td = document.createElement("td");
      td.innerHTML = "No Fitment Data";
      tr.appendChild(td);
      fitmentDisplay.appendChild(tr);
    }

    if (data.length > 0 && data.length != 0) {
      let fitment_part_display = document.getElementById("fitment_partNo");
      fitment_part_display.innerHTML = partId;
      let fitment_sku_display = document.getElementById("fitment_part_sku");
      fitment_sku_display.innerHTML = data[0].sku;

      // create columns for fitment table
      let table = fitmentDisplay;
      table.classList.add("table");
      table.classList.add("table-striped");
      table.classList.add("table-bordered");
      table.classList.add("table-hover");
      table.classList.add("table-sm");
      table.classList.add("table-fitment");
      table.classList.add("text-dark");
      let tr = document.createElement("tr");
      let th = document.createElement("th");
      th.innerHTML = "#";
      tr.appendChild(th);
      th = document.createElement("th");
      th.innerHTML = "Type";
      tr.appendChild(th);
      th = document.createElement("th");
      th.innerHTML = "Make";
      tr.appendChild(th);
      th = document.createElement("th");
      th.innerHTML = "Model";
      tr.appendChild(th);
      th = document.createElement("th");
      th.innerHTML = "Display name";
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
      th.innerHTML = "Update";
      tr.appendChild(th);
      th = document.createElement("th");
      th.innerHTML = "Delete";
      tr.appendChild(th);
      table.appendChild(tr);

      // create rows for fitment table
      for (let i = 0; i < data.length; i++) {
        tr = document.createElement("tr");
        let td = document.createElement("td");
        td.contentEditable = false;
        td.innerHTML = data[i].fitting_id;
        tr.appendChild(td);
        td = document.createElement("td");
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
        td.innerHTML = data[i].display_name;
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
        td.contentEditable = false;
        td.innerHTML =
          "<input type='checkbox' name='myTextEditBox' value='checked' />";
        let child = td.childNodes;
        if (data[i].date_on == 1) {
          child[0].checked = true;
        } else {
          child[0].checked = false;
        } //td.innerHTML = data[i].date_on;
        tr.appendChild(td);
        td = document.createElement("td");
        td.innerHTML = `<button class="fitmentBtnUpd" value="${data[i].fitting_id}"><i class="fa-solid fa-floppy-disk"></i></button>`;
        tr.appendChild(td);
        td = document.createElement("td");
        td.innerHTML = `<button class="fitmentBtnDel" value="${data[i].fitting_id}"><i class="fa-solid fa-trash"></i></button>`;
        tr.appendChild(td);
        table.appendChild(tr);
      }
      fitmentUpdateBtns();
      fitmentDeleteBtns();
    }
  }
}
