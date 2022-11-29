window.onload = function () {
  init();
  console.log(sessionStorage.getItem("supplierId"));
};

function init() {
  let supplierId = sessionStorage.getItem("supplierId");
  let form = document.getElementById("create_part_form");
  let add_first_row = document.getElementById("add_fit");
  let fitmentContainer = document.getElementById("part_fitment");
  let fitmentRow = document.getElementById("part_fitment--row");
  let remove_first_row = document.getElementById("remove_fit");

  let formSubmit = document.getElementById("create_part_submit");

  formSubmit.addEventListener("click", function (e) {
    e.preventDefault();
    let partName = document.getElementById("part_name").value;
    let partSku = document.getElementById("part_number").value;
    let alt_part_number = document.getElementById("alt_part_number").value;
    let alt_vendor_number = document.getElementById("alt_vendor_number").value;
    let alt_sku = document.getElementById("alt_sku_number").value;

    let body = {
      token: sessionStorage.getItem("token"),
      supplierId: supplierId,
      part: {
        part_name: partName,
        part_sku: partSku,
      },
      alt_part_numbers: {
        alt_part_no: alt_part_number,
        alt_vendor_no: alt_vendor_number,
        alt_sku_no: alt_vendor_number,
      },
      fittings: [],
    };

    let fittingRow = document.querySelectorAll(".fitment_row");
    for (let i = 0; i < fittingRow.length; i++) {
      let fits = new fitting();
      let child = fittingRow[i].childNodes;
      for (let j = 0; j < child.length; j++) {
        let grandChild = child[j].childNodes;
        for (let k = 0; k < grandChild.length; k++) {
          if (grandChild[k].value !== undefined) {
            console.log(grandChild[k].id);
            if (grandChild[k].id === "fitting_type") {
              fits.type = grandChild[k].value;
            }
            if (grandChild[k].id === "fitting_make") {
              fits.make = grandChild[k].value;
            }
            if (grandChild[k].id === "fitting_model") {
              fits.model = grandChild[k].value;
            }
            if (grandChild[k].id === "fitting_year") {
              fits.year = grandChild[k].value;
            }
            if (grandChild[k].id === "fitting_cc") {
              fits.cc = grandChild[k].value;
            }
            if (grandChild[k].id === "fitting_year_from") {
              fits.year_from = grandChild[k].value;
            }
            if (grandChild[k].id === "fitting_year_to") {
              fits.year_to = grandChild[k].value;
            }
            if (grandChild[k].checked) {
              fits.year_on = 1;
            } else {
              fits.year_on = 0;
            }
          } else {
            continue;
          }
        }
      }
      body.fittings.push(fits);
    }

    axios.post("/user/create_part_fitting", body).then((res) => {
      console.log(res);
    });
  });

  function fitting(type, make, model, cc, year_from, year_to, year_on) {
    (this.type = type),
      (this.make = make),
      (this.model = model),
      (this.cc = cc),
      (this.year_from = year_from),
      (this.year_to = year_to),
      (this.year_on = year_on);
  }

  add_first_row.addEventListener("click", function (e) {
    e.preventDefault();
    createNewRow(e);
  });

  remove_first_row.addEventListener("click", function (e) {
    e.preventDefault();
    let rows = document.getElementsByClassName("fitment_row");
    if (rows.length <= 1) {
      return;
    } else {
      removeNewRow(e);
    }
  });

  function createNewRow(e) {
    let fitment = cloneElement(fitmentRow);
    appendFitment(fitment, fitmentContainer);
    updateAllRowIDs();
    let currentId = e.target.value;
    console.log(currentId);
    newRowEventListener(currentId);
  }

  function removeNewRow(e) {
    let id = e.target.value;
    let rows = document.getElementsByClassName("fitment_row");
    console.log("id", id);
    console.log("length", rows.length);
    console.log("rows", rows);
    rows[id - 1].remove();
  }

  function cloneElement(part_fitment) {
    let newFitment = part_fitment.cloneNode(true);
    for (let i = 0; i < newFitment.childNodes.length; i++) {
      let child = newFitment.childNodes[i];
      for (let k = 0; k < child.childNodes.length; k++) {
        let grandChild = child.childNodes[k];
        if (grandChild.value !== undefined) {
          grandChild.value = "";
        }
      }
    }
    return newFitment;
  }

  function appendFitment(element, target) {
    target.appendChild(element);
  }

  function updateAllRowIDs() {
    let rows_column = document.getElementsByClassName("add_fitting");
    let rows_column_del = document.getElementsByClassName("remove_fitting");
    for (let i = 0; i < rows_column.length; i++) {
      rows_column[i].value = i + 1;
      rows_column_del[i].value = i + 1;
    }
  }

  function newRowEventListener(id) {
    let newAddBtns = document.getElementsByClassName("add_fitting");
    newAddBtns[id].addEventListener("click", function (e) {
      e.preventDefault();
      createNewRow(e);
    });
    let newRemoveBtns = document.getElementsByClassName("remove_fitting");
    newRemoveBtns[id].addEventListener("click", function (e) {
      e.preventDefault();
      let rows = document.getElementsByClassName("fitment_row");
      console.log(rows.length);
      if (rows.length <= 1) {
        return;
      } else {
        removeNewRow(e);
      }
    });
  }
}
