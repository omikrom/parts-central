window.onload = function () {
  console.log("window.onload");
  init();
};

function init() {
  const form = document.getElementById("upload-form");
  const message = document.getElementById("message");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const file = document.getElementById("csv").files[0];
    const formData = new FormData();
    formData.append("file", file);

    try {
      axios.post("/upload/csv", formData).then((res) => {
        message.innerHTML = res.data.message;
      });
    } catch (error) {
      console.log(error);
    }
  });
}
