window.onload = function () {
  let token = sessionStorage.getItem("token");
  if (token === null) {
    window.location.href = "/login";
  } else {
    axios.defaults.headers.common["x-access-token"] = token;
  }
  init();
  checkJobs();
  setInterval(() => {
    checkJobs();
  }, 10000);
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
        });
    } catch (error) {
      message.innerHTML = error.message;
      console.log(error);
    }
  });
}


function checkJobs() {
  let currentJobsElement = document.getElementById("current_jobs");
  let currentJobs = [];
  let supplierId = sessionStorage.getItem("supplierId");
  console.log("supplierId:", supplierId);

  axios.get(`/jobs/${supplierId}`).then((res) => {
    res.data.forEach((job) => {
      currentJobs.push(job);
    });
  }).catch(() => {

  }).finally(() => {
    createJobElements(currentJobs);
  });;
}

function createJobElements(jobs) {
  let div = document.getElementById("current_jobs");
  div.innerHTML = "";
  let header = document.createElement("div");
  header.classList.add("job");
  header.classList.add("job--header");
  header.innerHTML = `
    <div class="job--id job--item">
      Job ID
    </div>
    <div class="job--file_name job--item">
      File Name
    </div>
    <div class="job--progress job--item">
      Progress
    </div>
    <div class="job__status job--item">
      Status
    </div>
  `;
  div.appendChild(header);
  if (jobs.length === 0) {
    let noJobs = document.createElement("div");
    noJobs.classList.add("job");
    noJobs.innerHTML = `
      <div class="job--id">
        <p>No current Jobs</p>
      </div>
    `;
    div.appendChild(noJobs);
  }
  jobs.forEach((job) => {
    console.log(job);
    let jobDiv = document.createElement("div");
    jobDiv.classList.add("job");
    jobDiv.innerHTML = `
      <div class="job--id job--item">
        ${job.jobId}
      </div>
      <div class="job--file_name job--item">
        ${job.fileName}
      </div>
      <div class="job--progress job--item">
        ${job.progress}%
      </div>
      <div class="job__status job--item">
        ${job.status}
      </div>
    `;
    div.appendChild(jobDiv);
  });

}