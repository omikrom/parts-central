window.onload = function () {
  let token = sessionStorage.getItem("token");
  if (token === null) {
    window.location.href = "/login";
  } else {
    axios.defaults.headers.common["x-access-token"] = token;
  }
  init();
};


//global pagination properties
var offset = 0;
var limit = 10;
var updated = 0;
var created = false;
let currentPage = 1;
let totalPages = 0;
let minPage = 0;
let maxPage = 0;




function calculateTotalPages() {
  let entries = document.getElementById("show_entries");
  let sId = sessionStorage.getItem("supplierId");
  let count = 0;
  let pages = 0;


  axios.get(`/user/part_count/${sId}`).then((res) => {
    count = parseInt(res.data);
    pages = Math.ceil(count / entries.value);
    totalPages = pages;
    let part_pages = document.getElementById("part_pages");
    part_pages.innerHTML = "";

    if (pages <= 1) {
      return;
    }

    minPage = currentPage - 2;
    maxPage = currentPage + 2;

    if (minPage < 1) {
      minPage = 1;
      maxPage = 5;
    }

    if (maxPage > totalPages) {
      maxPage = totalPages;
      minPage = totalPages - 4;
    }


    let pageList = document.createElement("ul");
    pageList.classList.add("pagination");
    pageList.classList.add("justify-content-center");
    pageList.setAttribute("id", "page_list");
    part_pages.appendChild(pageList);

    // first page button
    let liFirst = document.createElement("li");
    liFirst.classList.add("page-item");
    let aFirst = document.createElement("a");
    aFirst.classList.add("page-link");
    aFirst.setAttribute("id", "page_first");
    aFirst.innerHTML = `<i class="fa fa-fast-backward"></i>`;
    liFirst.appendChild(aFirst);
    pageList.appendChild(liFirst);

    // first page button event listener
    aFirst.addEventListener("click", (e) => {
      e.preventDefault();
      if (currentPage > 1) {
        offset = 0;
        currentPage = 1;
        console.log("offset", offset);
        init();
      }
    });


    // Previous button
    let liPrev = document.createElement("li");
    liPrev.classList.add("page-item");
    let aPrev = document.createElement("a");
    aPrev.classList.add("page-link");
    aPrev.setAttribute("id", "page_prev");
    aPrev.innerHTML = `<i class="fa fa-angle-double-left"></i>`;
    liPrev.appendChild(aPrev);
    pageList.appendChild(liPrev);


    if (currentPage == 1) {
      aPrev.classList.add("disabled");
    } else {
      aPrev.classList.remove("disabled");
    }

    // prev button event listener

    aPrev.addEventListener("click", (e) => {
      e.preventDefault();
      if (currentPage > 1) {
        offset = (currentPage - 2) * entries.value;
        currentPage = currentPage - 1;
        console.log("offset", offset);
        init();
      }
    });

    // Page numbers

    for (let i = minPage; i <= maxPage; i++) {
      let li = document.createElement("li");
      li.classList.add("page-item");

      let a = document.createElement("a");
      a.classList.add("page-link");

      a.setAttribute("id", `page_${i}`);

      a.innerHTML = i;

      li.appendChild(a);
      pageList.appendChild(li);

      if (currentPage == i) {
        a.classList.add("active");
      } else {
        a.classList.remove("active");
      }

      a.addEventListener("click", (e) => {
        e.preventDefault();
        offset = (i - 1) * entries.value;
        currentPage = i;
        console.log("offset", offset);
        init();
      });
    }

    // Next button
    let liNext = document.createElement("li");
    liNext.classList.add("page-item");
    let aNext = document.createElement("a");
    aNext.classList.add("page-link");
    aNext.setAttribute("id", "page_next");
    aNext.innerHTML = `<i class="fa fa-angle-double-right" aria-hidden="false"></i>`;
    liNext.appendChild(aNext);
    pageList.appendChild(liNext);

    if (currentPage == totalPages) {
      aNext.classList.add("disabled");
    } else {
      aNext.classList.remove("disabled");
    }

    aNext.addEventListener("click", (e) => {
      e.preventDefault();
      if (currentPage < totalPages) {
        offset = currentPage * entries.value;
        currentPage = currentPage + 1;
        console.log("offset", offset);
        init();
      }
    });

    // Last page button
    let liLast = document.createElement("li");
    liLast.classList.add("page-item");
    let aLast = document.createElement("a");
    aLast.classList.add("page-link");
    aLast.setAttribute("id", "page_last");
    aLast.innerHTML = `<i class="fa fa-fast-forward" aria-hidden="true"></i>`;
    liLast.appendChild(aLast);
    pageList.appendChild(liLast);

    aLast.addEventListener("click", (e) => {
      e.preventDefault();
      if (currentPage < totalPages) {
        offset = (totalPages - 1) * entries.value;
        currentPage = totalPages;
        console.log("offset", offset);
        init();
      }
    });

    if (currentPage == minPage) {
      aFirst.classList.add("disabled");
    } else {
      aFirst.classList.remove("disabled");
    }

    if (currentPage == maxPage) {
      aLast.classList.add("disabled");
    } else {
      aLast.classList.remove("disabled");
    }

    // goto page

    // create ul
    let gotoUl = document.createElement("ul");
    gotoUl.classList.add("pagination");
    gotoUl.classList.add("justify-content-center");
    gotoUl.setAttribute("id", "goto_ul");
    part_pages.appendChild(gotoUl);

    let liGoToInput = document.createElement("li");
    liGoToInput.classList.add("page-item");
    let aGoToInput = document.createElement("input");
    aGoToInput.classList.add("page-link");
    aGoToInput.classList.add("goto-page");
    aGoToInput.setAttribute("id", "page_goto_input");
    aGoToInput.setAttribute("type", "number");
    aGoToInput.setAttribute("min", "1");
    aGoToInput.setAttribute("max", totalPages);
    aGoToInput.setAttribute("value", currentPage);
    liGoToInput.appendChild(aGoToInput);
    gotoUl.appendChild(liGoToInput);

    // goto page button
    let liGoto = document.createElement("li");
    liGoto.classList.add("page-item");
    let aGoto = document.createElement("a");
    aGoto.classList.add("page-link");
    aGoto.setAttribute("id", "page_goto");
    aGoto.innerHTML = "Go to page";
    liGoto.appendChild(aGoto);
    gotoUl.appendChild(liGoto);
    // of total pages
    let liOf = document.createElement("li");
    liOf.classList.add("page-item");
    let aOf = document.createElement("a");
    aOf.classList.add("page-link");
    aOf.setAttribute("id", "page_of");
    aOf.innerHTML = `of ${totalPages}`;
    liOf.appendChild(aOf);
    gotoUl.appendChild(liOf);


    aGoto.addEventListener("click", (e) => {
      e.preventDefault();
      let gotoPage = parseInt(document.getElementById("page_goto_input").value);
      if (gotoPage >= 1 && gotoPage <= totalPages) {
        offset = (gotoPage - 1) * entries.value;
        currentPage = gotoPage;
        console.log("offset", offset);
        init();
      }
    });

  });

}


