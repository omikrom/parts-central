window.onload = function () {
  let token = sessionStorage.getItem("token");
  if (token === null) {
    window.location.href = "/login";
  } else {
    axios.defaults.headers.common["x-access-token"] = token;
  }
  init();
};

function getOptions(type) {
  let url
  switch (type) {
    case "type":
      url = 'type_options';
      break;
    case "make":
      url = 'make_options';
      break;
    case "model":
      url = 'model_options';
      break;
    case "cc":
      url = 'cc_options';
      break;
  }

  let typeOptions = [];
  let sId = sessionStorage.getItem("supplierId");
  let datalist = document.getElementById(url);

  axios.get(`/parts/${url}/${sId}`).then((res) => {
    console.log('getting types');
    res.data.forEach((Type) => {
      switch (type) {
        case "type":
          Type = Type.type;
          break;
        case "make":
          Type = Type.manufacturer;
          break;
        case "model":
          Type = Type.model;
          break;
        case "cc":
          Type = Type.cc;
          break;
      }
      typeOptions.push(Type);
    });
  }).finally(() => {
    typeOptions.forEach((type) => {
      let option = document.createElement('option');
      option.value = type;
      datalist.appendChild(option);
    });
  });
}


function init() {
  let formSubmit = document.getElementById("create_part_submit");
  let message = document.getElementById("message");

  let typeOptions = getOptions("type");

  let manufacturerInput = document.getElementById("fitting_make");

  manufacturerInput.addEventListener("click", function (e) {
    let makeOptions = getOptions("make");
  }, { once: true });


  manufacturerInput.addEventListener("change", function (e) {
    e.preventDefault();
    let make = manufacturerInput.value;
    let sId = sessionStorage.getItem("supplierId");
    let modelInput = document.getElementById("fitting_model");
    let modelOptions = document.getElementById("model_options");
    modelOptions.innerHTML = "";

    axios.get(`/parts/${make}/model_options/${sId}`).then((res) => {
      res.data.forEach((model) => {
        let option = document.createElement('option');
        option.value = model.model;
        modelOptions.appendChild(option);
      });
    });
  });

  formSubmit.addEventListener("click", function (e) {
    e.preventDefault();
    let isValid = validateForm();
    if (isValid) {
      let partName = document.getElementById("part_name").value;
      let partSku = document.getElementById("part_number").value;
      let alt_part_number = document.getElementById("alt_part_number").value;
      let alt_vendor_number =
        document.getElementById("alt_vendor_number").value;
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
              if (grandChild[k].id === "fitting_display_name") {
                fits.display_name = grandChild[k].value;
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
                if (grandChild[k].value != "") {
                  fits.year_to = grandChild[k].value;
                } else {
                  fits.year_to = new Date().getFullYear();
                }
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
        if (res.data.message == "Part created") {
          message.innerHTML = "Part created";
          setTimeout(() => {
            window.location.href = "/create_part";
          }, 2000);
        }
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
    } else {
      message.innerHTML = "Please fill in all required fields";
    }
  });
}

function validateForm() {
  let message = document.getElementById("message");
  let partName = document.getElementById("part_name").value;
  let partSku = document.getElementById("part_number").value;
  let type = document.getElementsByName("fitting_type");
  let make = document.getElementsByName("fitting_make");
  let model = document.getElementsByName("fitting_model");
  let cc = document.getElementsByName("fitting_cc");

  if (partSku === "") {
    message.innerHTML = "Part SKU is required";
    return false;
  }

  for (let i = 0; i < type.length; i++) {
    if (type[i].value === "") {
      message.innerHTML = "Fitting Type is required";
      return false;
    } else {
      message.innerHTML = "";
    }
  }

  for (let i = 0; i < make.length; i++) {
    if (make[i].value === "") {
      message.innerHTML = "Fitting Make is required";
      return false;
    } else {
      message.innerHTML = "";
    }
  }

  for (let i = 0; i < model.length; i++) {
    if (model[i].value === "") {
      message.innerHTML = "Fitting Model is required";
      return false;
    } else {
      message.innerHTML = "";
    }
  }

  for (let i = 0; i < cc.length; i++) {
    if (cc[i].value === "") {
      message.innerHTML = "Fitting CC is required";
      return false;
    } else {
      message.innerHTML = "";
    }
  }

  return true;
}
