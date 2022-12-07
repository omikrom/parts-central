window.onload = function () {
  let token = sessionStorage.getItem("token");
  if (token === null) {
    window.location.href = "/login";
  } else {
    axios.defaults.headers.common["x-access-token"] = token;
  }
  init();
};

function init() {
  const form = document.getElementById("upload_csv_form");
  const message = document.getElementById("message");
  let bar = document.getElementById("progress_bar");
  console.log(bar);
  let barLabel = document.getElementById("progress_bar_label");



  form.addEventListener("submit", (e) => {
    console.log("clicked");
    e.preventDefault();
    let progress_bar = document.getElementsByClassName("progress-bar--div");
    progress_bar[0].classList.remove("hidden");
    const file = document.getElementById("csv").files[0];
    let token = sessionStorage.getItem("token");
    let supplierId = sessionStorage.getItem("supplierId");

    const formData = new FormData();
    formData.append("file", file);

    const config = {
      onUploadProgress: function (progressEvent) {
        const percentComplete = Math.round(
          (progressEvent.loaded / progressEvent.total) * 100
        );
        bar.value = percentComplete;
        barLabel.innerHTML = percentComplete + "%";
        if (percentComplete === 100) {
          message.innerHTML = "File uploaded successfully";
          setTimeout(() => {
            message.innerHTML = "Processing file please wait..."
          }, 2000);
        }
      },
    };

    try {
      axios
        .post(`/upload/user_csv/${supplierId}`, formData, config, token)
        .then((res) => {
          message.innerHTML = res.data.message;
          setTimeout(() => {
            window.location.href = "/user_parts";
          }, 1000);
        });
    } catch (error) {
      message.innerHTML = error.message;
      console.log(error);
    }
  });
}
