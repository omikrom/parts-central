window.onload = function () {
  console.log(sessionStorage.getItem("userId"));
  // fill bikeProducer dropdowns
  let bikeProducerDropDown = document.getElementById("bikeProducer_options");
  let bikeModelDropDown = document.getElementById("bikeModel_options");

  console.log(bikeProducerDropDown);
  let newOptions = document.createElement("option");

  axios.get("https://partscentral.online/parts/bike_make").then((res) => {
    console.log("getting bike makes");
    //axios.get("http://localhost:3000/parts/bike_make").then((res) => {
    console.log(res.data);
    res.data.forEach((bikeProducer) => {
      newOptions = document.createElement("option");
      newOptions.value = bikeProducer.bikeProducer;
      newOptions.innerHTML = bikeProducer.bikeProducer;
      bikeProducerDropDown.appendChild(newOptions);
    });
  });

  axios.get("https://partscentral.online/parts/bike_models").then((res) => {
    console.log("getting bike models");
    //axios.get("http://localhost:3000/parts/bike_models").then((res) => {
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
    console.log("creating new part");
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
        // auth data
        token: sessionStorage.getItem("token"),
        userId: sessionStorage.getItem("userId"),
        // manufacturer data
        itemNo: document.getElementsByName("itemNo")[0].value,
        vendorNo: document.getElementsByName("vendorNo")[0].value,
        bikeProducer: prodVal,
        bikeModel: modelVal,
        cc: document.getElementsByName("cc")[0].value,
        // user specific data
        partSKU: document.getElementsByName("partSKU")[0].value,
        partName: document.getElementsByName("partName")[0].value,
        displayName: document.getElementsByName("displayName")[0].value,
        addPartNo1: document.getElementsByName("addPartNo1")[0].value,
        addPartNo2: document.getElementsByName("addPartNo2")[0].value,
        addPartNo3: document.getElementsByName("addPartNo3")[0].value,
        //part fitting data
        date_from: document.getElementsByName("date_from")[0].value,
        date_to: document.getElementsByName("date_to")[0].value,
        date_on: date_on_result,
      };
      console.log("part body:", body);
      //.post("http://localhost:3000/user/display_bike", body)
      axios
        .post("https://partscentral.online/user/display_bike", body)
        .then((res) => {
          console.log("res data: ", res.data);
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
    let partSKU = document.getElementsByName("partSKU")[0].value;

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
    if (partSKU == "") {
      validation = false;
    }
    if (displayName == "") {
      validation = false;
    }

    return validation;
  }

  function displayNewPart(data) {

    let newPartTable = document.getElementById("new_part_table");
    newPartTable.style.display = "block";

    let waitingCollection = document.getElementsByClassName("waiting");
    while (waitingCollection.length > 0) {
      waitingCollection[0].remove();
    }

    let manufacturerRow = document.getElementById("manufacturer_row");
    let partRow = document.getElementById("part_row");
    let fittingRow = document.getElementById("fitting_row");
    manufacturerRow.style.display = "table-row";
    partRow.style.display = "table-row";
    fittingRow.style.display = "table-row";


    let newItemNo = document.getElementById("newitemNo");
    let newVendorNo = document.getElementById("newvendorNo");
    let newBikeProducer = document.getElementById("newbikeProducer");
    let newBikeModel = document.getElementById("newbikeModel");
    let newCC = document.getElementById("newcc");

    let newPartSKU = document.getElementById("newpartSKU");
    let newPartName = document.getElementById("newpartName");
    let newDisplayName = document.getElementById("newpartDisplayName");
    let newAddPartNo1 = document.getElementById("newpartAlt1");
    let newAddPartNo2 = document.getElementById("newpartAlt2");
    let newAddPartNo3 = document.getElementById("newpartAlt3");
    let newDateFrom = document.getElementById("newdate_from");
    let newDateTo = document.getElementById("newdate_to");
    let newDateOn = document.getElementById("newdate_on");

    newItemNo.innerHTML = data.itemNo;
    newVendorNo.innerHTML = data.vendorNo;
    newBikeProducer.innerHTML = data.bikeProducer;
    newBikeModel.innerHTML = data.bikeModel;
    newCC.innerHTML = data.cc;
    newPartSKU.innerHTML = data.partSKU;
    newPartName.innerHTML = data.partName;
    newDisplayName.innerHTML = data.displayName;
    newAddPartNo1.innerHTML = data.addPartNo1;
    newAddPartNo2.innerHTML = data.addPartNo2;
    newAddPartNo3.innerHTML = data.addPartNo3;
    newDateFrom.innerHTML = data.date_from;
    newDateTo.innerHTML = data.date_to;
    newDateOn.innerHTML = data.date_on;
  }

  function resetInputFields() {
    document.getElementsByName("itemNo")[0].value = "";
    document.getElementsByName("vendorNo")[0].value = "";
    document.getElementsByName("bikeProducer")[0].value = "";
    document.getElementsByName("bikeModel")[0].value = "";
    document.getElementsByName("cc")[0].value = "";
    document.getElementsByName("partSKU")[0].value = "";
    document.getElementsByName("partName")[0].value = "";
    document.getElementsByName("displayName")[0].value = "";
    document.getElementsByName("addPartNo1")[0].value = "";
    document.getElementsByName("addPartNo2")[0].value = "";
    document.getElementsByName("addPartNo3")[0].value = "";
    document.getElementsByName("date_from")[0].value = "";
    document.getElementsByName("date_to")[0].value = "";
    document.getElementsByName("date_on")[0].checked = false;
  }
};
