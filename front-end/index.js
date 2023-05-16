const dropZone = document.querySelector(".drop-zone");
const browseBtn = document.querySelector(".browseBtn");
const fileInput = document.querySelector("#fileInput");
const fileURLInput = document.querySelector("#fileURL");
const bgProgress = document.querySelector(".bg-progress");
const percentDiv = document.querySelector("#percent");
const progressBar = document.querySelector(".progress-bar");
const progressContainer = document.querySelector(".progress-container");
const sharingContainer = document.querySelector(".sharing-container");

const emailForm = document.querySelector("#emailForm");

const copyBtn = document.querySelector("#copyBtn");

// const host = "https://insharebk.herokuapp.com";
const host = 'http://127.0.0.1:3100';
const uploadURL = `${host}/api/files`;
const emailURL =  `${host}/api/files/send`;

const toast = document.querySelector(".toast");

dropZone.addEventListener("dragover", (e) => {
  e.preventDefault();
  if (!dropZone.classList.contains("dragged"))
    dropZone.classList.add("dragged");
});

dropZone.addEventListener("dragleave", (e) => {
  e.preventDefault();
  if (dropZone.classList.contains("dragged"))
    dropZone.classList.remove("dragged");
});

dropZone.addEventListener("drop", (e) => {
  e.preventDefault();
  if (dropZone.classList.contains("dragged"))
    dropZone.classList.remove("dragged");
  const files = e.dataTransfer.files;

  console.table(files);
  if (files.length) {
    fileInput.files = files;
    uploadFile();
  }
});

fileInput.addEventListener("change", (e) => {
  e.preventDefault();
  uploadFile();
});

browseBtn.addEventListener("click", (e) => {
  e.preventDefault();
  fileInput.click();
});

copyBtn.addEventListener("click", (e) => {
  e.preventDefault();
  fileURLInput.select();
  document.execCommand("copy");
  showToast("Link Copied");
});

const uploadFile = () => {
  progressContainer.style.display = "block";

  const file = fileInput.files[0];
  const formData = new FormData();
  formData.append("myfile", file);

  const xhr = new XMLHttpRequest();

  xhr.onreadystatechange = () => {
    // console.log(xhr.readyState);

    if (xhr.readyState === XMLHttpRequest.DONE) {
      // console.table(xhr.response);
      onUploadSuccess(JSON.parse(xhr.response));
    }
  };

  xhr.upload.onprogress = updateProgress;

  xhr.upload.onerror = () => {
    fileInput.value = "";
    // console.log("Error while uploading");
    showToast(`Error in uploading ${xhr.statusText}`);
  };

  xhr.open("POST", uploadURL);
  xhr.send(formData);
};

const updateProgress = (e) => {
  const percent = Math.round((e.loaded / e.total) * 100);
  console.log(e);
  console.log("Percentage loaded", percent);

  bgProgress.style.width = `${percent}%`;
  percentDiv.innerText = percent;
  progressBar.style.transform = `scaleX(${percent / 100})`;
};


const onUploadSuccess = ({ file: url }) => {
  // showToast("SATYAM 123  #####");
  // showToast(file);
  console.log("satyam111111111!!!!!!!!##########################");
  // console.log(file);
  console.log(url);
  fileInput.value = "";
  emailForm[2].removeAttribute("disabled");
  progressContainer.style.display = "none";
  sharingContainer.style.display = "block";
  fileURLInput.value = url;
};

emailForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const url = fileURLInput.value;
  console.log("Submit form");
  const formData = {
    uuid: url.split("/").splice(-1, 1)[0],
    emailTo: emailForm.elements["to-email"].value,
    emailForm: emailForm.elements["from-email"].value,
  };
  console.table(formData);
  emailForm.setAttribute("disabled", "true");

  fetch(emailURL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  })
    .then((res) => res.json())
    .then(({ success }) => {
      console.log(data);
      if (success) {
        sharingContainer.style.display = "none";
        showToast("Email sent!");
      }
    });
});

let toastTimer;
const showToast = (msg) => {
  toast.innerText = msg;
  toast.style.transform = "translate(-50%,0";
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.style.transform = "translate(-50%,60px)";
  }, 2000);
};
