import checkSession from "./session/checkSession.js";

window.onload = function () {
  let elements = [];
  let supplierName = document.getElementById("supplier_name");
  let supplier_line1_addr = document.getElementById("supplier_line1_addr");
  let supplier_line2_addr = document.getElementById("supplier_line2_addr");
  let supplier_area = document.getElementById("supplier_area");
  let supplier_city = document.getElementById("supplier_city");
  let supplier_country = document.getElementById("supplier_country");
  let supplier_postcode = document.getElementById("supplier_postcode");
  let supplier_phone = document.getElementById("supplier_phone");
  let message = document.getElementById("form_message");

  // Add elements to array
  elements.push(supplierName);
  elements.push(supplier_line1_addr);
  elements.push(supplier_line2_addr);
  elements.push(supplier_area);
  elements.push(supplier_city);
  elements.push(supplier_country);
  elements.push(supplier_postcode);
  elements.push(supplier_phone);

  let formData = {
    supplierName: supplierName.value,
    supplier_line1_addr: supplier_line1_addr.value,
    supplier_line2_addr: supplier_line2_addr.value,
    supplier_area: supplier_area.value,
    supplier_city: supplier_city.value,
    supplier_country: supplier_country.value,
    supplier_postcode: supplier_postcode.value,
    supplier_phone: supplier_phone.value,
  };

  let createSupplierBtn = document.getElementById("supplier_submit");
  let form_message = document.getElementById("form_message");

  createSupplierBtn.addEventListener("click", function (e) {
    e.preventDefault();
    updateForm(formData);
    let isValid = validateFields(formData, elements);
    console.log(isValid);
    if (isValid) {
      resetFields(elements);
      axios.post("/api/supplier/create", formData).then((res) => {
        if (res.status === 200) {
          message.innerHTML = "Supplier created successfully.";
          message.style.display = "block";
        } else {
          message.innerHTML = "Error creating supplier.";
          message.style.display = "block";
        }
      });
    }
  });

  /*axios.post("https://partscentral.online/api/register", body).then((res) => {
      //axios.post("http://localhost:3000/api/register", body).then((res) => {
      console.log(res.data);
      if (res.data.message === "Registration successful") {
        if (res.data.token) {
          sessionStorage.setItem("token", res.data.token);
          sessionStorage.setItem("role", res.data.role);
          sessionStorage.setItem("userId", res.data.userId);
          registerResMessage.innerHTML = "Registered successfully.";
          setTimeout(() => {
            window.location.href = "https://partscentral.online";
            //window.location.href = "http://localhost:3000/";
          }, 3000);
        }
      } else {
        registerResMessage.style.display = "block";
        registerResMessage.innerHTML = res.data.message;
      }
    });*/
};

function updateForm(formData) {
  let supplierName = document.getElementById("supplier_name");
  let supplier_line1_addr = document.getElementById("supplier_line1_addr");
  let supplier_line2_addr = document.getElementById("supplier_line2_addr");
  let supplier_area = document.getElementById("supplier_area");
  let supplier_city = document.getElementById("supplier_city");
  let supplier_country = document.getElementById("supplier_country");
  let supplier_postcode = document.getElementById("supplier_postcode");
  let supplier_phone = document.getElementById("supplier_phone");

  formData.supplierName = supplierName.value;
  formData.supplier_line1_addr = supplier_line1_addr.value;
  formData.supplier_line2_addr = supplier_line2_addr.value;
  formData.supplier_area = supplier_area.value;
  formData.supplier_city = supplier_city.value;
  formData.supplier_country = supplier_country.value;
  formData.supplier_postcode = supplier_postcode.value;
  formData.supplier_phone = supplier_phone.value;
}

function validateFields(data, elements) {
  console.log(data);
  let isValid = true;
  let message = document.getElementById("form_message");
  let postcodeRegex =
    /^[A-Z]{1,2}[0-9RCHNQ][0-9A-Z]?\s?[0-9][ABD-HJLNP-UW-Z]{2}$|^[A-Z]{2}-?[0-9]{4}$/;

  // Check for invalid

  console.log("checking");
  if (data.supplierName === "") {
    isValid = false;
    message.innerHTML = "Supplier name is required.";
    elements[0].classList.add("field_error");
  } else {
    elements[0].classList.remove("field_error");
    elements[0].classList.add("field_valid");
  }

  if (data.supplier_line1_addr === "") {
    isValid = false;
    message.innerHTML = "Address line 1 is required.";
    elements[1].classList.add("field_error");
  } else {
    elements[1].classList.remove("field_error");
    elements[1].classList.add("field_valid");
  }

  if (data.supplier_area === "") {
    isValid = false;
    message.innerHTML = "Area is required.";
    elements[3].classList.add("field_error");
  } else {
    elements[3].classList.remove("field_error");
    elements[3].classList.add("field_valid");
  }

  if (data.supplier_city === "") {
    isValid = false;
    message.innerHTML = "City is required.";
    elements[4].classList.add("field_error");
  } else {
    elements[4].classList.remove("field_error");
    elements[4].classList.add("field_valid");
  }

  if (data.supplier_country === "") {
    isValid = false;
    message.innerHTML = "Country is required.";
    elements[5].classList.add("field_error");
  } else {
    elements[5].classList.remove("field_error");
    elements[5].classList.add("field_valid");
  }

  if (data.supplier_postcode === "") {
    isValid = false;
    message.innerHTML = "Postcode is required.";
    elements[6].classList.add("field_error");
  } else if (postcodeRegex.test(data.supplier_postcode) === false) {
    isValid = false;
    message.innerHTML = "Postcode is invalid.";
    elements[6].classList.add("field_error");
  } else {
    elements[6].classList.remove("field_error");
    elements[6].classList.add("field_valid");
  }

  if (data.supplier_phone === "") {
    isValid = false;
    message.innerHTML = "Phone number is required.";
    elements[7].classList.add("field_error");
  } else {
    elements[7].classList.remove("field_error");
    elements[7].classList.add("field_valid");
  }

  if (data.supplier_phone.length < 11) {
    isValid = false;
    message.innerHTML = "Phone number must be at least 11 digits.";
    elements[7].classList.add("field_error");
  } else if (data.supplier_phone.length > 11) {
    isValid = false;
    message.innerHTML = "Phone number must be less than 11 digits.";
    elements[7].classList.add("field_error");
  } else if (data.supplier_phone.length === 11) {
    let firstDigit = data.supplier_phone.charAt(0);
    if (firstDigit !== "0") {
      isValid = false;
      message.innerHTML = "Phone number must start with 0.";
      elements[7].classList.add("field_error");
    }
  } else {
    elements[7].classList.remove("field_error");
    elements[7].classList.add("field_valid");
  }

  console.log();
  return isValid;
}

function resetFields(elements) {
  elements.forEach((element) => {
    element.style.border = "1px solid #ccc";
    element.classList.remove("field_error");
    element.classList.remove("field_valid");
    element.value = "";
  });
}
