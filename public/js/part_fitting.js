window.onload = function () {
  init();
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
      supplierId: sessionStorage.getItem("supplierId"),
      part: {
        part_name: partName,
        part_sku: partSku,
      },
      alt_part_numbers: {
        alt_part_no: alt_part_number,
        alt_vendor_no: alt_vendor_number,
        alt_sku_no: alt_sku,
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

}


