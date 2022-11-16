window.onload = function () {
  console.log(sessionStorage.getItem("userId"));
  // fill bikeProducer dropdown
  let part = {
    userId: sessionStorage.getItem("userId"),
    itemNo: "",
    vendorNo: "",
    bikeProducer: "",
    bikeModel: "",
    displayName: "",
    date_from: "",
    date_to: "",
  };
  let bikeProducerDropDown = document.getElementById("bikeProducer_options");
  let bikeModelDropDown = document.getElementById("bikeModel_options");

  console.log(bikeProducerDropDown);
  let newOptions = document.createElement("option");

  axios.get("http://localhost:3000/parts/bike_make").then((res) => {
    console.log(res.data);
    res.data.forEach((bikeProducer) => {
      newOptions = document.createElement("option");
      newOptions.value = bikeProducer.bikeProducer;
      newOptions.innerHTML = bikeProducer.bikeProducer;
      bikeProducerDropDown.appendChild(newOptions);
    });
  });

  axios.get("http://localhost:3000/parts/bike_models").then((res) => {
    console.log(res.data);
    res.data.forEach((bikeModel) => {
      newOptions = document.createElement("option");
      newOptions.value = bikeModel.bikeModel;
      newOptions.innerHTML = bikeModel.bikeModel;
      bikeModelDropDown.appendChild(newOptions);
    });
  });

  let producerValue = document.getElementsByName("bikeProducer")[0];
  let prodVal = "";
  producerValue.addEventListener("input", function () {
    prodVal = producerValue.value;
  });

  let modelValue = document.getElementsByName("bikeModel")[0];
  let modelVal = "";
  modelValue.addEventListener("input", function () {
    modelVal = modelValue.value;
  });

  let partSubmit = document.getElementById("new_part_submit");

  partSubmit.addEventListener("click", function (e) {
    e.preventDefault();
    let validation = checkValidation();
    console.log(validation);
    if (validation) {
      let dateOn = document.getElementsByName("date_on")[0].checked;
      let date_on_result = 0;
      if (dateOn) {
        date_on_result = 1;
      }
      let body = {
        token: sessionStorage.getItem("token"),
        userId: sessionStorage.getItem("userId"),
        itemNo: document.getElementsByName("itemNo")[0].value,
        vendorNo: document.getElementsByName("vendorNo")[0].value,
        bikeProducer: prodVal,
        bikeModel: modelVal,
        displayName: document.getElementsByName("displayName")[0].value,
        date_from: document.getElementsByName("date_from")[0].value,
        date_to: document.getElementsByName("date_to")[0].value,
        date_on: date_on_result,
      };
      console.log(body);
      axios
        .post("http://localhost:3000/user/display_bike", body)
        .then((res) => {
          console.log(res.data);
          if (res.data.message === "Part added successfully") {
            let newPartMessage = document.getElementById("new_part_message");
            newPartMessage.innerHTML = res.data.message;
            displayNewPart(res.data.part);
            resetInputFields();
            //window.location.href = "http://localhost:3000/view_parts";
          }
        });
    } else {
      let newPartMessage = document.getElementById("new_part_message");
      newPartMessage.innerHTML = "Please fill the required fields.";
    }
  });
  function checkValidation() {
    let itemNo = document.getElementsByName("itemNo")[0].value;
    let vendorNo = document.getElementsByName("vendorNo")[0].value;
    let bikeProducer = document.getElementsByName("bikeProducer")[0].value;
    let bikeModel = document.getElementsByName("bikeModel")[0].value;
    let displayName = document.getElementsByName("displayName")[0].value;

    let validation = true;
    if (itemNo == "") {
      validation = false;
    }
    if (vendorNo == "") {
      validation = false;
    }
    if (bikeProducer == "") {
      validation = false;
    }
    if (bikeModel == "") {
      validation = false;
    }
    if (displayName == "") {
      validation = false;
    }

    return validation;
  }

  function displayNewPart(data) {
    let newPartItem = document.getElementById("new_part_item");
    newPartItem.style.display = "block";

    let newItemNo = document.getElementById("new_item_no");
    let newVendorNo = document.getElementById("new_vendor_no");
    let newBikeProducer = document.getElementById("new_bike_producer");
    let newBikeModel = document.getElementById("new_bike_model");
    let newDisplayName = document.getElementById("new_display_name");
    let newCC = document.getElementById("new_cc");
    let newDateFrom = document.getElementById("new_date_from");
    let newDateTo = document.getElementById("new_date_to");
    let newDateOn = document.getElementById("new_date_on");

    newItemNo.innerHTML = data.itemNo;
    newVendorNo.innerHTML = data.vendorNo;
    newBikeProducer.innerHTML = data.bikeProducer;
    newBikeModel.innerHTML = data.bikeModel;
    newDisplayName.innerHTML = data.displayName;
    newCC.innerHTML = data.cc;
    newDateFrom.innerHTML = data.date_from;
    newDateTo.innerHTML = data.date_to;
    newDateOn.innerHTML = data.date_on;
  }

  function resetInputFields() {
    document.getElementsByName("itemNo")[0].value = "";
    document.getElementsByName("vendorNo")[0].value = "";
    document.getElementsByName("bikeProducer")[0].value = "";
    document.getElementsByName("bikeModel")[0].value = "";
    document.getElementsByName("displayName")[0].value = "";
    document.getElementsByName("cc")[0].value = "";
    document.getElementsByName("date_from")[0].value = "";
    document.getElementsByName("date_to")[0].value = "";
    document.getElementsByName("date_on")[0].checked = false;
  }
};
