let photoDB;

const request = indexedDB.open("photoDB", 1);

request.onupgradeneeded = e => {
  photoDB = e.target.result;
  photoDB.createObjectStore("photos", { keyPath: "id", autoIncrement: true });
};

request.onsuccess = e => {
  photoDB = e.target.result;
};

function showView(id) {
  document.querySelectorAll(".view").forEach(v => v.classList.remove("active"));
  document.getElementById(id).classList.add("active");

  if (id === "galleryView") loadGallery();
}

function openCamera() {
  const input = document.getElementById("cameraInput");
  input.click();

  input.onchange = e => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = ev => {
      const imgData = ev.target.result;
      document.getElementById("capturedImage").src = imgData;
      savePhoto(imgData);
    };

    reader.readAsDataURL(file);
  };
}

function savePhoto(data) {
  const tx = photoDB.transaction("photos", "readwrite");
  tx.objectStore("photos").add({ image: data });
}

function loadGallery() {
  const box = document.getElementById("savedPhotos");
  box.innerHTML = "";

  const tx = photoDB.transaction("photos", "readonly");
  const store = tx.objectStore("photos");
  const req = store.getAll();

  req.onsuccess = () => {
    req.result.forEach(p => {
      const img = document.createElement("img");
      img.src = p.image;
      box.appendChild(img);
    });
  };
}

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("service-worker.js");
}
