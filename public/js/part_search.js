window.onload = function () {
  console.log("window.onload");
  init();
  console.log("new search");
};

function init() {
  let userId = sessionStorage.getItem("userId");
  console.log("userId: " + userId);
  let manufacturerList = document.getElementById("inputGroupManufacturer");
  let modelList = document.getElementById("inputGroupModel");
  let ccList = document.getElementById("inputGroupCC");
  let yearFromList = document.getElementById("inputGroupYearFrom");
  let yearToList = document.getElementById("inputGroupYearTo");

  let searchSubmit = document.getElementById("search_submit");

  let bikeProducerData = [];
  console.log("init");
  axios
    .get(`https://partscentral.online/search/bike_producers/${userId}`)
    .then((res) => {
      for (let i in res.data) {
        bikeProducerData.push(res.data[i].bikeProducer);
      }
      let newOptions = document.createElement("option");
      bikeProducerData.forEach((manufacturer) => {
        newOptions = document.createElement("option");
        newOptions.value = manufacturer;
        newOptions.innerHTML = manufacturer;
        manufacturerList.appendChild(newOptions);
      });
    });

  manufacturerList.addEventListener("change", function (e) {
    let bikeProducer = e.target.value;
    let userId = sessionStorage.getItem("userId");
    console.log(bikeProducer);
    modelList.removeAttribute("disabled");
    ccList.disabled = "disabled";
    yearFromList.disabled = "disabled";
    yearToList.disabled = "disabled";
    while (modelList.firstChild) {
      modelList.removeChild(modelList.firstChild);
    }
    let modelOption = document.createElement("option");
    modelOption.innerHTML = "Choose...";
    modelList.appendChild(modelOption);

    while (ccList.firstChild) {
      ccList.removeChild(ccList.firstChild);
    }
    let ccOption = document.createElement("option");
    ccOption.innerHTML = "Choose...";
    modelList.appendChild(ccOption);
    ccList.appendChild(ccOption);
    while (yearFromList.firstChild) {
      yearFromList.removeChild(yearFromList.firstChild);
    }
    let yearFromOption = document.createElement("option");
    yearFromOption.innerHTML = "Choose...";
    yearFromList.appendChild(yearFromOption);
    while (yearToList.firstChild) {
      yearToList.removeChild(yearToList.firstChild);
    }
    let yearToOption = document.createElement("option");
    yearToOption.innerHTML = "Choose...";
    yearToList.appendChild(yearToOption);
    let bikeModelData = [];
    axios
      .get(
        `https://partscentral.online/search/bike_models/${bikeProducer}/${userId}`
      )
      .then((res) => {
        for (let i in res.data) {
          bikeModelData.push(res.data[i].bikeModel);
        }
        let newOptions = document.createElement("option");
        bikeModelData.forEach((model) => {
          newOptions = document.createElement("option");
          newOptions.value = model;
          newOptions.innerHTML = model;
          modelList.appendChild(newOptions);
        });
      });
  });

  modelList.addEventListener("change", function (e) {
    console.log(e.target.value);
    ccList.removeAttribute("disabled");

    while (ccList.firstChild) {
      ccList.removeChild(ccList.firstChild);
    }
    let ccOption = document.createElement("option");
    ccOption.innerHTML = "Choose...";
    ccList.appendChild(ccOption);

    while (yearFromList.firstChild) {
      yearFromList.removeChild(yearFromList.firstChild);
    }
    let yearFromOption = document.createElement("option");
    yearFromOption.innerHTML = "Choose...";
    yearFromList.appendChild(yearFromOption);
    while (yearToList.firstChild) {
      yearToList.removeChild(yearToList.firstChild);
    }
    let yearToOption = document.createElement("option");
    yearToOption.innerHTML = "Choose...";
    yearToList.appendChild(yearToOption);

    let bikeCCData = [];
    let bikeProducer = manufacturerList.value;
    let bikeModel = e.target.value;
    let userId = sessionStorage.getItem("userId");

    axios
      .get(
        `https://partscentral.online/search/bike_cc/${bikeProducer}/${bikeModel}/${userId}`
      )
      .then((res) => {
        for (let i in res.data) {
          bikeCCData.push(res.data[i].cc);
        }
        let newOptions = document.createElement("option");
        bikeCCData.forEach((cc) => {
          newOptions = document.createElement("option");
          newOptions.value = cc;
          newOptions.innerHTML = cc;
          ccList.appendChild(newOptions);
        });
      });
  });

  ccList.addEventListener("change", function (e) {
    console.log(e.target.value);
    yearFromList.removeAttribute("disabled");

    while (yearFromList.firstChild) {
      yearFromList.removeChild(yearFromList.firstChild);
    }
    let yearFromOption = document.createElement("option");
    yearFromOption.innerHTML = "Choose...";
    yearFromList.appendChild(yearFromOption);
    while (yearToList.firstChild) {
      yearToList.removeChild(yearToList.firstChild);
    }
    let yearToOption = document.createElement("option");
    yearToOption.innerHTML = "Choose...";
    yearToList.appendChild(yearToOption);

    let bikeYearFromData = [];
    let bikeProducer = manufacturerList.value;
    let bikeModel = modelList.value;
    let bikeCC = e.target.value;
    let userId = sessionStorage.getItem("userId");

    axios
      .get(
        `https://partscentral.online/search/bike_year_from/${bikeProducer}/${bikeModel}/${bikeCC}/${userId}`
      )
      .then((res) => {
        for (let i in res.data) {
          console.log(res.data[i]);
          bikeYearFromData.push(res.data[i].date_from);
        }
        let newOptions = document.createElement("option");
        bikeYearFromData.forEach((year) => {
          newOptions = document.createElement("option");
          newOptions.value = year;
          newOptions.innerHTML = year;
          yearFromList.appendChild(newOptions);
        });
      });
  });

  yearFromList.addEventListener("change", function (e) {
    console.log("year from changed");
    console.log(e.target.value);
    yearToList.removeAttribute("disabled");

    while (yearToList.firstChild) {
      yearToList.removeChild(yearToList.firstChild);
    }
    let yearToOption = document.createElement("option");
    yearToOption.innerHTML = "Choose...";
    yearToList.appendChild(yearToOption);

    let bikeYearToData = [];
    let bikeProducer = manufacturerList.value;
    let bikeModel = modelList.value;
    let bikeCC = ccList.value;
    let bikeYearFrom = e.target.value;
    let userId = sessionStorage.getItem("userId");

    console.log("requesting year to data");
    axios
      .get(
        `https://partscentral.online/search/bike_year_to/${bikeProducer}/${bikeModel}/${bikeCC}/${bikeYearFrom}/${userId}`
      )
      .then((res) => {
        console.log("response recieved", res.data);
        for (let i in res.data) {
          console.log(res.data[i]);
          bikeYearToData.push(res.data[i].date_to);
        }
        console.log("bikeYearToData", bikeYearToData);
        let newOptions = document.createElement("option");
        bikeYearToData.forEach((year) => {
          console.log("year", year);
          newOptions = document.createElement("option");
          newOptions.value = year.date_to;
          newOptions.innerHTML = year;
          yearToList.appendChild(newOptions);
        });
      });
  });

  searchSubmit.addEventListener("click", function (e) {
    e.preventDefault();
    let searchMessageContent = document.getElementById(
      "search_message_content"
    );
    let bikeProducer = manufacturerList.value;
    let bikeModel = modelList.value;
    let bikeCC = ccList.value;
    let bikeYearFrom = yearFromList.value;
    let bikeYearTo = yearToList.value;
    let userId = sessionStorage.getItem("userId");

    if (bikeProducer === "Choose...") {
      searchMessageContent.innerHTML = "Please choose a Manufacturer";
    } else if (bikeModel === "Choose...") {
      console.log("model");
      searchMessageContent.innerHTML = "";
      axios
        .get(
          `https://partscentral.online/search/part/${bikeProducer}/${userId}`
        )
        .then((res) => {
          updateSearchResults(res.data);
        });
    } else if (bikeCC === "Choose...") {
      console.log("cc");
      searchMessageContent.innerHTML = "";
      axios
        .get(
          `https://partscentral.online/search/part/${bikeProducer}/${bikeModel}/${userId}`
        )
        .then((res) => {
          updateSearchResults(res.data);
        });
    } else if (bikeYearFrom === "Choose...") {
      console.log("year from");
      searchMessageContent.innerHTML = "";
      axios
        .get(
          `https://partscentral.online/search/part/${bikeProducer}/${bikeModel}/${bikeCC}/${userId}`
        )
        .then((res) => {
          updateSearchResults(res.data);
        });
    } else if (bikeYearTo === "Choose...") {
      console.log("year to");
      searchMessageContent.innerHTML = "";
      axios
        .get(
          `https://partscentral.online/search/part/${bikeProducer}/${bikeModel}/${bikeCC}/${bikeYearFrom}/${userId}`
        )
        .then((res) => {
          updateSearchResults(res.data);
        });
    } else {
      console.log("all");
      searchMessageContent.innerHTML = "";
      axios
        .get(
          `https://partscentral.online/search/part/${bikeProducer}/${bikeModel}/${bikeCC}/${bikeYearFrom}/${bikeYearTo}/${userId}`
        )
        .then((res) => {
          //console.log(res.data);
          updateSearchResults(res.data);
        });
    }
  });
}

function updateSearchResults(data) {
  let tableRef = document.getElementById("search_results");

  // delete all rows
  while (tableRef.firstChild) {
    tableRef.removeChild(tableRef.firstChild);
  }
  for (let i = 0; i < data.length; i++) {
    let newTr = document.createElement("tr");
    let newTd = document.createElement("td");
    newTd.innerHTML = data[i].itemNo;
    newTr.appendChild(newTd);
    newTd = document.createElement("td");
    newTd.innerHTML = data[i].bikeProducer;
    newTr.appendChild(newTd);
    newTd = document.createElement("td");
    newTd.innerHTML = data[i].bikeModel;
    newTr.appendChild(newTd);
    newTd = document.createElement("td");
    newTd.innerHTML = data[i].bike_display_name;
    newTr.appendChild(newTd);
    newTd = document.createElement("td");
    newTd.innerHTML = data[i].cc;
    newTr.appendChild(newTd);
    newTd = document.createElement("td");
    newTd.innerHTML = data[i].date_from;
    newTr.appendChild(newTd);
    newTd = document.createElement("td");
    newTd.innerHTML = data[i].date_to;
    newTr.appendChild(newTd);
    tableRef.appendChild(newTr);
  }
}