function entriesChange() {
  console.log("offset", offset);
  let entries = document.getElementById("show_entries");
  let sId = sessionStorage.getItem("supplierId");
  entries.addEventListener("change", function (e) {
    offset = 0;
    limit = entries.value;
    currentPage = 1;
    calculateTotalPages();
    init();
  });
}

function init() {
  let partsList = document.getElementById("part_list");
  partsList.innerHTML = "";

  console.log("limit", limit);

  calculateTotalPages();
  entriesChange();

  let body = {
    token: sessionStorage.getItem("token"),
    userId: parseInt(sessionStorage.getItem("userId")),
    supplierId: parseInt(sessionStorage.getItem("supplierId")),
  };

  axios.post(`/user/user_parts/${limit}/${offset}`, body).then((res) => {
    createTableMain(res.data);
  });

  updated += 1;
  if (updated > 1) {
    created = true;
    updated = 1;
  }

  let search = document.getElementById("search");
  search.value = "";

  search.addEventListener("change", (e) => {
    e.preventDefault();
    let searchValue = search.value;
    let body = {
      token: sessionStorage.getItem("token"),
      userId: parseInt(sessionStorage.getItem("userId")),
      supplierId: parseInt(sessionStorage.getItem("supplierId")),
      search: searchValue,
    };

    axios.post(`/user/user_parts/${limit}/${offset}`, body).then((res) => {
      created = true;
      createTableMain(res.data);
    });
  });

}

async function createTableMain(data) {
  console.log("created", created);
  if (created) {
    var partList = document.getElementById("part_list");
    partList.innerHTML = "";
  }
  let tableHeadings = [
    "<input type='checkbox' id='check_all'/>",
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

  partList = document.getElementById("part_list");
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
    td.classList.add("text-center");
    tr.appendChild(td);

    td = document.createElement("td");
    td.innerHTML = `<button class="updateBtn text-dark" value="${data[i].id}"><i class="fa-solid fa-floppy-disk"></i></button>`;
    td.classList.add("text-center");
    tr.appendChild(td);
    td = document.createElement("td");
    td.classList.add("text-center");
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

  // style table rows
  let tableRows = document.getElementsByTagName("tr");
  for (let i = 0; i < tableRows.length; i++) {
    if (i == 0) {
      tableRows[i].classList.add("tb_heading");
    }
    if (i % 2 == 0 && i != 0) {
      tableRows[i].classList.add("tb_dark");
    } else if (i % 2 == 1 && i != 0) {
      tableRows[i].classList.add("tb_light");
    }
  }

  stripedBtnBackgrounds("fittingBtn");
  stripedBtnBackgrounds("updateBtn");
  stripedBtnBackgrounds("deleteBtn");

  createUpdateListeners();
  createDeleteListeners();
  createFittingListeners();
  closeFitment();
  addFitmentButton();
  closeAddFitment();
  checkAllCheckboxes();
}

function stripedBtnBackgrounds(className) {
  let btns = document.getElementsByClassName(className);
  for (let i = 0; i < btns.length; i++) {
    if (i % 2 == 0) {
      btns[i].classList.add("tb_light");
    } else {
      btns[i].classList.add("tb_dark");
    }
  }
}

function createTableHeader(tr, heading) {
  let th = document.createElement("th");
  th.scope = "col";
  th.innerHTML = heading;

  if (heading == "Fitting") {
    th.classList.add("text-center");
  }
  if (heading == "Edit") {
    th.classList.add("text-center");
  }
  if (heading == "Delete") {
    th.classList.add("text-center");
  }
  tr.appendChild(th);
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
    axios.post("/user/add_fitment", body).then((res) => {
      console.log("res:", res);
    });
  });
}

