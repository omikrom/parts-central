window.onload = function () {
  console.log("window.onload");
  init();
  console.log("new search");
};

function init() {
  let sId = sessionStorage.getItem("supplierId");
  let manufacturerList = document.getElementById("inputGroupManufacturer");
  let modelList = document.getElementById("inputGroupModel");
  let ccList = document.getElementById("inputGroupCC");
  let yearFromList = document.getElementById("inputGroupYearFrom");
  let yearToList = document.getElementById("inputGroupYearTo");
  let searchSubmit = document.getElementById("search_submit");

  let manufacturerData = [];
  console.log("init");
  axios.get(`/search/manufacturer/${sId}`).then((res) => {
    for (let i in res.data) {
      manufacturerData.push(res.data[i].manufacturer);
    }
    let newOptions = document.createElement("option");
    manufacturerData.forEach((manufacturer) => {
      newOptions = document.createElement("option");
      newOptions.value = manufacturer;
      newOptions.innerHTML = manufacturer;
      manufacturerList.appendChild(newOptions);
    });
  });

  manufacturerList.addEventListener("change", function (e) {
    let manufacturer = e.target.value;
    console.log(manufacturer);
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
    let ModelData = [];
    axios.get(`/search/models/${manufacturer}/${sId}`).then((res) => {
      for (let i in res.data) {
        ModelData.push(res.data[i].model);
      }
      let newOptions = document.createElement("option");
      ModelData.forEach((model) => {
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

    let cCData = [];
    let manufacturer = manufacturerList.value;
    let model = e.target.value;
    console.log(manufacturer);

    axios.get(`/search/cc/${manufacturer}/${model}/${sId}`).then((res) => {
      for (let i in res.data) {
        cCData.push(res.data[i].cc);
      }
      let newOptions = document.createElement("option");
      cCData.forEach((cc) => {
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

    let yearFromData = [];
    let manufacturer = manufacturerList.value;
    let model = modelList.value;
    let cC = e.target.value;
    axios
      .get(`/search/year_from/${manufacturer}/${model}/${cC}/${sId}`)
      .then((res) => {
        for (let i in res.data) {
          console.log(res.data[i]);
          yearFromData.push(res.data[i].date_from);
        }
        let newOptions = document.createElement("option");
        yearFromData.forEach((year) => {
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

    let yearToData = [];
    let manufacturer = manufacturerList.value;
    let model = modelList.value;
    let cC = ccList.value;
    let yearFrom = e.target.value;

    console.log("requesting year to data");
    axios
      .get(`/search/year_to/${manufacturer}/${model}/${cC}/${yearFrom}/${sId}`)
      .then((res) => {
        console.log("response recieved", res.data);
        for (let i in res.data) {
          console.log(res.data[i]);
          yearToData.push(res.data[i].date_to);
        }

        let newOptions = document.createElement("option");
        yearToData.forEach((year) => {
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
    let manufacturer = manufacturerList.value;
    let model = modelList.value;
    let cC = ccList.value;
    let yearFrom = yearFromList.value;
    let yearTo = yearToList.children[yearToList.selectedIndex].innerHTML;

    console.log("year to", yearTo);

    if (manufacturer === "Choose...") {
      searchMessageContent.innerHTML = "Please choose a Manufacturer";
    } else if (model === "Choose...") {
      console.log("model");
      searchMessageContent.innerHTML = "";
      axios.get(`/search/part/${manufacturer}/${sId}`).then((res) => {
        updateSearchResults(res.data);
      });
    } else if (cC === "Choose...") {
      console.log("cc");
      searchMessageContent.innerHTML = "";
      axios.get(`/search/part/${manufacturer}/${model}/${sId}`).then((res) => {
        updateSearchResults(res.data);
      });
    } else if (yearFrom === "Choose...") {
      console.log("year from");
      searchMessageContent.innerHTML = "";
      axios
        .get(`/search/part/${manufacturer}/${model}/${cC}/${sId}`)
        .then((res) => {
          updateSearchResults(res.data);
        });
    } else if (yearTo === "Choose...") {
      console.log("year to");
      searchMessageContent.innerHTML = "";
      axios
        .get(`/search/part/${manufacturer}/${model}/${cC}/${yearFrom}/${sId}`)
        .then((res) => {
          updateSearchResults(res.data);
        });
    } else {
      console.log("all");
      searchMessageContent.innerHTML = "";
      axios
        .get(
          `/search/part/${manufacturer}/${model}/${cC}/${yearFrom}/${yearTo}/${sId}`
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
  console.log(data);
  for (let i = 0; i < data.length; i++) {
    let newTr = document.createElement("tr");
    let newTd = document.createElement("td");
    newTd.innerHTML = data[i].sku;
    newTr.appendChild(newTd);
    newTd = document.createElement("td");
    newTd.innerHTML = data[i].part_name;
    newTr.appendChild(newTd);
    newTd = document.createElement("td");
    newTd.innerHTML = data[i].partNo;
    newTr.appendChild(newTd);
    newTd = document.createElement("td");
    newTd.innerHTML = data[i].vendorNo;
    newTr.appendChild(newTd);
    newTd = document.createElement("td");
    newTd.innerHTML = data[i].alt_sku;
    newTr.appendChild(newTd);
    tableRef.appendChild(newTr);
  }
}
