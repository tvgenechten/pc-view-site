const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const snapButton = document.getElementById('snap');
const fileInput = document.getElementById('fileInput');
const uploadButton = document.getElementById('upload');
const removeButton = document.getElementById('removePreview');
const preview = document.getElementById('preview');
const actionButtons = document.getElementById('actionButtons');
const context = canvas.getContext('2d');

let imageBlob = null;

function updateUI(show) {
    preview.style.display = show ? 'block' : 'none';
    actionButtons.style.display = show ? 'block' : 'none';
}

// Start webcam
navigator.mediaDevices.getUserMedia({ video: true })
    .then((stream) => {
        video.srcObject = stream;
    })
    .catch((err) => {
        console.error("Kan webcam niet starten:", err);
    });

// Foto nemen
snapButton.addEventListener('click', () => {
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob((blob) => {
        imageBlob = blob;
        preview.src = URL.createObjectURL(blob);
        updateUI(true);
    }, 'image/png');
});

// Handmatige afbeelding uploaden
fileInput.addEventListener('change', () => {
    const file = fileInput.files[0];
    if (file && file.type.startsWith('image/')) {
        imageBlob = file;
        preview.src = URL.createObjectURL(file);
        updateUI(true);
    }
});

// Preview verwijderen
removeButton.addEventListener('click', () => {
    preview.src = '';
    imageBlob = null;
    fileInput.value = '';
    updateUI(false);
});

// Upload naar backend
uploadButton.addEventListener('click', () => {
    if (!imageBlob) {
        alert("Geen afbeelding geselecteerd of genomen.");
        return;
    }

    const formData = new FormData();
    formData.append('image', imageBlob, 'foto.png');

    fetch('/upload', {
        method: 'POST',
        body: formData
    })
        .then(response => response.text())
        .then(result => {
            alert("Upload gelukt: " + result);
        })
        .catch(error => {
            console.error("Upload mislukt:", error);
        });
});