function createUpdateListeners() {
  let updateButtons = document.querySelectorAll(".updateBtn");
  updateButtons.forEach((button) => {
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
      sessionStorage.setItem("partId", id);
      let partId = id;
      let supplierId = sessionStorage.getItem("supplierId");
      let fitmentDisplay = document.getElementById("fitment_table");
      fitmentDisplay.innerHTML = "";

      axios.get(`/user/get_fitment/${supplierId}/${partId}`).then((res) => {
        createTable(res.data, fitmentDisplay, partId);
      });
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

function closeFitment() {
  let close = document.getElementById("close_fitment");
  close.addEventListener("click", function (e) {
    e.preventDefault();
    let fitment = document.getElementById("fitment_section");
    fitment.style.display = "none";
  });
}

function createTable(data, fitmentDisplay, partId) {
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
    sessionStorage.setItem("sku", data[0].sku);

    // create columns for fitment table
    let table = fitmentDisplay;
    table.classList.add("table");
    table.classList.add("table-light");
    table.classList.add("table-bordered");
    table.classList.add("table-hover");
    table.classList.add("table-sm");
    table.classList.add("table-fitment");
    table.classList.add("text-dark");
    let tr = document.createElement("tr");
    tr.classList.add("tb_heading");
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
    th.classList.add("text-center");
    tr.appendChild(th);
    th = document.createElement("th");
    th.innerHTML = "Delete";
    th.classList.add("text-center");
    tr.appendChild(th);
    table.appendChild(tr);

    // create rows for fitment table
    for (let i = 0; i < data.length; i++) {
      tr = document.createElement("tr");
      tr.classList.add("table-light");
      let td = document.createElement("td");
      td.classList.add("table_row--element");
      td.contentEditable = false;
      td.innerHTML = data[i].fitting_id;
      tr.appendChild(td);
      td = document.createElement("td");
      td.classList.add("table_row--element");
      td.contentEditable = true;
      td.innerHTML = data[i].type;
      tr.appendChild(td);
      td = document.createElement("td");
      td.classList.add("table_row--element");
      td.contentEditable = true;
      td.innerHTML = data[i].manufacturer;
      tr.appendChild(td);
      td = document.createElement("td");
      td.classList.add("table_row--element");
      td.contentEditable = true;
      td.innerHTML = data[i].model;
      tr.appendChild(td);
      td = document.createElement("td");
      td.classList.add("table_row--element");
      td.contentEditable = true;
      td.innerHTML = data[i].display_name;
      tr.appendChild(td);
      td = document.createElement("td");
      td.classList.add("table_row--element");
      td.contentEditable = true;
      td.innerHTML = data[i].cc;
      tr.appendChild(td);
      td = document.createElement("td");
      td.classList.add("table_row--element");
      td.contentEditable = true;
      td.innerHTML = data[i].date_from;
      tr.appendChild(td);
      td = document.createElement("td");
      td.classList.add("table_row--element");
      td.contentEditable = true;
      td.innerHTML = data[i].date_to;
      tr.appendChild(td);
      td = document.createElement("td");
      td.classList.add("table_row--element");
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
      td.classList.add("text-center");
      td.innerHTML = `<button class="fitmentBtnUpd" value="${data[i].fitting_id}"><i class="fa-solid fa-floppy-disk"></i></button>`;
      tr.appendChild(td);
      td = document.createElement("td");
      td.classList.add("text-center");
      td.innerHTML = `<button class="fitmentBtnDel" value="${data[i].fitting_id}"><i class="fa-solid fa-trash"></i></button>`;
      tr.appendChild(td);
      table.appendChild(tr);
    }
    fitmentUpdateBtns();
    fitmentDeleteBtns();
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

function checkAllCheckboxes() {
  let topCheckbox = document.getElementById("check_all");
  topCheckbox.addEventListener("change", function (e) {
    e.preventDefault();
    console.log(e.currentTarget.checked);
    let checkboxes = document.getElementsByClassName("form-check");
    for (let i = 0; i < checkboxes.length; i++) {
      checkboxes[i].checked = e.currentTarget.checked;
    }
  })
}
