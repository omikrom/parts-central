window.onload = function () {
  console.log(sessionStorage.getItem("userId"));
  // fill bikeProducer dropdown
  let part = {
    uId: sessionStorage.getItem("userId"),
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
  });
};
